import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar..component';
import { ButtonComponent } from './components/button/button.component';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule } from '@angular/forms';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { CurrencyFormatPipe } from './pipes/currency-format';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { AuthInterceptor } from './components/login-form/auth-interceptor';
import { CurrencyPipe } from '@angular/common';
import { RegisterComponent } from './components/register/register.component';
import { AddTransactionComponent } from './components/add-transaction/add-transaction.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ButtonComponent,
    InputFieldComponent,
    LoginFormComponent,
    DashboardComponent,
    TransactionsComponent,
    CurrencyFormatPipe,
    RegisterComponent,
    AddTransactionComponent
  ],
  imports: [
    BrowserModule,
    NgChartsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
