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
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { SITE_LOCALE } from '../../core/locale';

interface NavLink {
  href: string;
  label: string;
}

/**
 * En-tête collant + menu burger plein écran sur mobile.
 *
 * Les liens de section (`#realisations`…) ne fonctionnaient que sur la home :
 * partagé avec les pages catégorie/à propos/contact/FAQ depuis leur création,
 * cet en-tête pointait vers des ancres absentes de ces pages. Les liens sont
 * maintenant préfixés par le chemin de la home (`/` ou `/nl`), ce qui
 * fonctionne depuis n'importe quelle page.
 */
@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogotypeComponent, CtaButtonComponent],
  template: `
    <header class="header">
      <a class="header__brand" [href]="homePath()" aria-label="Heaven Motion — accueil">
        <app-logotype />
      </a>

      <nav class="header__nav" aria-label="Navigation principale">
        @for (link of links(); track link.href) {
          <a class="header__link" [href]="link.href">{{ link.label }}</a>
        }
      </nav>

      <div class="header__cta">
        <a class="header__lang" [href]="otherLocaleHref()">{{ otherLocaleLabel() }}</a>
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
          @for (link of links(); track link.href) {
            <a class="menu__link" [href]="link.href" (click)="close()">{{ link.label }}</a>
          }
        </nav>
        <a class="menu__link" [href]="otherLocaleHref()" (click)="close()">{{ otherLocaleLabel() }}</a>
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

  protected readonly links = computed<NavLink[]>(() => {
    const home = this.locale === 'nl' ? '/nl/' : '/';
    return this.locale === 'nl'
      ? [
          { href: `${home}#realisations`, label: 'Realisaties' },
          { href: `${home}#prestations`, label: 'Diensten' },
          { href: `${home}#process`, label: 'Werkwijze' },
          { href: `${home}#studio`, label: 'Studio' },
          { href: `${home}#contact`, label: 'Contact' },
          { href: `${home}#faq`, label: 'FAQ' },
        ]
      : [
          { href: `${home}#realisations`, label: 'Réalisations' },
          { href: `${home}#prestations`, label: 'Prestations' },
          { href: `${home}#process`, label: 'Process' },
          { href: `${home}#studio`, label: 'Studio' },
          { href: `${home}#contact`, label: 'Contact' },
          { href: `${home}#faq`, label: 'FAQ' },
        ];
  });

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
