import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { PackGridComponent } from '../../shared/ui/pack-grid.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import {
  SITE_LOCALE,
  SITE_LOCALES,
  categoryPath,
  categorySlug,
  homePath,
  routePath,
} from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { PRICING_CONTENT } from '../../core/pricing-content';
import { PRICING, formatPrice } from '../../core/packs';
import { PRICING_OPTIONS } from '../../core/pricing-options';
import { TRAVEL_ZONES } from '../../core/travel-zones';
import { CATEGORY_NAMES } from '../../core/site-content';

/**
 * Page tarifs : la grille complète des six catégories, les options, les
 * forfaits de déplacement, les conditions et une FAQ. Une seule page pour
 * toutes les recherches d'achat (« prix photographe vidéaste mariage »,
 * « wat kost een trouwfotograaf », « wedding photography packages ») : la
 * concurrence écrit « sur devis », cette page affiche tout.
 */
@Component({
  selector: 'app-pricing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteHeaderComponent,
    SiteFooterComponent,
    SectionTitleComponent,
    CtaButtonComponent,
    PackGridComponent,
    RouterLink,
  ],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu" class="pricing">
      <nav class="pricing__breadcrumb" [attr.aria-label]="text.breadcrumbAriaLabel">
        <a [routerLink]="homePath">{{ text.home }}</a>
        <span aria-hidden="true">/</span>
        <span>{{ content.eyebrow }}</span>
      </nav>

      <app-section-title [eyebrow]="content.eyebrow" [title]="content.title" titleId="titre-tarifs" level="h1" />

      <ul class="pricing__brief">
        @for (line of content.inBrief; track line) {
          <li>{{ line }}</li>
        }
      </ul>

      <section class="pricing__section" aria-labelledby="titre-formules">
        <h2 id="titre-formules" class="pricing__h2">{{ content.packTypesTitle }}</h2>
        <div class="pricing__types">
          @for (type of content.packTypes; track type.name) {
            <article class="pricing__type">
              <h3 class="pricing__h3">{{ type.name }}</h3>
              <p>{{ type.body }}</p>
            </article>
          }
        </div>
      </section>

      <section class="pricing__section" aria-labelledby="titre-grilles">
        <h2 id="titre-grilles" class="pricing__h2">{{ content.gridsTitle }}</h2>
        <p class="pricing__lead">{{ content.gridsLead }}</p>
        <nav class="pricing__jump" aria-label="Catégories">
          @for (entry of pricing; track entry.key) {
            <a [href]="'#tarifs-' + entry.key">{{ categoryName(entry.key) }}</a>
          }
        </nav>
        @for (entry of pricing; track entry.key) {
          <section class="pricing__category" [id]="'tarifs-' + entry.key">
            <h3 class="pricing__h3 pricing__h3--category">
              <a [routerLink]="categoryHref(entry.key)">{{ categoryName(entry.key) }}</a>
            </h3>
            <app-pack-grid [category]="entry.key" [showOptions]="false" />
          </section>
        }
      </section>

      <section class="pricing__section" aria-labelledby="titre-options">
        <h2 id="titre-options" class="pricing__h2">{{ content.optionsTitle }}</h2>
        <p class="pricing__lead">{{ content.optionsLead }}</p>
        <dl class="pricing__options">
          @for (option of options; track option.id) {
            <div class="pricing__option">
              <dt>
                {{ option.name[locale] }}
                <span class="pricing__option-price">{{ option.from ? text.packs.from + ' ' : '' }}{{ format(option.price) }}</span>
              </dt>
              <dd>{{ option.description[locale] }}</dd>
            </div>
          }
        </dl>
      </section>

      <section class="pricing__section" aria-labelledby="titre-deplacement">
        <h2 id="titre-deplacement" class="pricing__h2">{{ content.travelTitle }}</h2>
        <p class="pricing__lead">{{ content.travelLead }}</p>
        <div class="pricing__scroll">
          <table class="pricing__table">
            <thead>
              <tr>
                <th scope="col">{{ content.travelColumns.zone }}</th>
                <th scope="col">{{ content.travelColumns.distance }}</th>
                <th scope="col">{{ content.travelColumns.fee }}</th>
                <th scope="col">{{ content.travelColumns.examples }}</th>
              </tr>
            </thead>
            <tbody>
              @for (zone of zones; track zone.id) {
                <tr>
                  <th scope="row">{{ zone.id }}</th>
                  <td>{{ zone.distance[locale] }}</td>
                  <td class="pricing__fee">
                    @if (zone.fee === null) {
                      {{ content.travelOnQuote }}
                    } @else if (zone.fee === 0) {
                      {{ content.travelIncluded }}
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
        <p class="pricing__note">{{ content.travelHotel }}</p>
      </section>

      <section class="pricing__section" aria-labelledby="titre-pourquoi">
        <h2 id="titre-pourquoi" class="pricing__h2">{{ content.whyTitle }}</h2>
        @for (paragraph of content.why; track paragraph) {
          <p class="pricing__paragraph">{{ paragraph }}</p>
        }
        <h3 class="pricing__h3">{{ content.marketTitle }}</h3>
        <div class="pricing__scroll">
          <table class="pricing__table">
            <tbody>
              @for (row of content.market; track row.label) {
                <tr>
                  <th scope="row">{{ row.label }}</th>
                  <td class="pricing__fee">{{ row.range }}</td>
                  <td class="pricing__source">{{ row.source }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="pricing__note">{{ content.marketNote }}</p>
      </section>

      <section class="pricing__section" aria-labelledby="titre-conditions">
        <h2 id="titre-conditions" class="pricing__h2">{{ content.termsTitle }}</h2>
        <dl class="pricing__options">
          @for (term of content.terms; track term.name) {
            <div class="pricing__option">
              <dt>{{ term.name }}</dt>
              <dd>{{ term.body }}</dd>
            </div>
          }
        </dl>
      </section>

      <section class="pricing__section" aria-labelledby="titre-faq-tarifs">
        <h2 id="titre-faq-tarifs" class="pricing__h2">{{ content.faqTitle }}</h2>
        <dl class="pricing__faq">
          @for (entry of content.faq; track entry.question) {
            <div class="pricing__faq-item">
              <dt>{{ entry.question }}</dt>
              <dd>{{ entry.answer }}</dd>
            </div>
          }
        </dl>
      </section>

      <section class="pricing__cta" aria-labelledby="titre-cta-tarifs">
        <h2 id="titre-cta-tarifs" class="pricing__h2">{{ content.ctaTitle }}</h2>
        <p class="pricing__paragraph">{{ content.ctaBody }}</p>
        <app-cta-button [href]="contactPath">{{ text.quoteCta }}</app-cta-button>
      </section>
    </main>

    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;

      .pricing {
        display: grid;
        gap: 16px;
        padding: 20px $pad-x-mobile 64px;

        @include tablet-up {
          padding: 24px $pad-x-desktop 96px;
        }
      }

      .pricing__breadcrumb {
        display: flex;
        gap: 8px;
        margin-bottom: 12px;
        color: $color-muted-45;
        font-size: $fs-13;

        a {
          color: $color-muted-60;
          text-decoration: none;

          &:hover {
            color: $color-amber;
          }
        }
      }

      .pricing__brief {
        display: grid;
        gap: 8px;
        max-width: 72ch;
        padding: 20px 24px;
        margin: -24px 0 16px;
        list-style: none;
        background: $color-surface;
        border-left: 3px solid $color-amber;

        li {
          position: relative;
          padding-left: 16px;
          color: $color-film;
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

      .pricing__section {
        display: grid;
        gap: 12px;
        padding-top: 40px;
        margin-top: 24px;
        border-top: $rule-width solid $color-rule-10;
      }

      .pricing__h2 {
        @include display-caps($fs-26, $ls-14);

        color: $color-film;
        margin: 0;

        @include tablet-up {
          font-size: $fs-40;
        }
      }

      .pricing__h3 {
        @include display-caps($fs-15, $ls-14, $weight-semibold);

        color: $color-amber;
        margin: 16px 0 0;
      }

      .pricing__h3--category {
        font-size: $fs-18;
        margin: 24px 0 8px;

        a {
          color: inherit;
          text-decoration: none;

          &:hover {
            color: $color-film;
          }
        }
      }

      .pricing__lead,
      .pricing__paragraph {
        max-width: 72ch;
        margin: 0;
        color: $color-muted-60;
        font-size: $fs-15;
        line-height: $lh-body;
      }

      .pricing__types {
        display: grid;
        gap: $gutter;

        @include tablet-up {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @include desktop {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
      }

      .pricing__type {
        padding: 20px;
        background: $color-charcoal;
        border: $rule-width solid $color-rule-10;

        h3 {
          margin: 0 0 8px;
        }

        p {
          margin: 0;
          color: $color-muted-60;
          font-size: $fs-14;
          line-height: $lh-body;
        }
      }

      .pricing__jump {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 16px;

        a {
          @include display-caps($fs-11, $ls-20, $weight-semibold);

          color: $color-muted-60;
          text-decoration: none;

          &:hover {
            color: $color-amber;
          }
        }
      }

      .pricing__category {
        display: grid;
        gap: 4px;
      }

      .pricing__options,
      .pricing__faq {
        display: grid;
        margin: 0;
        border-top: $rule-width solid $color-rule-10;

        @include tablet-up {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          column-gap: 40px;
        }
      }

      .pricing__option,
      .pricing__faq-item {
        padding: 16px 0;
        border-bottom: $rule-width solid $color-rule-10;

        dt {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: $color-film;
          font-size: $fs-14;
          font-weight: $weight-semibold;
        }

        dd {
          margin: 6px 0 0;
          color: $color-muted-60;
          font-size: $fs-13;
          line-height: $lh-body;
        }
      }

      .pricing__faq-item dt {
        @include display-caps($fs-13, $ls-14, $weight-semibold);
      }

      .pricing__option-price {
        color: $color-amber;
        white-space: nowrap;
      }

      .pricing__scroll {
        overflow-x: auto;
      }

      .pricing__table {
        width: 100%;
        border-collapse: collapse;
        font-size: $fs-13;

        th,
        td {
          padding: 12px 12px 12px 0;
          text-align: left;
          vertical-align: top;
          border-bottom: $rule-width solid $color-rule-10;
          line-height: $lh-body;
        }

        thead th {
          @include display-caps($fs-11, $ls-20, $weight-semibold);

          color: $color-muted-45;
        }

        tbody th {
          color: $color-film;
          font-weight: $weight-semibold;
        }

        td {
          color: $color-muted-60;
        }
      }

      .pricing__fee {
        color: $color-amber !important;
        white-space: nowrap;
      }

      .pricing__source {
        color: $color-muted-45 !important;
      }

      .pricing__note {
        max-width: 72ch;
        margin: 4px 0 0;
        color: $color-muted-45;
        font-size: $fs-13;
        line-height: $lh-body;
      }

      .pricing__cta {
        display: grid;
        justify-items: start;
        gap: 12px;
        padding: 32px 24px;
        margin-top: 24px;
        background: $color-surface;
        border-left: 3px solid $color-amber;
      }
    `,
  ],
})
export class PricingPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  protected readonly locale = inject(SITE_LOCALE);

  protected readonly text = UI_TEXT[this.locale];
  protected readonly content = PRICING_CONTENT[this.locale];
  protected readonly pricing = PRICING;
  protected readonly options = PRICING_OPTIONS;
  protected readonly zones = TRAVEL_ZONES;
  protected readonly homePath = homePath(this.locale);
  protected readonly contactPath = routePath(this.locale, 'contact');

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = routePath(this.locale, 'pricing');
      this.seo.apply({
        title: `${this.content.metaTitle} — ${settings.brandName}`,
        description: this.content.metaDescription,
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.homePath },
        { name: this.content.eyebrow, path },
      ]);
      this.seo.applyHreflang(
        Object.fromEntries(SITE_LOCALES.map((l) => [l, routePath(l, 'pricing')])) as Record<
          'fr' | 'nl' | 'en',
          string
        >,
      );
      this.seo.applyPricingCatalog(settings, this.locale);
      this.seo.applyFaq(this.content.faq);
    });
  }

  protected categoryName(key: (typeof PRICING)[number]['key']): string {
    return CATEGORY_NAMES[key][this.locale];
  }

  protected categoryHref(key: (typeof PRICING)[number]['key']): string {
    return categoryPath(this.locale, categorySlug(this.locale, key));
  }

  protected format(amount: number): string {
    return formatPrice(amount);
  }
}
