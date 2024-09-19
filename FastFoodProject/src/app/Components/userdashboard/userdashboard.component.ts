import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  foodItems: any[] = [];
  filteredItems: any[] = [];
  foodTypes: string[] = [];
  selectedFoodType: string | null = null;
  showMenu: boolean = false;
  selectedItem: any;
  token: string | null = null;
  loading: boolean = true;
  error: string | null = null;
  isModalVisible: boolean = false; // Control item order modal visibility
  isNotificationVisible: boolean = false; // Control notification visibility
  notificationMessage: string = ''; // Notification message
  isLogoutModalVisible: boolean = false; // Control logout confirmation modal visibility
  isWelcomeModalVisible: boolean = false; // Control welcome message modal visibility
  userName: string = 'User'; // Example user name; you might fetch this from a service or API
  userDetails: any = {};
  userId: any;

  constructor(private router: Router) {
    this.userId = +localStorage.getItem('userId')!;
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('jwtToken');

    if (this.token) {
      this.loadFoodItems();
      this.fetchUserDetails(); // Fetch user details to get the name
      this.checkAndShowWelcomeModal();
    } else {
      this.handleTokenError();
    }
  }

  async loadFoodItems() {
    this.loading = true;
    this.error = null;

    try {
      const response = await axios.get('http://localhost:5270/api/fooditems', {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      this.foodItems = response.data;
      this.filteredItems = this.foodItems;
      this.extractFoodTypes();
    } catch (error) {
      this.handleApiError(error, 'Error loading food items');
    } finally {
      this.loading = false;
    }
  }

  extractFoodTypes() {
    const types = new Set(this.foodItems.map(item => item.foodType));
    this.foodTypes = Array.from(types);
  }

  filterItemsByType(type: string | null) {
    this.selectedFoodType = type;
    this.filteredItems = type ? this.foodItems.filter(item => item.foodType === type) : this.foodItems;
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  getImageUrl(imageName: string): string {
    return `${imageName}`;
  }

  openOrderModal(item: any) {
    this.selectedItem = item; // Store the selected item
    this.isModalVisible = true; // Show the modal
  }

  async proceedToPayment() {
    if (!this.selectedItem) {
      this.error = 'No item selected for order.';
      return;
    }

    // Pass the selected item information to the payment page
    localStorage.setItem('selectedFoodItem', JSON.stringify(this.selectedItem));

    // Redirect to payment page
    this.router.navigate(['/payment']);
  }

  addToCart(item: any) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((cartItem: any) => cartItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    this.showNotification(`Item "${item.name}" added to cart.`);
  }

  showNotification(message: string) {
    this.notificationMessage = message;
    this.isNotificationVisible = true;

    // Hide notification after 3 seconds
    setTimeout(() => {
      this.isNotificationVisible = false;
    }, 3000);
  }

  showProfile() {
    this.router.navigate(['/user-profile']);
  }

  private handleApiError(error: any, context: string) {
    if (axios.isAxiosError(error)) {
      console.error(`${context}:`, error.response?.data || error.message);
      this.error = `${context}. Please try again later.`;
    } else {
      console.error('Unexpected error:', error);
      this.error = 'Unexpected error. Please try again later.';
    }
  }

  private handleTokenError() {
    console.error('No JWT token found');
    this.error = 'Authentication error. Please log in again.';
    this.loading = false;
    this.router.navigate(['/login']); // Redirect to login page
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToOrders() {
    this.router.navigate(['/order-list']);
  }

  cancelPayment() {
    this.isModalVisible = false;
  }

  // Show logout confirmation modal
  logout() {
    this.isLogoutModalVisible = true;
  }

  // Confirm logout and perform logout actions
  confirmLogout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('welcomeModalShown'); // Clear the welcome modal state on logout
    this.isLogoutModalVisible = false;
    this.router.navigate(['/login']);
  }

  // Cancel logout and close the modal
  cancelLogout() {
    this.isLogoutModalVisible = false;
  }

  // Check if the welcome modal has been shown and display it if not
  private checkAndShowWelcomeModal() {
    if (!localStorage.getItem('welcomeModalShown')) {
      this.isWelcomeModalVisible = true;
      localStorage.setItem('welcomeModalShown', 'true');
    }
  }

  // Close the welcome modal
  closeWelcomeModal() {
    this.isWelcomeModalVisible = false;
  }

  async fetchUserDetails() {
    try {
      const response = await axios.get(`http://localhost:5270/api/user/${this.userId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });
      this.userDetails = response.data;
      this.userName = this.userDetails.name; // Fetch and store user name
    } catch (error) {
      console.error('Error fetching user details', error);
    }
  }
}
