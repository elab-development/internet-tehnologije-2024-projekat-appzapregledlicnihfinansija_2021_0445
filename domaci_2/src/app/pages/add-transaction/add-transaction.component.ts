import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, ModalComponent],
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

  showModal: boolean = false;

  onSubmit() {
    console.log('Transaction Data:', this.transaction);
    this.router.navigate(['/transactions']);
  }

  navigateBack() {
    this.router.navigate(['/transactions']);
  }
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  confirmSave() {
    console.log('Transaction Data:', this.transaction);
    this.router.navigate(['/transactions']);  // Preusmeravanje na stranicu sa transakcijama
    this.closeModal();  // Zatvori modal nakon što je transakcija sačuvana
  }
}