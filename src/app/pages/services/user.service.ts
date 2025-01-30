import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginData } from '../../interfaces/login.interface';
import { User, UserListResponse } from '../../interfaces/user.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly URL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const loginData: LoginData = JSON.parse(
      localStorage.getItem('user') || '{}'
    );
    return new HttpHeaders().set('Authorization', `Bearer ${loginData.Token}`);
  }

  getActive(): Observable<UserListResponse> {
    return this.http
      .get<UserListResponse>(`${this.URL}/api/users`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getInactive(): Observable<UserListResponse> {
    return this.http
      .get<UserListResponse>(`${this.URL}/api/users/inactive`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  post(body: User): Observable<UserListResponse> {
    return this.http
      .post<UserListResponse>(`${this.URL}/api/users`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  put(id: string, body: User): Observable<UserListResponse> {
    return this.http
      .put<UserListResponse>(`${this.URL}/api/users/${id}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  inactivateUser(id: string): Observable<UserListResponse> {
    return this.http
      .delete<UserListResponse>(`${this.URL}/api/users/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  activateUser(id: string): Observable<UserListResponse> {
    return this.http
      .put<UserListResponse>(`${this.URL}/api/users/reactivate/${id}`, {
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
}
