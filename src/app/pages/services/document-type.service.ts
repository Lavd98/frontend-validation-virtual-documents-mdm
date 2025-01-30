import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginData } from '../../interfaces/login.interface';
import {
  DocumentType,
  DocumentTypeListResponse,
} from '../../interfaces/documet-type.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  private readonly URL = environment.apiUrl;;
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const loginData: LoginData = JSON.parse(
      localStorage.getItem('user') || '{}'
    );
    return new HttpHeaders().set('Authorization', `Bearer ${loginData.Token}`);
  }

  getActive(): Observable<DocumentTypeListResponse> {
    return this.http
      .get<DocumentTypeListResponse>(`${this.URL}/api/document-types`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getInactive(): Observable<DocumentTypeListResponse> {
    return this.http
      .get<DocumentTypeListResponse>(
        `${this.URL}/api/document-types/inactive`,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }

  post(body: DocumentType): Observable<DocumentTypeListResponse> {
    return this.http
      .post<DocumentTypeListResponse>(`${this.URL}/api/document-types`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  put(id: string, body: DocumentType): Observable<DocumentTypeListResponse> {
    return this.http
      .put<DocumentTypeListResponse>(
        `${this.URL}/api/document-types/${id}`,
        body,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }

  inactivateUser(id: string): Observable<DocumentTypeListResponse> {
    return this.http
      .delete<DocumentTypeListResponse>(
        `${this.URL}/api/document-types/${id}`,
        {
          headers: this.getHeaders(),
        }
      )
      .pipe(catchError(this.handleError));
  }

  activateUser(id: string): Observable<DocumentTypeListResponse> {
    return this.http
      .put<DocumentTypeListResponse>(
        `${this.URL}/api/document-types/reactivate/${id}`,
        {},
        {
          headers: this.getHeaders(),
        }
      )
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
}
