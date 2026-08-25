import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

/**
 * Modale plein écran, fond noir 94 %.
 *
 * Ferme par ✕, clic hors zone et touche Échap. Le focus est piégé tant que la
 * modale est ouverte et rendu à l'élément déclencheur à la fermeture.
 */
@Component({
  selector: 'app-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.escape)': 'closed.emit()',
  },
  template: `
    <!--
      Le clic hors zone est une commodité pointeur ; l'équivalent clavier est
      la touche Échap (gérée au niveau du document) et le bouton ✕ focusable.
    -->
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <div class="scrim" (click)="onScrimClick($event)">
      <div
        #panel
        class="panel"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="label()"
        tabindex="-1"
        (keydown.tab)="trapFocus($event)"
      >
        <button #closeButton class="panel__close" type="button" (click)="closed.emit()">
          <span class="sr-only">Fermer</span>
          <span aria-hidden="true">&#10005;</span>
        </button>
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  readonly label = input('');
  readonly closed = output<void>();

  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private readonly closeButton = viewChild.required<ElementRef<HTMLButtonElement>>('closeButton');
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private previouslyFocused: HTMLElement | null = null;

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.previouslyFocused = this.document.activeElement as HTMLElement | null;
    this.document.body.classList.add('is-locked');
    this.closeButton().nativeElement.focus();
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) {
      return;
    }
    this.document.body.classList.remove('is-locked');
    this.previouslyFocused?.focus();
  }

  protected onScrimClick(event: MouseEvent): void {
    // Un clic à l'intérieur du panneau ne doit pas fermer la modale.
    if (!this.panel().nativeElement.contains(event.target as Node)) {
      this.closed.emit();
    }
  }

  /** Boucle le focus sur les éléments interactifs du panneau. */
  protected trapFocus(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    const focusables = Array.from(
      this.panel().nativeElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => element.offsetParent !== null || element === this.closeButton().nativeElement);

    if (focusables.length === 0) {
      return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.document.activeElement;

    if (keyboardEvent.shiftKey && active === first) {
      keyboardEvent.preventDefault();
      last.focus();
    } else if (!keyboardEvent.shiftKey && active === last) {
      keyboardEvent.preventDefault();
      first.focus();
    }
  }
}
