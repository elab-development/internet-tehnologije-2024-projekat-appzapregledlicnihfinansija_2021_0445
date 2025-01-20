import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SiteHeaderComponent } from '../../site-header/site-header.component';
import { CommonModule } from '@angular/common';
import { CurrencyFormatterPipe } from '../../pipe/currency-formatter.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SiteHeaderComponent, RouterModule, CommonModule, CurrencyFormatterPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {} 

  navigateTo(route: string) {
    this.router.navigate(['/'+route]);
  }
}
