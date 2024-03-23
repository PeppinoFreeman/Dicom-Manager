import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SegmentationService {
  private readonly _url = `${environment.apiUrl}${environment.segmentEndpoint}`;

  constructor(private http: HttpClient) {}

  getSegmentation(id: string): Observable<{ content: string }> {
    return this.http.get<{ content: string }>(`${this._url}/${id}`);
  }
}
