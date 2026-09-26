import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { SiteStore } from '../site-store';
import { SITE_LOCALE, homePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/**
 * Page 404 réelle : jusqu'ici, toute URL inconnue retombait sur la home
 * avec un code 200 (`redirectTo: ''`), un « soft 404 » que Google
 * déconseille. Le vrai statut HTTP 404 est posé côté serveur dans
 * `app.routes.server.ts` (`status: 404` sur le `**` final) ; ce composant
 * ne fait qu'afficher un contenu adapté, pas de canonical/hreflang/JSON-LD
 * ici — une URL qui n'existe pas n'a pas d'identité à indexer.
 */
@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, CtaButtonComponent],
  template: `
    <app-site-header />

    <main id="contenu">
      <section class="not-found">
        <p class="not-found__code">404</p>
        <h1 class="not-found__title">{{ title() }}</h1>
        <p class="not-found__text">{{ text() }}</p>
        <app-cta-button [href]="homeHref()">{{ ctaLabel() }}</app-cta-button>
      </section>
    </main>

    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;

      .not-found {
        display: grid;
        justify-items: center;
        text-align: center;
        gap: 16px;
        padding: 96px $pad-x-mobile;

        @include tablet-up {
          padding: 140px $pad-x-desktop;
        }
      }

      .not-found__code {
        @include display-caps($fs-52, $ls-14);

        color: $color-amber;
        margin: 0;
      }

      .not-found__title {
        @include display-caps($fs-26, $ls-14);

        color: $color-film;
        margin: 0;
      }

      .not-found__text {
        max-width: 48ch;
        color: $color-muted-60;
        font-size: $fs-15;
        margin: 0 0 8px;
      }
    `,
  ],
})
export class NotFoundComponent {
  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);
  private readonly titleService = inject(Title);
  private readonly uiText = UI_TEXT[this.locale];

  constructor() {
    this.store.load(this.locale);
    this.titleService.setTitle(`${this.uiText.notFound.title} — Heaven Motion`);
  }

  protected readonly homeHref = () => homePath(this.locale);

  protected title(): string {
    return this.uiText.notFound.title;
  }

  protected text(): string {
    return this.uiText.notFound.text;
  }

  protected ctaLabel(): string {
    return this.uiText.notFound.cta;
  }
}
