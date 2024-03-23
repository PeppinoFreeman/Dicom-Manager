# DICOM Manager

**Requirements**: 
- Node and npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- .NET SDK: https://dotnet.microsoft.com/en-us/download/dotnet or install Visual Studio with .NET developement environment: https://visualstudio.microsoft.com/fr/downloads/
- Python: https://www.python.org/downloads/ pick the same version used for the azure function (*currently v3.11*)
- Visual Studio Code: https://code.visualstudio.com
- Azurite: `npm install -g azurite`
- Azure function tools: `npm install -g azure-functions-core-tools@4 --unsafe-perm true`

**Recommanded**:
- Install the following extensions for Visual Studio Code to use Azure:
    - Azure Functions
    - Azure Account
    - Azure Ressources
    - Azure Static Web Apps
    - Azure Storage
    - Azurite
- And the following extensions for language support:
    - Python
    - C#
    - Angular Language Service

To run the whole project execute the file **run.sh**

To run each project individually, see the respective section for each below.

## Frontend
If it is a first time execution run the following command inside the `Module_Angular/` folder: 

- `npm i`

Then execute the file **front_run.sh**

## Backend
Execute the file **back_run.sh**

## Azurite local storage
Execute the file **azurite_run.sh**

To update local blob storage CORS rule, manually modify `__azurite_db_blob__.json`

## Azure Function
If it is a first time execution run the following command `Module_Azure_Function/` folder: 

- `pip install -r requirements.txt`

Then execute the file **func_run.sh**


## DICOM test samples
DICOM file samples are available in the folder `Samples/`
These examples were fetched from: https://www.cancerimagingarchive.net/browse-collections/


## CICD
The configuration can be found in `.github/workflows/` folder.

### Frontend:
Using the `azure-static-web-apps.yml` file to trigger automatic deploy from of the front as a Static Web Application.

### Backend:
Using the `azure-web-app.yml` file to trigger automatic deploy of the back as an Azure Web Application.
