import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { SITE_LOCALE } from '../../core/locale';

interface NavLink {
  fragment: string;
  label: string;
}

/**
 * En-tête collant + menu burger plein écran sur mobile.
 *
 * Les liens de section (`#realisations`…) pointent tous vers la home, quelle
 * que soit la page courante : `routerLink` + `fragment` plutôt qu'un `href`
 * classique, pour une navigation côté client (pas de rechargement complet)
 * avec défilement automatique jusqu'à l'ancre (`withInMemoryScrolling` dans
 * `app.config.ts`). Le CTA (`app-cta-button`) garde un `href` classique : ce
 * composant partagé ne porte pas de variante `routerLink`, et le changer
 * toucherait tous ses autres usages sur le site — hors périmètre ici.
 */
@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogotypeComponent, CtaButtonComponent, RouterLink],
  template: `
    <header class="header">
      <a class="header__brand" [routerLink]="homePath()" aria-label="Heaven Motion — accueil">
        <app-logotype />
      </a>

      <nav class="header__nav" aria-label="Navigation principale">
        @for (link of links(); track link.fragment) {
          <a class="header__link" [routerLink]="homePath()" [fragment]="link.fragment">{{ link.label }}</a>
        }
      </nav>

      <div class="header__cta">
        <a class="header__lang" [routerLink]="otherLocaleHref()">{{ otherLocaleLabel() }}</a>
        <app-cta-button [href]="contactHref()">{{ ctaLabel() }}</app-cta-button>
      </div>

      <button
        #burgerButton
        class="header__burger"
        type="button"
        [attr.aria-expanded]="menuOpen()"
        aria-controls="menu-mobile"
        (click)="toggle()"
      >
        {{ menuOpen() ? closeLabel() : 'Menu' }}
      </button>
    </header>

    @if (menuOpen()) {
      <div id="menu-mobile" class="menu">
        <nav class="menu__nav" aria-label="Navigation mobile">
          @for (link of links(); track link.fragment) {
            <a
              class="menu__link"
              [routerLink]="homePath()"
              [fragment]="link.fragment"
              (click)="close()"
              >{{ link.label }}</a
            >
          }
        </nav>
        <a class="menu__link" [routerLink]="otherLocaleHref()" (click)="close()">{{ otherLocaleLabel() }}</a>
        <div class="menu__cta">
          <app-cta-button [href]="contactHref()">{{ ctaLabel() }}</app-cta-button>
        </div>
      </div>
    }
  `,
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  private readonly locale = inject(SITE_LOCALE);
  private readonly burgerButton = viewChild<ElementRef<HTMLButtonElement>>('burgerButton');

  protected readonly menuOpen = signal(false);

  protected readonly homePath = computed(() => (this.locale === 'nl' ? '/nl' : '/'));
  protected readonly contactHref = computed(() =>
    this.locale === 'nl' ? '/nl/#contact' : '/#contact',
  );
  protected readonly ctaLabel = computed(() => (this.locale === 'nl' ? 'Offerte aanvragen' : 'Demander un devis'));
  protected readonly closeLabel = computed(() => (this.locale === 'nl' ? 'Sluiten' : 'Fermer'));

  /** Bascule vers l'équivalent home de l'autre langue — pas de mapping de
   * slug ici : c'est volontairement simple, chaque page qui a un vrai
   * équivalent (catégorie, à propos, contact, FAQ) affine ce lien via ses
   * propres balises hreflang, destinées aux robots plutôt qu'au clic humain.
   */
  protected readonly otherLocaleHref = computed(() => (this.locale === 'nl' ? '/' : '/nl'));
  protected readonly otherLocaleLabel = computed(() => (this.locale === 'nl' ? 'FR' : 'NL'));

  protected readonly links = computed<NavLink[]>(() =>
    this.locale === 'nl'
      ? [
          { fragment: 'realisations', label: 'Realisaties' },
          { fragment: 'prestations', label: 'Diensten' },
          { fragment: 'process', label: 'Werkwijze' },
          { fragment: 'studio', label: 'Studio' },
          { fragment: 'contact', label: 'Contact' },
          { fragment: 'faq', label: 'FAQ' },
        ]
      : [
          { fragment: 'realisations', label: 'Réalisations' },
          { fragment: 'prestations', label: 'Prestations' },
          { fragment: 'process', label: 'Process' },
          { fragment: 'studio', label: 'Studio' },
          { fragment: 'contact', label: 'Contact' },
          { fragment: 'faq', label: 'FAQ' },
        ],
  );

  protected toggle(): void {
    this.menuOpen.update((open) => !open);
  }

  /** Ferme le menu et rend le focus au bouton burger qui l'a ouvert —
   * sinon, au clavier, le focus se retrouve perdu en haut de page. */
  protected close(): void {
    const wasOpen = this.menuOpen();
    this.menuOpen.set(false);
    if (wasOpen) {
      this.burgerButton()?.nativeElement.focus();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.menuOpen()) {
      this.close();
    }
  }
}
