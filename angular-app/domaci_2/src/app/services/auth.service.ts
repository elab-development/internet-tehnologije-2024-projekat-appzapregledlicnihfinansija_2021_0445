import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { logInUser, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) {}

  login(credentials: logInUser): Observable<{ access_token: string, token_type: string }> {
    return this.http.post<{ access_token: string, token_type: string }>(
      `${this.apiUrl}/login`,
      credentials
    ).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.access_token);
      }),
      catchError(this.handleError)
    );
  }

  getUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.status === 401) {
      errorMessage = 'Invalid credentials';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}