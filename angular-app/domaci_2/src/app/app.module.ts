import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar..component';
import { ButtonComponent } from './components/button/button.component';
import { InputFieldComponent } from './components/input-field/input-field.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    ButtonComponent,
    InputFieldComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
