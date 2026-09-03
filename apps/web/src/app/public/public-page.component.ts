import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
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
import { SITE_LOCALE } from '../core/locale';
import { UI_TEXT } from '../core/ui-text';
import { SITE_CONTENT } from '../core/site-content';

/**
 * Page unique du site public : tout est en un seul défilement, chaque section
 * ramène au formulaire de devis.
 */
@Component({
  selector: 'app-public-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
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
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu">
      <app-hero />
      <p class="home-intro">
        {{ homeIntroText() }}
        <a [routerLink]="zonesPath()">{{ zonesLinkLabel() }}</a>
      </p>
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

      .home-intro {
        max-width: 640px;
        margin: 20px auto 0;
        padding: 0 $pad-x-mobile;
        color: $color-muted-60;
        font-size: $fs-14;
        line-height: $lh-body;
        text-align: center;

        @include tablet-up {
          padding: 0 $pad-x-desktop;
        }

        a {
          color: $color-amber;
          text-decoration: none;
          white-space: nowrap;

          &:hover {
            text-decoration: underline;
          }
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

  /**
   * Répond à trois intentions de recherche réelles dès la home : "vidéaste
   * indépendant" (par opposition aux agences trouvées chez les concurrents
   * établis), "en français et en néerlandais" (vrai différenciateur — la
   * plupart des concurrents repérés n'ont qu'une seule langue), et "couvre
   * ma commune" (renvoi direct vers /zones plutôt qu'un lien de pied de
   * page seul).
   */
  protected homeIntroText(): string {
    const brand = this.store.settings().brandName;
    return this.locale === 'nl'
      ? `Onafhankelijke videograaf gevestigd in Brussel, ${brand} filmt in het Frans en het Nederlands in de 19 gemeenten van het Brussels Hoofdstedelijk Gewest, en ook in Wemmel en de Vlaamse rand.`
      : `Vidéaste indépendant basé à Bruxelles, ${brand} tourne en français et en néerlandais dans les 19 communes de la Région de Bruxelles-Capitale, ainsi qu'à Wemmel et dans sa périphérie flamande.`;
  }

  protected zonesPath(): string {
    return this.locale === 'nl' ? '/nl/zones' : '/zones';
  }

  protected zonesLinkLabel(): string {
    return this.locale === 'nl' ? 'Bekijk het volledige werkgebied' : "Voir toute la zone d'intervention";
  }
}
