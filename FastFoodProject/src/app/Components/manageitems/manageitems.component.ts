import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manageitems',
  templateUrl: './manageitems.component.html',
  styleUrls: ['./manageitems.component.css']
})
export class ManageitemsComponent implements OnInit {
  foodItems: any[] = [];
  filteredItems: any[] = [];
  foodTypes: string[] = [];
  selectedFoodType: string | null = null;
  showAddItemForm: boolean = false;
  editingItem: any = null;
  token: string | null = null;
  showDeleteConfirmation: boolean = false;
  itemToDelete: any = null;
  notification: { message: string, type: string } | null = null;
  menuVisible = true;
  showLogoutModal = false;

  // Reactive form group for add/update item
  itemForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder) {
    // Initialize form with validators
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      imgUrl: ['', [Validators.required, Validators.pattern(/https?:\/\/.+/)]],
      foodType: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('jwtToken');
    this.loadFoodItems();
    this.loadFoodTypes();
  }

  // Load all food items from the API
  async loadFoodItems() {
    try {
      const response = await axios.get('http://localhost:5270/api/fooditems', {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      this.foodItems = response.data;
      this.filteredItems = this.foodItems;
    } catch (error) {
      console.error('Error loading food items', error);
      this.notification = { message: 'Failed to load food items', type: 'error' };
      this.showNotification();
    }
  }

  // Load all food types (unique) from the API
  async loadFoodTypes() {
    try {
      const response = await axios.get('http://localhost:5270/api/fooditems/foodtypes', {
        headers: { Authorization: `Bearer ${this.token}` }
      });
      this.foodTypes = response.data;
    } catch (error) {
      console.error('Error loading food types', error);
      this.notification = { message: 'Failed to load food types', type: 'error' };
      this.showNotification();
    }
  }

  // Filter the food items based on the selected food type
  filterItemsByType(type: string | null) {
    this.selectedFoodType = type;
    this.filteredItems = type
      ? this.foodItems.filter(item => item.foodType === type)
      : this.foodItems;
  }

  // Toggle form visibility for adding/updating items
  toggleAddItemForm(editingItem: any = null) {
    this.showAddItemForm = !this.showAddItemForm;
    if (editingItem) {
      this.editingItem = { ...editingItem }; // Clone to avoid direct mutation
      this.itemForm.patchValue({
        name: editingItem.name,
        description: editingItem.description,
        price: editingItem.price,
        imgUrl: editingItem.imgUrl,
        foodType: editingItem.foodType
      });
    } else {
      this.resetForm();
    }
  }

  // Add or update a food item
  async addOrUpdateItem() {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      this.notification = { message: 'Please correct the errors in the form.', type: 'error' };
      this.showNotification();
      return;
    }

    const formData = { ...this.itemForm.value };

    try {
      if (this.editingItem) {
        // Update the existing item
        formData.id = this.editingItem.id;
        const updateUrl = `http://localhost:5270/api/fooditems/${this.editingItem.id}`;
        await axios.put(updateUrl, formData, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.notification = { message: 'Item updated successfully', type: 'success' };
      } else {
        // Add a new item
        const response = await axios.post('http://localhost:5270/api/fooditems', formData, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.foodItems.push(response.data);
        this.notification = { message: 'Item added successfully', type: 'success' };
      }

      // Check if the entered food type is new, and add it to the foodTypes array if it's not already there
      if (!this.foodTypes.includes(formData.foodType)) {
        this.foodTypes.push(formData.foodType); // Dynamically add new food type
      }

      this.loadFoodItems();
      this.resetForm();
      this.showNotification();
    } catch (error) {
      console.error('Error occurred', error);
      this.notification = { message: 'Unexpected error occurred', type: 'error' };
      this.showNotification();
    }
  }

  // Show the notification for 3 seconds
  showNotification() {
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }

  // Show delete confirmation modal
  async deleteItem(id: number) {
    this.itemToDelete = id;
    this.showDeleteConfirmation = true;
  }

  // Confirm delete action
  async confirmDelete() {
    if (this.itemToDelete) {
      try {
        await axios.delete(`http://localhost:5270/api/fooditems/${this.itemToDelete}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.notification = { message: 'Item deleted successfully', type: 'success' };
        this.loadFoodItems();
        this.showDeleteConfirmation = false;
        this.showNotification();
      } catch (error) {
        console.error('Error deleting food item', error);
        this.notification = { message: 'Error occurred', type: 'error' };
        this.showNotification();
      }
    }
  }

  cancelDelete() {
    this.itemToDelete = null;
    this.showDeleteConfirmation = false;
  }

  resetForm() {
    this.itemForm.reset();
    this.editingItem = null;
  }

  // Get the image URL (can be adjusted if image is hosted differently)
  getImageUrl(imgUrl: string): string {
    return imgUrl;
  }

  // Navigation methods
  navigateToAdminDash() {
    this.router.navigate(['/admindash']);
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/home']);
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
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
    this.showLogoutModal = false;
  }
}
