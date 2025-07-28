import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private accounts = [
    { id: 1, user_id: 1, account_name: 'Savings Account', balance: 5000.00 },
    { id: 2, user_id: 1, account_name: 'Checking Account', balance: 1200.50 },
    { id: 3, user_id: 1, account_name: 'Investment Account', balance: 7500.75 }
  ];

  private categories = [
    { id: 1, name: 'Groceries', description: 'Food and household items' },
    { id: 2, name: 'Utilities', description: 'Bills and utilities' },
    { id: 3, name: 'Entertainment', description: 'Leisure and fun' }
  ];

  private transactions = [
    { id: 1, account_id: 1, category_id: 1, amount: 150.00, transaction_date: '2025-07-01', details: 'Grocery shopping', category: this.categories[0] },
    { id: 2, account_id: 1, category_id: 2, amount: 75.50, transaction_date: '2025-07-02', details: 'Electricity bill', category: this.categories[1] },
    { id: 3, account_id: 2, category_id: 3, amount: 30.00, transaction_date: '2025-07-03', details: 'Movie tickets', category: this.categories[2] },
    { id: 4, account_id: 2, category_id: 1, amount: 45.20, transaction_date: '2025-07-04', details: 'Supermarket', category: this.categories[0] },
    { id: 5, account_id: 3, category_id: 2, amount: 100.00, transaction_date: '2025-07-05', details: 'Internet bill', category: this.categories[1] },
    { id: 6, account_id: 1, category_id: 3, amount: 60.00, transaction_date: '2025-07-06', details: 'Concert tickets', category: this.categories[2] },
    { id: 7, account_id: 2, category_id: 1, amount: 80.00, transaction_date: '2025-07-07', details: 'Grocery shopping', category: this.categories[0] },
    { id: 8, account_id: 3, category_id: 2, amount: 90.00, transaction_date: '2025-07-08', details: 'Water bill', category: this.categories[1] }
  ];

  getAccounts(): Observable<any[]> {
    return of(this.accounts);
  }

  getTransactions(page: number, filters: any): Observable<any> {
    let filteredTransactions = this.transactions;

    if (filters.account_id) {
      filteredTransactions = filteredTransactions.filter(t => t.account_id === +filters.account_id);
    }
    if (filters.category) {
      filteredTransactions = filteredTransactions.filter(t => t.category.name.toLowerCase().includes(filters.category.toLowerCase()));
    }

    const pageSize = 3;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedTransactions = filteredTransactions.slice(start, end);

    return of({
      data: paginatedTransactions,
      next_page_url: end < filteredTransactions.length ? 'next' : null
    });
  }
}