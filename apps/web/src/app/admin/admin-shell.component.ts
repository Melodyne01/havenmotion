import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LogotypeComponent } from '../shared/ui/logotype.component';
import { AuthService } from '../core/auth/auth.service';
import { AdminLocaleService } from './admin-locale.service';
import { SiteLocale } from '../core/locale';

/** Cadre du backoffice : navigation latérale, session et lien de prévisualisation. */
@Component({
  selector: 'app-admin-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LogotypeComponent],
  template: `
    <div class="shell">
      <aside class="shell__nav">
        <a class="shell__brand" routerLink="/">
          <app-logotype [small]="true" />
        </a>

        <nav aria-label="Sections du backoffice">
          @for (link of links; track link.path) {
            <a
              class="shell__link"
              [routerLink]="link.path"
              routerLinkActive="is-active"
              #rla="routerLinkActive"
              [attr.aria-current]="rla.isActive ? 'page' : null"
              >{{ link.label }}</a
            >
          }
        </nav>

        <div class="shell__lang" role="group" aria-label="Langue éditée">
          <button
            type="button"
            class="shell__lang-btn"
            [class.is-active]="locale() === 'fr'"
            (click)="setLocale('fr')"
          >
            FR
          </button>
          <button
            type="button"
            class="shell__lang-btn"
            [class.is-active]="locale() === 'nl'"
            (click)="setLocale('nl')"
          >
            NL
          </button>
        </div>

        <div class="shell__foot">
          <a class="shell__preview" href="/?preview=1" target="_blank" rel="noopener">
            Voir en preview
          </a>
          <p class="shell__user">{{ email() }}</p>
          <button class="shell__logout" type="button" (click)="logout()">Se déconnecter</button>
        </div>
      </aside>

      <main class="shell__main">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './admin-shell.component.scss',
})
export class AdminShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly adminLocale = inject(AdminLocaleService);

  protected readonly email = this.auth.email;
  protected readonly locale = this.adminLocale.locale;

  protected readonly links = [
    { path: 'categories', label: 'Catégories' },
    { path: 'films', label: 'Films' },
    { path: 'showreel', label: 'Showreel' },
    { path: 'medias', label: 'Médias' },
    { path: 'contenus', label: 'Contenus' },
    { path: 'devis', label: 'Demandes de devis' },
    { path: 'journal', label: 'Journal' },
  ];

  protected setLocale(locale: SiteLocale): void {
    this.adminLocale.set(locale);
  }

  protected logout(): void {
    this.auth.logout().subscribe(() => {
      void this.router.navigate(['/admin/login']);
    });
  }
}
