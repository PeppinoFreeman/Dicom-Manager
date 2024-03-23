import { Injectable } from '@angular/core';
import { Renderer, parseImage } from 'dicom.ts';
import { DCMImage } from 'dicom.ts/dist/parser';
import { Observable, of, take } from 'rxjs';
import { IImage } from '../interfaces/image';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private _images: IImage[] = [];
  private _imagesToDisplay: any[] = [];

  displayDicom(dcm: DataView): Observable<string> {
    return new Observable<string>((subscriber) => {
      const canvas = document.createElement('canvas');
      const image: DCMImage | null = parseImage(dcm);
      const renderer = new Renderer(canvas);

      renderer
        .render(image as DCMImage, 0)
        .then(() => {
          subscriber.next(canvas.toDataURL('image/png'));
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }

  uploadFiles(
    files: File[],
    images: IImage[],
    imagesToDisplay: IImage[]
  ): Observable<any[][]> {
    this._images = images;
    this._imagesToDisplay = imagesToDisplay;

    for (let file of files) {
      try {
        const isDcmFile = file.name.endsWith('.dcm');
        isDcmFile ? this.uploadDcmFile(file) : this.uploadImageFile(file);
      } catch (error) {
        // TODO put an error toast?
        console.error(error);
      }
    }

    return of([this._images, this._imagesToDisplay]);
  }

  groupDicomByUid(): string {
    return ''; // image?.seriesInstanceUID;
  }

  uploadDcmFile(file: File): void {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = () => {
      const image: IImage = {
        content: reader.result as ArrayBuffer,
        name: file.name,
        type: 'application/dicom',
      };
      this._images.push(image);

      this.displayDicom(new DataView(image.content))
        .pipe(take(1))
        .subscribe((data) =>
          this._imagesToDisplay.push({
            ...image,
            content: data,
          })
        );
    };
  }

  uploadImageFile(file: File): void {
    let image: IImage;
    const readerForSending = new FileReader();
    readerForSending.readAsArrayBuffer(file);

    readerForSending.onload = () => {
      image = {
        content: readerForSending.result as ArrayBuffer,
        name: file.name,
        type: file.type,
      };
      this._images.push(image);
    };

    const readerForDisplay = new FileReader();
    readerForDisplay.readAsDataURL(file);

    readerForDisplay.onload = (event) => {
      this._imagesToDisplay.push({ ...image, content: event.target?.result });
    };
  }
}
