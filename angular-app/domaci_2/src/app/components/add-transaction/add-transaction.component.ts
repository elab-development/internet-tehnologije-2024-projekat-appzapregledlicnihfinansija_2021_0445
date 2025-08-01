import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-add-transaction',
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']
})
export class AddTransactionComponent {

  amount: number = 0;
  details: string = '';
  type: 'expense' | 'income' = 'expense';
  accountId!: number;
  categoryId!: number;

  accounts: any[] = [];
  categories: any[] = [];
  isLoading = false;
  error: string = '';

  currentUserId!: number;

  constructor(
    private transactionService: TransactionService,
    private apiService: ApiService,
    private authService: AuthService,
    // private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.getUser().subscribe({
      next: (currentUser) => {
        if (currentUser && currentUser.id) {
          this.currentUserId = currentUser.id;
this.loadAccounts(this.currentUserId);
          console.log(currentUser.id)
        } else {
          console.error('No logged-in user found');
        }
      },
      error: (err) => {
        console.error('Failed to get user', err);
      }
    });
  }

  submit() {
    if (!this.amount || !this.accountId) {
      this.error = 'All fields are required.';
      return;
    }

    const transaction = {
      amount: this.amount.toString(),
      details: this.details,
      type: this.type,
      account_id: this.accountId,
      category_id: 73
    };

    this.isLoading = true;
    this.transactionService.createTransaction(transaction).subscribe({
      next: (res) => {
        console.log('Transaction created:', res);
        this.router.navigate([`/transactions/{userId}`]);
      },
      error: (err) => {
        this.error = 'Failed to add transaction.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onTypeChange(newValue: string) {
    console.log('Type changed:', newValue);
    this.type = newValue as 'expense' | 'income';
  }

  loadAccounts(userId: number) {
    this.apiService.getAccounts().subscribe({
      next: (data) => {
        console.log(data);
        this.accounts = data.filter(account => +account.user_id === userId);
        console.log('User accounts loaded:', this.accounts);
      },
      error: (err) => {
        console.error('Failed to load accounts', err);
      }
    });
  }
}

