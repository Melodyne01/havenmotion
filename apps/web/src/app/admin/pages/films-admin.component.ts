import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/api/admin-api.service';
import { MediaPickerComponent } from '../components/media-picker.component';
import { Category, Film, MediaAsset } from '../../models';

/** Films / projets : création, édition, réordonnancement, publication. */
@Component({
  selector: 'app-films-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MediaPickerComponent],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Films</h1>
        <div class="a-actions">
          <select class="a-input" [(ngModel)]="filter" (ngModelChange)="load()" name="filter">
            <option value="">Toutes les catégories</option>
            @for (category of categories(); track category.id) {
              <option [value]="category.id">{{ category.name }}</option>
            }
          </select>
          <button class="a-btn" type="button" (click)="startNew()">Nouveau film</button>
        </div>
      </header>

      @if (status()) {
        <p class="a-status" role="status">{{ status() }}</p>
      }

      @if (draft(); as film) {
        <div class="a-card">
          <div class="a-grid">
            <label class="a-field">
              <span class="a-label">Titre</span>
              <input class="a-input" type="text" [(ngModel)]="film.title" name="title" />
            </label>

            <label class="a-field">
              <span class="a-label">Catégorie</span>
              <select class="a-input" [(ngModel)]="film.categoryId" name="category">
                @for (category of categories(); track category.id) {
                  <option [value]="category.id">{{ category.name }}</option>
                }
              </select>
            </label>

            <label class="a-field">
              <span class="a-label">Client</span>
              <input class="a-input" type="text" [(ngModel)]="film.client" name="client" />
            </label>

            <label class="a-field">
              <span class="a-label">Date</span>
              <input class="a-input" type="date" [(ngModel)]="film.date" name="date" />
            </label>

            <label class="a-field">
              <span class="a-label">Durée</span>
              <input class="a-input" type="text" [(ngModel)]="film.duration" name="duration" />
            </label>

            <label class="a-field">
              <span class="a-label">Statut</span>
              <select class="a-input" [(ngModel)]="film.status" name="status">
                <option value="Draft">Brouillon</option>
                <option value="Published">Publié</option>
              </select>
            </label>

            <label class="a-field">
              <span class="a-label">Mise en avant</span>
              <select class="a-input" [(ngModel)]="film.isFeatured" name="featured">
                <option [ngValue]="true">Oui</option>
                <option [ngValue]="false">Non</option>
              </select>
            </label>

            <label class="a-field">
              <span class="a-label">Description</span>
              <textarea
                class="a-input"
                rows="3"
                [(ngModel)]="film.description"
                name="description"
              ></textarea>
            </label>
          </div>

          <div class="a-grid">
            <app-media-picker
              label="Fichier vidéo"
              accept="video/*"
              [selected]="film.media"
              (choose)="setMedia(film, $event)"
            />
            <app-media-picker
              label="Poster"
              accept="image/*"
              [selected]="film.poster"
              (choose)="setPoster(film, $event)"
            />
          </div>

          <div class="a-actions">
            <button class="a-btn" type="button" (click)="save(film)">Enregistrer</button>
            <button class="a-btn a-btn--ghost" type="button" (click)="draft.set(null)">
              Annuler
            </button>
          </div>
        </div>
      }

      @if (films().length === 0) {
        <p class="a-empty">Aucun film pour ce filtre.</p>
      } @else {
        <div class="a-scroll">
          <table class="a-table">
            <caption class="sr-only">
              Films, glisser une ligne pour réordonner
            </caption>
            <thead>
              <tr>
                <th scope="col">Ordre</th>
                <th scope="col">Titre</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Client</th>
                <th scope="col">Statut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (film of films(); track film.id; let i = $index) {
                <tr
                  draggable="true"
                  (dragstart)="draggedIndex.set(i)"
                  (dragover)="onDragOver($event, i)"
                  (dragend)="commitOrder()"
                >
                  <td>{{ i + 1 }}</td>
                  <td>{{ film.title }}</td>
                  <td>{{ categoryName(film.categoryId) }}</td>
                  <td>{{ film.client }}</td>
                  <td>
                    <span class="a-tag" [class.a-tag--muted]="film.status !== 'Published'">
                      {{ film.status === 'Published' ? 'Publié' : 'Brouillon' }}
                    </span>
                  </td>
                  <td class="a-actions">
                    <button class="a-btn a-btn--ghost" type="button" (click)="edit(film)">
                      Éditer
                    </button>
                    <button class="a-btn a-btn--danger" type="button" (click)="remove(film)">
                      Supprimer
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
})
export class FilmsAdminComponent {
  private readonly api = inject(AdminApiService);

  protected readonly films = signal<Film[]>([]);
  protected readonly categories = signal<Category[]>([]);
  protected readonly draft = signal<Film | null>(null);
  protected readonly status = signal<string | null>(null);
  protected readonly draggedIndex = signal<number | null>(null);
  protected filter = '';

  private readonly categoriesById = computed(
    () => new Map(this.categories().map((category) => [category.id, category.name])),
  );

  constructor() {
    this.api.categories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.load();
      },
      error: () => this.categories.set([]),
    });
  }

  protected categoryName(id: string): string {
    return this.categoriesById().get(id) ?? '—';
  }

  protected load(): void {
    this.api.films(this.filter || undefined).subscribe({
      next: (films) => this.films.set(films),
      error: () => this.films.set([]),
    });
  }

  protected startNew(): void {
    const categoryId = this.filter || this.categories()[0]?.id || '';
    this.draft.set({
      id: '',
      categoryId,
      categorySlug: '',
      title: '',
      client: '',
      date: null,
      duration: '',
      description: '',
      sortOrder: this.films().length + 1,
      isFeatured: false,
      status: 'Draft',
      media: null,
      poster: null,
    });
  }

  protected edit(film: Film): void {
    this.draft.set({ ...film });
  }

  protected setMedia(film: Film, asset: MediaAsset): void {
    film.media = asset;
  }

  protected setPoster(film: Film, asset: MediaAsset): void {
    film.poster = asset;
  }

  protected save(film: Film): void {
    const request = film.id ? this.api.updateFilm(film.id, film) : this.api.createFilm(film);
    request.subscribe({
      next: () => {
        this.status.set(`« ${film.title} » enregistré.`);
        this.draft.set(null);
        this.load();
      },
      error: () => this.status.set("L'enregistrement a échoué."),
    });
  }

  protected remove(film: Film): void {
    this.api.deleteFilm(film.id).subscribe({
      next: () => {
        this.status.set(`« ${film.title} » supprimé.`);
        this.load();
      },
      error: () => this.status.set('La suppression a échoué.'),
    });
  }

  protected onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    const from = this.draggedIndex();
    if (from === null || from === index) {
      return;
    }
    const next = [...this.films()];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    this.films.set(next);
    this.draggedIndex.set(index);
  }

  protected commitOrder(): void {
    if (this.draggedIndex() === null) {
      return;
    }
    this.draggedIndex.set(null);
    this.api.reorderFilms(this.films().map((film) => film.id)).subscribe({
      next: () => this.status.set('Ordre des films enregistré.'),
      error: () => {
        this.status.set("L'ordre n'a pas pu être enregistré.");
        this.load();
      },
    });
  }
}
