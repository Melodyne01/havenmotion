import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LogotypeComponent } from '../../shared/ui/logotype.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';

interface NavLink {
  href: string;
  label: string;
}

/** En-tête collant + menu burger plein écran sur mobile. */
@Component({
  selector: 'app-site-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LogotypeComponent, CtaButtonComponent],
  template: `
    <header class="header">
      <a class="header__brand" href="#hero" aria-label="Heaven Motion — accueil">
        <app-logotype />
      </a>

      <nav class="header__nav" aria-label="Navigation principale">
        @for (link of links(); track link.href) {
          <a class="header__link" [href]="link.href">{{ link.label }}</a>
        }
      </nav>

      <div class="header__cta">
        <app-cta-button href="#contact">Demander un devis</app-cta-button>
      </div>

      <button
        class="header__burger"
        type="button"
        [attr.aria-expanded]="menuOpen()"
        aria-controls="menu-mobile"
        (click)="toggle()"
      >
        {{ menuOpen() ? 'Fermer' : 'Menu' }}
      </button>
    </header>

    @if (menuOpen()) {
      <div id="menu-mobile" class="menu">
        <nav class="menu__nav" aria-label="Navigation mobile">
          @for (link of links(); track link.href) {
            <a class="menu__link" [href]="link.href" (click)="close()">{{ link.label }}</a>
          }
        </nav>
        <div class="menu__cta">
          <app-cta-button href="#contact">Demander un devis</app-cta-button>
        </div>
      </div>
    }
  `,
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  protected readonly menuOpen = signal(false);

  protected readonly links = signal<NavLink[]>([
    { href: '#realisations', label: 'Réalisations' },
    { href: '#prestations', label: 'Prestations' },
    { href: '#process', label: 'Process' },
    { href: '#studio', label: 'Studio' },
    { href: '#contact', label: 'Contact' },
  ]).asReadonly();

  protected toggle(): void {
    this.menuOpen.update((open) => !open);
  }

  protected close(): void {
    this.menuOpen.set(false);
  }
}
