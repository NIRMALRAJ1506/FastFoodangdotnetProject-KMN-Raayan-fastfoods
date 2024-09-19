import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  selectedItem: any;
  token: string | null = null;
  error: string | null = null;
  paymentDetails = {
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };
  isProcessing = false; // Flag to prevent multiple clicks

  // Define formErrors with an index signature
  formErrors: { [key: string]: string } = {};

  private apiUrl = 'http://localhost:5270/api/order'; // Base API URL

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('jwtToken');

    // Get the selected food item from local storage
    const storedItem = localStorage.getItem('selectedFoodItem');
    if (storedItem) {
      this.selectedItem = JSON.parse(storedItem);
    } else {
      this.router.navigate(['/userdash']); // Redirect if no item selected
    }
  }

  validateForm(): boolean {
    this.formErrors = {}; // Clear previous errors

    // Card Number Validation
    if (!this.paymentDetails.cardNumber) {
      this.formErrors['cardNumber'] = 'Card number is required.';
    } else if (!/^\d{16}$/.test(this.paymentDetails.cardNumber)) {
      this.formErrors['cardNumber'] = 'Card number must be 16 digits.';
    }

    // Expiry Date Validation
    if (!this.paymentDetails.expiryDate) {
      this.formErrors['expiryDate'] = 'Expiry date is required.';
    } else if (!/^(0[1-9]|1[0-2])\/(2[0-9])$/.test(this.paymentDetails.expiryDate)) {
      this.formErrors['expiryDate'] = 'Expiry date must be in MM/YY format.';
    }

    // CVV Validation
    if (!this.paymentDetails.cvv) {
      this.formErrors['cvv'] = 'CVV is required.';
    } else if (!/^\d{3}$/.test(this.paymentDetails.cvv)) {
      this.formErrors['cvv'] = 'CVV must be 3 digits.';
    }

    // Return true if no errors
    return Object.keys(this.formErrors).length === 0;
  }

  async payNow() {
    if (this.isProcessing) return; // Prevent multiple clicks
    this.isProcessing = true; // Set processing flag

    if (!this.selectedItem || !this.token) {
      this.error = 'Payment cannot be processed. Try again.';
      this.isProcessing = false; // Reset processing flag
      return;
    }

    // Validate form fields
    if (!this.validateForm()) {
      this.isProcessing = false; // Reset processing flag
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.error = 'User not logged in. Please log in first.';
        this.isProcessing = false; // Reset processing flag
        return;
      }

      // Order creation after payment
      const orderCreateModel = {
        orderNumber: `ORD-${new Date().getTime()}`, // Generate a unique order number
        totalPrice: this.selectedItem.price,
        orderTime: new Date().toISOString(),
        status: 'Pending',
        userId: userId,
        foodItemIds: [this.selectedItem.id]
      };

      const response = await axios.post(this.apiUrl, orderCreateModel, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      });

      const orderId = response.data.id;
      if (orderId) {
        // Navigate to the order confirmation page
        this.router.navigate(['/order-confirmation', orderId]);
      } else {
        this.error = 'Unexpected response format. Please try again.';
      }
    } catch (error) {
      console.error('Payment error:', error); // Log error for debugging
      this.error = 'Error processing payment. Please try again.';
    } finally {
      this.isProcessing = false; // Reset processing flag
    }
  }

  cancelPayment() {
    this.router.navigate(['/userdash']);
  }
}
