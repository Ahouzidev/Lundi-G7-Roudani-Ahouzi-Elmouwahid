import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  message: string = '';
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      currentPassword: [''],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    });
  }

  ngOnInit() {
    // Load user data
    this.userService.getCurrentUser().subscribe(
      user => {
        this.profileForm.patchValue({
          username: user.username,
          email: user.email
        });
      },
      error => {
        this.error = 'Error loading user data';
      }
    );
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const formData = this.profileForm.value;
      
      // Only include password fields if they are filled
      if (!formData.currentPassword) {
        delete formData.currentPassword;
        delete formData.newPassword;
        delete formData.confirmPassword;
      }

      this.userService.updateProfile(formData).subscribe(
        response => {
          this.message = 'Profile updated successfully';
          this.error = '';
          // Update local storage if username changed
          if (response.username) {
            localStorage.setItem('username', response.username);
            this.authService.updateUsername(response.username);
          }
        },
        error => {
          this.error = error.error || 'Error updating profile';
          this.message = '';
        }
      );
    }
  }
} 