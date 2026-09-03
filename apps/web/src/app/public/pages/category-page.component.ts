import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { VideoFrameComponent } from '../../shared/ui/video-frame.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { PublicApiService } from '../../core/api/public-api.service';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { CATEGORY_SLUG_MAP, SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { Film } from '../../models';

/**
 * Page catégorie : une URL indexable par catégorie (mariage, corporate…),
 * remplace l'ancienne modale. Même contenu (reel, films, CTA), mais crawlable
 * et positionnable — c'est tout l'enjeu du passage en pages.
 */
@Component({
  selector: 'app-category-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, VideoFrameComponent, CtaButtonComponent, RouterLink],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu">
      @if (category(); as cat) {
        <article class="category-page">
          <nav class="category-page__breadcrumb" [attr.aria-label]="text.breadcrumbAriaLabel">
            <a [routerLink]="homePath()">{{ text.home }}</a>
            <span aria-hidden="true">/</span>
            <span>{{ cat.name }}</span>
          </nav>

          <app-video-frame
            [asset]="activeAsset()"
            playback="manual"
            [muted]="false"
            [loop]="false"
            [controls]="true"
            [label]="activeTitle()"
            class="category-page__frame"
            #frame
          />

          <div class="category-page__body">
            <p class="category-page__eyebrow">{{ cat.tagline }}</p>
            <h1 class="category-page__title">{{ activeTitle() }}</h1>
            <p class="category-page__meta">{{ metaLine() }}</p>

            @if (films().length > 0) {
              <ul class="category-page__films">
                @for (film of films(); track film.id) {
                  <li>
                    <button
                      class="category-page__film"
                      type="button"
                      [class.is-active]="film.id === activeFilmId()"
                      (click)="selectFilm(film)"
                    >
                      <span class="category-page__film-title">{{ film.title }}</span>
                      <span class="category-page__film-meta">{{ film.client }} · {{ film.duration }}</span>
                    </button>
                  </li>
                }
              </ul>
            }

            <app-cta-button [href]="contactHref()">{{ ctaLabel() }}</app-cta-button>
          </div>
        </article>
      }
    </main>

    <app-site-footer />
  `,
  styleUrl: './category-page.component.scss',
})
export class CategoryPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(PublicApiService);
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  private readonly paramMap = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly category = computed(() => {
    const slug = this.paramMap().get('slug');
    return this.store.categories().find((c) => c.slug === slug) ?? null;
  });

  private readonly selected = signal<Film | null>(null);

  protected readonly films = toSignal(
    toObservable(this.category).pipe(
      switchMap((category) => (category ? this.api.films(category.slug, this.locale) : of([]))),
    ),
    { initialValue: [] as Film[] },
  );

  protected readonly text = UI_TEXT[this.locale];
  protected readonly homePath = computed(() => (this.locale === 'nl' ? '/nl' : '/'));
  protected readonly contactHref = computed(() => (this.locale === 'nl' ? '/nl/#contact' : '/#contact'));
  protected readonly ctaLabel = computed(() =>
    this.locale === 'nl' ? 'Zo’n project? Offerte aanvragen' : 'Un projet comme ça ? Devis',
  );

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      // Le store a fini de charger mais aucune catégorie ne correspond au
      // slug de l'URL : on revient à la home plutôt que de laisser une page
      // vide indexable.
      if (this.store.isLoaded() && !this.category()) {
        this.router.navigateByUrl(this.homePath());
      }
    });

    effect(() => {
      const cat = this.category();
      if (!cat) {
        return;
      }
      const settings = this.store.settings();
      const base = this.locale === 'nl' ? '/nl/realisaties' : '/realisations';
      const path = `${base}/${cat.slug}`;
      this.seo.apply({
        title: `${cat.name} — ${settings.brandName} — Vidéaste ${settings.city}`,
        description: `${cat.tagline} Devis sous 48 h.`,
        path,
        imagePath: cat.poster?.posterUrl ?? undefined,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.homePath() },
        { name: cat.name, path },
      ]);
      this.seo.applyService(settings, cat, this.store.services());

      const pair = CATEGORY_SLUG_MAP.find((entry) =>
        this.locale === 'nl' ? entry.nl === cat.slug : entry.fr === cat.slug,
      );
      if (pair) {
        this.seo.applyHreflang({
          fr: `/realisations/${pair.fr}`,
          nl: `/nl/realisaties/${pair.nl}`,
        });
      }
    });
  }

  protected activeFilmId(): string | null {
    return this.selected()?.id ?? null;
  }

  protected activeAsset() {
    return this.selected()?.media ?? this.category()?.reel ?? null;
  }

  protected activeTitle(): string {
    return this.selected()?.title ?? this.category()?.name ?? '';
  }

  protected metaLine(): string {
    const film = this.selected();
    if (film) {
      return [film.client, film.duration, film.date?.slice(0, 4)].filter(Boolean).join(' · ');
    }
    const cat = this.category();
    if (!cat) {
      return '';
    }
    const noun = cat.filmCount > 1 ? this.text.categoryBand.filmPlural : this.text.categoryBand.filmSingular;
    return `${cat.filmCount} ${noun} · ${cat.name}`;
  }

  protected selectFilm(film: Film): void {
    this.selected.set(film.id === this.selected()?.id ? null : film);
  }
}
