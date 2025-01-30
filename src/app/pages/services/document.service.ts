import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { LoginData } from '../../interfaces/login.interface';
import {
  Document,
  DocumentListResponse,
} from '../../interfaces/documet.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private readonly URL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const loginData: LoginData = JSON.parse(
      localStorage.getItem('user') || '{}'
    );
    return new HttpHeaders().set('Authorization', `Bearer ${loginData.Token}`);
  }

  getActive(areaId: number): Observable<DocumentListResponse> {
    return this.http
      .get<DocumentListResponse>(`${this.URL}/api/documents/area/${areaId}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getInactive(areaId: number): Observable<DocumentListResponse> {
    return this.http
      .get<DocumentListResponse>(
        `${this.URL}/api/documents/area/${areaId}/inactive`,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }

  post(body: any): Observable<DocumentListResponse> {
    return this.http
      .post<DocumentListResponse>(`${this.URL}/api/documents`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  put(id: string, body: any): Observable<DocumentListResponse> {
    return this.http
      .put<DocumentListResponse>(`${this.URL}/api/documents/${id}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  inactivateUser(id: string): Observable<DocumentListResponse> {
    return this.http
      .delete<DocumentListResponse>(`${this.URL}/api/documents/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  activateUser(id: string): Observable<DocumentListResponse> {
    return this.http
      .put<DocumentListResponse>(`${this.URL}/api/documents/reactivate/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }

  getDocumentByNumber(id: string): Observable<any> {
    return this.http
      .get<DocumentListResponse>(`${this.URL}/api/documents/basic/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }
}
