import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { TransactionService, PaginatedResponse } from '../../services/transaction.service';
import { Account, Transaction } from '../../models/user.model';
import { ChartData, ChartOptions } from 'chart.js';
import { AuthService } from '../../services/auth.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];
  myAccounts: Account[] = []; // Added
  recentTransactions: Transaction[] = [];
  initialAmount: number = 0;
  monthlyContribution: number = 0;
  months: number = 0;
  interestRate: number = 0;
  selectedCurrency: string = 'EUR';
  savingsTotal: number | null = null;
  convertedCurrency: number | null = null;
  errorMessage: string = '';
  userId: number = 0;

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
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(
    private apiService: ApiService,
    private transactionService: TransactionService,
    private authService: AuthService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.userId = user.id;
        this.loadAccounts();
        this.loadTransactions();
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user: ' + err.message;
        console.error('User fetch error:', err);
      }
    });
  }

  loadAccounts() {
    this.apiService.getAccounts().subscribe({
      next: (response: Account[]) => {
        console.log('Received accounts:', response);
        this.accounts = response.filter(account => account.user_id.toString() === this.userId.toString());
        this.errorMessage = this.accounts.length ? '' : 'No accounts available';
      },
      error: (err) => {
        this.errorMessage = 'Failed to load accounts: ' + err.message;
        console.error('Account fetch error:', err);
      }
    });
  }

  loadTransactions() {
    this.transactionService.getTransactions(1).subscribe({
      next: (response: PaginatedResponse<Transaction>) => {
        console.log('Received transactions:', response);
        this.recentTransactions = Array.isArray(response.data) ? response.data.slice(0, 10) : [];
        this.updatePieChartData();
        this.updateMonthlySpendingChart();
      },
      error: (err) => {
        console.error('Transaction fetch error:', err);
      }
    });
  }

  getSumsByCategoryType(transactions: Transaction[]) {
    const sums: Record<string, number> = {};

    transactions.forEach(tx => {
      const type = tx.category?.type || 'Unknown';
      const amount = parseFloat(tx.amount) || 0;

      if (!sums[type]) {
        sums[type] = 0;
      }
      sums[type] += amount;
    });

    return sums;
  }

  updatePieChartData() {
    const sums = this.getSumsByCategoryType(this.recentTransactions);

    const typeOrder: Record<string, number> = {
      expense: 0,
      income: 1
    };

    const sortedLabels = Object.keys(sums).sort((a, b) => {
      return (typeOrder[a] ?? 2) - (typeOrder[b] ?? 2);
    });

    const sortedData = sortedLabels.map(label => sums[label]);

    const colorMap: Record<string, string> = {
      expense: '#FF6384',
      income: '#36A2EB',
      Unknown: '#FFCE56'
    };

    const backgroundColors = sortedLabels.map(label => colorMap[label] || '#999');

    this.pieChartData = {
      labels: sortedLabels,
      datasets: [{
        data: sortedData,
        backgroundColor: backgroundColors
      }]
    };
  }

  updateMonthlySpendingChart() {
    const monthlySums: Record<string, number> = {};

    this.recentTransactions.forEach(tx => {
      const accountBelongsToUser = tx.account?.user_id.toString() === this.userId.toString();
      const isExpense = tx.type === 'expense';

      if (accountBelongsToUser && isExpense) {
        const date = new Date(tx.created_at);
        if (isNaN(date.getTime())) return;
        const monthName = date.toLocaleString('default', { month: 'short', year: 'numeric' });

        if (!monthlySums[monthName]) {
          monthlySums[monthName] = 0;
        }
        monthlySums[monthName] += parseFloat(tx.amount) || 0;
      }
    });

    const sortedMonths = Object.keys(monthlySums).sort((a, b) => {
      return new Date(`1 ${a}`).getTime() - new Date(`1 ${b}`).getTime();
    });

    this.barChartData = {
      labels: sortedMonths.length ? sortedMonths : ['No Data'],
      datasets: [{
        label: "expenses",
        data: sortedMonths.length ? sortedMonths.map(month => monthlySums[month]) : [0],
        backgroundColor: '#36A2EB'
      }]
    };
  }
  calculateSavings() {
    const principal = this.initialAmount;
    const monthlyRate = this.interestRate / 100 / 12;
    const futureValue = principal * Math.pow(1 + monthlyRate, this.months) +
      this.monthlyContribution * ((Math.pow(1 + monthlyRate, this.months) - 1) / monthlyRate);
    this.savingsTotal = futureValue;

    const rates = { EUR: 0.0085, USD: 0.009, CHF: 0.008 };
    this.convertedCurrency = futureValue * (rates[this.selectedCurrency as keyof typeof rates] || 1);
  }

  viewDetails(accountId: number) {
    console.log('View transactions for account:', accountId);
  }

  transform(value: number): string | null {
    return this.currencyPipe.transform(value, 'RSD', 'symbol', '1.2-2');
  }
}