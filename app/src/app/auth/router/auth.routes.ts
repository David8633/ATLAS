import { Routes } from '@angular/router';

export const ROUTES_AUTH: Routes = [
    { path: 'login',  loadComponent: () => import('./../../auth/login-component/login-component').then(l => l.LoginComponent) },
    { path: 'register', loadComponent: () => import('./../../auth/register-component/register-component').then(l => l.RegisterComponent)}
];