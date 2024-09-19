import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  loading = true;
  error: string | null = null;
  selectedUser: any = null; // For holding user data when updating
  selectedUserId: number | null = null; // For holding user ID when deleting
  isEditing = false; // Flag to show/hide the update form
  menuVisible = true;
  showLogoutModal = false;
  showDeleteModal = false; // Flag to show/hide delete confirmation modal

  constructor(private router: Router) {}

  ngOnInit() {
    this.fetchUsers();
  }

  async fetchUsers() {
    try {
      const response = await axios.get('http://localhost:5270/api/user');
      this.users = response.data;
      this.loading = false;
    } catch (error) {
      this.error = 'Error fetching users';
      console.error('Error fetching users:', error);
      this.loading = false;
    }
  }

  async deleteUser(userId: number) {
    try {
      await axios.delete(`http://localhost:5270/api/user/${userId}`);
      this.users = this.users.filter(user => user.id !== userId);
      this.showDeleteModal = false; // Close the modal after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  // Open the delete confirmation modal
  openDeleteModal(userId: number) {
    this.selectedUserId = userId;
    this.showDeleteModal = true;
  }

  // Confirm the deletion
  confirmDelete() {
    if (this.selectedUserId !== null) {
      this.deleteUser(this.selectedUserId);
    }
  }

  // Cancel the deletion and close the modal
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedUserId = null;
  }

  // Open the update form and select the user to be updated
  editUser(user: any) {
    this.selectedUser = { ...user }; // Copy user data to prevent direct mutation
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.selectedUser = null;
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
