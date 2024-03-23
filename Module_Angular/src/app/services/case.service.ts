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

  createCase(patient: IPatient, images: IImage[]): Observable<{ id: string }> {
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

    return this.http.post<{ id: string }>(this._url, formData);
  }
}
