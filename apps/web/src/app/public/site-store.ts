import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PublicApiService } from '../core/api/public-api.service';
import { Category, SitePayload } from '../models';
import { PLACEHOLDER_CATEGORIES, PLACEHOLDER_SITE } from '../core/placeholder-content';

/**
 * État du site public. Un seul chargement (`/public/site` + `/public/categories`)
 * alimente toutes les sections ; le résultat est repris tel quel à l'hydratation
 * grâce au cache de transfert HTTP.
 */
@Injectable({ providedIn: 'root' })
export class SiteStore {
  private readonly api = inject(PublicApiService);

  private readonly payload = signal<SitePayload>(PLACEHOLDER_SITE);
  private readonly categoryList = signal<Category[]>(PLACEHOLDER_CATEGORIES);
  private readonly loaded = signal(false);

  readonly settings = computed(() => this.payload().settings);
  readonly services = computed(() => this.payload().services);
  readonly process = computed(() => this.payload().process);
  readonly about = computed(() => this.payload().about);
  readonly testimonials = computed(() => this.payload().testimonials);
  readonly logos = computed(() => this.payload().logos);
  readonly categories = computed(() =>
    [...this.categoryList()]
      .filter((category) => category.isPublished)
      .sort((a, b) => a.sortOrder - b.sortOrder),
  );
  readonly isLoaded = this.loaded.asReadonly();

  load(): void {
    forkJoin({ site: this.api.site(), categories: this.api.categories() }).subscribe(
      ({ site, categories }) => {
        this.payload.set(site);
        this.categoryList.set(categories.length > 0 ? categories : PLACEHOLDER_CATEGORIES);
        this.loaded.set(true);
      },
    );
  }
}
