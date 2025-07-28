import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MockDataService } from './mock-data.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = '';

  constructor(private http: HttpClient, private mockDataService: MockDataService) {}

  getAccounts(): Observable<any[]> {
    // return this.http.get<any[]>(`${this.apiUrl}/accounts`);
    return this.mockDataService.getAccounts();
  }

  getTransactions(page: number, filters: any): Observable<any> {
    // return this.http.get<any>(`${this.apiUrl}/transactions?page=${page}`, { params: filters });
    return this.mockDataService.getTransactions(page, filters);
}

getExchangeRate(from: string, to: string) {
  return this.http.get<any>(`https://api.exchangerate.host/convert?from=${from}&to=${to}`);
}
}