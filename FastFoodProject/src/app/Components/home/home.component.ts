import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] // Corrected the typo from 'styleUrl' to 'styleUrls'
})
export class HomeComponent implements OnInit {

  ngOnInit() {
    // Check if the JWT token exists and clear it
    const token = localStorage.getItem('jwtToken');
    if (token) {
      localStorage.removeItem('jwtToken');
      console.log('Token cleared.');
    }
  }
}
