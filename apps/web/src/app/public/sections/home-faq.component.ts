import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { FAQ_CONTENT } from '../../core/faq-content';

/**
 * FAQ générale en bas de la home : les mêmes questions transactionnelles
 * (prix, délai, zone, droits) que la page `/faq` dédiée, pas un doublon
 * de contenu différent — un visiteur qui ne va pas jusqu'à cette page
 * doit quand même trouver ces réponses avant de repartir. Le lien vers
 * `/faq` reste utile : c'est un maillage interne réel, pas décoratif.
 */
@Component({
  selector: 'app-home-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, RouterLink],
  template: `
    <section class="home-faq" id="faq" aria-labelledby="titre-home-faq">
      <app-section-title
        [eyebrow]="text.homeFaq.eyebrow"
        [title]="text.homeFaq.title"
        titleId="titre-home-faq"
      />

      <dl class="home-faq__list">
        @for (entry of entries; track entry.question) {
          <div class="home-faq__item">
            <dt class="home-faq__question">{{ entry.question }}</dt>
            <dd class="home-faq__answer">{{ entry.answer }}</dd>
          </div>
        }
      </dl>

      <a class="home-faq__more" [routerLink]="faqPath()">{{ text.homeFaq.seeMoreLabel }} →</a>
    </section>
  `,
  styleUrl: './home-faq.component.scss',
})
export class HomeFaqComponent {
  private readonly locale = inject(SITE_LOCALE);
  protected readonly text = UI_TEXT[this.locale];
  protected readonly entries = FAQ_CONTENT[this.locale];

  protected faqPath(): string {
    return this.locale === 'nl' ? '/nl/faq' : '/faq';
  }
}
