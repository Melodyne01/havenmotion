import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { AboutComponent } from '../sections/about.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/** Page « À propos » dédiée : même contenu que la section home, sa propre URL. */
@Component({
  selector: 'app-about-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, AboutComponent, SiteFooterComponent],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />
    <main id="contenu">
      <app-about />
    </main>
    <app-site-footer />
  `,
})
export class AboutPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);
  protected readonly text = UI_TEXT[this.locale];

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = this.locale === 'nl' ? '/nl/over-ons' : '/a-propos';
      const title = this.locale === 'nl' ? 'Over ons' : 'À propos';
      this.seo.apply({
        title: `${title} — ${settings.brandName}`,
        description:
          this.locale === 'nl'
            ? `${settings.tagline} Gevestigd in ${settings.city}.`
            : `${settings.tagline} Basé à ${settings.city}.`,
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.locale === 'nl' ? '/nl' : '/' },
        { name: title, path },
      ]);
      this.seo.applyHreflang({ fr: '/a-propos', nl: '/nl/over-ons' });
    });
  }
}
