import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Transaction } from '../models/user.model';
import { AuthService } from './auth.service';

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private transactions = new BehaviorSubject<Transaction[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTransactions(page: number = 1, filters: { category?: string, account_id?: number } = {}): Observable<PaginatedResponse<Transaction>> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    let params = new HttpParams().set('page', page.toString());
    if (filters.category) {
      params = params.set('category', filters.category);
    }
    if (filters.account_id) {
      params = params.set('account_id', filters.account_id.toString());
    }
    return this.http.get<PaginatedResponse<Transaction>>(`${this.apiUrl}/transactions`, { headers, params }).pipe(
      map(response => {
        console.log('Transactions response:', response);
        return {
          ...response,
          data: Array.isArray(response.data) ? response.data : []
        };
      }),
      tap(response => this.transactions.next(response.data)),
      catchError(this.handleError)
    );
  }

  createTransaction(tx: any) {
    return this.http.post(`${this.apiUrl}/transactions`, tx);
  }

  addTransaction(transaction: Partial<Transaction>): Observable<Transaction> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction, { headers }).pipe(
      tap(newTransaction => {
        const current = this.transactions.getValue();
        this.transactions.next([...current, newTransaction]);
      }),
      catchError(this.handleError)
    );
  }

  deleteTransaction(id: number): Observable<void> {
    const token = this.authService.getToken();
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`, { headers }).pipe(
      tap(() => {
        const current = this.transactions.getValue();
        this.transactions.next(current.filter(t => t.id !== id));
      }),
      catchError(this.handleError)
    );
  }

  calculateBalance(): number {
    return this.transactions.getValue().reduce((acc, t) => {
      const amt = parseFloat(t.amount);
      return amt > 0 ? acc + amt : acc - amt;
    }, 0);
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