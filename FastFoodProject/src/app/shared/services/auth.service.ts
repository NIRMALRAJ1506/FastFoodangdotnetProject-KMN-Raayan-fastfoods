import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5270/api'; // Update with your API base URL

  constructor() {}

  getUserRole(userId: string, token: string): Promise<string> {
    return axios.get(`${this.apiUrl}/user/${userId}/role`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => response.data.role)
      .catch(() => {
        throw new Error('Unable to fetch user role');
      });
  }
}
