import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Barre l'accès au backoffice tant qu'aucune session n'est ouverte. */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    // Mot de passe par défaut : on impose d'en choisir un avant tout le reste.
    if (auth.mustChangePassword() && !state.url.startsWith('/admin/compte')) {
      return router.createUrlTree(['/admin/compte']);
    }
    return true;
  }
  return router.createUrlTree(['/admin/login'], { queryParams: { redirect: state.url } });
};
