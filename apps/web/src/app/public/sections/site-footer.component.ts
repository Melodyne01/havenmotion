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
 *
 * Liens SEO (Clip, Lifestyle) : présents sur chaque page du site, avec un
 * ancrage explicite plutôt qu'un "en savoir plus" — c'est le levier de
 * maillage interne le plus concret pour pousser ces pages, bien plus
 * qu'un ordre d'affichage ou une priorité de sitemap. Choisis sur demande
 * du client pour lancer le site sur des catégories non disputées par les
 * grosses agences bruxelloises plutôt que sur "mariage"/"corporate" à
 * Bruxelles, déjà saturés par des studios établis et des annuaires.
 * Le lien Wemmel a été retiré du pied de page sur demande du client — la
 * page /zones/wemmel reste en ligne et indexée (sitemap, maillage depuis
 * /zones), simplement plus mise en avant à chaque page.
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
        <a class="footer__link" [href]="zonesHref()">{{ zonesLabel() }}</a>
        <a class="footer__link" [href]="clipHref()">{{ clipLabel() }}</a>
        <a class="footer__link" [href]="lifestyleHref()">{{ lifestyleLabel() }}</a>
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
  protected readonly zonesHref = computed(() => (this.locale === 'nl' ? '/nl/zones' : '/zones'));
  protected readonly zonesLabel = computed(() =>
    this.locale === 'nl' ? 'Werkgebied' : "Zone d'intervention",
  );
  protected readonly clipHref = computed(() =>
    this.locale === 'nl' ? '/nl/realisaties/clip' : '/realisations/clip',
  );
  protected readonly clipLabel = computed(() => (this.locale === 'nl' ? 'Clips' : 'Clips musicaux'));
  protected readonly lifestyleHref = computed(() =>
    this.locale === 'nl' ? '/nl/realisaties/lifestyle' : '/realisations/lifestyle',
  );
  protected readonly lifestyleLabel = computed(() => 'Lifestyle');
  protected readonly contactHref = computed(() => (this.locale === 'nl' ? '/nl/contact' : '/contact'));
}
