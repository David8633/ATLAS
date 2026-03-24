import { Routes } from '@angular/router';
import { authGuardGuard } from '../../../guard/auth-guard-guard';
import { Layout } from './../../../components/layout/layout';

export const ROUTES_LAYOUT: Routes = [
    {
        path: '',
        component: Layout, // <--- Este es el "Capitán". Él sostiene el Header y Footer.
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('./../../../pages/dashboard/dashboard').then(t => t.Dashboard) },
            { path: 'lodgings', loadComponent: () => import('./../../../pages/lodgings/lodgings').then(t => t.Lodgings) },
            { path: 'destinations', loadComponent: () => import('./../../../pages/destinations/destinations').then(t => t.Destinations) },
            { path: 'books', loadComponent: () => import('./../../../pages/books/books').then(t => t.Books) },
            { 
                path: 'newLodging', 
                canActivate: [authGuardGuard], 
                loadComponent: () => import('./../../../pages/create-lodging/create-lodging').then(t => t.CreateLodging) 
            },
            { 
                path: 'account', 
                canActivate: [authGuardGuard], 
                loadComponent: () => import('./../../../pages/account/account').then(t => t.Account) 
            },
            { 
                path: 'details/:id', 
                canActivate: [authGuardGuard], 
                loadComponent: () => import('./../../../pages/details/details').then(t => t.Details) 
            },
            { 
                path: 'favourites', 
                canActivate: [authGuardGuard], 
                loadComponent: () => import('../../../pages/favourites/favourites').then(t => t.Favourites) 
            }
    ]}
];