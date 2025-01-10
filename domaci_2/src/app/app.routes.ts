import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'transactions', component: TransactionsComponent},
    { path: 'settings', component: SettingsComponent},
    { path: 'login', component: LoginComponent},

    { path: '', redirectTo: '/dashboard', pathMatch: 'full'}

];