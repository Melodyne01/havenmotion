import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/api/admin-api.service';
import { AdminLocaleService } from '../admin-locale.service';
import { ClientLogo, SiteSettings } from '../../models';

/**
 * Contenus modifiables depuis le backoffice : logos clients et une partie
 * des coordonnées (nom de marque, e-mail, Instagram — les seuls champs
 * réellement repris par le site public).
 *
 * L'accroche, la ville, la région, la mention légale, les prestations, le
 * process et les témoignages ne sont volontairement plus éditables ici :
 * le site public les tient de `SITE_CONTENT` (dictionnaire statique FR/NL
 * dans le code), pas de l'API, pour garantir de vraies traductions plutôt
 * qu'un contenu saisi une fois et jamais adapté à la langue affichée. Ces
 * champs existaient encore dans ce formulaire alors qu'ils n'avaient plus
 * aucun effet sur le site : un changement enregistré ici avec succès ne
 * se voyait jamais en ligne. Pour changer ce texte, il faut passer par le
 * code (`site-content.ts`, `category-faq-content.ts`, etc.).
 */
@Component({
  selector: 'app-content-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Contenus</h1>
        <p class="a-hint">Chaque bloc s’enregistre séparément.</p>
      </header>

      @if (status()) {
        <p class="a-status" role="status">{{ status() }}</p>
      }

      @if (settings(); as site) {
        <div class="a-card">
          <h2 class="a-label">Coordonnées &amp; identité</h2>
          <div class="a-grid">
            <label class="a-field">
              <span class="a-label">Nom de marque</span>
              <input class="a-input" type="text" [(ngModel)]="site.brandName" name="brand" />
            </label>
            <label class="a-field">
              <span class="a-label">E-mail</span>
              <input class="a-input" type="email" [(ngModel)]="site.email" name="email" />
            </label>
            <label class="a-field">
              <span class="a-label">Instagram</span>
              <input class="a-input" type="text" [(ngModel)]="site.instagram" name="instagram" />
            </label>
          </div>
          <div class="a-actions">
            <button class="a-btn" type="button" (click)="saveSettings(site)">Enregistrer</button>
          </div>
        </div>
      }

      <div class="a-card">
        <h2 class="a-label">Logos clients</h2>
        @for (logo of logos(); track logo.id) {
          <div class="a-grid block">
            <label class="a-field">
              <span class="a-label">Nom</span>
              <input class="a-input" type="text" [(ngModel)]="logo.name" name="l-name-{{ logo.id }}" />
            </label>
            <label class="a-field">
              <span class="a-label">URL de l’image</span>
              <input class="a-input" type="text" [(ngModel)]="logo.imageUrl" name="l-url-{{ logo.id }}" />
            </label>
            <div class="a-actions">
              <button class="a-btn" type="button" (click)="saveLogo(logo)">Enregistrer</button>
              <button class="a-btn a-btn--danger" type="button" (click)="deleteLogo(logo)">
                Supprimer
              </button>
            </div>
          </div>
        }
        <button class="a-btn a-btn--ghost" type="button" (click)="addLogo()">Ajouter un logo</button>
      </div>
    </section>
  `,
  styles: [
    `
      @use 'tokens' as *;

      .block {
        padding: 16px 0;
        border-bottom: $rule-width solid $color-rule-10;
      }
    `,
  ],
})
export class ContentAdminComponent {
  private readonly api = inject(AdminApiService);
  private readonly adminLocale = inject(AdminLocaleService);

  protected readonly settings = signal<SiteSettings | null>(null);
  protected readonly logos = signal<ClientLogo[]>([]);
  protected readonly status = signal<string | null>(null);

  constructor() {
    // Les logos client sont partagés entre langues (noms de marque) : chargés
    // une seule fois, pas rebranchés sur le changement de langue.
    this.reloadLogos();

    effect(() => {
      this.adminLocale.locale();
      this.api
        .settings(this.adminLocale.locale())
        .subscribe({ next: (v) => this.settings.set(v), error: () => undefined });
    });
  }

  protected saveSettings(site: SiteSettings): void {
    this.api.updateSettings(site, this.adminLocale.locale()).subscribe({
      next: () => this.status.set('Coordonnées enregistrées.'),
      error: () => this.status.set("L'enregistrement a échoué."),
    });
  }

  protected addLogo(): void {
    this.logos.update((list) => [
      ...list,
      { id: '', name: '', imageUrl: null, sortOrder: list.length + 1 },
    ]);
  }

  protected saveLogo(logo: ClientLogo): void {
    this.api.saveLogo(logo).subscribe({
      next: () => {
        this.status.set('Logo enregistré.');
        this.reloadLogos();
      },
      error: () => this.status.set("L'enregistrement a échoué."),
    });
  }

  protected deleteLogo(logo: ClientLogo): void {
    if (!logo.id) {
      this.logos.update((list) => list.filter((item) => item !== logo));
      return;
    }
    this.api.deleteLogo(logo.id).subscribe({ next: () => this.reloadLogos() });
  }

  private reloadLogos(): void {
    this.api.logos().subscribe({ next: (v) => this.logos.set(v), error: () => undefined });
  }
}
