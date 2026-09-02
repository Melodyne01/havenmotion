import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { SiteStore } from '../site-store';
import { SITE_LOCALE } from '../../core/locale';

/**
 * Pied de page : logotype, mention légale, © année + ville.
 *
 * Les mentions légales et la confidentialité n'ont pas encore de version
 * NL (texte juridique, pas un contenu à traduire à la légère) : le pied de
 * page NL pointe donc vers les pages FR plutôt que vers un lien mort.
 */
@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogotypeComponent],
  template: `
    <footer class="footer">
      <app-logotype />
      <p class="footer__legal">{{ settings().legalText }}</p>
      <nav class="footer__nav" aria-label="Navigation du pied de page">
        <a class="footer__link" [href]="aboutHref()">{{ aboutLabel() }}</a>
        <a class="footer__link" [href]="faqHref()">FAQ</a>
        <a class="footer__link" [href]="contactHref()">Contact</a>
        <a class="footer__link" href="/mentions-legales">Mentions légales</a>
        <a class="footer__link" href="/confidentialite">Confidentialité</a>
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
  protected readonly contactHref = computed(() => (this.locale === 'nl' ? '/nl/contact' : '/contact'));
}
