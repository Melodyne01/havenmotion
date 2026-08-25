import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CategoryBandComponent } from './category-band.component';
import { CategoryModalComponent } from './category-modal.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { Category } from '../../models';

/**
 * Réalisations. Les catégories *sont* la navigation : cinq bandes empilées,
 * bord à bord, séparées de 2 px. Pas d'onglets, pas de carrousel.
 */
@Component({
  selector: 'app-categories',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryBandComponent, CategoryModalComponent, SectionTitleComponent],
  template: `
    <section class="categories" id="realisations" aria-labelledby="titre-realisations">
      <div class="categories__head">
        <app-section-title
          eyebrow="Réalisations"
          title="Cinq territoires"
          titleId="titre-realisations"
        />
      </div>

      <div class="categories__bands">
        @for (category of categories(); track category.id; let i = $index) {
          <app-category-band [category]="category" [index]="i" (open)="openCategory($event)" />
        }
      </div>
    </section>

    @if (active(); as category) {
      <app-category-modal [category]="category" (closed)="closeCategory()" />
    }
  `,
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private readonly store = inject(SiteStore);

  protected readonly categories = this.store.categories;
  protected readonly active = signal<Category | null>(null);

  protected openCategory(category: Category): void {
    this.active.set(category);
  }

  protected closeCategory(): void {
    this.active.set(null);
  }
}
