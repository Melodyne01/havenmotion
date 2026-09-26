import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { ContactComponent } from '../sections/contact.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE, SITE_LOCALES, homePath, pick, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/** Page « Contact » dédiée : même formulaire que la section home, sa propre URL. */
@Component({
  selector: 'app-contact-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, ContactComponent, SiteFooterComponent],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />
    <main id="contenu">
      <app-contact headingLevel="h1" />
    </main>
    <app-site-footer />
  `,
})
export class ContactPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);
  protected readonly text = UI_TEXT[this.locale];

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = routePath(this.locale, 'contact');
      this.seo.apply({
        title: `Contact — ${settings.brandName}`,
        description: pick(this.locale, {
          fr: 'Un projet en Belgique, en France, au Luxembourg ou aux Pays-Bas ? Devis chiffré sous 48 h, forfait de déplacement compris.',
          nl: 'Een project in België, Frankrijk, Luxemburg of Nederland? Concrete offerte binnen 48 u, verplaatsing inbegrepen.',
          en: 'A project in Belgium, France, Luxembourg or the Netherlands? Itemised quote within 48 h, travel fee included.',
        }),
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: homePath(this.locale) },
        { name: 'Contact', path },
      ]);
      this.seo.applyHreflang({
        fr: routePath('fr', 'contact'),
        ...Object.fromEntries(SITE_LOCALES.filter((l) => l !== 'fr').map((l) => [l, routePath(l, 'contact')])),
      });
    });
  }
}
