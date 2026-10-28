import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SITE_LOCALE, SiteLocale } from '../../core/locale';
import { CATEGORY_GALLERY_TEXT, CATEGORY_PHOTOS, photoUrl } from '../../core/category-photos';

const LIGHTBOX_TEXT: Record<
  SiteLocale,
  { open: string; close: string; previous: string; next: string; photo: string }
> = {
  fr: {
    open: 'Agrandir la photo',
    close: 'Fermer',
    previous: 'Photo précédente',
    next: 'Photo suivante',
    photo: 'Photo',
  },
  nl: {
    open: 'Foto vergroten',
    close: 'Sluiten',
    previous: 'Vorige foto',
    next: 'Volgende foto',
    photo: 'Foto',
  },
  en: {
    open: 'Enlarge photo',
    close: 'Close',
    previous: 'Previous photo',
    next: 'Next photo',
    photo: 'Photo',
  },
};

/** Écart horizontal minimal (px) d'un balayage tactile pour changer de photo. */
const SWIPE_DISTANCE = 50;

/**
 * Galerie de photos d'une catégorie (page `/prestations/:slug`). La section
 * disparaît quand la catégorie n'a pas de photos : pas de cadre vide.
 *
 * Toucher ou cliquer une photo l'agrandit dans une visionneuse plein écran
 * (`<dialog>` natif : piège du focus, touche Échap et arrière-plan inerte
 * fournis par le navigateur). Flèches du clavier, boutons et balayage tactile
 * font défiler les photos de la catégorie.
 */
@Component({
  selector: 'app-category-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent],
  template: `
    @if (photos().length > 0 && text(); as t) {
      <section class="gallery" [attr.aria-labelledby]="'titre-galerie-' + category()">
        <app-section-title
          [eyebrow]="t.eyebrow"
          [title]="t.title"
          [titleId]="'titre-galerie-' + category()"
        />
        <ul class="gallery__grid" [class.gallery__grid--single]="photos().length === 1">
          @for (photo of photos(); track photo.slug) {
            <li class="gallery__item">
              <button
                type="button"
                class="gallery__open"
                [attr.aria-label]="lightbox.open + ' : ' + photo.alt[locale]"
                (click)="show($index)"
              >
                <img
                  [src]="url(photo.slug, 800)"
                  [attr.srcset]="
                    url(photo.slug, 800) + ' 800w, ' + url(photo.slug, 1600) + ' 1600w'
                  "
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  [width]="photo.width"
                  [height]="photo.height"
                  [alt]="photo.alt[locale]"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </li>
          }
        </ul>
      </section>
    }

    <dialog #viewer class="viewer" [attr.aria-label]="lightbox.photo" (close)="onClosed()">
      <div
        class="viewer__layer"
        role="presentation"
        (click)="onBackdrop($event)"
        (keydown)="onKey($event)"
        (touchstart)="onTouchStart($event)"
        (touchend)="onTouchEnd($event)"
      >
        @if (current(); as photo) {
          <figure class="viewer__figure">
            <img
              class="viewer__image"
              [src]="url(photo.slug, 1600)"
              [width]="photo.width"
              [height]="photo.height"
              [alt]="photo.alt[locale]"
            />
            <figcaption class="viewer__caption">
              <span>{{ photo.alt[locale] }}</span>
              <span class="viewer__count" aria-live="polite"
                >{{ index() + 1 }} / {{ photos().length }}</span
              >
            </figcaption>
          </figure>
        }
        <button
          type="button"
          class="viewer__button viewer__close"
          [attr.aria-label]="lightbox.close"
          (click)="close()"
        >
          <span aria-hidden="true">×</span>
        </button>
        @if (photos().length > 1) {
          <button
            type="button"
            class="viewer__button viewer__prev"
            [attr.aria-label]="lightbox.previous"
            (click)="step(-1)"
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            class="viewer__button viewer__next"
            [attr.aria-label]="lightbox.next"
            (click)="step(1)"
          >
            <span aria-hidden="true">›</span>
          </button>
        }
      </div>
    </dialog>
  `,
  styles: [
    `
      @use 'tokens' as *;

      .gallery {
        background: $color-charcoal;

        @include section-padding;
      }

      .gallery__grid {
        column-gap: $gutter;
        columns: 1;
        list-style: none;
        margin: 0;
        padding: 0;

        @media (min-width: 640px) {
          columns: 2;
        }

        @media (min-width: 1024px) {
          columns: 3;
        }
      }

      /* Une seule photo : pleine largeur de colonne plutôt qu'un tiers de page vide. */
      .gallery__grid--single {
        columns: 1;
        max-width: 800px;
      }

      .gallery__item {
        break-inside: avoid;
        margin: 0 0 $gutter;
      }

      .gallery__open {
        background: none;
        border: 0;
        cursor: zoom-in;
        display: block;
        overflow: hidden;
        padding: 0;
        width: 100%;

        &:focus-visible {
          @include focus-ring;
        }
      }

      .gallery__item img {
        background: $color-surface;
        display: block;
        height: auto;
        transition: transform 0.4s ease;
        width: 100%;
      }

      @media (hover: hover) {
        .gallery__open:hover img {
          transform: scale(1.04);
        }
      }

      .viewer {
        background: $color-modal-scrim;
        border: 0;
        color: $color-film;
        height: 100%;
        margin: 0;
        max-height: none;
        max-width: none;
        padding: 0;
        width: 100%;

        &::backdrop {
          background: $color-modal-scrim;
        }

        &[open] {
          animation: viewer-in 0.25s ease;
        }
      }

      .viewer__layer {
        height: 100%;
        width: 100%;
      }

      .viewer__figure {
        align-items: center;
        display: flex;
        flex-direction: column;
        gap: 12px;
        height: 100%;
        justify-content: center;
        margin: 0;
        padding: 64px 16px 24px;

        @include tablet-up {
          padding: 48px 88px 32px;
        }
      }

      .viewer__image {
        height: auto;
        max-height: calc(100% - 48px);
        max-width: 100%;
        object-fit: contain;
        width: auto;
        animation: viewer-zoom 0.3s ease;
      }

      .viewer__caption {
        color: $color-muted-60;
        display: flex;
        font-size: $fs-14;
        gap: 16px;
        justify-content: space-between;
        line-height: $lh-body;
        max-width: min(100%, 900px);
        width: 100%;
      }

      .viewer__count {
        color: $color-amber;
        flex: none;
      }

      .viewer__button {
        background: rgba(11, 11, 12, 0.6);
        border: $rule-width solid $color-rule-16;
        color: $color-film;
        cursor: pointer;
        font-size: $fs-26;
        height: 44px;
        line-height: 1;
        position: absolute;
        width: 44px;

        &:hover {
          border-color: $color-amber;
          color: $color-amber;
        }

        &:focus-visible {
          @include focus-ring;
        }
      }

      .viewer__close {
        right: 16px;
        top: 16px;
      }

      .viewer__prev,
      .viewer__next {
        top: 50%;
        transform: translateY(-50%);
      }

      .viewer__prev {
        left: 8px;
      }

      .viewer__next {
        right: 8px;
      }

      @keyframes viewer-in {
        from {
          opacity: 0;
        }
      }

      @keyframes viewer-zoom {
        from {
          opacity: 0;
          transform: scale(0.94);
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .viewer[open],
        .viewer__image {
          animation: none;
        }

        .gallery__item img {
          transition: none;
        }
      }
    `,
  ],
})
export class CategoryGalleryComponent {
  readonly category = input.required<string>();

  protected readonly locale = inject(SITE_LOCALE);
  protected readonly photos = computed(() => CATEGORY_PHOTOS[this.category()] ?? []);
  protected readonly text = computed(
    () => CATEGORY_GALLERY_TEXT[this.locale][this.category()] ?? null,
  );

  protected readonly lightbox = LIGHTBOX_TEXT[this.locale];
  protected readonly index = signal(0);
  protected readonly current = signal<(typeof CATEGORY_PHOTOS)[string][number] | null>(null);

  private readonly viewer = viewChild.required<ElementRef<HTMLDialogElement>>('viewer');
  private readonly document = inject(DOCUMENT);
  private touchStartX: number | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => (this.document.documentElement.style.overflow = ''));
  }

  protected show(index: number): void {
    const dialog = this.viewer().nativeElement;
    this.select(index);
    if (typeof dialog.showModal === 'function' && !dialog.open) {
      dialog.showModal();
      this.document.documentElement.style.overflow = 'hidden';
    }
  }

  protected step(delta: number): void {
    const count = this.photos().length;
    this.select((this.index() + delta + count) % count);
  }

  protected close(): void {
    this.viewer().nativeElement.close();
  }

  protected onClosed(): void {
    this.current.set(null);
    this.document.documentElement.style.overflow = '';
  }

  /** Clic sur l'arrière-plan sombre (hors photo et boutons) : fermeture. */
  protected onBackdrop(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('viewer__layer') || target.classList.contains('viewer__figure')) {
      this.close();
    }
  }

  protected onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      this.step(-1);
    } else if (event.key === 'ArrowRight') {
      this.step(1);
    }
  }

  protected onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches.length === 1 ? event.touches[0].clientX : null;
  }

  protected onTouchEnd(event: TouchEvent): void {
    if (this.touchStartX === null || this.photos().length < 2) {
      return;
    }
    const delta = event.changedTouches[0].clientX - this.touchStartX;
    this.touchStartX = null;
    if (Math.abs(delta) >= SWIPE_DISTANCE) {
      this.step(delta < 0 ? 1 : -1);
    }
  }

  private select(index: number): void {
    this.index.set(index);
    this.current.set(this.photos()[index] ?? null);
  }

  protected url(slug: string, width: 800 | 1600): string {
    return photoUrl(this.category(), slug, width);
  }
}
