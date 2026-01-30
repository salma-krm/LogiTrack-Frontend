import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Guard pour les routes publiques (login, register)
 * Redirige vers le dashboard si l'utilisateur est déjà connecté
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // L'utilisateur est déjà connecté, rediriger vers le dashboard
    router.navigate(['/dashboard/home']);
    return false;
  }

  // L'utilisateur n'est pas connecté, autoriser l'accès à la page publique
  return true;
};

