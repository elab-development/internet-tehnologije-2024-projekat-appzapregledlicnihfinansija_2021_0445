import { Component, OnInit } from '@angular/core';
import { ApiService, CreateAccountDto } from '../../services/api.service';
import { TransactionService, PaginatedResponse } from '../../services/transaction.service';
import { Account, Transaction } from '../../models/user.model';
import { ChartData, ChartOptions } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Accounts
  accounts: Account[] = [];
  myAccounts: Account[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  isLoadingAccounts: boolean = false;

  // Transactions + korisnik
  recentTransactions: Transaction[] = [];
  userId: number = 0;
  isLoadingTransactions: boolean = false;

  // Calculator
  initialAmount: number = 0;
  monthlyContribution: number = 0;
  months: number = 0;
  interestRate: number = 0;
  selectedCurrency: string = 'EUR';
  savingsTotal: number | null = null;
  convertedCurrency: number | null = null;

  // Charts
  pieChartData: ChartData<'pie'> = {
    labels: ['expense', 'income'],
    datasets: [{ data: [0, 0], backgroundColor: ['#FF6384', '#36A2EB'] }]
  };
  pieChartOptions: ChartOptions<'pie'> = { responsive: true };

  barChartData: ChartData<'bar'> = {
    labels: ['expenses'],
    datasets: [{ data: [], backgroundColor: '#36A2EB' }]
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    }
  };

  constructor(
    private apiService: ApiService,
    private transactionService: TransactionService,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.loadAccounts();
        this.loadAllTransactions();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user: ' + err.message;
        console.error('User fetch error:', err);
      }
    });
  }

  loadAccounts() {
    this.isLoadingAccounts = true;
    this.apiService.getAccounts().subscribe({
      next: (response: Account[]) => {
        this.accounts = response.filter(a => String(a.user_id) === String(this.userId));
        this.myAccounts = this.accounts;
        console.log('Received accounts:', this.accounts);
        this.errorMessage = this.accounts.length ? '' : 'No accounts available';
      },
      error: (err) => {
        this.errorMessage = 'Failed to load accounts: ' + err.message;
        console.error('Account fetch error:', err);
      },
      complete: () => {
        this.isLoadingAccounts = false;
      }
    });
  }

  deleteAccount(accountId: number) {
    this.apiService.deleteAccount(accountId).subscribe({
      next: () => {
        this.loadAccounts();
      },
      error: (err) => {
        console.error('Error deleting account:', err);
        this.errorMessage = 'Failed to delete account: ' + err.message;
      }
    });
  }
  
  loadAllTransactions(page = 1, accumulated: Transaction[] = []) {
    if (page === 1) this.isLoadingTransactions = true;

    this.transactionService.getTransactions(page).subscribe({
      next: (response: PaginatedResponse<Transaction>) => {
        accumulated.push(...response.data);

        if (response.next_page_url) {
          this.loadAllTransactions(page + 1, accumulated);
        } else {
          this.recentTransactions = accumulated;
          this.updatePieChartData();
          this.updateMonthlySpendingChart();
          this.isLoadingTransactions = false;
        }
      },
      error: (err) => {
        console.error('Transaction fetch error:', err);
        this.isLoadingTransactions = false;
      }
    });
  }

  get recentTransactionsLimited() {
    return this.recentTransactions.slice(0, 3);
  }

  getSumsByCategoryType(transactions: Transaction[]) {
    const sums: Record<string, number> = {};

    transactions.forEach(tx => {
      const type = tx.category?.type || 'Unknown';
      const amount = parseFloat(tx.amount) || 0;

      if (!sums[type]) sums[type] = 0;
      sums[type] += amount;
    });

    return sums;
  }

  updatePieChartData() {
    const sums = this.getSumsByCategoryType(this.recentTransactions);
    console.log('Current recent transactions:', this.recentTransactions);

    const typeOrder: Record<string, number> = { expense: 0, income: 1 };
    const sortedLabels = Object.keys(sums).sort((a, b) =>
      (typeOrder[a] ?? 2) - (typeOrder[b] ?? 2)
    );

    this.cd.detectChanges();

    const sortedData = sortedLabels.map(label => sums[label]);
    const colorMap: Record<string, string> = {
      expense: '#FF6384',
      income: '#36A2EB',
      Unknown: '#FFCE56'
    };
    const backgroundColors = sortedLabels.map(label => colorMap[label] || '#999');

    this.pieChartData = {
      labels: sortedLabels,
      datasets: [{ data: sortedData, backgroundColor: backgroundColors }]
    };
  }

  updateMonthlySpendingChart() {
    const monthlySums: Record<string, number> = {};

    this.recentTransactions.forEach(tx => {
      const accountBelongsToUser = String(tx.account?.user_id) === String(this.userId);
      const isExpense = tx.type === 'expense';

      if (accountBelongsToUser && isExpense) {
        const date = new Date(tx.created_at);
        if (isNaN(date.getTime())) return;
        const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });

        if (!monthlySums[monthName]) monthlySums[monthName] = 0;
        monthlySums[monthName] += parseFloat(tx.amount) || 0;
      }
    });

    this.cd.detectChanges();

    const sortedMonths = Object.keys(monthlySums).sort(
      (a, b) => new Date(`1 ${a}`).getTime() - new Date(`1 ${b}`).getTime()
    );

    this.barChartData = {
      labels: sortedMonths.length ? sortedMonths : ['No Data'],
      datasets: [{
        label: 'expenses',
        data: sortedMonths.length ? sortedMonths.map(month => monthlySums[month]) : [0],
        backgroundColor: '#36A2EB'
      }]
    };
  }

  calculateSavings() {
    const principal = Number(this.initialAmount || 0);
    const monthlyRate = Number(this.interestRate || 0) / 100 / 12;
    const n = Number(this.months || 0);
    const C = Number(this.monthlyContribution || 0);

    let futureValue = 0;
    if (monthlyRate > 0) {
      futureValue = principal * Math.pow(1 + monthlyRate, n) +
        C * ((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate);
    } else {
      futureValue = principal + C * n;
    }

    this.savingsTotal = futureValue;

    const rates = { EUR: 0.0085, USD: 0.009, CHF: 0.008 };
    this.convertedCurrency = futureValue * (rates[this.selectedCurrency as keyof typeof rates] || 1);
  }

  viewDetails(accountId: number) {
    console.log('View transactions for account:', accountId);
    this.router.navigate(['/transactions', accountId]);
  }

  getAccountTitle(a: Account): string {
    return (a.name || a.account_name || 'Account').toString();
  }

  trackByAccountId(index: number, a: Account) {
    return a.id;
  }

  transform(value: number): string | null {
    return this.currencyPipe.transform(value, 'RSD', 'symbol', '1.2-2');
  }
}
