import { HttpInterceptorFn } from '@angular/common/http';

export const autIntecerceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
