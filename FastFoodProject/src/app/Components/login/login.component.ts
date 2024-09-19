import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service'; // Adjust the path as needed

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  roles = ['User', 'Admin']; // Dropdown options
  loginError: string | null = null; // To display error messages
  showModal = false; // To control modal visibility

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]{4,15}$')]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      role: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      try {
        let response;
        if (formData.role === 'Admin') {
          response = await this.userService.loginAdmin(formData);
        } else {
          response = await this.userService.loginUser(formData);
        }

        const token = localStorage.getItem("jwtToken");

        if (token) {
          // Save JWT token in localStorage
          this.loginError = null; // Reset error message
          
          // Redirect based on role
          if (formData.role === 'Admin') {
            this.router.navigate(['/admindash']);
          } else {
            this.router.navigate(['/userdash']);
          }
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('Login failed', error);
        this.loginError = 'Invalid username or password';
        this.showModal = true; // Show modal on error
      }
    }
  }

  closeModal() {
    this.showModal = false;
  }
}
