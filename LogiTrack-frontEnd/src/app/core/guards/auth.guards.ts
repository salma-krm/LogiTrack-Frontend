import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Check if token is expiring soon and refresh if needed
  if (authService.isTokenExpiringSoon()) {
    authService.refreshToken().subscribe({
      error: () => {
        router.navigate(['/auth/login']);
      }
    });
  }

  return true;
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const requiredRoles = route.data?.['roles'] as string[];
  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No specific role required
  }

  const user = authService.getCurrentUser();
  if (!user || !requiredRoles.includes(user.role)) {
    router.navigate(['/access-denied']);
    return false;
  }

  return true;
};

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    // Redirect authenticated users to their appropriate dashboard
    switch (user?.role) {
      case 'ADMIN':
        router.navigate(['/admin/dashboard']);
        break;
      case 'MANAGER':
        router.navigate(['/warehouse/dashboard']);
        break;
      case 'CLIENT':
        router.navigate(['/client/dashboard']);
        break;
      default:
        router.navigate(['/dashboard']);
    }
    return false;
  }

  return true;
};
