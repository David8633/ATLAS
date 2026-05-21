import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'auth', loadChildren : () => import('./auth/router/auth.routes').then(a => a.ROUTES_AUTH)},
    { path: '', loadChildren : () => import('./components/layout/router/layout.router').then(l => l.ROUTES_LAYOUT)},
    { path: '**', redirectTo: 'dashboard' }
];