import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { ProjectCardComponent } from '../../shared/ui/project-card.component';
import { PublicApiService } from '../../core/api/public-api.service';
import { SITE_LOCALE, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { Project } from '../../models';

/**
 * Derniers projets publiés (home, page catégorie, page région). La section
 * disparaît quand il n'y a rien à montrer : pas de « bientôt » en
 * production. Filtrable par catégorie ou par région.
 */
@Component({
  selector: 'app-recent-projects',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, ProjectCardComponent, RouterLink],
  template: `
    @if (projects().length > 0) {
      <section class="recent" aria-labelledby="titre-projets-recents">
        <app-section-title [eyebrow]="text.projects.eyebrow" [title]="title()" titleId="titre-projets-recents" />
        <div class="recent__grid">
          @for (project of projects(); track project.id) {
            <app-project-card [project]="project" />
          }
        </div>
        <p class="recent__all">
          <a [routerLink]="projectsPath">{{ text.projects.seeAll }} →</a>
        </p>
      </section>
    }
  `,
  styles: [
    `
      @use 'tokens' as *;

      .recent {
        background: $color-surface;

        @include section-padding;
      }

      .recent__grid {
        display: grid;
        gap: $gutter;

        @include tablet-up {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      .recent__all {
        margin: 24px 0 0;

        a {
          @include display-caps($fs-11, $ls-20, $weight-semibold);

          color: $color-amber;
          text-decoration: none;

          &:hover {
            color: $color-film;
          }
        }
      }
    `,
  ],
})
export class RecentProjectsComponent {
  readonly category = input<string | undefined>(undefined);
  readonly region = input<string | undefined>(undefined);
  readonly title = input<string>(UI_TEXT[inject(SITE_LOCALE)].projects.homeTitle);
  readonly limit = input(3);

  private readonly api = inject(PublicApiService);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly text = UI_TEXT[this.locale];
  protected readonly projectsPath = routePath(this.locale, 'projects');
  protected readonly projects = toSignal(
    this.api.projects(this.locale, { category: this.category(), region: this.region(), limit: this.limit() }),
    { initialValue: [] as Project[] },
  );
}
