import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChartComponent } from '../../components/chart/chart.component';
import { SiteHeaderComponent } from '../../site-header/site-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent, SiteHeaderComponent, RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {} 

  navigateTo(route: string) {
    this.router.navigate(['/'+route]);
  }
}
