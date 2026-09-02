import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { AboutComponent } from '../sections/about.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE } from '../../core/locale';

/** Page « À propos » dédiée : même contenu que la section home, sa propre URL. */
@Component({
  selector: 'app-about-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, AboutComponent, SiteFooterComponent],
  template: `
    <a class="skip-link" href="#contenu">Aller au contenu</a>
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

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = this.locale === 'nl' ? '/nl/over-ons' : '/a-propos';
      this.seo.apply({
        title: `À propos — ${settings.brandName}`,
        description: `${settings.tagline} Basé à ${settings.city}.`,
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: 'Accueil', path: this.locale === 'nl' ? '/nl' : '/' },
        { name: 'À propos', path },
      ]);
      this.seo.applyHreflang({ fr: '/a-propos', nl: '/nl/over-ons' });
    });
  }
}
