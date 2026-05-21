import { inject, Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../auth/service/auth-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  
  private authService: AuthService  = inject(AuthService);
  private router: Router = inject(Router);

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/auth/login']);
    return false;
  }
}
