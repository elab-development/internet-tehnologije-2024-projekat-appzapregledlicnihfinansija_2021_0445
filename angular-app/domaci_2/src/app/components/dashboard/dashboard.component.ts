import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  accounts: any[] = [];
  recentTransactions: any[] = [];

  convertedCurrency: number | null = null;
  selectedCurrency: string = 'EUR';

  initialAmount: number = 0;
  monthlyContribution: number = 0;
  months: number = 0;
  interestRate: number = 0;
  savingsTotal: number | null = null;

  pieChartData: any;
  barChartData: any;
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2E7D32',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        backgroundColor: '#4CAF50',
        titleColor: '#ffffff',
        bodyColor: '#ffffff'
      }
    }
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          color: '#2E7D32'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#2E7D32',
          callback: (value) => `$${value}`
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#2E7D32'
        }
      },
      tooltip: {
        backgroundColor: '#4CAF50',
        titleColor: '#ffffff',
        bodyColor: '#ffffff'
      }
    }
  };

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
    this.apiService.getAccounts().subscribe(data => {
      this.accounts = data;
    });

    this.apiService.getTransactions(1, {}).subscribe(tx => {
      this.recentTransactions = tx.data.slice(0, 5);

      // Pie chart by category
      const grouped = tx.data.reduce((acc: any, curr: any) => {
        const categoryName = curr.category.name;
        acc[categoryName] = (acc[categoryName] || 0) + curr.amount;
        return acc;
      }, {});
      this.pieChartData = {
        labels: Object.keys(grouped),
        datasets: [{
          data: Object.values(grouped),
          backgroundColor: ['#4CAF50', '#66BB6A', '#9CCC9C'],
          hoverBackgroundColor: ['#388E3C', '#4CAF50', '#7CB342']
        }]
      };

      // Bar chart by month
      const monthlyTotals: { [month: string]: number } = {};
      tx.data.forEach((t: any) => {
        const month = new Date(t.transaction_date).toLocaleString('default', { month: 'short', year: 'numeric' });
        monthlyTotals[month] = (monthlyTotals[month] || 0) + t.amount;
      });
      this.barChartData = {
        labels: Object.keys(monthlyTotals),
        datasets: [{
          label: 'Monthly Spending',
          data: Object.values(monthlyTotals),
          backgroundColor: '#4CAF50',
          hoverBackgroundColor: '#388E3C'
        }]
      };
    });
  }

  viewDetails(accountId: number) {
    this.router.navigate(['/transactions'], { queryParams: { accountId } });
  }

  getExchangeRate(from: string, to: string) {
    this.apiService.getExchangeRate(from, to);
  }

  calculateSavings(): void {
    let balance = this.initialAmount;
    const monthlyRate = this.interestRate > 0 ? this.interestRate / 100 / 12 : 0;

    for (let i = 0; i < this.months; i++) {
      balance += this.monthlyContribution;
      balance += balance * monthlyRate;
    }

    this.savingsTotal = balance;

    // Pozovi javni API za konverziju
    this.apiService.getExchangeRate('RSD', this.selectedCurrency).subscribe(res => {
      if (res && res.result) {
        this.convertedCurrency = balance * res.result;
      }
    });
  }
}