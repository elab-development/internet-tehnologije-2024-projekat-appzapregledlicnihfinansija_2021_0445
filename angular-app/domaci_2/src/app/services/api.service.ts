import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/accounts`);
  }

  getTransactions(page: number, filters: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/transactions?page=${page}`, { params: filters });
  }
}