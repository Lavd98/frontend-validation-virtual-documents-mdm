import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginData } from '../../interfaces/login.interface';
import { Area, AreaListResponse } from '../../interfaces/area.interface';
import { environment } from '../../../environments/environment';

import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private readonly URL = environment.apiUrl;
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.loginData.Token}`
    );
  }

  loginData: LoginData = (() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : { Token: undefined, User: {} };
  })();

  getActive(): Observable<AreaListResponse> {
    return this.http
      .get<AreaListResponse>(`${this.URL}/api/areas`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  getInactive(): Observable<AreaListResponse> {
    return this.http
      .get<AreaListResponse>(`${this.URL}/api/areas/inactive`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  post(body: Area): Observable<AreaListResponse> {
    return this.http
      .post<AreaListResponse>(`${this.URL}/api/areas`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  put(id: string, body: Area): Observable<AreaListResponse> {
    return this.http
      .put<AreaListResponse>(`${this.URL}/api/areas/${id}`, body, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  inactivateUser(id: string): Observable<AreaListResponse> {
    return this.http
      .delete<AreaListResponse>(`${this.URL}/api/areas/${id}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  activateUser(id: string): Observable<AreaListResponse> {
    return this.http
      .put<AreaListResponse>(
        `${this.URL}/api/areas/reactivate/${id}`,
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
        `Backend returned code ${error.status}, ` + `body was: ${error.message}`
      );
    }
    return throwError(
      () => new Error('Something went wrong; please try again later.')
    );
  }
}
