// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/service/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  // ✅ Endpoints públicos que NO deben llevar token
  const isPublicEndpoint = (): boolean => {
    const url = req.url;
    const method = req.method;
    
    // Auth endpoints
    if (url.includes('/api/auth/')) return true;
    
    // GET públicos
    if (method === 'GET') {
      if (url.includes('/api/destinos')) return true;
      if (url.includes('/api/alojamientos')) return true;
      if (url.includes('/api/opiniones')) return true;
      if (url.includes('/api/detalles')) return true;
    }
    
    // Swagger
    if (url.includes('/swagger') || url.includes('/api-docs') || url.includes('/v3/api-docs')) {
      return true;
    }
    
    return false;
  };
  
  // Solo añadir token si existe y NO es endpoint público
  if (token && !isPublicEndpoint()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};