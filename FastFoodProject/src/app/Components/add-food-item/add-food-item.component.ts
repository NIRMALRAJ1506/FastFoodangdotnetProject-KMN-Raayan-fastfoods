import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-add-food-item',
  templateUrl: './add-food-item.component.html',
  styleUrls: ['./add-food-item.component.css']
})
export class AddFoodItemComponent implements OnInit {
  addFoodItemForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.addFoodItemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      imageUrl: ['', Validators.required],
      foodType: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  async onSubmit() {
    if (this.addFoodItemForm.valid) {
      try {
        await axios.post('http://localhost:5270/api/fooditems', this.addFoodItemForm.value);
        this.router.navigate(['/manage-items']); // Redirect to Manage Items page
      } catch (error) {
        console.error('Error adding food item', error);
      }
    } else {
      console.error('Form is invalid');
    }
  }
}
