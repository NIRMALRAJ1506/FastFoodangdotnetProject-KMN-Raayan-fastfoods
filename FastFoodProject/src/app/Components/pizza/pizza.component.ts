import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { ImgService } from '../../shared/services/imgservice.service';
 // Adjust the import path as necessary

@Component({
  selector: 'app-pizza',
  templateUrl: './pizza.component.html',
  styleUrls: ['./pizza.component.css']
})
export class PizzaComponent implements OnInit {
  pizzaItems: any[] = [];
  foodType: string = 'Pizza'; // Directly set to 'Pizza'
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private imgService: ImgService // Inject ImgService
  ) {}

  ngOnInit() {
    this.loadPizzaItems();
  }

  async loadPizzaItems() {
    try {
      const response = await axios.get('http://localhost:5270/api/fooditems', {
        params: { type: this.foodType } // Append ?type=Pizza to the URL
      });
      this.pizzaItems = response.data;
    } catch (error) {
      console.error('Error loading pizza items', error);
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadImage();
    }
  }

  async uploadImage() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    try {
      await axios.post('http://localhost:5270/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Refresh or update the list of pizza items after upload
      this.loadPizzaItems();
    } catch (error) {
      console.error('Error uploading image', error);
    }
  }

  navigateToAddFoodItem() {
    this.router.navigate(['/add-food-item'], { queryParams: { type: this.foodType } });
  }

  navigateToUpdateFoodItem(id: number) {
    this.router.navigate(['/update-food-item', id]);
  }

  async deleteFoodItem(id: number) {
    try {
      await axios.delete(`http://localhost:5270/api/fooditems/${id}`);
      this.loadPizzaItems(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting pizza item', error);
    }
  }

  getImageUrl(imgName: string): string {
    return this.imgService.getImage(imgName);
  }
}
