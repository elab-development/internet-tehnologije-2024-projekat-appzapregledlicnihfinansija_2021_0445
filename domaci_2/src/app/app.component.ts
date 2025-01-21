import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { SiteHeaderComponent } from './site-header/site-header.component';
import { AddTransactionComponent } from './pages/add-transaction/add-transaction.component';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import { ButtonComponent } from './components/button/button.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { ModalComponent } from './components/modal/modal.component';
import { RegisterComponent } from './pages/register/register.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, SettingsComponent, TransactionsComponent, SiteHeaderComponent,
    TransactionsComponent,AddTransactionComponent, FormsModule, ButtonComponent, InputFieldComponent, ModalComponent, RegisterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
