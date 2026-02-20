import { Routes } from '@angular/router';
import { authGuardGuard } from './guard/auth-guard-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {path: 'auth/login' , loadComponent: () => import('./auth/login-component/login-component').then(l => l.LoginComponent)},
    {path: 'auth/register' , loadComponent: () => import('./auth/register-component/register-component').then(l => l.RegisterComponent)},
    {path: 'newLodging', canActivate: [authGuardGuard] ,loadComponent: () => import('./pages/create-lodging/create-lodging').then(t => t.CreateLodging)},
    {path: 'dashboard', loadComponent: () => import('./pages/dashboard/dashboard').then(t => t.Dashboard)},
    {path: 'account', canActivate: [authGuardGuard] ,loadComponent: () => import('./pages/account/account').then(t => t.Account)},
    {path: 'details/:id', canActivate: [authGuardGuard] ,loadComponent: () => import('./pages/details/details').then(t => t.Details)},
    {path: 'favorites', canActivate: [authGuardGuard] ,loadComponent: () => import('./pages/favorites/favorites').then(t => t.Favorites)},
];
