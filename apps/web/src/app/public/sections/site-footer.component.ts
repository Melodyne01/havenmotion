import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { SiteStore } from '../site-store';
import { SITE_LOCALE, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/**
 * Pied de page : logotype, mention légale, © année + ville.
 *
 * Le lien « Tarifs » est présent sur chaque page du site : c'est le maillage
 * interne le plus concret vers la page la plus rentable. Les liens vers les
 * pages commune, eux, restent hors du pied de page sur demande du client
 * (ces pages n'existent qu'en FR et NL et sont reliées depuis /zones).
 */
@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogotypeComponent, RouterLink],
  template: `
    <footer class="footer">
      <app-logotype />
      <p class="footer__legal">{{ settings().legalText }}</p>
      <nav class="footer__nav" [attr.aria-label]="text.footer.navAriaLabel">
        <a class="footer__link" [routerLink]="pricingHref">{{ text.footer.pricing }}</a>
        <a class="footer__link" [routerLink]="aboutHref">{{ text.footer.about }}</a>
        <a class="footer__link" [routerLink]="faqHref">FAQ</a>
        @if (zonesHref) {
          <a class="footer__link" [routerLink]="zonesHref">{{ text.footer.zones }}</a>
        }
        <a class="footer__link" [routerLink]="contactHref">Contact</a>
        <a class="footer__link" [routerLink]="mentionsHref">{{ text.footer.legal }}</a>
        <a class="footer__link" [routerLink]="confidentialiteHref">{{ text.footer.privacy }}</a>
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
  protected readonly text = UI_TEXT[this.locale];
  protected readonly year = new Date().getFullYear();

  protected readonly pricingHref = routePath(this.locale, 'pricing');
  protected readonly aboutHref = routePath(this.locale, 'about');
  protected readonly faqHref = routePath(this.locale, 'faq');
  /** Les pages zones/commune n'existent pas encore en anglais (chantier 5). */
  protected readonly zonesHref = this.locale === 'en' ? null : routePath(this.locale, 'zones');
  protected readonly contactHref = routePath(this.locale, 'contact');
  protected readonly mentionsHref = routePath(this.locale, 'legal');
  protected readonly confidentialiteHref = routePath(this.locale, 'privacy');
}
