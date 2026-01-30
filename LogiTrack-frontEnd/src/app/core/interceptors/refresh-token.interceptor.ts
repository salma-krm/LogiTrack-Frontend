import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

export const RefreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 errors with automatic token refresh
      if (error.status === 401 && !req.url.includes('/api/auth/')) {
        return handle401Error(req, next, authService, router);
      }

      return throwError(() => error);
    })
  );
};

function handle401Error(request: any, next: any, authService: AuthService, router: Router): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((tokenResponse: any) => {
        isRefreshing = false;
        refreshTokenSubject.next(tokenResponse.token);

        // Retry the original request with the new token
        const newRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${tokenResponse.token}`
          }
        });

        return next(newRequest);
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logout();
        router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  } else {
    // If refresh is already in progress, wait for it to complete
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(() => {
        const newRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${authService.getToken()}`
          }
        });
        return next(newRequest);
      })
    );
  }
}
