import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TransactionService, PaginatedResponse } from '../../services/transaction.service';
import { Transaction } from '../../models/user.model';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  transactions: Transaction[] = [];
  currentPage: number = 1;
  lastPage: number = 1;
  hasMore: boolean = true;
  categoryFilter: string = '';
  accountId?: number;
  private filterSubject = new Subject<string>();

  constructor(
    private transactionService: TransactionService,
    private route: ActivatedRoute, private router: Router,
    private http: HttpClient
  ) {}

  private apiUrl = 'http://127.0.0.1:8000/api';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.accountId = params['accountId'] ? +params['accountId'] : undefined;
      this.currentPage = 1;
      this.loadTransactions();
    });

    this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 1;
      this.loadTransactions();
    });
  }

  getAllTransactions(filters: any = {}) {
    const params = {
      ...filters,
      per_page: 10000,
      page: 1
    };
    return this.http.get<PaginatedResponse<Transaction>>(`${this.apiUrl}/transactions`, { params });
  }

  export() {
    this.getAllTransactions({ account_id: this.accountId }).subscribe({
      next: (response) => {
        const transactions = response.data;
  
        const exportData = transactions.map(tx => ({
          Date: new Date(tx.created_at).toLocaleDateString(),
          Account: tx.account?.account_name || 'N/A',
          Type: tx.type,
          Amount: tx.amount,
          Details: tx.details || '',
        }));
  
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');
  
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'transactions.xlsx');
      },
      error: (err) => {
        console.error('Failed to export transactions', err);
      }
    });
  }

  isAdmin(transaction: Transaction): boolean {
    return transaction.account.user?.role === 'admin';
  }

  deleteTransaction(transactionId: number) {
    this.transactionService.deleteTransaction(transactionId).subscribe({
      next: () => {
        this.loadTransactions();
      },
      error: (err) => {
        console.error('Failed to delete transaction', err);
      }
    });
  }

  applyFilters() {
    this.filterSubject.next(this.categoryFilter);
  }

  onAddTransactionClick(): void {
    this.router.navigate(['/add-transaction']);
  }

  loadTransactions() {
    const filters = { category: this.categoryFilter, account_id: this.accountId };
    this.transactionService.getTransactions(this.currentPage, filters).subscribe({
      next: (response: PaginatedResponse<Transaction>) => {
        this.transactions = response.data;
        this.currentPage = response.current_page;
        this.lastPage = response.last_page;
        this.hasMore = response.next_page_url != null;
      },
      error: (err) => {
        console.error('Failed to load transactions:', err);
      }
    });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

  nextPage() {
    if (this.currentPage < this.lastPage) {
      this.currentPage++;
      this.loadTransactions();
    }
  }

  ngOnDestroy() {
    this.filterSubject.complete();
  }
}