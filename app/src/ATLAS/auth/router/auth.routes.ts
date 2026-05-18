import { Routes } from '@angular/router';

export const ROUTES_AUTH: Routes = [
    { path: 'login',  loadComponent: () => import('../login-component/login-component').then(l => l.LoginComponent) },
    { path: 'register', loadComponent: () => import('../register-component/register-component').then(l => l.RegisterComponent)}
];