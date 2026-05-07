import { CanActivateFn } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');

  if(!token){
    return false;
  }

  return true;
};
