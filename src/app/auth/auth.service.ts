import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const body = { Username: username, Password: password };
    return this.http
      .post<LoginResponse>(`${this.URL}/api/auth/login`, body)
      .pipe(catchError(this.handleError));
  }

  newToken(token: string): Observable<any> {
    const body = { Token: token };
    return this.http
      .post<LoginResponse>(`${this.URL}/api/auth/new-token`, body)
      .pipe(catchError(this.handleError));
  }

  isTokenValid(): Observable<any> {
    const { Token, User } = JSON.parse(localStorage.getItem('user') || '{}');
    if (!Token || !User) {
      return new Observable((observer) => {
        observer.next({
          code: 201,
          success: true,
          message: 'Resource created successfully',
          data: {
            valid: false,
            expired: true,
          },
        });
        observer.complete();
      });
    }

    const body = { Token };

    return this.http
      .post<any>(`${this.URL}/api/auth/validate-token`, body)
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
