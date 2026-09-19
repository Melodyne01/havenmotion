import { Injectable, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PublicApiService } from '../core/api/public-api.service';
import { SiteLocale } from '../core/locale';
import { SITE_CONTENT } from '../core/site-content';
import { Category, SitePayload } from '../models';
import { PLACEHOLDER_CATEGORIES, PLACEHOLDER_SITE } from '../core/placeholder-content';

/**
 * État du site public. Un seul chargement (`/public/site` + `/public/categories`)
 * alimente toutes les sections ; le résultat est repris tel quel à l'hydratation
 * grâce au cache de transfert HTTP.
 *
 * `/public/site` est toujours interrogé en FR : brandName/email/instagram/
 * showreel n'ont qu'une valeur (pas de traduction), et restent éditables
 * depuis le backoffice quelle que soit la langue affichée. Le texte qui,
 * lui, varie par langue (accroche, ville/région, mentions légales, à propos,
 * prestations, étapes, témoignages) vient du dictionnaire statique
 * `SITE_CONTENT`, pas de l'API — sur demande explicite du client, qui
 * accepte en échange que ce contenu ne soit plus éditable depuis l'admin
 * sans passer par du code. Seules les catégories restent locale-dépendantes
 * côté API : elles portent de vrais médias (reel/poster), qu'un dictionnaire
 * ne peut pas représenter.
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

  load(locale: SiteLocale = 'fr'): void {
    forkJoin({ site: this.api.site('fr'), categories: this.api.categories(locale) }).subscribe(
      ({ site, categories }) => {
        const content = SITE_CONTENT[locale];
        this.payload.set({
          settings: {
            ...site.settings,
            tagline: content.tagline,
            city: content.city,
            region: content.region,
            legalText: content.legalText,
          },
          services: [...content.services],
          process: [...content.process],
          about: { portraitUrl: site.about.portraitUrl, paragraphs: [...content.aboutParagraphs] },
          testimonials: [...content.testimonials],
          logos: site.logos,
        });
        this.categoryList.set(categories.length > 0 ? categories : PLACEHOLDER_CATEGORIES);
        this.loaded.set(true);
      },
    );
  }
}
