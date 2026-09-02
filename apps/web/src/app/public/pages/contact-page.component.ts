import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { ContactComponent } from '../sections/contact.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';

/** Page « Contact » dédiée : même formulaire que la section home, sa propre URL. */
@Component({
  selector: 'app-contact-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, ContactComponent, SiteFooterComponent],
  template: `
    <a class="skip-link" href="#contenu">Aller au contenu</a>
    <app-site-header />
    <main id="contenu">
      <app-contact />
    </main>
    <app-site-footer />
  `,
})
export class ContactPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);

  constructor() {
    this.store.load();

    effect(() => {
      const settings = this.store.settings();
      this.seo.apply({
        title: `Contact — ${settings.brandName}`,
        description: `Un projet à ${settings.city} et ses environs ? Devis sous 48 h.`,
        path: '/contact',
      });
      this.seo.applyBreadcrumbs([
        { name: 'Accueil', path: '/' },
        { name: 'Contact', path: '/contact' },
      ]);
    });
  }
}
