import { ChangeDetectionStrategy, Component, RESPONSE_INIT, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE, SITE_LOCALES, homePath, pick, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { COUNTRIES, REGIONS, regionId } from '../../core/regions';
import { COUNTRY_CONTENT, REGION_CONTENT } from '../../core/region-content';
import { formatPrice, travelZone } from '../../core/travel-zones';
import { countryPath, regionPath } from './region-page.component';

/**
 * Page pays (`/zones/belgique`, `/nl/zones/nederland`, `/en/areas/luxembourg`) :
 * l'intro du pays, ses conditions (forfait, TVA, langues) et la liste de ses
 * régions qui ont une page dans cette langue. Les régions de phases 2 et 3
 * apparaissent sans lien, avec leur forfait, tant qu'elles n'ont pas de
 * contenu : le visiteur sait que la zone est couverte, le robot ne reçoit
 * pas de page creuse.
 */
@Component({
  selector: 'app-country-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, SectionTitleComponent, CtaButtonComponent, RouterLink, NotFoundComponent],
  template: `
    @if (!view()) {
      <app-not-found />
    } @else {
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu" class="country">
      @if (view(); as v) {
        <nav class="country__breadcrumb" [attr.aria-label]="text.breadcrumbAriaLabel">
          <a [routerLink]="homePath">{{ text.home }}</a>
          <span aria-hidden="true">/</span>
          <a [routerLink]="zonesPath">{{ text.zones.eyebrow }}</a>
          <span aria-hidden="true">/</span>
          <span>{{ v.name }}</span>
        </nav>

        <app-section-title [eyebrow]="text.zones.eyebrow" [title]="v.title" titleId="titre-pays" level="h1" />

        <p class="country__intro">{{ v.content.intro }}</p>

        <ul class="country__list">
          @for (item of v.content.practical; track item) {
            <li>{{ item }}</li>
          }
        </ul>

        @if (v.regions.length > 0) {
          <section class="country__section" aria-labelledby="titre-regions">
            <h2 id="titre-regions" class="country__h2">{{ text.zones.regionsTitle }}</h2>
            <ul class="country__regions">
              @for (region of v.regions; track region.id) {
                <li>
                  @if (region.href) {
                    <a [routerLink]="region.href">{{ region.name }}</a>
                  } @else {
                    <span class="country__region-name">{{ region.name }}</span>
                  }
                  <span class="country__fee">{{ text.zones.travelFee }} : {{ region.fee }}</span>
                </li>
              }
            </ul>
          </section>
        }

        <section class="country__cta">
          <app-cta-button [href]="contactPath">{{ text.quoteCta }}</app-cta-button>
        </section>
      }
    </main>

    <app-site-footer />
    }
  `,
  styles: [
    `
      @use 'tokens' as *;
      @use 'editorial' as *;

      .country {
        @include editorial-page;
      }

      .country__breadcrumb {
        @include editorial-breadcrumb;
      }

      .country__intro {
        @include editorial-paragraph;

        max-width: 78ch;
        margin-top: -24px;
      }

      .country__list {
        @include editorial-list;

        max-width: 78ch;
      }

      .country__section {
        @include editorial-section;
      }

      .country__h2 {
        @include editorial-h2;
      }

      .country__regions {
        display: grid;
        gap: 0;
        padding: 0;
        margin: 0;
        list-style: none;
        border-top: $rule-width solid $color-rule-10;

        li {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 8px 16px;
          padding: 12px 0;
          border-bottom: $rule-width solid $color-rule-10;
          font-size: $fs-14;
        }

        a,
        .country__region-name {
          @include display-caps($fs-13, $ls-14, $weight-semibold);

          color: $color-film;
          text-decoration: none;
        }

        a:hover {
          color: $color-amber;
        }

        .country__region-name {
          color: $color-muted-45;
        }
      }

      .country__fee {
        color: $color-amber;
        white-space: nowrap;
      }

      .country__cta {
        margin-top: 24px;
      }
    `,
  ],
})
export class CountryPageComponent {
  private readonly route = inject(ActivatedRoute);
  /** Réponse HTTP en cours (SSR uniquement) : pour poser un vrai 404. */
  private readonly response = inject(RESPONSE_INIT, { optional: true });
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  private readonly paramMap = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly text = UI_TEXT[this.locale];
  protected readonly homePath = homePath(this.locale);
  protected readonly zonesPath = routePath(this.locale, 'zones');
  protected readonly contactPath = routePath(this.locale, 'contact');

  protected readonly view = computed(() => {
    const slug = this.paramMap().get('pays');
    const country = COUNTRIES.find((c) => c.slug[this.locale] === slug);
    if (!country) {
      return null;
    }
    return {
      country,
      name: country.name[this.locale],
      title: pick(this.locale, {
        fr: `Photographe & vidéaste — ${country.name.fr}`,
        nl: `Fotograaf & videograaf — ${country.name.nl}`,
        en: `Photographer & videographer — ${country.name.en}`,
      }),
      content: COUNTRY_CONTENT[country.code][this.locale],
      regions: REGIONS.filter((r) => r.country === country.code).map((r) => {
        const fee = travelZone(r.zone).fee;
        return {
          id: regionId(r),
          name: r.name[this.locale],
          href: REGION_CONTENT[regionId(r)]?.[this.locale] ? regionPath(this.locale, r) : null,
          fee: fee === null ? this.text.zones.travelOnQuote : fee === 0 ? this.text.zones.travelIncluded : formatPrice(fee),
        };
      }),
    };
  });

  constructor() {
    this.store.load(this.locale);

    // Pays inconnu : vraie 404 (statut HTTP posé pendant le SSR).
    if (!this.view() && this.response) {
      this.response.status = 404;
    }

    effect(() => {
      const v = this.view();
      if (!v) {
        return;
      }
      const settings = this.store.settings();
      const path = countryPath(this.locale, v.country);
      this.seo.apply({
        title: `${v.title} — ${settings.brandName}`,
        description: v.content.intro.slice(0, 155).replace(/\s\S*$/, '…'),
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.homePath },
        { name: this.text.zones.eyebrow, path: this.zonesPath },
        { name: v.name, path },
      ]);
      this.seo.applyHreflang({
        fr: countryPath('fr', v.country),
        ...Object.fromEntries(SITE_LOCALES.filter((l) => l !== 'fr').map((l) => [l, countryPath(l, v.country)])),
      });
    });
  }
}
