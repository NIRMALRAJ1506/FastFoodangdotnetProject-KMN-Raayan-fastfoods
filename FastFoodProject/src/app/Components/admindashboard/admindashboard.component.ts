import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {
  showMenu = false;
  totalItems: number = 0;
  totalUsers: number = 0;
  totalOrders: number = 0;
  chart: Chart | undefined;
  token: string | null = null;
  showLogoutModal = false;
  showWelcomeModal = false;
  userName: string | undefined;

  fastFoodItems = [
    { name: 'Manage Items', link: '/manageitems' },
    { name: 'Manage Orders', link: '/manageorders' },
    { name: 'Manage Users', link: '/manageusers' },
    { name: 'Feedbacks', link: '/feedbacks' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.token = localStorage.getItem('jwtToken');
    if (this.token) {
      this.fetchItemCount();
      this.fetchUserCount();
      this.fetchOrderCount();
      this.fetchUserDetails();

      // Check if the welcome modal has already been shown this session
      const welcomeModalShown = sessionStorage.getItem('welcomeModalShown');
      if (!welcomeModalShown) {
        this.showWelcomeModal = true; // Show modal only if it hasn't been shown
        sessionStorage.setItem('welcomeModalShown', 'true'); // Set flag so it doesn't show again
      }
    } else {
      console.error('No JWT token found');
      this.router.navigate(['/login']);
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  async fetchItemCount() {
    if (!this.token) return;

    try {
      const response = await axios.get('http://localhost:5270/api/FoodItems', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      this.totalItems = response.data.length;
      this.updateChart();
    } catch (error) {
      console.error('Error fetching item count:', error);
    }
  }

  async fetchUserCount() {
    if (!this.token) return;

    try {
      const response = await axios.get('http://localhost:5270/api/user/count', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      this.totalUsers = response.data; // Ensure this returns a number
      this.updateChart();
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  }

  async fetchOrderCount() {
    if (!this.token) return;

    try {
      const response = await axios.get('http://localhost:5270/api/order/count', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      this.totalOrders = response.data; // Ensure this returns a number
      this.updateChart();
    } catch (error) {
      console.error('Error fetching order count:', error);
    }
  }

  async fetchUserDetails() {
    try {
      const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
      if (!userId || !this.token) return;

      const response = await axios.get(`http://localhost:5270/api/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      this.userName = response.data.name; // Fetch and store user name
    } catch (error) {
      console.error('Error fetching user details', error);
    }
  }

  updateChart() {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const canvas = document.getElementById('userChart') as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (this.chart) {
          this.chart.destroy(); // Clear any existing chart
        }
        this.chart = new Chart(ctx!, {
          type: 'bar',
          data: {
            labels: ['Total Items', 'Total Users', 'Total Orders'],
            datasets: [
              {
                label: 'Count',
                data: [this.totalItems, this.totalUsers, this.totalOrders],
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  }

  openLogoutModal() {
    this.showLogoutModal = true;
  }

  closeLogoutModal() {
    this.showLogoutModal = false;
  }

  confirmLogout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
    this.showLogoutModal = false;
    sessionStorage.removeItem('welcomeModalShown'); // Reset flag on logout
  }

  // Handle welcome modal close
  closeWelcomeModal() {
    this.showWelcomeModal = false;
  }
}
