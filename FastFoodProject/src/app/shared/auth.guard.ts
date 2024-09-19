import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('jwtToken');
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in local storage

      if (token && userId) {
        return this.authService.getUserRole(userId, token).then(role => {
          // Define admin-only and user-only routes
          const adminRoutes = ['/admindash','/manageitems', '/manageusers', '/admin-order-confirm', '/feedbacks','/manageorders'];
          const userRoutes = ['/userdash', '/cart', '/order-list'];

          if (adminRoutes.includes(state.url) && role !== 'Admin') {
            // Redirect users who are not Admin to home or other appropriate page
            this.router.navigate(['/login']);
            return false;
          }

          if (userRoutes.includes(state.url) && role !== 'User') {
            // Redirect Admins or others who are not User to home or other appropriate page
            this.router.navigate(['/login']);
            return false;
          }

          return true; // Allow access if roles match
        }).catch(() => {
          this.router.navigate(['/login']);
          return false;
        });
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      return false;
    }
  }
}
