import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ICase } from '../interfaces/case';
import { IImage } from '../interfaces/image';
import { IPatient } from './../interfaces/patient';

@Injectable({
  providedIn: 'root',
})
export class CaseService {
  private readonly _url = `${environment.apiUrl}${environment.caseEndpoint}`;
  readonly currentCase$ = new Subject();
  readonly caseList$ = new BehaviorSubject([]);

  constructor(private http: HttpClient) {}

  getAllCases(): Observable<ICase[]> {
    return this.http.get<ICase[]>(this._url);
  }

  getSingleCase(id = ''): Observable<ICase> {
    return this.http.get<ICase>(`${this._url}/${id}`);
  }

  createCase(patient: IPatient, images: IImage[]): Observable<string> {
    const formData = this.generateFormData(patient, images);

    return this.http.post<string>(this._url, formData);
  }

  deleteCase(id = ''): Observable<string> {
    return this.http.delete<string>(`${this._url}/${id}`);
  }

  editCase(patient: IPatient, images: IImage[], id = ''): Observable<string> {
    const formData = this.generateFormData(patient, images);

    return this.http.put<string>(`${this._url}/${id}`, formData);
  }

  getURLSignature(id = ''): Observable<string> {
    return this.http.get<string>(`${this._url}/SignURL/${id}`);
  }

  private generateFormData(patient: IPatient, images: IImage[]): FormData {
    const formData = new FormData();
    for (let key of Object.keys(patient)) {
      formData.append(key, (patient as any)[key]);
    }

    images.forEach((image, index) => {
      formData.append(`images[${index}][name]`, image.name);
      formData.append(`images[${index}][type]`, image.type);
      formData.append(
        `images[${index}][content]`,
        new Blob([image.content as ArrayBuffer], { type: image.type }),
        image.name
      );
    });
    return formData;
  }
}
