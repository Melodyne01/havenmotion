import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SiteStore } from '../site-store';

/** Témoignages : trois citations puis un bandeau de logos clients. */
@Component({
  selector: 'app-testimonials',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, RevealDirective],
  template: `
    <section class="testimonials" id="temoignages" aria-labelledby="titre-temoignages">
      <app-section-title
        eyebrow="Ils ont tourné avec le studio"
        title="Retours"
        titleId="titre-temoignages"
      />

      <div class="testimonials__grid">
        @for (testimonial of testimonials(); track testimonial.id) {
          <figure class="quote" appReveal>
            <blockquote class="quote__text">{{ testimonial.quote }}</blockquote>
            <figcaption class="quote__author">
              {{ testimonial.author }}
              <span class="quote__role">{{ testimonial.role }}</span>
            </figcaption>
          </figure>
        }
      </div>

      @if (logos().length > 0) {
        <ul class="logos" aria-label="Clients">
          @for (logo of logos(); track logo.id) {
            <li class="logos__item">
              @if (logo.imageUrl; as image) {
                <img class="logos__image" [src]="image" [alt]="logo.name" loading="lazy" />
              } @else {
                <span class="logos__name">{{ logo.name }}</span>
              }
            </li>
          }
        </ul>
      }
    </section>
  `,
  styleUrl: './testimonials.component.scss',
})
export class TestimonialsComponent {
  private readonly store = inject(SiteStore);
  protected readonly testimonials = this.store.testimonials;
  protected readonly logos = this.store.logos;
}
