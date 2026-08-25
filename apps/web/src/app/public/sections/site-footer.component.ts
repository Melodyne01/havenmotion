import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { SiteStore } from '../site-store';

/** Pied de page : logotype, mention légale, © année + ville. */
@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogotypeComponent],
  template: `
    <footer class="footer">
      <app-logotype />
      <p class="footer__legal">{{ settings().legalText }}</p>
      <nav class="footer__nav" aria-label="Informations légales">
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
  protected readonly settings = this.store.settings;
  protected readonly year = new Date().getFullYear();
}
