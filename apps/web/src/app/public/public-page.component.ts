import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from './sections/site-header.component';
import { HeroComponent } from './sections/hero.component';
import { IntroComponent } from './sections/intro.component';
import { KeyFiguresComponent } from './sections/key-figures.component';
import { CategoriesComponent } from './sections/categories.component';
import { ServicesComponent } from './sections/services.component';
import { ProcessComponent } from './sections/process.component';
import { AboutComponent } from './sections/about.component';
import { TestimonialsComponent } from './sections/testimonials.component';
import { ContactComponent } from './sections/contact.component';
import { HomeFaqComponent } from './sections/home-faq.component';
import { SiteFooterComponent } from './sections/site-footer.component';
import { CtaButtonComponent } from '../shared/ui/cta-button.component';
import { SiteStore } from './site-store';
import { SeoService } from '../core/seo.service';
import { SITE_LOCALE } from '../core/locale';
import { UI_TEXT } from '../core/ui-text';
import { SITE_CONTENT } from '../core/site-content';
import { FAQ_CONTENT } from '../core/faq-content';

/**
 * Page unique du site public : tout est en un seul défilement, chaque section
 * ramène au formulaire de devis.
 */
@Component({
  selector: 'app-public-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteHeaderComponent,
    HeroComponent,
    IntroComponent,
    KeyFiguresComponent,
    CategoriesComponent,
    ServicesComponent,
    ProcessComponent,
    AboutComponent,
    TestimonialsComponent,
    ContactComponent,
    HomeFaqComponent,
    SiteFooterComponent,
    CtaButtonComponent,
  ],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu">
      <app-hero />
      <app-intro />
      <app-key-figures />
      <app-categories />
      <app-services />
      <app-process />
      <app-about />
      <app-testimonials />
      <app-contact />
      <app-home-faq />
    </main>

    <app-site-footer />

    <!-- Le CTA reste atteignable en permanence sur mobile. -->
    <div class="sticky-cta">
      <app-cta-button href="#contact">{{ text.hero.cta }}</app-cta-button>
    </div>
  `,
  styles: [
    `
      @use 'tokens' as *;

      .sticky-cta {
        position: fixed;
        inset: auto 0 0 0;
        z-index: 40;
        display: flex;
        justify-content: center;
        padding: 12px $pad-x-mobile;
        background: rgba(11, 11, 12, 0.94);
        border-top: $rule-width solid $color-rule-10;

        @include desktop {
          display: none;
        }
      }
    `,
  ],
})
export class PublicPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);
  protected readonly text = UI_TEXT[this.locale];

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = this.locale === 'nl' ? '/nl' : '/';
      this.seo.apply({
        title:
          this.locale === 'nl'
            ? `${settings.brandName} — Onafhankelijke videograaf in ${settings.city} en omstreken`
            : `${settings.brandName} — Vidéaste indépendant à ${settings.city} et environs`,
        description:
          this.locale === 'nl'
            ? `${settings.tagline} Brussel, Wemmel en de Vlaamse rand — offerte binnen 48 u.`
            : `${settings.tagline} Bruxelles, Wemmel et la périphérie flamande — devis sous 48 h.`,
        path,
        imagePath: settings.showreel?.posterUrl ?? undefined,
        locale: this.locale,
      });
      this.seo.applyHreflang({ fr: '/', nl: '/nl' });
      this.seo.applyStructuredData(settings, this.store.categories(), this.priceRange());
      this.seo.applyFaq(FAQ_CONTENT[this.locale]);
    });
  }

  /**
   * "900€–1800€" calculé depuis les vrais tarifs de départ (SITE_CONTENT),
   * jamais une fourchette inventée — répond à l'intention de recherche
   * "combien coûte un vidéaste" dès les résultats enrichis de Google.
   */
  private priceRange(): string | undefined {
    const prices = SITE_CONTENT[this.locale].services
      .map((s) => Number(s.startingPrice.replace(/[^\d]/g, '')))
      .filter((n) => Number.isFinite(n) && n > 0);
    if (!prices.length) {
      return undefined;
    }
    return `${Math.min(...prices)}€–${Math.max(...prices)}€`;
  }
}
