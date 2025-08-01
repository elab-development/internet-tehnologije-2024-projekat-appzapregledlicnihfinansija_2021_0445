import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService, CreateAccountDto } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent {
  newAccountName: string = '';
  newAccountBalance: number | null = null;
  isSubmitting: boolean = false;
  createError: string = '';
  successMessage: string = '';

  @Output() accountCreated = new EventEmitter<void>();

  constructor(private apiService: ApiService) {}

  onCreateAccount(): void {
    if (!this.newAccountName || this.newAccountBalance === null) {
      this.createError = 'Please fill in all fields';
      return;
    }

    this.isSubmitting = true;
    this.createError = '';
    this.successMessage = '';

    const payload: CreateAccountDto = {
      account_name: this.newAccountName,
      balance: Number(this.newAccountBalance)
    };

    this.apiService.createAccount(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Account created successfully.';
        this.newAccountName = '';
        this.newAccountBalance = null;
        this.accountCreated.emit();
      },
      error: (err: Error) => {
        this.isSubmitting = false;
        this.createError = err.message || 'Error creating account';
      }
    });
  }
}
