import { HttpInterceptorFn } from '@angular/common/http';

export const authIntecerceptorInterceptor: HttpInterceptorFn = (req, next) => {
  
  const token = localStorage.getItem('token');

  if(token){
    const cloneReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
    return next(cloneReq);
  }

  return next(req);
};
