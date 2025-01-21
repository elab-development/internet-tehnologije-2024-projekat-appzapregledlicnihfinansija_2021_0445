import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ButtonComponent } from '../../components/button/button.component';
import { InputFieldComponent } from '../../components/input-field/input-field.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ButtonComponent, CommonModule, InputFieldComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

}
