import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { IS_PUBLIC_API } from './request-context.interceptor';
import { AuthService } from '../services/auth-service/auth-service';

export const privateInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (req.context.get(IS_PUBLIC_API)) {
    return next(req);
  }

  const token = authService.getToken;

  if (!token) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
