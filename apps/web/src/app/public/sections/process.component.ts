import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SiteStore } from '../site-store';

/** Process : Échange → Tournage → Livraison. */
@Component({
  selector: 'app-process',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, RevealDirective],
  template: `
    <section class="process" id="process" aria-labelledby="titre-process">
      <app-section-title eyebrow="Process" title="Trois étapes" titleId="titre-process" />

      <ol class="process__list">
        @for (step of steps(); track step.id) {
          <li class="step" appReveal>
            <span class="step__index">{{ step.index }}</span>
            <h3 class="step__title">{{ step.title }}</h3>
            <p class="step__body">{{ step.body }}</p>
          </li>
        }
      </ol>
    </section>
  `,
  styleUrl: './process.component.scss',
})
export class ProcessComponent {
  private readonly store = inject(SiteStore);
  protected readonly steps = this.store.process;
}
