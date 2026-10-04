import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { ProjectCardComponent } from '../../shared/ui/project-card.component';
import { PublicApiService } from '../../core/api/public-api.service';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE, SITE_LOCALES, homePath, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { Project } from '../../models';

/** Liste des projets publiés dans la langue courante. */
@Component({
  selector: 'app-projects-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, SectionTitleComponent, ProjectCardComponent],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu" class="projects">
      <app-section-title [eyebrow]="text.projects.eyebrow" [title]="text.projects.title" titleId="titre-projets" level="h1" />
      <p class="projects__lead">{{ text.projects.lead }}</p>

      @if (projects().length === 0) {
        <p class="projects__empty">{{ text.projects.empty }}</p>
      } @else {
        <div class="projects__grid">
          @for (project of projects(); track project.id) {
            <app-project-card [project]="project" />
          }
        </div>
      }
    </main>

    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;
      @use 'editorial' as *;

      .projects {
        @include editorial-page;
      }

      .projects__lead {
        @include editorial-paragraph;

        max-width: 72ch;
        margin-top: -24px;
      }

      .projects__empty {
        @include editorial-paragraph;

        padding: 20px 24px;
        background: $color-surface;
        border-left: 3px solid $color-amber;
      }

      .projects__grid {
        display: grid;
        gap: $gutter;

        @include tablet-up {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        @include desktop {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class ProjectsPageComponent {
  private readonly api = inject(PublicApiService);
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly text = UI_TEXT[this.locale];
  protected readonly projects = toSignal(this.api.projects(this.locale), { initialValue: [] as Project[] });

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = routePath(this.locale, 'projects');
      this.seo.apply({
        title: `${this.text.projects.title} — ${settings.brandName}`,
        description: this.text.projects.lead,
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: homePath(this.locale) },
        { name: this.text.projects.eyebrow, path },
      ]);
      this.seo.applyHreflang({
        fr: routePath('fr', 'projects'),
        ...Object.fromEntries(SITE_LOCALES.filter((l) => l !== 'fr').map((l) => [l, routePath(l, 'projects')])),
      });
    });
  }
}
