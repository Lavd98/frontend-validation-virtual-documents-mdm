import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginResponse } from '../interfaces/login.interface';
import * as jwt_decode from 'jwt-decode';

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

  isTokenValid(): boolean {
    const { token } = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) {
      return false;
    }

    try {
      // const decodedToken: any = jwt_decode(token);
      // const expirationDate = new Date(0);
      // expirationDate.setUTCSeconds(decodedToken.exp);

      // if (expirationDate < new Date()) {
      //   return false; // Token ha expirado
      // }

      return true; // Token es válido
    } catch (error) {
      return false; // Error al decodificar el token
    }
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
