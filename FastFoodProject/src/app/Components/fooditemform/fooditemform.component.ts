import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios from 'axios';
import { ActivatedRoute, Router } from '@angular/router';
import { ImgService } from '../../shared/services/imgservice.service';
 // Adjust the import path as necessary

@Component({
  selector: 'app-fooditemform',
  templateUrl: './fooditemform.component.html',
  styleUrls: ['./fooditemform.component.css']
})
export class FooditemformComponent implements OnInit {
  foodItemForm: FormGroup;
  itemId: number | null = null;
  foodType: string = '';
  imageNames: string[] = []; // To hold image names for the dropdown

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private imgService: ImgService // Inject ImgService
  ) {
    this.foodItemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
      imageName: ['', Validators.required], // Use imageName instead of ImgUrl
      foodType: ['']
    });
  }

  ngOnInit(): void {
    this.itemId = +this.route.snapshot.paramMap.get('id')!;
    this.foodType = this.route.snapshot.queryParamMap.get('type') || '';
    
    // Initialize image names from ImgService
    this.imageNames = Object.keys(this.imgService.images);

    if (this.itemId) {
      // Editing an existing item
      this.fetchFoodItem();
    } else {
      // Initializing form with the provided food type
      this.foodItemForm.patchValue({ foodType: this.foodType });
    }
  }

  private async fetchFoodItem() {
    try {
      const response = await axios.get(`http://localhost:5270/api/fooditems/${this.itemId}`);
      const data = response.data;
      // Derive imageName from ImgUrl
      const imageName = Object.keys(this.imgService.images).find(name => this.imgService.getImage(name) === data.ImgUrl) || '';
      this.foodItemForm.patchValue({
        ...data,
        imageName // Set imageName instead of ImgUrl
      });
    } catch (error) {
      console.error('Error fetching food item:', error);
    }
  }

  async onSubmit() {
    if (this.foodItemForm.valid) {
      const formValue = this.foodItemForm.value;
      const imageUrl = this.imgService.getImage(formValue.imageName); // Get image URL from ImgService
      const foodItem = {
        ...formValue,
        ImgUrl: imageUrl // Include image URL in the payload
      };

      try {
        if (this.itemId) {
          // Update existing item
          await axios.put(`http://localhost:5270/api/fooditems/${this.itemId}`, foodItem);
        } else {
          // Add new item
          await axios.post('http://localhost:5270/api/fooditems', foodItem);
        }
        this.router.navigate(['/pizza']); // Redirect to the pizza page or wherever appropriate
      } catch (error) {
        console.error('Error saving food item:', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
