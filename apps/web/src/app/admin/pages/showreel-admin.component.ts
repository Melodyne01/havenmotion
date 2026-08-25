import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AdminApiService } from '../../core/api/admin-api.service';
import { SlicePipe } from '@angular/common';
import { MediaPickerComponent } from '../components/media-picker.component';
import { MediaAsset, SiteSettings } from '../../models';

/** Showreel du hero : vidéo active + historique des versions. */
@Component({
  selector: 'app-showreel-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaPickerComponent, SlicePipe],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Showreel</h1>
        <p class="a-hint">La vidéo choisie s’affiche en haut du site, en boucle et sans son.</p>
      </header>

      @if (status()) {
        <p class="a-status" role="status">{{ status() }}</p>
      }

      <div class="a-card">
        <app-media-picker
          label="Vidéo active"
          accept="video/*"
          [selected]="settings()?.showreel ?? null"
          (choose)="select($event)"
        />
      </div>

      <div class="a-card">
        <h2 class="a-label">Versions précédentes</h2>
        @if (history().length === 0) {
          <p class="a-hint">Aucune version antérieure.</p>
        } @else {
          <div class="a-scroll">
            <table class="a-table">
              <thead>
                <tr>
                  <th scope="col">Fichier</th>
                  <th scope="col">Mise en ligne</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                @for (asset of history(); track asset.id) {
                  <tr>
                    <td>{{ asset.fileName }}</td>
                    <td>{{ asset.createdAt | slice: 0 : 10 }}</td>
                    <td>
                      <button class="a-btn a-btn--ghost" type="button" (click)="select(asset)">
                        Réactiver
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </section>
  `,
})
export class ShowreelAdminComponent {
  private readonly api = inject(AdminApiService);

  protected readonly settings = signal<SiteSettings | null>(null);
  protected readonly history = signal<MediaAsset[]>([]);
  protected readonly status = signal<string | null>(null);

  constructor() {
    this.load();
  }

  protected select(asset: MediaAsset): void {
    this.api.setShowreel(asset.id).subscribe({
      next: (settings) => {
        this.settings.set(settings);
        this.status.set('Showreel mis à jour.');
        this.loadHistory();
      },
      error: () => this.status.set('La mise à jour a échoué.'),
    });
  }

  private load(): void {
    this.api.settings().subscribe({
      next: (settings) => this.settings.set(settings),
      error: () => this.settings.set(null),
    });
    this.loadHistory();
  }

  private loadHistory(): void {
    this.api.showreelHistory().subscribe({
      next: (assets) => this.history.set(assets),
      error: () => this.history.set([]),
    });
  }
}
