import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { SiteStore } from '../site-store';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/**
 * À propos : portrait 3:4 et quatre phrases. Réutilisé tel quel comme
 * section de la home (titre en H2, un H1 existe déjà dans le hero) et
 * comme contenu de la page autonome `/a-propos` (titre en H1, cf.
 * `headingLevel` posé par `AboutPageComponent`).
 */
@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, RevealDirective],
  template: `
    <section class="about" id="studio" aria-labelledby="titre-studio">
      <div class="about__portrait" appReveal>
        @if (about().portraitUrl; as portrait) {
          <img
            class="about__image"
            [src]="portrait"
            [alt]="'Portrait — ' + settings().brandName"
            width="900"
            height="1200"
            loading="lazy"
            decoding="async"
          />
        }
      </div>

      <div class="about__text" appReveal>
        <app-section-title
          [eyebrow]="text.about.eyebrow"
          [title]="text.about.title"
          titleId="titre-studio"
          [level]="headingLevel()"
        />
        @for (paragraph of about().paragraphs; track paragraph) {
          <p class="about__line">{{ paragraph }}</p>
        }
      </div>
    </section>
  `,
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  readonly headingLevel = input<'h1' | 'h2'>('h2');

  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);
  protected readonly about = this.store.about;
  protected readonly settings = this.store.settings;
  protected readonly text = UI_TEXT[this.locale];
}
