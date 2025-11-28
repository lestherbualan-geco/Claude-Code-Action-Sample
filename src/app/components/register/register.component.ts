import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = signal('');
  username = signal('');
  password = signal('');
  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.name() || !this.username() || !this.password()) {
      this.errorMessage.set('Please fill in all fields');
      return;
    }

    const result = this.authService.register(this.name(), this.username(), this.password());

    if (result.success) {
      this.successMessage.set(result.message);
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    } else {
      this.errorMessage.set(result.message);
    }
  }
}
