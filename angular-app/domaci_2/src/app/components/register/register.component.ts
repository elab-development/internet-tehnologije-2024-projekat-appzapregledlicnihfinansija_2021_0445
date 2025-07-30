import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {
    const credentials = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.authService.register(credentials).subscribe({
      next: (response) => {
        const token = response.access_token;
        const tokenType = response.token_type;
        localStorage.setItem('authToken', `${tokenType} ${token}`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.message || 'Registration failed';
        console.error('Registration error:', err);
      }
    });
  }
}
