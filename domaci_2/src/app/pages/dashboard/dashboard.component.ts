import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ChartComponent } from '../../components/chart/chart.component';
import { SiteHeaderComponent } from '../../site-header/site-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ChartComponent, SiteHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor(private router: Router) {} 

  // Define the navigateTo method
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
