import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CurrencyFormatterPipe } from '../../pipe/currency-formatter.pipe';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, CurrencyFormatterPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {

 constructor(private router: Router) {} 
 
 categories = ['Food', 'Salary', 'Transport'];

 transactions = [
  { date: '2025-01-01', category: 'Food', amount: -50, description: 'Groceries' },
  { date: '2025-01-03', category: 'Salary', amount: 1000, description: 'January Salary' },
  { date: '2025-01-05', category: 'Transport', amount: -30, description: 'Bus Ticket' },
];

// Filter model
filter = {
  dateFrom: '',
  dateTo: '',
  category: 'all',
};

// Filtered transactions
filteredTransactions = [...this.transactions];

// Apply the filter
applyFilters() {
  this.filteredTransactions = this.transactions.filter(transaction => {
    let matches = true;

    // Date filter
    if (this.filter.dateFrom && new Date(transaction.date) < new Date(this.filter.dateFrom)) {
      matches = false;
    }
    if (this.filter.dateTo && new Date(transaction.date) > new Date(this.filter.dateTo)) {
      matches = false;
    }

    // Category filter
    if (this.filter.category !== 'all' && transaction.category !== this.filter.category) {
      matches = false;
    }

    return matches;
  });
}

   navigateTo(route: string) {
     this.router.navigate(['/'+route]);
   }

}
