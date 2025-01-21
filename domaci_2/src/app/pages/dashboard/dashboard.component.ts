import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '../../site-header/site-header.component';
import { CommonModule } from '@angular/common';
import { CurrencyFormatterPipe } from '../../pipe/currency-formatter.pipe';
import { ButtonComponent } from '../../components/button/button.component';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SiteHeaderComponent, RouterModule, CommonModule, CurrencyFormatterPipe, ButtonComponent, ModalComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {} 

  showModal: boolean = false;

  navigateTo(route: string) {
    this.router.navigate(['/'+route]);
  }
}
