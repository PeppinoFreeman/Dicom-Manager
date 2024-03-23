import azure.functions as func
import logging
from azure.storage.blob import BlobServiceClient

import numpy as np 
import os
import copy
from math import *
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from functools import reduce

# reading in dicom files
import pydicom
from io import BytesIO

# skimage image processing packages
from skimage import measure, morphology
from skimage.morphology import ball, binary_closing
from skimage.measure import label, regionprops

# scipy linear algebra functions 
from scipy.linalg import norm
import scipy.ndimage

# ipywidgets for some interactive plots
from ipywidgets.widgets import * 
import ipywidgets as widgets

# plotly 3D interactive graphs 
import plotly
from plotly.graph_objs import *
import chart_studio

import tempfile

chart_studio.tools.set_credentials_file(username='peppino111', api_key='xoJ3hyQZIvla4oFhbgXE')
app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

@app.route(route="http_trigger")
def http_trigger(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
        
    param = req.params.get('id')
    if not param:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            param = req_body.get('id')

    if param:
        dicom_data = get_blob_data(f'container-{param}')

        # set path and load files 
        patient_dicom = load_scan(dicom_data)
        patient_pixels = get_pixels_hu(patient_dicom)

        # get masks 
        segmented_lungs = segment_lung_mask(patient_pixels, fill_lung_structures=False)
        segmented_lungs_fill = segment_lung_mask(patient_pixels, fill_lung_structures=True)
        internal_structures = segmented_lungs_fill - segmented_lungs

        # isolate lung from chest
        copied_pixels = copy.deepcopy(patient_pixels)
        for i, mask in enumerate(segmented_lungs_fill): 
            get_high_vals = mask == 0
            copied_pixels[i][get_high_vals] = 0
        seg_lung_pixels = copied_pixels
        
        # generate plot of 1 slice
        result = generate_plot(patient_pixels, segmented_lungs_fill, seg_lung_pixels, internal_structures)
        
        # generate a GIF of all slices 
        # result = generate_gif(segmented_lungs_fill)
        
        headers = {"Content-Type": "image/png"} # change format depending on what to send
        return func.HttpResponse(result, headers=headers)
    else:
        return func.HttpResponse(
             "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
             status_code=200
        )

def get_blob_data(container_name):
    connection_string = os.environ.get("SQLAZURECONNSTR_AzureBlobStorage")
    if connection_string is None:
        connection_string = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;"    
    blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    container_client = blob_service_client.get_container_client(container_name)
    
    dicom_data_list = []

    try:
        for blob in container_client.list_blobs():
            blob_client = container_client.get_blob_client(blob.name)
            blob_stream = BytesIO()
            blob_client.download_blob().download_to_stream(blob_stream)
            blob_stream.seek(0)

            # Read DICOM data from the stream
            dicom_data = pydicom.dcmread(blob_stream)
            dicom_data_list.append(dicom_data)

        return dicom_data_list
    except Exception as e:
        logging.error(f"Error getting blob data: {e}")
        return None
      
def generate_plot(patient_pixels, segmented_lungs_fill, seg_lung_pixels, internal_structures):
    f, ax = plt.subplots(2,2, figsize = (10,10))

    # pick random slice 
    slice_id = 2

    ax[0,0].imshow(patient_pixels[slice_id], cmap=plt.cm.bone)
    ax[0,0].set_title('Original Dicom')
    ax[0,0].axis(False)

    ax[0,1].imshow(segmented_lungs_fill[slice_id], cmap=plt.cm.bone)
    ax[0,1].set_title('Lung Mask')
    ax[0,1].axis(False)

    ax[1,0].imshow(seg_lung_pixels[slice_id], cmap=plt.cm.bone)
    ax[1,0].set_title('Segmented Lung')
    ax[1,0].axis(False)

    ax[1,1].imshow(seg_lung_pixels[slice_id], cmap=plt.cm.bone)
    ax[1,1].imshow(internal_structures[slice_id], cmap='jet', alpha=0.7)
    ax[1,1].set_title('Segmentation with \nInternal Structure')
    ax[1,1].axis(False)    
    
    image_stream = BytesIO()
    plt.savefig(image_stream, format='png')
    image_stream.seek(0)
    
    # Close the plot to free up resources
    plt.close()
    return image_stream.read()
 
def generate_gif(data):
    fig, ax = plt.subplots()

    def update(frame):
        ax.clear()
        ax.imshow(data[frame], cmap='gray')

    # Assuming image_array is a list of 2D numpy arrays
    num_frames = len(data)
    animation = FuncAnimation(fig, update, frames=num_frames, interval=100, repeat=False)

    # Save the animation to a temporary file
    temp_file = tempfile.NamedTemporaryFile(suffix='.gif', delete=False)
    animation.save(temp_file.name, writer='imagemagick', fps=10)
    temp_file.close()

    # Read the temporary file back into a BytesIO object
    with open(temp_file.name, 'rb') as f:
        gif_stream = BytesIO(f.read())

    # Remove the temporary file
    os.remove(temp_file.name)

    return gif_stream.read()

def load_scan(dicom_data):
    #[pydicom.read_file(path) for path in paths]
    slices = dicom_data
    slices.sort(key = lambda x: int(x.InstanceNumber), reverse = True)
    try:
        slice_thickness = np.abs(slices[0].ImagePositionPatient[2] - slices[1].ImagePositionPatient[2])
    except:
        slice_thickness = np.abs(slices[0].SliceLocation - slices[1].SliceLocation)
        
    for s in slices:
        s.SliceThickness = slice_thickness
        
    return slices

def get_pixels_hu(scans):
    image = np.stack([s.pixel_array for s in scans])
    image = image.astype(np.int16)
    # Set outside-of-scan pixels to 0
    # The intercept is usually -1024, so air is approximately 0
    image[image == -2000] = 0
    
    # Convert to Hounsfield units (HU)
    intercept = scans[0].RescaleIntercept
    slope = scans[0].RescaleSlope
    
    if slope != 1:
        image = slope * image.astype(np.float64)
        image = image.astype(np.int16)
        
    image += np.int16(intercept)
    
    return np.array(image, dtype=np.int16)

def largest_label_volume(im, bg=-1):
    vals, counts = np.unique(im, return_counts=True)
    counts = counts[vals != bg]
    vals = vals[vals != bg]
    if len(counts) > 0:
        return vals[np.argmax(counts)]
    else:
        return None
    
def segment_lung_mask(image, fill_lung_structures=True):
    # not actually binary, but 1 and 2. 
    # 0 is treated as background, which we do not want
    binary_image = np.array(image >= -700, dtype=np.int8)+1
    labels = measure.label(binary_image)
 
    # Pick the pixel in the very corner to determine which label is air.
    # Improvement: Pick multiple background labels from around the  patient
    # More resistant to “trays” on which the patient lays cutting the air around the person in half
    background_label = labels[0,0,0]
 
    # Fill the air around the person
    binary_image[background_label == labels] = 2
 
    # Method of filling the lung structures (that is superior to 
    # something like morphological closing)
    if fill_lung_structures:
        # For every slice we determine the largest solid structure
        for i, axial_slice in enumerate(binary_image):
            axial_slice = axial_slice - 1
            labeling = measure.label(axial_slice)
            l_max = largest_label_volume(labeling, bg=0)
 
            if l_max is not None: #This slice contains some lung
                binary_image[i][labeling != l_max] = 1
    binary_image -= 1 #Make the image actual binary
    binary_image = 1-binary_image # Invert it, lungs are now 1
 
    # Remove other air pockets inside body
    labels = measure.label(binary_image, background=0)
    l_max = largest_label_volume(labels, bg=0)
    if l_max is not None: # There are air pockets
        binary_image[labels != l_max] = 0
 
    return binary_image
