import axios from 'axios';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FoodItemService {
  private apiUrl = 'http://localhost:5270/api/fooditems';

  constructor() { }

  getFoodItems() {
    return axios.get(this.apiUrl);
  }

  getFoodItem(id: number) {
    return axios.get(`${this.apiUrl}/${id}`);
  }

  addFoodItem(foodItem: any) {
    return axios.post(this.apiUrl, foodItem);
  }

  updateFoodItem(id: number, foodItem: any) {
    return axios.put(`${this.apiUrl}/${id}`, foodItem);
  }

  deleteFoodItem(id: number) {
    return axios.delete(`${this.apiUrl}/${id}`);
  }
}
