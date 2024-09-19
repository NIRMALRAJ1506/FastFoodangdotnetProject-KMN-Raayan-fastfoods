import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  passwordForm: FormGroup;
  isEmailVerified = false;
  isInvalidEmail = false;
  passwordResetSuccess = false;
  errorMessage = '';
  isLoading = false;

  constructor(private fb: FormBuilder) {
    // Email form
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    // Password form
    this.passwordForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$' // Regex for strong password
          ),
        ],
      ],
    });
  }

  // Verify if the email exists in the backend
  verifyEmail() {
    const email = this.emailForm.get('email')?.value;
    this.isLoading = true;
    this.errorMessage = ''; // Clear previous error messages

    axios
      .post('http://localhost:5270/api/user/forgot-password', { email }) // Updated to correct API endpoint
      .then((response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.isEmailVerified = true;
          this.isInvalidEmail = false;
        } else {
          this.isInvalidEmail = true;
          this.errorMessage = 'Email does not exist.';
        }
      })
      .catch((error) => {
        this.isLoading = false;
        this.isInvalidEmail = true;
        this.errorMessage = 'Error verifying email. Please try again later.';
        console.error('Error verifying email:', error);
      });
  }

  // Reset password after verifying the email
  resetPassword() {
    if (this.passwordForm.invalid) {
      return; // Prevent resetting password if form is invalid
    }

    const email = this.emailForm.get('email')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    this.isLoading = true;
    this.errorMessage = ''; // Clear previous error messages

    axios
      .post('http://localhost:5270/api/user/reset-password', { email, newPassword }) // Updated to correct API endpoint
      .then((response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.passwordResetSuccess = true;
          this.isEmailVerified = false; // Reset the form state after successful password reset
        }
      })
      .catch((error) => {
        this.isLoading = false;
        this.errorMessage = 'Error resetting password. Please try again later.';
        console.error('Error resetting password:', error);
      });
  }
}
