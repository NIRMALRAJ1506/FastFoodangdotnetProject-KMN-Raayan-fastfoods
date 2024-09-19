import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactUsComponent {
  contactForm: FormGroup;
  showNotification: boolean = false;

  constructor(private fb: FormBuilder) {
    // Initialize the form group
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      feedbacktext: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const feedbackData = this.contactForm.value;

      // Submit feedback data using axios without a service
      axios.post('http://localhost:5270/api/feedback', feedbackData)
        .then(response => {
          console.log('Feedback submitted successfully:', response.data);
          this.showNotification = true;
      
      // Reset the form after submission
      this.contactForm.reset();
      
      // Optionally hide notification after some time
      setTimeout(() => this.showNotification = false, 5000);
          this.contactForm.reset(); // Reset the form after successful submission
        })
        .catch(error => {
          console.error('Error submitting feedback:', error);
          alert('There was an error submitting your feedback. Please try again.');
        });
    } else {
      console.log('Form is invalid');
    }
  }

  ngOnInit() {
    // Check if the JWT token exists and clear it
    const token = localStorage.getItem('jwtToken');
    if (token) {
      localStorage.removeItem('jwtToken');
      console.log('Token cleared.');
    }
  }
}
