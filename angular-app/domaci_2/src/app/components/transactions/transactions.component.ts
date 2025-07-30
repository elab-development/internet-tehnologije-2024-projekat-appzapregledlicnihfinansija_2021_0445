import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { TransactionService, PaginatedResponse } from '../../services/transaction.service';
import { Transaction } from '../../models/user.model';

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
    private route: ActivatedRoute, private router: Router
  ) {}

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