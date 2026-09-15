import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../app-config';
import { SiteLocale } from '../locale';
import {
  AuditLogEntry,
  Category,
  ClientLogo,
  Film,
  Lead,
  LeadStatus,
  MediaAsset,
  ProcessStep,
  ServiceCard,
  SiteSettings,
  Testimonial,
} from '../../models';

export interface LeadFilters {
  projectType?: string;
  budgetRange?: string;
  status?: LeadStatus;
  from?: string;
  to?: string;
}

/** Écritures du backoffice. Toutes les routes exigent un jeton `Admin`/`Editor`. */
@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(APP_CONFIG).apiBaseUrl;

  // --- Catégories ---------------------------------------------------------
  categories(locale: SiteLocale = 'fr'): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.base}/admin/categories`, {
      params: new HttpParams().set('locale', locale),
    });
  }

  updateCategory(id: string, body: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.base}/admin/categories/${id}`, body);
  }

  reorderCategories(ids: string[]): Observable<void> {
    return this.http.put<void>(`${this.base}/admin/categories/reorder`, { ids });
  }

  // --- Films --------------------------------------------------------------
  films(categoryId?: string): Observable<Film[]> {
    const params = categoryId ? new HttpParams().set('categoryId', categoryId) : undefined;
    return this.http.get<Film[]>(`${this.base}/admin/films`, { params });
  }

  createFilm(body: Partial<Film>): Observable<Film> {
    return this.http.post<Film>(`${this.base}/admin/films`, body);
  }

  updateFilm(id: string, body: Partial<Film>): Observable<Film> {
    return this.http.put<Film>(`${this.base}/admin/films/${id}`, body);
  }

  deleteFilm(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/films/${id}`);
  }

  reorderFilms(ids: string[]): Observable<void> {
    return this.http.put<void>(`${this.base}/admin/films/reorder`, { ids });
  }

  // --- Médias -------------------------------------------------------------
  media(): Observable<MediaAsset[]> {
    return this.http.get<MediaAsset[]>(`${this.base}/admin/media`);
  }

  mediaById(id: string): Observable<MediaAsset> {
    return this.http.get<MediaAsset>(`${this.base}/admin/media/${id}`);
  }

  deleteMedia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/media/${id}`);
  }

  // --- Réglages -----------------------------------------------------------
  settings(locale: SiteLocale = 'fr'): Observable<SiteSettings> {
    return this.http.get<SiteSettings>(`${this.base}/admin/settings`, {
      params: new HttpParams().set('locale', locale),
    });
  }

  updateSettings(body: Partial<SiteSettings>, locale: SiteLocale = 'fr'): Observable<SiteSettings> {
    return this.http.put<SiteSettings>(`${this.base}/admin/settings`, body, {
      params: new HttpParams().set('locale', locale),
    });
  }

  setShowreel(mediaId: string, locale: SiteLocale = 'fr'): Observable<SiteSettings> {
    return this.http.put<SiteSettings>(
      `${this.base}/admin/settings/showreel`,
      { mediaId },
      { params: new HttpParams().set('locale', locale) },
    );
  }

  showreelHistory(): Observable<MediaAsset[]> {
    return this.http.get<MediaAsset[]>(`${this.base}/admin/settings/showreel/history`);
  }

  // --- Contenus texte -----------------------------------------------------
  services(locale: SiteLocale = 'fr'): Observable<ServiceCard[]> {
    return this.http.get<ServiceCard[]>(`${this.base}/admin/services`, {
      params: new HttpParams().set('locale', locale),
    });
  }

  saveService(body: Partial<ServiceCard>, locale: SiteLocale = 'fr'): Observable<ServiceCard> {
    return body.id
      ? this.http.put<ServiceCard>(`${this.base}/admin/services/${body.id}`, body)
      : this.http.post<ServiceCard>(`${this.base}/admin/services`, body, {
          params: new HttpParams().set('locale', locale),
        });
  }

  deleteService(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/services/${id}`);
  }

  processSteps(locale: SiteLocale = 'fr'): Observable<ProcessStep[]> {
    return this.http.get<ProcessStep[]>(`${this.base}/admin/process`, {
      params: new HttpParams().set('locale', locale),
    });
  }

  saveProcessStep(body: Partial<ProcessStep>, locale: SiteLocale = 'fr'): Observable<ProcessStep> {
    return body.id
      ? this.http.put<ProcessStep>(`${this.base}/admin/process/${body.id}`, body)
      : this.http.post<ProcessStep>(`${this.base}/admin/process`, body, {
          params: new HttpParams().set('locale', locale),
        });
  }

  deleteProcessStep(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/process/${id}`);
  }

  testimonials(locale: SiteLocale = 'fr'): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.base}/admin/testimonials`, {
      params: new HttpParams().set('locale', locale),
    });
  }

  saveTestimonial(body: Partial<Testimonial>, locale: SiteLocale = 'fr'): Observable<Testimonial> {
    return body.id
      ? this.http.put<Testimonial>(`${this.base}/admin/testimonials/${body.id}`, body)
      : this.http.post<Testimonial>(`${this.base}/admin/testimonials`, body, {
          params: new HttpParams().set('locale', locale),
        });
  }

  deleteTestimonial(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/testimonials/${id}`);
  }

  logos(): Observable<ClientLogo[]> {
    return this.http.get<ClientLogo[]>(`${this.base}/admin/logos`);
  }

  saveLogo(body: Partial<ClientLogo>): Observable<ClientLogo> {
    return body.id
      ? this.http.put<ClientLogo>(`${this.base}/admin/logos/${body.id}`, body)
      : this.http.post<ClientLogo>(`${this.base}/admin/logos`, body);
  }

  deleteLogo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/admin/logos/${id}`);
  }

  // --- Demandes de devis --------------------------------------------------
  leads(filters: LeadFilters = {}): Observable<Lead[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value) {
        params = params.set(key, value);
      }
    }
    return this.http.get<Lead[]>(`${this.base}/admin/leads`, { params });
  }

  updateLeadStatus(id: string, status: LeadStatus): Observable<Lead> {
    return this.http.patch<Lead>(`${this.base}/admin/leads/${id}`, { status });
  }

  leadsCsvUrl(): string {
    return `${this.base}/admin/leads/export.csv`;
  }

  exportLeads(): Observable<Blob> {
    return this.http.get(this.leadsCsvUrl(), { responseType: 'blob' });
  }

  // --- Journal ------------------------------------------------------------
  auditLog(): Observable<AuditLogEntry[]> {
    return this.http.get<AuditLogEntry[]>(`${this.base}/admin/audit`);
  }
}
