import { ChangeDetectionStrategy, Component, RESPONSE_INIT, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { PackGridComponent } from '../../shared/ui/pack-grid.component';
import { NotFoundComponent } from './not-found.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE, SiteLocale, homePath, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { findGuide } from '../../core/guide-content';

/** Chemin d'un guide : `/guides/prix-…`, `/nl/gidsen/wat-kost-…`. */
export function guidePath(locale: SiteLocale, slug: string): string {
  return `${routePath(locale, 'guides')}/${slug}`;
}

/**
 * Page d'un guide : réponse directe en tête, sections avec tableaux et
 * listes, FAQ balisée, la grille mariage et un devis. Un guide n'existe
 * que dans sa langue (hreflang sur lui-même) ; un slug inconnu répond un
 * vrai 404. JSON-LD `Article` avec date de publication : les requêtes
 * « prix 2026 » valorisent la fraîcheur.
 */
@Component({
  selector: 'app-guide-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteHeaderComponent,
    SiteFooterComponent,
    SectionTitleComponent,
    CtaButtonComponent,
    PackGridComponent,
    RouterLink,
    NotFoundComponent,
  ],
  template: `
    @if (!guide()) {
      <app-not-found />
    } @else if (guide(); as g) {
      <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
      <app-site-header />

      <main id="contenu" class="guide">
        <nav class="guide__breadcrumb" [attr.aria-label]="text.breadcrumbAriaLabel">
          <a [routerLink]="homePath">{{ text.home }}</a>
          <span aria-hidden="true">/</span>
          <a [routerLink]="guidesPath">{{ text.guides.eyebrow }}</a>
          <span aria-hidden="true">/</span>
          <span>{{ g.eyebrow }}</span>
        </nav>

        <app-section-title [eyebrow]="g.eyebrow" [title]="g.title" titleId="titre-guide" level="h1" />
        <p class="guide__meta">{{ text.guides.published }} {{ g.published }} · {{ g.readingMinutes }} {{ text.guides.reading }}</p>

        <p class="guide__answer">{{ g.answer }}</p>

        @for (section of g.sections; track section.title) {
          <section class="guide__section">
            <h2 class="guide__h2">{{ section.title }}</h2>
            @for (paragraph of section.paragraphs; track paragraph) {
              <p class="guide__p">{{ paragraph }}</p>
            }
            @if (section.list) {
              <ul class="guide__list">
                @for (item of section.list; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            }
            @if (section.table; as table) {
              <div class="guide__scroll">
                <table class="guide__table">
                  <thead>
                    <tr>
                      @for (column of table.columns; track column) {
                        <th scope="col">{{ column }}</th>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    @for (row of table.rows; track $index) {
                      <tr>
                        @for (cell of row; track $index; let first = $first) {
                          @if (first) {
                            <th scope="row">{{ cell }}</th>
                          } @else {
                            <td>{{ cell }}</td>
                          }
                        }
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
              @if (table.note) {
                <p class="guide__note">{{ table.note }}</p>
              }
            }
          </section>
        }

        <section class="guide__section" aria-labelledby="titre-grille-guide">
          <h2 id="titre-grille-guide" class="guide__h2">{{ text.packs.title }}</h2>
          <app-pack-grid category="mariage" [showOptions]="false" />
        </section>

        <section class="guide__section" aria-labelledby="titre-faq-guide">
          <h2 id="titre-faq-guide" class="guide__h2">FAQ</h2>
          <dl class="guide__faq">
            @for (entry of g.faq; track entry.question) {
              <div>
                <dt>{{ entry.question }}</dt>
                <dd>{{ entry.answer }}</dd>
              </div>
            }
          </dl>
        </section>

        <p class="guide__note">{{ text.guides.sources }}</p>

        <section class="guide__cta" aria-labelledby="titre-cta-guide">
          <h2 id="titre-cta-guide" class="guide__h2">{{ g.ctaTitle }}</h2>
          <p class="guide__p">{{ g.ctaBody }}</p>
          <app-cta-button [href]="contactPath">{{ text.quoteCta }}</app-cta-button>
        </section>
      </main>

      <app-site-footer />
    }
  `,
  styles: [
    `
      @use 'tokens' as *;
      @use 'editorial' as *;

      .guide {
        @include editorial-page;
      }

      .guide__breadcrumb {
        @include editorial-breadcrumb;
      }

      .guide__meta {
        @include display-caps($fs-11, $ls-20, $weight-semibold);

        color: $color-muted-45;
        margin: -32px 0 0;
      }

      .guide__answer {
        @include editorial-answer;

        margin-top: 8px;
      }

      .guide__section {
        @include editorial-section;
      }

      .guide__h2 {
        @include editorial-h2;
      }

      .guide__p {
        @include editorial-paragraph;
      }

      .guide__list {
        @include editorial-list;
      }

      .guide__faq {
        @include editorial-faq;
      }

      .guide__cta {
        @include editorial-cta;
      }

      .guide__scroll {
        overflow-x: auto;
      }

      .guide__table {
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

        thead th {
          @include display-caps($fs-11, $ls-20, $weight-semibold);

          color: $color-muted-45;
        }

        tbody th {
          color: $color-film;
          font-weight: $weight-semibold;
        }

        td:nth-child(2) {
          color: $color-amber;
        }
      }

      .guide__note {
        max-width: 78ch;
        margin: 0;
        color: $color-muted-45;
        font-size: $fs-13;
        line-height: $lh-body;
      }
    `,
  ],
})
export class GuidePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);
  private readonly response = inject(RESPONSE_INIT, { optional: true });

  private readonly paramMap = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly text = UI_TEXT[this.locale];
  protected readonly homePath = homePath(this.locale);
  protected readonly guidesPath = routePath(this.locale, 'guides');
  protected readonly contactPath = `${routePath(this.locale, 'contact')}?categorie=mariage`;
  protected readonly guide = computed(() => findGuide(this.locale, this.paramMap().get('slug') ?? ''));

  constructor() {
    this.store.load(this.locale);

    if (!this.guide() && this.response) {
      this.response.status = 404;
    }

    effect(() => {
      const g = this.guide();
      if (!g) {
        return;
      }
      const settings = this.store.settings();
      const path = guidePath(this.locale, g.slug);
      this.seo.apply({
        title: `${g.metaTitle} — ${settings.brandName}`,
        description: g.metaDescription,
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.homePath },
        { name: this.text.guides.eyebrow, path: this.guidesPath },
        { name: g.eyebrow, path },
      ]);
      this.seo.applyHreflang({ [this.locale]: path });
      this.seo.applyArticle(settings, { title: g.title, description: g.metaDescription, path, published: g.published, locale: this.locale });
      this.seo.applyFaq(g.faq);
    });
  }
}
