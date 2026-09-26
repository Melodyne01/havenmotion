import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { SITE_LOCALE, SITE_LOCALES, contactAnchor, homePath, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/**
 * En-tête collant + menu burger plein écran sur mobile.
 *
 * Les liens de section (`#realisations`…) pointent tous vers la home, quelle
 * que soit la page courante : `routerLink` + `fragment` plutôt qu'un `href`
 * classique, pour une navigation côté client (pas de rechargement complet)
 * avec défilement automatique jusqu'à l'ancre (`withInMemoryScrolling` dans
 * `app.config.ts`). Le lien « Tarifs » est la seule page dédiée du menu :
 * c'est la page la plus rentable du site, elle mérite sa place partout.
 *
 * Sélecteur de langue : les deux autres langues, vers leur home. Pas de
 * mapping de slug ici, volontairement simple — chaque page qui a un vrai
 * équivalent affine ce lien via ses balises hreflang, destinées aux robots.
 */
@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogotypeComponent, CtaButtonComponent, RouterLink],
  template: `
    <header class="header">
      <a class="header__brand" [routerLink]="homePath" [attr.aria-label]="text.header.brandAriaLabel">
        <app-logotype />
      </a>

      <nav class="header__nav" aria-label="Navigation principale">
        @for (link of text.header.links; track link.fragment) {
          @if (link.fragment === 'prestations') {
            <a class="header__link" [routerLink]="pricingPath">{{ link.label }}</a>
          } @else {
            <a class="header__link" [routerLink]="homePath" [fragment]="link.fragment">{{ link.label }}</a>
          }
        }
      </nav>

      <div class="header__cta">
        @for (other of otherLocales; track other) {
          <a class="header__lang" [routerLink]="homeOf(other)" [attr.hreflang]="other">{{ other.toUpperCase() }}</a>
        }
        <app-cta-button [href]="contactHref">{{ text.quoteCta }}</app-cta-button>
      </div>

      <button
        #burgerButton
        class="header__burger"
        type="button"
        [attr.aria-expanded]="menuOpen()"
        aria-controls="menu-mobile"
        (click)="toggle()"
      >
        {{ menuOpen() ? text.header.closeMenu : text.header.openMenu }}
      </button>
    </header>

    @if (menuOpen()) {
      <div id="menu-mobile" class="menu">
        <nav class="menu__nav" aria-label="Navigation mobile">
          @for (link of text.header.links; track link.fragment) {
            @if (link.fragment === 'prestations') {
              <a class="menu__link" [routerLink]="pricingPath" (click)="close()">{{ link.label }}</a>
            } @else {
              <a
                class="menu__link"
                [routerLink]="homePath"
                [fragment]="link.fragment"
                (click)="close()"
                >{{ link.label }}</a
              >
            }
          }
        </nav>
        @for (other of otherLocales; track other) {
          <a class="menu__link" [routerLink]="homeOf(other)" (click)="close()">{{ other.toUpperCase() }}</a>
        }
        <div class="menu__cta">
          <app-cta-button [href]="contactHref">{{ text.quoteCta }}</app-cta-button>
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
  protected readonly text = UI_TEXT[this.locale];

  protected readonly homePath = homePath(this.locale);
  protected readonly pricingPath = routePath(this.locale, 'pricing');
  protected readonly contactHref = contactAnchor(this.locale);
  protected readonly otherLocales = SITE_LOCALES.filter((l) => l !== this.locale);

  protected homeOf(locale: (typeof SITE_LOCALES)[number]): string {
    return homePath(locale);
  }

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
