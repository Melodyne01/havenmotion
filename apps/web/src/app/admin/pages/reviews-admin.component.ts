import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/api/admin-api.service';
import { Project, Review } from '../../models';
import { CATEGORY_NAMES } from '../../core/site-content';
import { CategoryKey } from '../../core/locale';

const CATEGORY_KEYS: readonly CategoryKey[] = ['evenementiel', 'mariage', 'corporate', 'sport', 'clip', 'lifestyle'];

/**
 * Avis clients réels. Remplacent les témoignages d'attente : la home et
 * les pages catégorie n'affichent rien tant qu'aucun avis publié n'existe.
 * Un avis est saisi dans la langue où il a été écrit ; il peut être relié
 * au projet dont il parle.
 */
@Component({
  selector: 'app-reviews-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Avis clients</h1>
        <button class="a-btn" type="button" (click)="add()">Nouvel avis</button>
      </header>
      <p class="a-hint">
        Uniquement des avis réels, avec l’accord du client. Dans la langue où il a été écrit : le site montre
        d’abord ceux de la langue du visiteur, puis les autres.
      </p>

      @if (status()) {
        <p class="a-status" role="status">{{ status() }}</p>
      }

      @for (review of reviews(); track review.id || $index) {
        <div class="a-card">
          <div class="a-grid">
            <label class="a-field">
              <span class="a-label">Auteur (prénom, ou prénom + initiale)</span>
              <input class="a-input" type="text" [(ngModel)]="review.author" name="author-{{ $index }}" />
            </label>
            <label class="a-field">
              <span class="a-label">Ville</span>
              <input class="a-input" type="text" [(ngModel)]="review.city" name="city-{{ $index }}" />
            </label>
            <label class="a-field">
              <span class="a-label">Catégorie</span>
              <select class="a-input" [(ngModel)]="review.categoryKey" name="category-{{ $index }}">
                <option value="">—</option>
                @for (key of categoryKeys; track key) {
                  <option [value]="key">{{ categoryName(key) }}</option>
                }
              </select>
            </label>
            <label class="a-field">
              <span class="a-label">Note (1-5)</span>
              <input class="a-input" type="number" min="1" max="5" [(ngModel)]="review.rating" name="rating-{{ $index }}" />
            </label>
            <label class="a-field">
              <span class="a-label">Langue</span>
              <select class="a-input" [(ngModel)]="review.locale" name="locale-{{ $index }}">
                <option value="fr">FR</option>
                <option value="nl">NL</option>
                <option value="en">EN</option>
              </select>
            </label>
            <label class="a-field">
              <span class="a-label">Date</span>
              <input class="a-input" type="date" [(ngModel)]="review.date" name="date-{{ $index }}" />
            </label>
            <label class="a-field">
              <span class="a-label">Source (google, e-mail…)</span>
              <input class="a-input" type="text" [(ngModel)]="review.source" name="source-{{ $index }}" />
            </label>
            <label class="a-field">
              <span class="a-label">Projet lié</span>
              <select class="a-input" [(ngModel)]="review.projectId" name="project-{{ $index }}">
                <option [ngValue]="null">—</option>
                @for (project of projects(); track project.id) {
                  <option [ngValue]="project.id">{{ project.fr?.title || project.slug }}</option>
                }
              </select>
            </label>
            <label class="a-field">
              <span class="a-label">Publié</span>
              <select class="a-input" [(ngModel)]="review.isPublished" name="published-{{ $index }}">
                <option [ngValue]="true">Oui</option>
                <option [ngValue]="false">Non</option>
              </select>
            </label>
            <label class="a-field">
              <span class="a-label">Ordre</span>
              <input class="a-input" type="number" [(ngModel)]="review.sortOrder" name="order-{{ $index }}" />
            </label>
            <label class="a-field a-field--wide">
              <span class="a-label">Citation</span>
              <textarea class="a-input" rows="3" [(ngModel)]="review.quote" name="quote-{{ $index }}"></textarea>
            </label>
          </div>
          <div class="a-actions">
            <button class="a-btn" type="button" (click)="save(review)">Enregistrer</button>
            <button class="a-btn a-btn--danger" type="button" (click)="remove(review)">Supprimer</button>
          </div>
        </div>
      } @empty {
        <p class="a-empty">Aucun avis pour l’instant. Les témoignages d’attente ne sont plus affichés sur le site.</p>
      }
    </section>
  `,
  styles: [
    `
      .a-field--wide {
        grid-column: 1 / -1;
      }
    `,
  ],
})
export class ReviewsAdminComponent {
  private readonly api = inject(AdminApiService);

  protected readonly reviews = signal<Review[]>([]);
  protected readonly projects = signal<Project[]>([]);
  protected readonly status = signal<string | null>(null);
  protected readonly categoryKeys = CATEGORY_KEYS;

  constructor() {
    this.load();
    this.api.projects().subscribe({ next: (p) => this.projects.set(p), error: () => undefined });
  }

  protected categoryName(key: string): string {
    return CATEGORY_NAMES[key as CategoryKey]?.fr ?? key;
  }

  protected add(): void {
    this.reviews.update((list) => [
      {
        id: '',
        author: '',
        city: '',
        categoryKey: '',
        rating: 5,
        locale: 'fr',
        quote: '',
        date: null,
        source: '',
        projectId: null,
        isPublished: true,
        sortOrder: list.length + 1,
      },
      ...list,
    ]);
  }

  protected save(review: Review): void {
    this.api.saveReview({ ...review, date: review.date || null }).subscribe({
      next: () => {
        this.status.set('Avis enregistré.');
        this.load();
      },
      error: () => this.status.set("L'enregistrement a échoué. L'auteur et la citation sont obligatoires."),
    });
  }

  protected remove(review: Review): void {
    if (!review.id) {
      this.reviews.update((list) => list.filter((item) => item !== review));
      return;
    }
    this.api.deleteReview(review.id).subscribe({ next: () => this.load() });
  }

  private load(): void {
    this.api.reviews().subscribe({ next: (v) => this.reviews.set(v), error: () => undefined });
  }
}
