import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { PaginatedAccounts, Account } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAccounts(page: number = 1, allAccounts: Account[] = []): Observable<Account[]> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    const params = new HttpParams().set('page', page.toString());
    
    return this.http.get<PaginatedAccounts>(`${this.apiUrl}/accounts`, { headers, params }).pipe(
      tap(response => console.log('Accounts response (page ' + page + '):', response)),
      map(response => ({
        data: Array.isArray(response.data) ? response.data : [],
        meta: response.meta || { current_page: 1, last_page: 1 }
      })),
      switchMap(response => {
        const accounts = [...allAccounts, ...response.data];
        if (response.meta.current_page < response.meta.last_page) {
          return this.getAccounts(page + 1, accounts);
        }
        return of(accounts);
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
    console.error('API error:', error);
    return throwError(() => new Error(errorMessage));
  }
}