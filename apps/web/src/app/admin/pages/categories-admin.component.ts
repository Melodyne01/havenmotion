import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/api/admin-api.service';
import { AdminLocaleService } from '../admin-locale.service';
import { MediaPickerComponent } from '../components/media-picker.component';
import { Category, MediaAsset } from '../../models';

/**
 * Écran principal du backoffice : c'est ici que le client remplace la vidéo
 * d'une bande et réordonne les cinq catégories. Le site public relit ces
 * valeurs à chaque rendu, donc aucun redéploiement n'est nécessaire.
 */
@Component({
  selector: 'app-categories-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MediaPickerComponent],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Catégories</h1>
        <p class="a-hint">Glissez une ligne pour changer l’ordre des bandes du site.</p>
      </header>

      @if (status()) {
        <p class="a-status" role="status">{{ status() }}</p>
      }

      <ul class="list">
        @for (category of categories(); track category.id; let i = $index) {
          <li
            class="row"
            [class.is-dragged]="draggedIndex() === i"
            draggable="true"
            (dragstart)="onDragStart(i)"
            (dragover)="onDragOver($event, i)"
            (dragend)="onDragEnd()"
          >
            <div class="row__head">
              <span class="row__index">{{ pad(i) }}</span>
              <h2 class="row__name">{{ category.name }}</h2>
              <span class="a-tag" [class.a-tag--muted]="!category.isPublished">
                {{ category.isPublished ? 'Publiée' : 'Masquée' }}
              </span>
              <span class="row__handle" aria-hidden="true">⠿</span>
            </div>

            <div class="a-grid">
              <label class="a-field">
                <span class="a-label">Nom</span>
                <input class="a-input" type="text" [(ngModel)]="category.name" name="name-{{ i }}" />
              </label>

              <label class="a-field">
                <span class="a-label">Slug</span>
                <input class="a-input" type="text" [(ngModel)]="category.slug" name="slug-{{ i }}" />
              </label>

              <label class="a-field">
                <span class="a-label">Ligne descriptive</span>
                <input
                  class="a-input"
                  type="text"
                  [(ngModel)]="category.tagline"
                  name="tagline-{{ i }}"
                />
              </label>

              <label class="a-field">
                <span class="a-label">Nombre de films affiché</span>
                <input
                  class="a-input"
                  type="number"
                  min="0"
                  [(ngModel)]="category.filmCount"
                  name="count-{{ i }}"
                />
              </label>

              <label class="a-field">
                <span class="a-label">Publication</span>
                <select class="a-input" [(ngModel)]="category.isPublished" name="pub-{{ i }}">
                  <option [ngValue]="true">Publiée</option>
                  <option [ngValue]="false">Masquée</option>
                </select>
              </label>
            </div>

            <div class="a-grid">
              <app-media-picker
                label="Vidéo reel de la bande"
                accept="video/*"
                [selected]="category.reel"
                (choose)="setReel(category, $event)"
              />
              <app-media-picker
                label="Poster de la bande"
                accept="image/*"
                [selected]="category.poster"
                (choose)="setPoster(category, $event)"
              />
            </div>

            <div class="a-actions">
              <button class="a-btn" type="button" (click)="save(category)">Enregistrer</button>
            </div>
          </li>
        }
      </ul>

      @if (categories().length === 0) {
        <p class="a-empty">Aucune catégorie. Vérifiez que l’API est démarrée.</p>
      }
    </section>
  `,
  styleUrl: './categories-admin.component.scss',
})
export class CategoriesAdminComponent {
  private readonly api = inject(AdminApiService);
  private readonly adminLocale = inject(AdminLocaleService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly status = signal<string | null>(null);
  protected readonly draggedIndex = signal<number | null>(null);

  constructor() {
    effect(() => {
      this.adminLocale.locale();
      this.load();
    });
  }

  protected pad(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  protected onDragStart(index: number): void {
    this.draggedIndex.set(index);
  }

  /** Réordonnancement optimiste : la ligne suit le curseur pendant le glisser. */
  protected onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    const from = this.draggedIndex();
    if (from === null || from === index) {
      return;
    }
    const next = [...this.categories()];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    this.categories.set(next);
    this.draggedIndex.set(index);
  }

  protected onDragEnd(): void {
    if (this.draggedIndex() === null) {
      return;
    }
    this.draggedIndex.set(null);
    this.api.reorderCategories(this.categories().map((category) => category.id)).subscribe({
      next: () => this.status.set('Ordre des bandes enregistré.'),
      error: () => {
        this.status.set("L'ordre n'a pas pu être enregistré.");
        this.load();
      },
    });
  }

  protected setReel(category: Category, asset: MediaAsset): void {
    category.reel = asset;
    this.save(category);
  }

  protected setPoster(category: Category, asset: MediaAsset): void {
    category.poster = asset;
    this.save(category);
  }

  protected save(category: Category): void {
    this.api
      .updateCategory(category.id, {
        name: category.name,
        slug: category.slug,
        tagline: category.tagline,
        filmCount: category.filmCount,
        isPublished: category.isPublished,
        reel: category.reel,
        poster: category.poster,
      })
      .subscribe({
        next: () => this.status.set(`« ${category.name} » enregistrée.`),
        error: () => this.status.set("L'enregistrement a échoué."),
      });
  }

  private load(): void {
    this.api.categories(this.adminLocale.locale()).subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([]),
    });
  }
}
