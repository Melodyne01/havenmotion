import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { PackGridComponent } from '../../shared/ui/pack-grid.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE, SITE_LOCALES, homePath, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { ONE_PERSON_CONTENT } from '../../core/one-person-content';

/**
 * Page « photo et vidéo par une seule personne » : l'argument central du
 * site, traité de front — méthode sur les cinq moments clés d'un mariage,
 * avantages, limites, second opérateur. Reliée depuis chaque page mariage
 * et événementiel.
 */
@Component({
  selector: 'app-one-person-page',
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

    <main id="contenu" class="one">
      <nav class="one__breadcrumb" [attr.aria-label]="text.breadcrumbAriaLabel">
        <a [routerLink]="homePath">{{ text.home }}</a>
        <span aria-hidden="true">/</span>
        <span>{{ content.title }}</span>
      </nav>

      <app-section-title [eyebrow]="content.eyebrow" [title]="content.title" titleId="titre-une-personne" level="h1" />

      <p class="one__answer">{{ content.answer }}</p>

      <section class="one__section" aria-labelledby="titre-moments">
        <h2 id="titre-moments" class="one__h2">{{ content.momentsTitle }}</h2>
        <p class="one__p">{{ content.momentsLead }}</p>
        <ol class="one__moments">
          @for (moment of content.moments; track moment.title) {
            <li>
              <h3 class="one__h3">{{ moment.title }}</h3>
              <p class="one__p">{{ moment.body }}</p>
            </li>
          }
        </ol>
      </section>

      <section class="one__section" aria-labelledby="titre-avantages">
        <h2 id="titre-avantages" class="one__h2">{{ content.advantagesTitle }}</h2>
        <div class="one__cards">
          @for (item of content.advantages; track item.title) {
            <article>
              <h3 class="one__h3">{{ item.title }}</h3>
              <p>{{ item.body }}</p>
            </article>
          }
        </div>
      </section>

      <section class="one__section" aria-labelledby="titre-limites">
        <h2 id="titre-limites" class="one__h2">{{ content.limitsTitle }}</h2>
        <ul class="one__list">
          @for (item of content.limits; track item) {
            <li>{{ item }}</li>
          }
        </ul>
        <h3 class="one__h3">{{ content.secondTitle }}</h3>
        <p class="one__p">{{ content.second }}</p>
      </section>

      <section class="one__section" aria-labelledby="titre-formules-mariage">
        <h2 id="titre-formules-mariage" class="one__h2">{{ text.packs.title }}</h2>
        <app-pack-grid category="mariage" [showOptions]="false" />
      </section>

      <section class="one__section" aria-labelledby="titre-faq-une-personne">
        <h2 id="titre-faq-une-personne" class="one__h2">{{ content.faqTitle }}</h2>
        <dl class="one__faq">
          @for (entry of content.faq; track entry.question) {
            <div>
              <dt>{{ entry.question }}</dt>
              <dd>{{ entry.answer }}</dd>
            </div>
          }
        </dl>
      </section>

      <section class="one__cta" aria-labelledby="titre-cta-une-personne">
        <h2 id="titre-cta-une-personne" class="one__h2">{{ content.ctaTitle }}</h2>
        <p class="one__p">{{ content.ctaBody }}</p>
        <app-cta-button [href]="contactPath">{{ text.quoteCta }}</app-cta-button>
      </section>
    </main>

    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;
      @use 'editorial' as *;

      .one {
        @include editorial-page;
      }

      .one__breadcrumb {
        @include editorial-breadcrumb;
      }

      .one__answer {
        @include editorial-answer;
      }

      .one__section {
        @include editorial-section;
      }

      .one__h2 {
        @include editorial-h2;
      }

      .one__h3 {
        @include editorial-h3;
      }

      .one__p {
        @include editorial-paragraph;
      }

      .one__list {
        @include editorial-list;
      }

      .one__cards {
        @include editorial-cards;
      }

      .one__faq {
        @include editorial-faq;
      }

      .one__cta {
        @include editorial-cta;
      }

      .one__moments {
        display: grid;
        gap: 16px;
        padding: 0 0 0 28px;
        margin: 0;

        li::marker {
          color: $color-amber;
          font-family: $font-display;
          font-weight: $weight-bold;
        }
      }
    `,
  ],
})
export class OnePersonPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly text = UI_TEXT[this.locale];
  protected readonly content = ONE_PERSON_CONTENT[this.locale];
  protected readonly homePath = homePath(this.locale);
  protected readonly contactPath = routePath(this.locale, 'contact');

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = routePath(this.locale, 'onePerson');
      this.seo.apply({
        title: `${this.content.metaTitle} — ${settings.brandName}`,
        description: this.content.metaDescription,
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.homePath },
        { name: this.content.title, path },
      ]);
      this.seo.applyHreflang({
        fr: routePath('fr', 'onePerson'),
        ...Object.fromEntries(SITE_LOCALES.filter((l) => l !== 'fr').map((l) => [l, routePath(l, 'onePerson')])),
      });
      this.seo.applyFaq(this.content.faq);
    });
  }
}
