import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.css'
})
export class AddTransactionComponent {
  transaction = {
    date: '',
    category: '',
    amount: null,
    description: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Transaction Data:', this.transaction);
    this.router.navigate(['/transactions']);
  }

  navigateBack() {
    this.router.navigate(['/transactions']);
  }
}