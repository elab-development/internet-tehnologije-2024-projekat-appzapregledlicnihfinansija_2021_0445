import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  onSubmit() {

    const credentials = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        const token = response.access_token;
        const tokenType = response.token_type; 
        localStorage.setItem('authToken', `${tokenType} ${token}`);
    
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Login error:', err);
      }
    });
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
  
}
