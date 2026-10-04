import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { QuoteFormComponent } from './quote-form.component';
import { SiteStore } from '../site-store';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { QuoteService, prefillFromParams } from '../../core/quote';

/**
 * Section contact. Sur l'accueil, un bouton ouvre le popup de devis ; sur la
 * page Contact (`inlineForm`), le formulaire est affiché directement, déjà
 * prérempli par les paramètres de l'URL : c'est aussi la page où arrive un
 * visiteur sans JavaScript qui a cliqué « Demander un devis ».
 */
@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, CtaButtonComponent, QuoteFormComponent],
  template: `
    <section class="contact" id="contact" aria-labelledby="titre-contact">
      <div class="contact__intro">
        <app-section-title
          [eyebrow]="text.eyebrow"
          [title]="text.title"
          titleId="titre-contact"
          [level]="headingLevel()"
        />
        <p class="contact__lead">{{ text.lead }}</p>
        <ul class="contact__links">
          <li><a class="contact__link" [href]="'mailto:' + settings().email">{{ settings().email }}</a></li>
          <li>
            <a class="contact__link" [href]="'https://instagram.com/' + instagramHandle()" rel="noopener" target="_blank">{{
              settings().instagram
            }}</a>
          </li>
        </ul>
      </div>

      @if (inlineForm()) {
        <app-quote-form [prefill]="prefill" idPrefix="page" />
      } @else {
        <div class="contact__action">
          <app-cta-button (click)="quote.open()">{{ text.openQuote }}</app-cta-button>
        </div>
      }
    </section>
  `,
  styleUrl: './contact.component.scss',
})
export class ContactComponent {
  readonly headingLevel = input<'h1' | 'h2'>('h2');
  /** `true` sur la page Contact : formulaire affiché dans la page plutôt qu'en popup. */
  readonly inlineForm = input(false);

  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);
  protected readonly quote = inject(QuoteService);

  protected readonly settings = this.store.settings;
  protected readonly text = UI_TEXT[this.locale].contact;
  protected readonly prefill = prefillFromParams(inject(ActivatedRoute).snapshot.queryParamMap);

  protected instagramHandle(): string {
    return this.settings().instagram.replace('@', '');
  }
}
