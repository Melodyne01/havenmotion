import { HttpErrorResponse } from '@angular/common/http';

/** Message lisible à partir d'une réponse d'erreur de l'API (ProblemDetails / ValidationProblem). */
export function authErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }
  if (error.status === 429) {
    return 'Trop de tentatives. Réessayez dans une minute.';
  }
  const body = error.error as { title?: string; errors?: Record<string, string[]> } | null;
  const details = body?.errors ? Object.values(body.errors).flat() : [];
  if (details.length > 0) {
    return details.join(' ');
  }
  return body?.title || fallback;
}
