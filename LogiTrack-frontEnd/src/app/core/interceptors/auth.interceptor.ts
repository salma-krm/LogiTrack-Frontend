import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip auth header for login, register, and refresh endpoints
  const authEndpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh'];
  const isAuthEndpoint = authEndpoints.some(endpoint => req.url.includes(endpoint));

  if (isAuthEndpoint) {
    return next(req);
  }

  // Add Session-Id header for protected endpoints
  const token = authService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        'Session-Id': token
      }
    });
  }

  return next(req);
};
