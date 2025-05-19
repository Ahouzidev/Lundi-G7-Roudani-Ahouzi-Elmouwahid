import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join our plantation management system</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Username</mat-label>
              <input matInput formControlName="username" placeholder="Choose a username">
              <mat-icon matSuffix>person</mat-icon>
              <mat-error *ngIf="registerForm.get('username')?.errors?.['required'] && registerForm.get('username')?.touched">
                Username is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('username')?.errors?.['minlength'] && registerForm.get('username')?.touched">
                Username must be at least 3 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" placeholder="Enter your email" type="email">
              <mat-icon matSuffix>email</mat-icon>
              <mat-error *ngIf="registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.errors?.['email'] && registerForm.get('email')?.touched">
                Please enter a valid email
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" placeholder="Create a password">
              <mat-icon matSuffix>lock</mat-icon>
              <mat-error *ngIf="registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.errors?.['minlength'] && registerForm.get('password')?.touched">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="error">
              {{ error }}
            </div>

            <button mat-raised-button color="primary" type="submit" [disabled]="!registerForm.valid" class="submit-button">
              <mat-icon>how_to_reg</mat-icon>
              Create Account
            </button>
          </form>
        </mat-card-content>

        <mat-divider></mat-divider>

        <mat-card-footer>
          <div class="login-link">
            Already have an account? 
            <a mat-button color="primary" routerLink="/login">Sign in here</a>
          </div>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }

    .register-card {
      max-width: 400px;
      width: 100%;
      padding: 20px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    mat-card-header {
      margin-bottom: 20px;
      text-align: center;
      display: block;
    }

    mat-card-title {
      font-size: 24px;
      margin-bottom: 8px;
      color: #333;
    }

    mat-card-subtitle {
      font-size: 16px;
      color: #666;
    }

    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }

    .submit-button {
      width: 100%;
      padding: 8px;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      margin: 8px 0;
      text-align: center;
    }

    mat-card-footer {
      padding: 16px;
      text-align: center;
    }

    .login-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #666;
    }

    mat-divider {
      margin: 20px 0;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;
      this.authService.register(username, email, password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = 'Registration failed. Please try again.';
          console.error('Registration error:', err);
        }
      });
    }
  }
} 