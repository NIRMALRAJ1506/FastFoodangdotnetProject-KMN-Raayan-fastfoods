import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../shared/services/user.service'; // Adjust the path according to your project structure
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup; // Non-null assertion operator
  isModalVisible = false; // Modal visibility state
  successMessage: string = 'User Added Successfully';
  

  constructor(private fb: FormBuilder, private userService: UserService,private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z]+( [a-zA-Z]+)*$'),
        Validators.minLength(4),
        Validators.maxLength(20)
      ]],
      dob: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_,./#&()\'\\-\\s]{4,50}$')]],
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]{4,15}$')]],
      email: ['', [Validators.required, Validators.pattern(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ // Custom email pattern
      )]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')]],
      role: ['User', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;
      this.userService.registerUser(formData)
        .then(response => {
          console.log('User registration successful', response);
          this.signupForm.reset(); // Reset form after successful submission
          this.openModal(); // Open the success modal
        })
        .catch(error => {
          console.error('Error during user registration', error);
        });
    } else {
      console.error('Form is invalid');
    }
  }

  openModal(): void {
    this.isModalVisible = true; // Show the modal
  }

  closeModal(): void {
    this.isModalVisible = false; // Hide the modal
    this.router.navigate(['/login'])
  }
}
