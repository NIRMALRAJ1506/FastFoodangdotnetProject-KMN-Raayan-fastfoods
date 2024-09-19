import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  orderDetails: any;
  token: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Retrieve token from localStorage
    this.token = localStorage.getItem('jwtToken');
    
    if (!this.token) {
      console.error('No JWT token found');
      this.router.navigate(['/login']);
      return;
    }

    // Fetch the order ID from the route parameters
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.fetchOrderDetails(orderId);
    } else {
      console.error('No order ID found in the route parameters');
      this.router.navigate(['/error']);
    }
  }

  async fetchOrderDetails(orderId: string) {
    try {
      // Make the API call to get order details
      const response = await axios.get(`http://localhost:5270/api/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      // Retrieve the cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
      console.log('Cart:', cart); // Log cart to check structure
      console.log('OrderItems from API:', response.data.orderItems); // Log order items to check structure
  
      // Calculate the quantity of each item in the order
      const orderItemsWithQuantity = response.data.orderItems.map((item: any) => {
        const quantity = cart.filter((cartItem: any) => cartItem.id === item.id).length;
        console.log(`Item ID: ${item.id}, Quantity: ${quantity}`); // Log item ID and calculated quantity
        return {
          ...item,
          quantity: quantity // Add calculated quantity to each item
        };
      });

      console.log('Order Items with Quantities:', orderItemsWithQuantity); // Log final result

      // Store the order details including the calculated quantities
      this.orderDetails = {
        orderNumber: response.data.orderNumber,
        totalPrice: response.data.totalPrice,
        status: response.data.status,
        orderItems: orderItemsWithQuantity, // Attach items with quantities
        userAddress: response.data.userAddress // Corrected to match the casing returned from the API
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  }

  // Helper method to check if the token has expired
  isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() > expiry;
  }

  // Helper method to construct image URLs for food items
  getImageUrl(imageName: string): string {
    return `${imageName}`; // Adjust this if you have a specific image URL format
  }

  // Method to navigate back to the user dashboard
  goBack() {
    this.router.navigate(['/userdash']);
  }
}
