import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from './sections/site-header.component';
import { HeroComponent } from './sections/hero.component';
import { CategoriesComponent } from './sections/categories.component';
import { ServicesComponent } from './sections/services.component';
import { ProcessComponent } from './sections/process.component';
import { AboutComponent } from './sections/about.component';
import { TestimonialsComponent } from './sections/testimonials.component';
import { ContactComponent } from './sections/contact.component';
import { SiteFooterComponent } from './sections/site-footer.component';
import { CtaButtonComponent } from '../shared/ui/cta-button.component';
import { SiteStore } from './site-store';
import { SeoService } from '../core/seo.service';

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
    CategoriesComponent,
    ServicesComponent,
    ProcessComponent,
    AboutComponent,
    TestimonialsComponent,
    ContactComponent,
    SiteFooterComponent,
    CtaButtonComponent,
  ],
  template: `
    <a class="skip-link" href="#contenu">Aller au contenu</a>
    <app-site-header />

    <main id="contenu">
      <app-hero />
      <app-categories />
      <app-services />
      <app-process />
      <app-about />
      <app-testimonials />
      <app-contact />
    </main>

    <app-site-footer />

    <!-- Le CTA reste atteignable en permanence sur mobile. -->
    <div class="sticky-cta">
      <app-cta-button href="#contact">Demander un devis</app-cta-button>
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

  constructor() {
    this.store.load();

    effect(() => {
      const settings = this.store.settings();
      this.seo.apply({
        title: `${settings.brandName} — Vidéaste ${settings.city} & ${settings.region}`,
        description: `${settings.tagline} Devis sous 48 h.`,
        path: '/',
        imagePath: settings.showreel?.posterUrl ?? undefined,
      });
      this.seo.applyStructuredData(settings, this.store.categories());
    });
  }
}
