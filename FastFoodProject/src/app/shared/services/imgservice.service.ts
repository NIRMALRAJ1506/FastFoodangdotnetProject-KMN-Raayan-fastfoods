import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImgService {
  images: { [key: string]: string } = {
    cornfries: 'assets/images/cornfries.jpeg',
    pizza: 'assets/images/pizza.jpg',
    // Add other images here
  };

  getImage(name: string): string {
    return this.images[name] || 'assets/images/default.jpg'; // Default image if not found
  }
}
