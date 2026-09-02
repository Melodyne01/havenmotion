import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CategoryBandComponent } from './category-band.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';

/**
 * Réalisations. Les catégories *sont* la navigation : cinq bandes empilées,
 * bord à bord, séparées de 2 px. Pas d'onglets, pas de carrousel — et depuis
 * le passage en pages, plus de modale non plus : chaque bande est un lien
 * direct vers la page de la catégorie.
 */
@Component({
  selector: 'app-categories',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryBandComponent, SectionTitleComponent],
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
          <app-category-band [category]="category" [index]="i" />
        }
      </div>
    </section>
  `,
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  private readonly store = inject(SiteStore);

  protected readonly categories = this.store.categories;
}
