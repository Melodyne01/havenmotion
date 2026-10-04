import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE, SITE_LOCALES, homePath, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { COUNTRIES, REGIONS, regionId } from '../../core/regions';
import { REGION_CONTENT } from '../../core/region-content';
import { TRAVEL_ZONES, formatPrice } from '../../core/travel-zones';
import { countryPath, regionPath } from './region-page.component';

/**
 * Page hub `/zones` : les cinq zones de déplacement et leur forfait, puis
 * les pays avec leurs régions. Maillage interne entre la home, les pages
 * pays et les pages région (silo SEO classique). Une région sans contenu
 * dans la langue courante est listée sans lien : la zone est couverte, la
 * page viendra avec sa matière (phases 2 et 3 du plan).
 */
@Component({
  selector: 'app-zones-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, SectionTitleComponent, RouterLink],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu" class="zones">
      <app-section-title [eyebrow]="text.zones.eyebrow" [title]="text.zones.title" titleId="titre-zones" level="h1" />
      <p class="zones__intro">{{ text.zones.lead }}</p>

      <div class="zones__scroll">
        <table class="zones__table">
          <tbody>
            @for (zone of travelZones; track zone.id) {
              <tr>
                <th scope="row">{{ zone.id }}</th>
                <td>{{ zone.distance[locale] }}</td>
                <td class="zones__fee">
                  @if (zone.fee === null) {
                    {{ text.zones.travelOnQuote }}
                  } @else if (zone.fee === 0) {
                    {{ text.zones.travelIncluded }}
                  } @else {
                    {{ format(zone.fee) }}
                  }
                </td>
                <td>{{ zone.examples[locale] }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <h2 class="zones__h2">{{ text.zones.countriesTitle }}</h2>
      @for (country of countries; track country.code) {
        <section class="zones__country" [attr.aria-labelledby]="'titre-' + country.code">
          <h3 [id]="'titre-' + country.code" class="zones__group-title">
            <a [routerLink]="country.href">{{ country.name }}</a>
          </h3>
          <ul class="zones__list">
            @for (region of country.regions; track region.id) {
              <li>
                @if (region.href) {
                  <a [routerLink]="region.href">{{ region.name }}</a>
                } @else {
                  <span>{{ region.name }}</span>
                }
              </li>
            }
          </ul>
        </section>
      }
    </main>

    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;
      @use 'editorial' as *;

      .zones {
        @include editorial-page;
      }

      .zones__intro {
        @include editorial-paragraph;

        max-width: 72ch;

        @include laptop-up {
          max-width: 100ch;
          font-size: 16px;
        }
        margin-top: -24px;
      }

      .zones__scroll {
        overflow-x: auto;
      }

      .zones__table {
        width: 100%;
        border-collapse: collapse;
        font-size: $fs-13;

        th,
        td {
          padding: 10px 12px 10px 0;
          text-align: left;
          vertical-align: top;
          border-bottom: $rule-width solid $color-rule-10;
          line-height: $lh-body;
          color: $color-muted-60;
        }

        th {
          color: $color-film;
          font-weight: $weight-semibold;
        }
      }

      .zones__fee {
        color: $color-amber !important;
        white-space: nowrap;
      }

      .zones__h2 {
        @include editorial-h2;

        margin-top: 24px;
      }

      .zones__group-title {
        @include display-caps($fs-13, $ls-14, $weight-semibold);

        margin: 24px 0 0;
        padding-top: 16px;
        border-top: $rule-width solid $color-rule-10;

        a {
          color: $color-amber;
          text-decoration: none;

          &:hover {
            color: $color-film;
          }
        }
      }

      .zones__list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px 24px;
        padding: 0;
        margin: 8px 0 0;
        list-style: none;

        @include tablet-up {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        a,
        span {
          display: block;
          padding: 12px 0;
          font-size: $fs-14;
          text-decoration: none;
          border-bottom: $rule-width solid $color-rule-10;
        }

        a {
          color: $color-film;

          &:hover {
            color: $color-amber;
          }
        }

        span {
          color: $color-muted-45;
        }
      }
    `,
  ],
})
export class ZonesPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  protected readonly locale = inject(SITE_LOCALE);

  protected readonly text = UI_TEXT[this.locale];
  protected readonly travelZones = TRAVEL_ZONES;
  protected readonly countries = COUNTRIES.map((country) => ({
    code: country.code,
    name: country.name[this.locale],
    href: countryPath(this.locale, country),
    regions: REGIONS.filter((r) => r.country === country.code).map((r) => ({
      id: regionId(r),
      name: r.name[this.locale],
      href: REGION_CONTENT[regionId(r)]?.[this.locale] ? regionPath(this.locale, r) : null,
    })),
  }));

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = routePath(this.locale, 'zones');
      this.seo.apply({
        title: `${this.text.zones.eyebrow} — ${settings.brandName}`,
        description: this.text.zones.lead,
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: homePath(this.locale) },
        { name: this.text.zones.eyebrow, path },
      ]);
      this.seo.applyHreflang({
        fr: routePath('fr', 'zones'),
        ...Object.fromEntries(SITE_LOCALES.filter((l) => l !== 'fr').map((l) => [l, routePath(l, 'zones')])),
      });
    });
  }

  protected format(amount: number): string {
    return formatPrice(amount);
  }
}
