import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { FAQ_CONTENT } from '../../core/faq-content';

@Component({
  selector: 'app-faq-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, SectionTitleComponent],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu">
      <section class="faq-page">
        <app-section-title eyebrow="FAQ" [title]="faqTitle()" titleId="titre-faq" level="h1" />

        <dl class="faq-page__list">
          @for (entry of entries; track entry.question) {
            <div class="faq-page__item">
              <dt class="faq-page__question">{{ entry.question }}</dt>
              <dd class="faq-page__answer">{{ entry.answer }}</dd>
            </div>
          }
        </dl>
      </section>
    </main>

    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;

      .faq-page {
        padding: 32px $pad-x-mobile 64px;

        @include tablet-up {
          padding: 40px $pad-x-desktop 80px;
        }
      }

      .faq-page__list {
        display: grid;
        gap: 0;
        margin: 24px 0 0;
        border-top: $rule-width solid $color-rule-10;
      }

      .faq-page__item {
        padding: 20px 0;
        border-bottom: $rule-width solid $color-rule-10;
      }

      .faq-page__question {
        @include display-caps($fs-15, $ls-14, $weight-semibold);

        color: $color-film;
        margin: 0 0 8px;
      }

      .faq-page__answer {
        margin: 0;
        color: $color-muted-60;
        font-size: $fs-14;
        line-height: $lh-body;
      }
    `,
  ],
})
export class FaqPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly entries = FAQ_CONTENT[this.locale];
  protected readonly text = UI_TEXT[this.locale];

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = this.locale === 'nl' ? '/nl/faq' : '/faq';
      this.seo.apply({
        title: `FAQ — ${settings.brandName}`,
        description:
          this.locale === 'nl'
            ? 'Prijzen, levertijden, werkgebied: antwoorden op de meest gestelde vragen.'
            : 'Tarifs, délais, zone d’intervention : les réponses aux questions les plus fréquentes.',
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.locale === 'nl' ? '/nl' : '/' },
        { name: 'FAQ', path },
      ]);
      this.seo.applyFaq(this.entries);
      this.seo.applyHreflang({ fr: '/faq', nl: '/nl/faq' });
    });
  }

  protected faqTitle(): string {
    return this.locale === 'nl' ? 'Veelgestelde vragen' : 'Questions fréquentes';
  }
}
