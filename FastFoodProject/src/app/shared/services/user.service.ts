import axios, { AxiosError } from 'axios';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5270/api'; // Adjust the base URL as needed

  constructor(private router: Router) {
    // Set up interceptors to include JWT token in requests
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }, (error) => {
      return Promise.reject(error);
    });
  }

  // Helper function to check if error is an AxiosError
  private isAxiosError(error: any): error is AxiosError {
    return error.isAxiosError === true;
  }

  // Registration Methods
  registerUser(userData: any) {
    return axios.post(`${this.apiUrl}/user/register`, userData)
      .then(response => {
        const { token, userId } = response.data;
        // Store JWT token and userId in localStorage
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userId', userId);
        return response.data;
      })
      .catch((error: any) => {
        if (this.isAxiosError(error)) {
          console.error('Error during user registration', error.response?.data || error.message);
        } else {
          console.error('Unexpected error during user registration', error);
        }
        throw error;
      });
  }

  registerAdmin(adminData: any) {
    return axios.post(`${this.apiUrl}/admin/register`, adminData)
      .then(response => {
        const { token, userId } = response.data;
        // Store JWT token and userId in localStorage
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userId', userId);
        return response.data;
      })
      .catch((error: any) => {
        if (this.isAxiosError(error)) {
          console.error('Error during admin registration', error.response?.data || error.message);
        } else {
          console.error('Unexpected error during admin registration', error);
        }
        throw error;
      });
  }

  // Login Methods
  loginUser(credentials: { username: string; password: string }) {
    return axios.post(`${this.apiUrl}/user/login`, credentials)
      .then(response => {
        const { token, userId } = response.data;
        // Store JWT token and userId in localStorage
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userId', userId);
        console.log(response);
        return response.data;
      })
      .catch((error: any) => {
        if (this.isAxiosError(error)) {
          console.error('Error during user login', error.response?.data || error.message);
        } else {
          console.error('Unexpected error during user login', error);
        }
        throw error;
      });
  }

  loginAdmin(credentials: { username: string; password: string }) {
    return axios.post(`${this.apiUrl}/admin/login`, credentials)
      .then(response => {
        const { token, userId } = response.data;
        // Store JWT token and userId in localStorage
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('userId', userId);
        return response.data;
      })
      .catch((error: any) => {
        if (this.isAxiosError(error)) {
          console.error('Error during admin login', error.response?.data || error.message);
        } else {
          console.error('Unexpected error during admin login', error);
        }
        throw error;
      });
  }

  // Fetch user details
  async getUserDetails() {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');
      const response = await axios.get(`${this.apiUrl}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      if (this.isAxiosError(error)) {
        console.error('Error fetching user details', error.response?.data || error.message);
      } else {
        console.error('Unexpected error fetching user details', error);
      }
      throw error;
    }
  }

  // Update user details
  async updateUser(updatedData: any) {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) throw new Error('User ID not found');
      await axios.put(`${this.apiUrl}/user/${userId}`, updatedData);
    } catch (error: any) {
      if (this.isAxiosError(error)) {
        console.error('Error updating user details', error.response?.data || error.message);
      } else {
        console.error('Unexpected error updating user details', error);
      }
      throw error;
    }
  }

  // Logout function to clear token and userId
  logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userId');
    this.router.navigate(['/login']);
  }
}
