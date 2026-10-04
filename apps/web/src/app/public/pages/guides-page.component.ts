import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE, SITE_LOCALES, homePath, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { guidesFor } from '../../core/guide-content';
import { guidePath } from './guide-page.component';

/** Liste des guides écrits dans la langue courante. */
@Component({
  selector: 'app-guides-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, SectionTitleComponent, RouterLink],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu" class="guides">
      <app-section-title [eyebrow]="text.guides.eyebrow" [title]="text.guides.title" titleId="titre-guides" level="h1" />
      <p class="guides__lead">{{ text.guides.lead }}</p>

      <ul class="guides__list">
        @for (guide of guides; track guide.slug) {
          <li class="guides__item">
            <a [routerLink]="href(guide.slug)">
              <span class="guides__eyebrow">{{ guide.eyebrow }} · {{ guide.readingMinutes }} {{ text.guides.reading }}</span>
              <span class="guides__title">{{ guide.title }}</span>
              <span class="guides__desc">{{ guide.metaDescription }}</span>
            </a>
          </li>
        }
      </ul>
    </main>

    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;
      @use 'editorial' as *;

      .guides {
        @include editorial-page;
      }

      .guides__lead {
        @include editorial-paragraph;

        max-width: 72ch;
        margin-top: -24px;
      }

      .guides__list {
        display: grid;
        gap: $gutter;
        padding: 0;
        margin: 0;
        list-style: none;
      }

      .guides__item a {
        display: grid;
        gap: 8px;
        padding: 24px;
        color: inherit;
        text-decoration: none;
        background: $color-charcoal;
        border: $rule-width solid $color-rule-10;
        transition: border-color $dur-fast $ease;

        &:hover {
          border-color: $color-amber;
        }
      }

      .guides__eyebrow {
        @include display-caps($fs-11, $ls-20, $weight-semibold);

        color: $color-amber;
      }

      .guides__title {
        @include display-caps($fs-18, $ls-14, $weight-semibold);

        color: $color-film;
      }

      .guides__desc {
        color: $color-muted-60;
        font-size: $fs-14;
        line-height: $lh-body;
      }
    `,
  ],
})
export class GuidesPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly text = UI_TEXT[this.locale];
  protected readonly guides = guidesFor(this.locale);

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = routePath(this.locale, 'guides');
      this.seo.apply({
        title: `${this.text.guides.title} — ${settings.brandName}`,
        description: this.text.guides.lead,
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: homePath(this.locale) },
        { name: this.text.guides.eyebrow, path },
      ]);
      this.seo.applyHreflang({
        fr: routePath('fr', 'guides'),
        ...Object.fromEntries(SITE_LOCALES.filter((l) => l !== 'fr').map((l) => [l, routePath(l, 'guides')])),
      });
    });
  }

  protected href(slug: string): string {
    return guidePath(this.locale, slug);
  }
}
