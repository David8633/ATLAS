import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'auth/login' , loadComponent: () => import('./auth/login-component/login-component').then(l => l.LoginComponent)},
    {path: 'auth/register' , loadComponent: () => import('./auth/register-component/register-component').then(l => l.RegisterComponent)},
    
];
