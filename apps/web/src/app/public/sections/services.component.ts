import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SiteStore } from '../site-store';

/** Prestations : quatre cartes, contenu piloté par le backoffice. */
@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, CtaButtonComponent, RevealDirective],
  template: `
    <section class="services" id="prestations" aria-labelledby="titre-prestations">
      <app-section-title
        eyebrow="Prestations"
        title="Ce que je livre"
        titleId="titre-prestations"
      />

      <div class="services__grid">
        @for (service of services(); track service.id) {
          <article class="card" appReveal>
            <h3 class="card__name">{{ service.name }}</h3>

            <ul class="card__included">
              @for (item of service.included; track item) {
                <li class="card__item">{{ item }}</li>
              }
            </ul>

            <dl class="card__facts">
              <dt>Durée</dt>
              <dd>{{ service.duration }}</dd>
              <dt>Livrables</dt>
              <dd>{{ service.deliverables }}</dd>
            </dl>

            <p class="card__price">{{ service.startingPrice }}</p>
            <app-cta-button href="#contact" variant="ghost">Demander un devis</app-cta-button>
          </article>
        }
      </div>
    </section>
  `,
  styleUrl: './services.component.scss',
})
export class ServicesComponent {
  private readonly store = inject(SiteStore);
  protected readonly services = this.store.services;
}
