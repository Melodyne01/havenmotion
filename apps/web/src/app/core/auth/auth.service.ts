import { Injectable, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APP_CONFIG } from '../app-config';
import { AuthTokens } from '../../models';

const STORAGE_KEY = 'vnl.auth';

/**
 * Session du backoffice. Le jeton d'accès est court ; le jeton de
 * rafraîchissement est stocké côté navigateur et échangé par l'intercepteur
 * lorsqu'une requête revient en 401.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(APP_CONFIG).apiBaseUrl;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly tokens = signal<AuthTokens | null>(this.restore());

  readonly isAuthenticated = computed(() => this.tokens() !== null);
  readonly email = computed(() => this.tokens()?.email ?? '');
  readonly role = computed(() => this.tokens()?.role ?? null);

  get accessToken(): string | null {
    return this.tokens()?.accessToken ?? null;
  }

  login(email: string, password: string): Observable<AuthTokens> {
    return this.http
      .post<AuthTokens>(`${this.base}/auth/login`, { email, password })
      .pipe(tap((tokens) => this.persist(tokens)));
  }

  /** Échange le jeton de rafraîchissement. Renvoie `false` si la session est morte. */
  refresh(): Observable<boolean> {
    const refreshToken = this.tokens()?.refreshToken;
    if (!refreshToken) {
      return of(false);
    }
    return this.http.post<AuthTokens>(`${this.base}/auth/refresh`, { refreshToken }).pipe(
      tap((tokens) => this.persist(tokens)),
      map(() => true),
      catchError(() => {
        this.clear();
        return of(false);
      }),
    );
  }

  logout(): Observable<void> {
    const refreshToken = this.tokens()?.refreshToken;
    this.clear();
    if (!refreshToken) {
      return of(void 0);
    }
    return this.http
      .post<void>(`${this.base}/auth/logout`, { refreshToken })
      .pipe(catchError(() => of(void 0)));
  }

  clear(): void {
    this.tokens.set(null);
    if (this.isBrowser) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  private persist(tokens: AuthTokens): void {
    this.tokens.set(tokens);
    if (this.isBrowser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    }
  }

  private restore(): AuthTokens | null {
    if (!this.isBrowser) {
      return null;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthTokens;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
