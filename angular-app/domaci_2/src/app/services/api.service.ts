import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Account } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAccounts(): Observable<Account[]> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    return this.http.get<{ data: Account[] }>(`${this.apiUrl}/accounts`, { headers }).pipe(
      map(response => {
        console.log('Accounts response:', response);
        return Array.isArray(response.data) ? response.data : [];
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.status === 401) {
      errorMessage = 'Unauthorized access';
    } else {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}