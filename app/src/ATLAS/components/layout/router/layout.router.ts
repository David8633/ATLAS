import { Routes } from '@angular/router';
import { Layout } from '../layout';
import { AuthGuard } from '../../../guard/auth-guard';
import { EditFormComponent } from '../../edit-form/edit-form';

export const ROUTES_LAYOUT: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('../../../pages/dashboard/dashboard').then(t => t.Dashboard) },

      // Primero la ruta con parámetro
      {
        path: 'lodgings/:destino',
        loadComponent: () =>
          import('../../../pages/lodgings/lodgings').then(t => t.Lodgings)
      },

      // Luego la ruta general
      {
        path: 'lodgings',
        loadComponent: () =>
          import('../../../pages/lodgings/lodgings').then(t => t.Lodgings)
      },

      { path: 'destinations', loadComponent: () => import('../../../pages/destinations/destinations').then(t => t.Destinations) },
      { path: 'books', loadComponent: () => import('../../../pages/booking/booking').then(t => t.Booking) },

      { 
        path: 'account', 
        canActivate: [AuthGuard], 
        loadComponent: () => import('../../../pages/account/account').then(t => t.Account) 
      },
      { 
        path: 'details/:id',  
        loadComponent: () => import('../../../pages/details/details').then(t => t.Details) 
      } ,{
        path: 'payBooking',
        canActivate: [AuthGuard], 
        loadComponent: () =>
          import('../../../pages/pay-booking/pay-booking').then(t => t.PayBooking)
      },{
        path: 'edit/:type/:id',
        canActivate: [AuthGuard],
        loadComponent: () => EditFormComponent
      }
    ]
  }
];
