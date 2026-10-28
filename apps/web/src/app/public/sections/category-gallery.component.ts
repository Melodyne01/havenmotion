import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SITE_LOCALE } from '../../core/locale';
import { CATEGORY_GALLERY_TEXT, CATEGORY_PHOTOS, photoUrl } from '../../core/category-photos';

/**
 * Galerie de photos d'une catégorie (page `/prestations/:slug`). La section
 * disparaît quand la catégorie n'a pas de photos : pas de cadre vide.
 */
@Component({
  selector: 'app-category-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent],
  template: `
    @if (photos().length > 0 && text(); as t) {
      <section class="gallery" [attr.aria-labelledby]="'titre-galerie-' + category()">
        <app-section-title [eyebrow]="t.eyebrow" [title]="t.title" [titleId]="'titre-galerie-' + category()" />
        <ul class="gallery__grid">
          @for (photo of photos(); track photo.slug) {
            <li class="gallery__item">
              <img
                [src]="url(photo.slug, 800)"
                [attr.srcset]="url(photo.slug, 800) + ' 800w, ' + url(photo.slug, 1600) + ' 1600w'"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                [width]="photo.width"
                [height]="photo.height"
                [alt]="photo.alt[locale]"
                loading="lazy"
                decoding="async"
              />
            </li>
          }
        </ul>
      </section>
    }
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

      .gallery__item {
        break-inside: avoid;
        margin: 0 0 $gutter;
      }

      .gallery__item img {
        background: $color-surface;
        display: block;
        height: auto;
        width: 100%;
      }
    `,
  ],
})
export class CategoryGalleryComponent {
  readonly category = input.required<string>();

  protected readonly locale = inject(SITE_LOCALE);
  protected readonly photos = computed(() => CATEGORY_PHOTOS[this.category()] ?? []);
  protected readonly text = computed(() => CATEGORY_GALLERY_TEXT[this.locale][this.category()] ?? null);

  protected url(slug: string, width: 800 | 1600): string {
    return photoUrl(this.category(), slug, width);
  }
}
