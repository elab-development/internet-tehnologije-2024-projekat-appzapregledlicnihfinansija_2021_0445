import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { AddTransactionComponent } from './pages/add-transaction/add-transaction.component';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, SettingsComponent, TransactionsComponent, SiteHeaderComponent,
    TransactionsComponent,AddTransactionComponent, FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
