import { Component } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrl: './feedbacks.component.css'
})
export class FeedbacksComponent {
  feedbacks: any[] = [];
  menuVisible=true;
  showLogoutModal=false;

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.loadFeedbacks();
  }
  loadFeedbacks(): void {
    // Fetch feedbacks from the backend
    axios.get('http://localhost:5270/api/feedback')
      .then(response => {
        this.feedbacks = response.data;
      })
      .catch(error => {
        console.error('Error fetching feedbacks:', error);
      });
    }

    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    }

    openLogoutModal() {
      this.showLogoutModal = true;
    }
  
    closeLogoutModal() {
      this.showLogoutModal = false;
    }
  
    confirmLogout() {
      // Perform the logout action
      localStorage.removeItem('jwtToken'); // Remove the token from localStorage
      this.router.navigate(['/login']); // Redirect to the login page
      this.showLogoutModal = false; // Close the modal after logout
    }
  }
