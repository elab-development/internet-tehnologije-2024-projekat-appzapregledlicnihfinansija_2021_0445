import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { PaginatedAccounts, Account, Category } from '../models/user.model';

export interface CreateAccountDto {
  account_name: string;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private authHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  private normalizeAccount(res: any): Account {
    return {
      id: res.id,
      user_id: res.user_id,
      name: res.name ?? res.account_name,
      balance: typeof res.balance === 'string' ? parseFloat(res.balance) : res.balance,
      created_at: res.created_at,
      updated_at: res.updated_at,
    } as Account;
  }

  getAccounts(page: number = 1, allAccounts: Account[] = []): Observable<Account[]> {
    const headers = this.authHeaders();
    const params = new HttpParams().set('page', page.toString());

    return this.http.get<PaginatedAccounts>(`${this.apiUrl}/accounts`, { headers, params }).pipe(
      tap(response => console.debug('Accounts response (page ' + page + '):', response)),
      map(response => ({
        data: Array.isArray(response.data) ? response.data.map(acc => this.normalizeAccount(acc)) : [],
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

  getAccountsPage(page: number = 1): Observable<{ data: Account[]; current_page: number; last_page: number }> {
    const headers = this.authHeaders();
    const params = new HttpParams().set('page', page.toString());

    return this.http.get<PaginatedAccounts>(`${this.apiUrl}/accounts`, { headers, params }).pipe(
      map(res => ({
        data: (res.data || []).map(acc => this.normalizeAccount(acc)),
        current_page: res.meta?.current_page ?? 1,
        last_page: res.meta?.last_page ?? 1
      })),
      catchError(this.handleError)
    );
  }

  createAccount(payload: CreateAccountDto): Observable<Account> {
    const headers = this.authHeaders();
    return this.http.post<any>(`${this.apiUrl}/accounts`, payload, { headers }).pipe(
      map(res => this.normalizeAccount(res)),
      catchError(this.handleError)
    );
  }

  getCategories(): Observable<Category[]> {
    const headers = this.authHeaders();
    return this.http.get<{ data: Category[] }>(`${this.apiUrl}/categories`, { headers }).pipe(
      map(res => res?.data ?? []),
      catchError(this.handleError)
    );
  }

  deleteAccount(accountId: number): Observable<Account>{
    return this.http.delete<Account>(`${this.apiUrl}/accounts/${accountId}`);
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error?.status === 401) {
      errorMessage = 'Unauthorized access';
    } else if (error?.status === 422) {
      const bag = error?.error?.errors || {};
      const msgs = Object.values(bag).flat() as string[];
      errorMessage = msgs.join(' ') || 'Validation failed (422)';
    } else if (error) {
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }

    console.error('API error:', error);
    return throwError(() => new Error(errorMessage));
  }
}