import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent {
  transactions: any[] = [];
  currentPage: number = 1;
  hasMore: boolean = true;
  categoryFilter: string = '';
  private filterSubject = new Subject<string>();

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.loadTransactions(params['accountId']);
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

  loadTransactions(accountId?: number) {
    const filters = { category: this.categoryFilter, account_id: accountId };
    this.apiService.getTransactions(this.currentPage, filters).subscribe(data => {
      this.transactions = data.data;
      this.hasMore = data.next_page_url != null;
    });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTransactions();
    }
  }

  nextPage() {
    this.currentPage++;
    this.loadTransactions();
  }

  ngOnDestroy() {
    this.filterSubject.complete();
  }
}
