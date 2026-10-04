import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE_LOCALE, routePath } from '../../core/locale';
import { Project } from '../../models';
import { CATEGORY_NAMES } from '../../core/site-content';
import { CategoryKey } from '../../core/locale';

/** Chemin d'une page projet dans une langue : `/projets/mariage-chateau-x`. */
export function projectPath(locale: 'fr' | 'nl' | 'en', slug: string): string {
  return `${routePath(locale, 'projects')}/${slug}`;
}

/**
 * Carte d'un projet : couverture, catégorie, titre, lieu et ville. Même
 * carte sur la home, la liste des projets, les pages catégorie et région.
 */
@Component({
  selector: 'app-project-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <a class="card" [routerLink]="href()">
      @if (project().cover?.posterUrl ?? project().cover?.renditions?.[0]?.url; as image) {
        <img class="card__image" [src]="image" [alt]="title()" loading="lazy" decoding="async" />
      } @else {
        <span class="card__placeholder" aria-hidden="true"></span>
      }
      <span class="card__body">
        <span class="card__eyebrow">{{ categoryName() }}@if (project().date) { · {{ year() }}}</span>
        <span class="card__title">{{ title() }}</span>
        <span class="card__meta">{{ place() }}</span>
      </span>
    </a>
  `,
  styles: [
    `
      @use 'tokens' as *;

      :host {
        display: block;
      }

      .card {
        display: grid;
        gap: 0;
        height: 100%;
        color: inherit;
        text-decoration: none;
        background: $color-charcoal;
        border: $rule-width solid $color-rule-10;
        transition: border-color $dur-fast $ease;

        &:hover {
          border-color: $color-amber;
        }
      }

      .card__image,
      .card__placeholder {
        display: block;
        width: 100%;
        aspect-ratio: 3 / 2;
        object-fit: cover;
        background: $color-surface;
      }

      .card__body {
        display: grid;
        gap: 6px;
        padding: 16px 18px 20px;
      }

      .card__eyebrow {
        @include display-caps($fs-11, $ls-20, $weight-semibold);

        color: $color-amber;
      }

      .card__title {
        @include display-caps($fs-15, $ls-14, $weight-semibold);

        color: $color-film;
      }

      .card__meta {
        color: $color-muted-60;
        font-size: $fs-13;
      }
    `,
  ],
})
export class ProjectCardComponent {
  readonly project = input.required<Project>();
  private readonly locale = inject(SITE_LOCALE);

  protected readonly text = computed(() => this.project()[this.locale] ?? this.project().fr ?? this.project().nl ?? this.project().en);
  protected readonly title = computed(() => this.text()?.title ?? this.project().slug);
  protected readonly href = computed(() => projectPath(this.locale, this.project().slug));
  protected readonly year = computed(() => this.project().date?.slice(0, 4) ?? '');
  protected readonly categoryName = computed(
    () => CATEGORY_NAMES[this.project().categoryKey as CategoryKey]?.[this.locale] ?? this.project().categoryKey,
  );
  protected readonly place = computed(() =>
    [this.project().venue, this.project().city].filter(Boolean).join(', '),
  );
}
