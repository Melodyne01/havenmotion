import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { QuoteFormComponent } from './quote-form.component';
import { QuoteService, prefillFromParams } from '../../core/quote';
import { SITE_LOCALES, SITE_LOCALE, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/**
 * Popup de demande de devis, monté une fois par page (dans l'en-tête).
 *
 * Tous les boutons « Demander un devis » du site gardent leur vrai lien
 * (`#contact`, `/contact?categorie=…&formule=…`) : sans JavaScript, ou pour
 * un robot, ils mènent à la page de contact. Dans le navigateur, un écouteur
 * en phase de capture intercepte ces clics avant le routeur et ouvre le
 * popup, prérempli avec les paramètres du lien. Un lien marqué
 * `data-page-link` (« Contact » du pied de page) reste un lien de page.
 *
 * `<dialog>` natif : piège du focus, touche Échap et arrière-plan inerte
 * sont fournis par le navigateur.
 */
@Component({
  selector: 'app-quote-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [QuoteFormComponent],
  template: `
    <dialog #dialog class="dialog" aria-labelledby="titre-devis" (close)="quote.close()">
      <div class="dialog__panel">
        <div class="dialog__head">
          <h2 id="titre-devis" class="dialog__title">{{ text.dialogTitle }}</h2>
          <button type="button" class="dialog__close" (click)="quote.close()">
            <span aria-hidden="true">×</span>
            <span class="sr-only">{{ text.close }}</span>
          </button>
        </div>
        <p class="dialog__lead">{{ text.lead }}</p>
        @if (quote.isOpen()) {
          <app-quote-form [prefill]="quote.prefill()" idPrefix="popup" />
        }
      </div>
    </dialog>
  `,
  styles: [
    `
      @use 'tokens' as *;

      .dialog {
        width: 100%;
        max-width: 100%;
        height: 100%;
        max-height: 100%;
        margin: 0;
        padding: 0;
        color: $color-film;
        background: $color-surface;
        border: 0;

        @include tablet-up {
          width: min(760px, calc(100% - 64px));
          // « auto » étirerait le dialogue entre top: 0 et bottom: 0.
          height: fit-content;
          max-height: calc(100% - 64px);
          margin: auto;
          border: $rule-width solid $color-rule-16;
        }

        &::backdrop {
          background: rgba(11, 11, 12, 0.82);
        }
      }

      .dialog__panel {
        display: grid;
        gap: 18px;
        padding: 24px $pad-x-mobile 40px;

        @include tablet-up {
          padding: 32px 40px 40px;
        }
      }

      .dialog__head {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 16px;
      }

      .dialog__title {
        @include display-caps($fs-26, $ls-14);

        margin: 0;
        line-height: $lh-tight;

        @include tablet-up {
          font-size: $fs-40;
        }
      }

      .dialog__close {
        flex: none;
        width: 44px;
        height: 44px;
        color: $color-film;
        font-size: $fs-26;
        line-height: 1;
        background: none;
        border: $rule-width solid $color-rule-16;
        cursor: pointer;

        &:hover {
          border-color: $color-amber;
          color: $color-amber;
        }

        &:focus-visible {
          @include focus-ring;
        }
      }

      .dialog__lead {
        max-width: 60ch;
        margin: 0;
        color: $color-muted-60;
        font-size: $fs-14;
        line-height: $lh-body;
      }
    `,
  ],
})
export class QuoteDialogComponent {
  protected readonly quote = inject(QuoteService);
  private readonly document = inject(DOCUMENT);
  private readonly locale = inject(SITE_LOCALE);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  protected readonly text = UI_TEXT[this.locale].contact;

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly contactPaths = SITE_LOCALES.map((l) => routePath(l, 'contact'));

  constructor() {
    effect(() => {
      const element = this.dialog().nativeElement;
      const open = this.quote.isOpen();
      if (!this.browser || typeof element.showModal !== 'function') {
        return;
      }
      if (open && !element.open) {
        element.showModal();
        this.document.documentElement.style.overflow = 'hidden';
      } else if (!open && element.open) {
        element.close();
      }
      if (!open) {
        this.document.documentElement.style.overflow = '';
      }
    });

    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const listener = (event: MouseEvent) => this.intercept(event);
      this.document.addEventListener('click', listener, true);
      // Clic sur l'arrière-plan (hors du panneau) : fermeture. Au clavier,
      // c'est la touche Échap, gérée nativement par <dialog>.
      const element = this.dialog().nativeElement;
      const backdrop = (event: MouseEvent) => {
        if (event.target === element) {
          this.quote.close();
        }
      };
      element.addEventListener('click', backdrop);
      destroyRef.onDestroy(() => {
        this.document.removeEventListener('click', listener, true);
        element.removeEventListener('click', backdrop);
        this.document.documentElement.style.overflow = '';
        this.quote.close();
      });
    });
  }

  private intercept(event: MouseEvent): void {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const anchor = (event.target as Element | null)?.closest?.('a');
    if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('data-page-link') || anchor.closest('dialog')) {
      return;
    }
    const url = new URL(anchor.href, this.document.location.href);
    if (url.origin !== this.document.location.origin) {
      return;
    }
    const isQuoteLink = url.hash === '#contact' || this.contactPaths.includes(url.pathname);
    if (!isQuoteLink) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.quote.open(prefillFromParams(url.searchParams));
  }
}
