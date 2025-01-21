import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css'
})
export class InputFieldComponent {
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() label: string = '';          // Label for the input 
  @Input() placeholder: string = '';    // Placeholder text
  @Input() value: string = '';          // Value for the input
  @Input() required: boolean = false;   // Required field validation
  @Input() minLength: number = 0;
}
