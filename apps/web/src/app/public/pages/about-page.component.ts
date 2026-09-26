import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { AboutComponent } from '../sections/about.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE, SITE_LOCALES, homePath, pick, routePath } from '../../core/locale';
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
      <app-about headingLevel="h1" />
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
      const path = routePath(this.locale, 'about');
      const title = this.text.about.pageTitle;
      this.seo.apply({
        title: `${title} — ${settings.brandName}`,
        description: pick(this.locale, {
          fr: `${settings.tagline} Studio installé à ${settings.city}.`,
          nl: `${settings.tagline} Studio gevestigd in ${settings.city}.`,
          en: `${settings.tagline} Studio based in ${settings.city}.`,
        }),
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: homePath(this.locale) },
        { name: title, path },
      ]);
      this.seo.applyHreflang({
        fr: routePath('fr', 'about'),
        ...Object.fromEntries(SITE_LOCALES.filter((l) => l !== 'fr').map((l) => [l, routePath(l, 'about')])),
      });
    });
  }
}
