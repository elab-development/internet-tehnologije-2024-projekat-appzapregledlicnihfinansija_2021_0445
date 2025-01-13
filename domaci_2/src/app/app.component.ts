import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { ChartComponent } from './components/chart/chart.component';
import { CategorySelectorComponent } from './components/category-selector/category-selector.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, SettingsComponent, TransactionsComponent, SiteHeaderComponent, ChartComponent, CategorySelectorComponent,
    TransactionsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
