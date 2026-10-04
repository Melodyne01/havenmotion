import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { APP_CONFIG } from '../app-config';
import { SiteLocale } from '../locale';
import { Category, Film, LeadRequest, Project, Review, SitePayload } from '../../models';
import { PLACEHOLDER_SITE, placeholderCategories, placeholderFilms } from '../placeholder-content';

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
      .pipe(catchError((err) => this.fallback('categories', err, placeholderCategories(locale))));
  }

  films(slug: string, locale: SiteLocale = 'fr'): Observable<Film[]> {
    return this.http
      .get<Film[]>(`${this.base}/public/categories/${slug}/films`, {
        params: new HttpParams().set('locale', locale),
      })
      .pipe(catchError((err) => this.fallback('films', err, placeholderFilms(slug, locale))));
  }

  /** Projets publiés dans la langue, les mis en avant d'abord ; `[]` sans API. */
  projects(locale: SiteLocale, filters: { category?: string; region?: string; limit?: number } = {}): Observable<Project[]> {
    let params = new HttpParams().set('locale', locale);
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params = params.set(key, String(value));
      }
    }
    return this.http
      .get<Project[]>(`${this.base}/public/projects`, { params })
      .pipe(catchError((err) => this.fallback('projects', err, [] as Project[])));
  }

  /** Un projet publié par slug ; `null` s'il n'existe pas ou sans API. */
  project(slug: string): Observable<Project | null> {
    return this.http
      .get<Project>(`${this.base}/public/projects/${slug}`)
      .pipe(catchError((err) => this.fallback('project', err, null as Project | null)));
  }

  /** Avis publiés, ceux de la langue d'abord ; `[]` sans API. */
  reviews(locale: SiteLocale, category?: string): Observable<Review[]> {
    let params = new HttpParams().set('locale', locale);
    if (category) {
      params = params.set('category', category);
    }
    return this.http
      .get<Review[]>(`${this.base}/public/reviews`, { params })
      .pipe(catchError((err) => this.fallback('reviews', err, [] as Review[])));
  }

  /**
   * Retombe sur le contenu de démarrage plutôt que sur une page vide, mais
   * en le signalant : un échec silencieux ici (mauvaise URL d'API, backend
   * injoignable) rendrait le site "fonctionnel" en apparence tout en
   * affichant du contenu figé sans que personne ne s'en aperçoive.
   */
  private fallback<T>(call: string, err: unknown, value: T): Observable<T> {
    // `warn`, pas `error` : c'est une dégradation gracieuse attendue (poste
    // de dev sans backend, incident réseau ponctuel), pas un crash — et les
    // parcours e2e tournent volontairement sans API, sur ce même repli.
    console.warn(`[PublicApiService] ${call}() a échoué, contenu de démarrage affiché à la place :`, err);
    return of(value);
  }

  submitLead(payload: LeadRequest): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.base}/public/leads`, payload);
  }
}
