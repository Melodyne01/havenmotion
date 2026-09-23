import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { SiteStore } from '../site-store';
import { SITE_LOCALE } from '../../core/locale';

/**
 * Pied de page : logotype, mention légale, © année + ville.
 *
 * Les liens SEO ajoutés au lancement (Wemmel, Clip, Lifestyle) ont tous
 * été retirés du pied de page sur demande du client — ces pages restent
 * en ligne et indexées (sitemap, maillage depuis /zones et la home),
 * simplement plus mises en avant sur chaque page du site.
 */
@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogotypeComponent, RouterLink],
  template: `
    <footer class="footer">
      <app-logotype />
      <p class="footer__legal">{{ settings().legalText }}</p>
      <nav class="footer__nav" aria-label="Navigation du pied de page">
        <a class="footer__link" [routerLink]="aboutHref()">{{ aboutLabel() }}</a>
        <a class="footer__link" [routerLink]="faqHref()">FAQ</a>
        <a class="footer__link" [routerLink]="zonesHref()">{{ zonesLabel() }}</a>
        <a class="footer__link" [routerLink]="contactHref()">Contact</a>
        <a class="footer__link" [routerLink]="mentionsHref()">{{ mentionsLabel() }}</a>
        <a class="footer__link" [routerLink]="confidentialiteHref()">{{ confidentialiteLabel() }}</a>
      </nav>
      <p class="footer__copy">© {{ year }} {{ settings().brandName }} — {{ settings().city }}</p>
    </footer>
  `,
  styleUrl: './site-footer.component.scss',
})
export class SiteFooterComponent {
  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly settings = this.store.settings;
  protected readonly year = new Date().getFullYear();

  protected readonly aboutHref = computed(() => (this.locale === 'nl' ? '/nl/over-ons' : '/a-propos'));
  protected readonly aboutLabel = computed(() => (this.locale === 'nl' ? 'Over ons' : 'À propos'));
  protected readonly faqHref = computed(() => (this.locale === 'nl' ? '/nl/faq' : '/faq'));
  protected readonly zonesHref = computed(() => (this.locale === 'nl' ? '/nl/zones' : '/zones'));
  protected readonly zonesLabel = computed(() =>
    this.locale === 'nl' ? 'Werkgebied' : "Zone d'intervention",
  );
  protected readonly contactHref = computed(() => (this.locale === 'nl' ? '/nl/contact' : '/contact'));
  protected readonly mentionsHref = computed(() =>
    this.locale === 'nl' ? '/nl/wettelijke-vermeldingen' : '/mentions-legales',
  );
  protected readonly mentionsLabel = computed(() =>
    this.locale === 'nl' ? 'Wettelijke vermeldingen' : 'Mentions légales',
  );
  protected readonly confidentialiteHref = computed(() =>
    this.locale === 'nl' ? '/nl/privacybeleid' : '/confidentialite',
  );
  protected readonly confidentialiteLabel = computed(() =>
    this.locale === 'nl' ? 'Privacybeleid' : 'Confidentialité',
  );
}
