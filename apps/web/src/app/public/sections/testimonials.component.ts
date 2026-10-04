import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { PublicApiService } from '../../core/api/public-api.service';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { Review } from '../../models';

/**
 * Avis clients réels (saisis dans le backoffice), puis le bandeau de logos.
 * Rien n'est affiché tant qu'aucun avis publié n'existe : les anciens
 * témoignages d'attente (« à compléter depuis le backoffice ») n'ont plus
 * leur place en production. Les avis dans la langue du visiteur viennent
 * d'abord, puis les autres. Le JSON-LD `AggregateRating` est publié avec
 * les mêmes avis, jamais sans.
 */
@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, RevealDirective],
  template: `
    @if (reviews().length > 0 || logos().length > 0) {
      <section class="testimonials" id="temoignages" aria-labelledby="titre-temoignages">
        <app-section-title
          [eyebrow]="text.reviews.eyebrow"
          [title]="text.reviews.title"
          titleId="titre-temoignages"
        />
        @if (reviews().length > 0) {
          <div class="testimonials__grid">
            @for (review of reviews(); track review.id) {
              <figure class="quote" appReveal>
                <blockquote class="quote__text" [attr.lang]="review.locale">{{ review.quote }}</blockquote>
                <figcaption class="quote__author">
                  {{ review.author }}@if (review.city) {, {{ review.city }}}
                  <span class="quote__role">
                    {{ stars(review.rating) }}@if (review.source) { · {{ text.reviews.source }} {{ review.source }}}
                  </span>
                </figcaption>
              </figure>
            }
          </div>
        }
        @if (logos().length > 0) {
          <ul class="logos" [attr.aria-label]="text.testimonials.clientsAriaLabel">
            @for (logo of logos(); track logo.id) {
              <li class="logos__item">
                @if (logo.imageUrl; as image) {
                  <img class="logos__image" [src]="image" [alt]="logo.name" loading="lazy" />
                } @else {
                  <span class="logos__name">{{ logo.name }}</span>
                }
              </li>
            }
          </ul>
        }
      </section>
    }
  `,
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  /** Catégorie (clé neutre) pour ne montrer que ses avis ; absent = tous. */
  readonly category = input<string | undefined>(undefined);
  /** Nombre maximum d'avis affichés. */
  readonly limit = input(6);

  private readonly api = inject(PublicApiService);
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly logos = this.store.logos;
  protected readonly text = UI_TEXT[this.locale];

  private readonly all = toSignal(this.api.reviews(this.locale, this.category()), { initialValue: [] as Review[] });
  protected readonly reviews = () => this.all().slice(0, this.limit());

  constructor() {
    effect(() => {
      this.seo.applyReviews(this.store.settings(), this.all());
    });
  }

  protected stars(rating: number): string {
    return '★'.repeat(Math.max(1, Math.min(5, rating)));
  }
}
