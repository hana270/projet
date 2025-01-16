import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  
})
export class RegisterComponent {
  registerData = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.registerData.username || !this.registerData.password) {
      alert('Please fill in all fields');
      return;
    }

    this.authService.register(this.registerData).subscribe(
      response => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error => {
        alert('Registration failed: ' + error);
      }
    );
  }
}