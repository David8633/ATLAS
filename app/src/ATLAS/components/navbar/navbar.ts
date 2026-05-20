import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  token = localStorage.getItem('token');
  authService = inject(AuthService);

  getUserInitial(): string {

    return this.authService.currentUser()?.firstName
      ?.charAt(0)
      ?.toUpperCase() || '?';

  }
}
