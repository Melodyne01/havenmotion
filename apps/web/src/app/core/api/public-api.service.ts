import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APP_CONFIG } from '../app-config';
import { SiteLocale } from '../locale';
import { Category, Film, LeadRequest, SitePayload } from '../../models';
import { PLACEHOLDER_CATEGORIES, PLACEHOLDER_FILMS, PLACEHOLDER_SITE } from '../placeholder-content';

/**
 * Lecture du contenu publié.
 *
 * Si l'API est injoignable (poste de dev sans backend, incident réseau), on
 * retombe sur le contenu de démarrage plutôt que d'afficher une page vide :
 * la maquette reste vérifiable et les CTA restent accessibles.
 */
@Injectable({ providedIn: 'root' })
export class PublicApiService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(APP_CONFIG).apiBaseUrl;

  site(locale: SiteLocale = 'fr'): Observable<SitePayload> {
    return this.http
      .get<SitePayload>(`${this.base}/public/site`, { params: new HttpParams().set('locale', locale) })
      .pipe(catchError((err) => this.fallback('site', err, PLACEHOLDER_SITE)));
  }

  categories(locale: SiteLocale = 'fr'): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.base}/public/categories`, {
        params: new HttpParams().set('locale', locale),
      })
      .pipe(catchError((err) => this.fallback('categories', err, PLACEHOLDER_CATEGORIES)));
  }

  films(slug: string, locale: SiteLocale = 'fr'): Observable<Film[]> {
    return this.http
      .get<Film[]>(`${this.base}/public/categories/${slug}/films`, {
        params: new HttpParams().set('locale', locale),
      })
      .pipe(catchError((err) => this.fallback('films', err, PLACEHOLDER_FILMS[slug] ?? [])));
  }

  /**
   * Retombe sur le contenu de démarrage plutôt que sur une page vide, mais
   * en le signalant : un échec silencieux ici (mauvaise URL d'API, backend
   * injoignable) rendrait le site "fonctionnel" en apparence tout en
   * affichant du contenu figé sans que personne ne s'en aperçoive.
   */
  private fallback<T>(call: string, err: unknown, value: T): Observable<T> {
    console.error(`[PublicApiService] ${call}() a échoué, contenu de démarrage affiché à la place :`, err);
    return of(value);
  }

  submitLead(payload: LeadRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/public/leads`, payload);
  }
}
