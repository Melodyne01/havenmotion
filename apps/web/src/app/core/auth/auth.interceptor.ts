import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

/** Ajoute le jeton d'accès aux appels `/admin` et rejoue une fois après un 401. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.accessToken;

  const isAdminCall = req.url.includes('/admin/') || req.url.includes('/auth/logout');
  if (!token || !isAdminCall) {
    return next(req);
  }

  const authorized = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(authorized).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401) {
        return throwError(() => error);
      }
      return auth.refresh().pipe(
        switchMap((ok) => {
          if (!ok) {
            void router.navigate(['/admin/login']);
            return throwError(() => error);
          }
          const retried = req.clone({
            setHeaders: { Authorization: `Bearer ${auth.accessToken}` },
          });
          return next(retried);
        }),
      );
    }),
  );
};
