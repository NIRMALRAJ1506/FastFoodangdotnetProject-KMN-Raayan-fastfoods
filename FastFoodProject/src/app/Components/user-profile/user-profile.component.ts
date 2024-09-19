import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userId: number;
  userDetails: any = {}; // Initialize as an empty object
  isEditing: boolean = false;
  token: any;
  showMenu: boolean = false; // Sidebar state
  updateNotification: string | null = null; // Notification for profile update
  isDeleteModalVisible: boolean = false; // Control delete confirmation modal visibility
  isLogoutModalVisible: boolean = false; // Control logout confirmation modal visibility

  constructor(private router: Router) {
    this.userId = +localStorage.getItem('userId')!;
  }

  ngOnInit(): void {
    this.fetchUserDetails();
    this.token = localStorage.getItem('jwtToken');
  }

  async fetchUserDetails() {
    try {
      const response = await axios.get(`http://localhost:5270/api/user/${this.userId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      this.userDetails = response.data;
      if (this.userDetails.dob) {
        // Convert date to YYYY-MM-DD format
        this.userDetails.dob = this.formatDateForInput(this.userDetails.dob);
      }
    } catch (error) {
      console.error('Error fetching user details', error);
    }
  }

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  editProfile() {
    this.isEditing = true;
  }

  async updateProfile() {
    try {
      if (this.userDetails.dob) {
        this.userDetails.dob = this.formatDateForInput(new Date(this.userDetails.dob).toISOString());
      }
      await axios.put(`http://localhost:5270/api/user/${this.userId}`, this.userDetails, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      this.isEditing = false;
      await this.fetchUserDetails();
      this.updateNotification = 'User Details Updated Successfully';
      setTimeout(() => this.updateNotification = null, 3000);
    } catch (error) {
      console.error('Error updating user profile', error);
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }

  showDeleteModal() {
    this.isDeleteModalVisible = true;
  }

  async confirmDelete() {
    try {
      await axios.delete(`http://localhost:5270/api/user/${this.userId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error deleting user profile', error);
    }
  }

  cancelDelete() {
    this.isDeleteModalVisible = false;
  }

  deleteProfile() {
    this.showDeleteModal();
  }

  showProfile() {
    this.router.navigate(['/user-profile']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToOrders() {
    this.router.navigate(['/order-list']);
  }

  goToHome() {
    this.router.navigate(['/userdash']);
  }

  showLogoutModal() {
    this.isLogoutModalVisible = true;
  }

  confirmLogout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }

  cancelLogout() {
    this.isLogoutModalVisible = false;
  }

  logout() {
    this.showLogoutModal();
  }

  toggleSidebar() {
    this.showMenu = !this.showMenu;
  }

  
}
