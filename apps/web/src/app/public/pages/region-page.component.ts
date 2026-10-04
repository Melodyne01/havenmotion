import { ChangeDetectionStrategy, Component, RESPONSE_INIT, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { VideoFrameComponent } from '../../shared/ui/video-frame.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { RecentProjectsComponent } from '../sections/recent-projects.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import {
  CategoryKey,
  SITE_LOCALE,
  SITE_LOCALES,
  SiteLocale,
  categoryPath,
  categorySlug,
  homePath,
  pick,
  routePath,
} from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { CATEGORY_NAMES } from '../../core/site-content';
import { PRICING, VAT_LABELS, formatPrice, startingPrice } from '../../core/packs';
import { COUNTRIES, Country, REGIONS, Region, regionId } from '../../core/regions';
import { REGION_CONTENT } from '../../core/region-content';
import { travelZone } from '../../core/travel-zones';

/** Chemin d'une page région dans une langue : `/zones/belgique/bruxelles`. */
export function regionPath(locale: SiteLocale, region: Region): string {
  const country = COUNTRIES.find((c) => c.code === region.country)!;
  return `${routePath(locale, 'zones')}/${country.slug[locale]}/${region.slug[locale]}`;
}

/** Chemin d'une page pays dans une langue : `/nl/zones/belgie`. */
export function countryPath(locale: SiteLocale, country: Country): string {
  return `${routePath(locale, 'zones')}/${country.slug[locale]}`;
}

/**
 * Page région (`/zones/:pays/:region`) : la page locale du site, une par
 * région et par langue où elle a un contenu. En bref (zone, forfait,
 * langues), les six prestations avec leur prix de départ, les villes avec
 * un fait chacune, les lieux de la région, le pratique, une FAQ locale et
 * un devis avec la région préremplie. Remplace les anciennes pages commune,
 * redirigées ici (voir `server.ts`).
 */
@Component({
  selector: 'app-region-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, VideoFrameComponent, CtaButtonComponent, RouterLink, NotFoundComponent, RecentProjectsComponent],
  template: `
    @if (!view()) {
      <app-not-found />
    } @else {
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu">
      @if (view(); as v) {
        <article class="region">
          <nav class="region__breadcrumb" [attr.aria-label]="text.breadcrumbAriaLabel">
            <a [routerLink]="homePath">{{ text.home }}</a>
            <span aria-hidden="true">/</span>
            <a [routerLink]="zonesPath">{{ text.zones.eyebrow }}</a>
            <span aria-hidden="true">/</span>
            <a [routerLink]="v.countryHref">{{ v.countryName }}</a>
            <span aria-hidden="true">/</span>
            <span>{{ v.name }}</span>
          </nav>

          <app-video-frame
            [asset]="store.settings().showreel"
            playback="hover"
            [muted]="true"
            [loop]="true"
            [controls]="false"
            [label]="'Showreel ' + store.settings().brandName"
            class="region__frame"
          />

          <div class="region__body">
            <p class="region__eyebrow">{{ v.countryName }} — {{ text.zones.eyebrow }}</p>
            <h1 class="region__title">{{ v.title }}</h1>
            <p class="region__intro">{{ v.content.intro }}</p>

            <ul class="region__brief" [attr.aria-label]="text.zones.inBrief">
              <li>{{ text.zones.travelFee }} : {{ v.fee }}</li>
              <li>{{ text.zones.languages }} : {{ v.languages }}</li>
              <li>{{ text.quoteDelay }}</li>
            </ul>

            <section class="region__section" aria-labelledby="titre-prestations-region">
              <h2 id="titre-prestations-region" class="region__h2">{{ text.zones.servicesIn }} — {{ v.name }}</h2>
              <ul class="region__services">
                @for (entry of pricing; track entry.key) {
                  <li>
                    <a [routerLink]="categoryHref(entry.key)">{{ serviceHeading(entry.key, v.name) }}</a>
                    <span>{{ text.services.from }} {{ format(from(entry.key)) }} {{ vat(entry.vat) }}</span>
                  </li>
                }
              </ul>
            </section>

            <section class="region__section" aria-labelledby="titre-villes">
              <h2 id="titre-villes" class="region__h2">{{ v.content.citiesTitle }}</h2>
              <dl class="region__cities">
                @for (city of v.content.cities; track city.name) {
                  <div>
                    <dt>{{ city.name }}</dt>
                    <dd>{{ city.fact }}</dd>
                  </div>
                }
              </dl>
            </section>

            <section class="region__section" aria-labelledby="titre-lieux">
              <h2 id="titre-lieux" class="region__h2">{{ v.content.venuesTitle }}</h2>
              <ul class="region__venues">
                @for (venue of v.content.venues; track venue) {
                  <li>{{ venue }}</li>
                }
              </ul>
            </section>

            <section class="region__section" aria-labelledby="titre-pratique">
              <h2 id="titre-pratique" class="region__h2">{{ v.content.practicalTitle }}</h2>
              <ul class="region__list">
                @for (item of v.content.practical; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
              <a class="region__more" [routerLink]="pricingPath">{{ text.zones.allZones }} →</a>
            </section>

            <section class="region__section" aria-labelledby="titre-faq-region">
              <h2 id="titre-faq-region" class="region__h2">{{ text.zones.faqTitle }}</h2>
              <dl class="region__faq">
                @for (entry of v.content.faq; track entry.question) {
                  <div>
                    <dt>{{ entry.question }}</dt>
                    <dd>{{ entry.answer }}</dd>
                  </div>
                }
              </dl>
            </section>

            <app-cta-button [href]="v.contactHref">{{ text.quoteCta }}</app-cta-button>
          </div>
        </article>
        <app-recent-projects [region]="v.regionId" [title]="text.projects.inRegion" />
      }
    </main>

    <app-site-footer />
    }
  `,
  styles: [
    `
      @use 'tokens' as *;
      @use 'editorial' as *;

      .region {
        display: grid;
      }

      .region__breadcrumb {
        @include editorial-breadcrumb;

        padding: 20px $pad-x-mobile 0;
        margin: 0;

        @include tablet-up {
          padding: 24px $pad-x-desktop 0;
        }
      }

      .region__frame {
        display: block;
        margin-top: 16px;
      }

      .region__body {
        display: grid;
        justify-items: start;
        gap: 16px;
        padding: 28px $pad-x-mobile 64px;

        @include tablet-up {
          padding: 32px $pad-x-desktop 96px;
        }
      }

      .region__eyebrow {
        @include display-caps($fs-11, $ls-44, $weight-semibold);

        color: $color-amber;
        margin: 0;
      }

      .region__title {
        @include display-caps($fs-40, $ls-14);

        color: $color-film;
        line-height: $lh-tight;
        margin: 0;

        @include tablet-up {
          font-size: $fs-64;
        }
      }

      .region__intro {
        @include editorial-paragraph;

        max-width: 78ch;
      }

      .region__brief {
        @include editorial-list;

        max-width: 78ch;
        padding: 16px 24px;
        background: $color-surface;
        border-left: 3px solid $color-amber;

        li {
          color: $color-film;
        }
      }

      .region__section {
        @include editorial-section;

        width: 100%;
      }

      .region__h2 {
        @include editorial-h2;
      }

      .region__services {
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

        a {
          @include display-caps($fs-13, $ls-14, $weight-semibold);

          color: $color-film;
          text-decoration: none;

          &:hover {
            color: $color-amber;
          }
        }

        span {
          color: $color-amber;
          white-space: nowrap;
        }
      }

      .region__cities {
        display: grid;
        gap: 12px;
        margin: 0;

        @include tablet-up {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 32px;
        }

        dt {
          @include editorial-h3;
        }

        dd {
          margin: 0;
          color: $color-muted-60;
          font-size: $fs-14;
          line-height: $lh-body;
        }
      }

      .region__venues {
        display: grid;
        gap: 6px 24px;
        padding: 0;
        margin: 0;
        list-style: none;

        @include tablet-up {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        li {
          position: relative;
          padding-left: 16px;
          color: $color-muted-60;
          font-size: $fs-14;
          line-height: $lh-body;

          &::before {
            position: absolute;
            left: 0;
            color: $color-amber;
            content: '—';
          }
        }
      }

      .region__list {
        @include editorial-list;
      }

      .region__faq {
        @include editorial-faq;
      }

      .region__more {
        @include editorial-link;
      }
    `,
  ],
})
export class RegionPageComponent {
  private readonly route = inject(ActivatedRoute);
  /** Réponse HTTP en cours (SSR uniquement) : pour poser un vrai 404. */
  private readonly response = inject(RESPONSE_INIT, { optional: true });
  protected readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  private readonly paramMap = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly text = UI_TEXT[this.locale];
  protected readonly pricing = PRICING;
  protected readonly homePath = homePath(this.locale);
  protected readonly zonesPath = routePath(this.locale, 'zones');
  protected readonly pricingPath = routePath(this.locale, 'pricing');

  /** La région de l'URL, si elle existe et a un contenu dans cette langue. */
  protected readonly view = computed(() => {
    const countrySlug = this.paramMap().get('pays');
    const regionSlug = this.paramMap().get('region');
    const country = COUNTRIES.find((c) => c.slug[this.locale] === countrySlug);
    const region = REGIONS.find((r) => r.country === country?.code && r.slug[this.locale] === regionSlug);
    const content = region ? REGION_CONTENT[regionId(region)]?.[this.locale] : undefined;
    if (!country || !region || !content) {
      return null;
    }
    const fee = travelZone(region.zone).fee;
    return {
      region,
      regionId: regionId(region),
      content,
      name: region.name[this.locale],
      countryName: country.name[this.locale],
      countryHref: countryPath(this.locale, country),
      title: pick(this.locale, {
        fr: `Photographe & vidéaste — ${region.name.fr}`,
        nl: `Fotograaf & videograaf — ${region.name.nl}`,
        en: `Photographer & videographer — ${region.name.en}`,
      }),
      fee: fee === null ? this.text.zones.travelOnQuote : fee === 0 ? this.text.zones.travelIncluded : formatPrice(fee),
      languages: region.languages.map((l) => pick(l, { fr: 'français', nl: 'Nederlands', en: 'English' })).join(', '),
      contactHref: `${routePath(this.locale, 'contact')}?region=${regionId(region)}`,
    };
  });

  constructor() {
    this.store.load(this.locale);

    // Région inconnue, ou sans contenu dans cette langue : vraie 404 (statut
    // HTTP posé pendant le SSR, page 404 affichée), pas une page vide en 200.
    if (!this.view() && this.response) {
      this.response.status = 404;
    }

    effect(() => {
      const v = this.view();
      if (!v) {
        return;
      }
      const settings = this.store.settings();
      const path = regionPath(this.locale, v.region);
      this.seo.apply({
        title: `${v.title} · ${pick(this.locale, { fr: 'prix affichés', nl: 'prijzen online', en: 'published prices' })} — ${settings.brandName}`,
        description: v.content.intro.slice(0, 155).replace(/\s\S*$/, '…'),
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.homePath },
        { name: this.text.zones.eyebrow, path: this.zonesPath },
        { name: v.countryName, path: v.countryHref },
        { name: v.name, path },
      ]);
      this.seo.applyRegion(settings, v.region, this.locale);
      this.seo.applyFaq(v.content.faq);
      const alternates = Object.fromEntries(
        SITE_LOCALES.filter((l) => REGION_CONTENT[regionId(v.region)]?.[l]).map((l) => [l, regionPath(l, v.region)]),
      );
      // Toujours un FR en x-default : la page pays FR si la région n'existe pas en FR.
      this.seo.applyHreflang({ fr: alternates['fr'] ?? countryPath('fr', COUNTRIES.find((c) => c.code === v.region.country)!), ...alternates });
    });
  }

  protected serviceHeading(key: CategoryKey, regionName: string): string {
    const name = CATEGORY_NAMES[key][this.locale];
    return pick(this.locale, {
      fr: `Photographe & vidéaste ${name} — ${regionName}`,
      nl: `Fotograaf & videograaf ${name} — ${regionName}`,
      en: `${name} photographer & videographer — ${regionName}`,
    });
  }

  protected categoryHref(key: CategoryKey): string {
    return categoryPath(this.locale, categorySlug(this.locale, key));
  }

  protected from(key: CategoryKey): number {
    return startingPrice(key);
  }

  protected vat(mode: (typeof PRICING)[number]['vat']): string {
    return VAT_LABELS[mode][this.locale];
  }

  protected format(amount: number): string {
    return formatPrice(amount);
  }
}
