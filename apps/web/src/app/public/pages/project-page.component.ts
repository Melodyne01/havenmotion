import { ChangeDetectionStrategy, Component, RESPONSE_INIT, computed, effect, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { VideoFrameComponent } from '../../shared/ui/video-frame.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { NotFoundComponent } from './not-found.component';
import { PublicApiService } from '../../core/api/public-api.service';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import {
  CategoryKey,
  SITE_LOCALE,
  SITE_LOCALES,
  categoryPath,
  categorySlug,
  homePath,
  routePath,
} from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { Project } from '../../models';
import { CATEGORY_NAMES } from '../../core/site-content';
import { PACK_LABELS, PackType, PACK_TYPES } from '../../core/packs';
import { COUNTRIES, findRegion } from '../../core/regions';
import { regionPath } from './region-page.component';
import { projectPath } from '../../shared/ui/project-card.component';

/**
 * Page d'un projet réel : le film, la galerie, le récit, le lieu et ce qui a
 * été livré. Le slug contient le lieu : c'est la page qui ranke sur
 * « mariage château X ». Une page n'existe dans une langue que si le projet
 * y a un titre ; sinon vrai 404, avec hreflang vers les langues où il existe.
 */
@Component({
  selector: 'app-project-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, VideoFrameComponent, CtaButtonComponent, RouterLink, NotFoundComponent],
  template: `
    @if (missing()) {
      <app-not-found />
    } @else if (view(); as v) {
      <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
      <app-site-header />

      <main id="contenu">
        <article class="project">
          <nav class="project__breadcrumb" [attr.aria-label]="text.breadcrumbAriaLabel">
            <a [routerLink]="homePath">{{ text.home }}</a>
            <span aria-hidden="true">/</span>
            <a [routerLink]="projectsPath">{{ text.projects.eyebrow }}</a>
            <span aria-hidden="true">/</span>
            <span>{{ v.title }}</span>
          </nav>

          @if (v.project.video) {
            <app-video-frame
              [asset]="v.project.video"
              playback="manual"
              [muted]="false"
              [loop]="false"
              [controls]="true"
              [label]="v.title"
              class="project__frame"
            />
          } @else if (v.coverUrl) {
            <img class="project__cover" [src]="v.coverUrl" [alt]="v.title" fetchpriority="high" />
          }

          <div class="project__body">
            <p class="project__eyebrow">
              <a [routerLink]="v.categoryHref">{{ v.categoryName }}</a>
              @if (v.regionHref) { · <a [routerLink]="v.regionHref">{{ v.regionName }}</a> }
              @if (v.year) { · {{ v.year }} }
            </p>
            <h1 class="project__title">{{ v.title }}</h1>
            <p class="project__summary">{{ v.summary }}</p>

            <dl class="project__facts">
              @if (v.place) {
                <dt>{{ text.projects.venue }}</dt>
                <dd>{{ v.place }}</dd>
              }
              @if (v.packLabel) {
                <dt>{{ text.projects.packDelivered }}</dt>
                <dd>{{ v.packLabel }}</dd>
              }
            </dl>

            @for (paragraph of v.paragraphs; track $index) {
              <p class="project__p">{{ paragraph }}</p>
            }

            @if (v.project.gallery.length > 0) {
              <section class="project__section" aria-labelledby="titre-galerie">
                <h2 id="titre-galerie" class="project__h2">{{ text.projects.gallery }}</h2>
                <ul class="project__gallery">
                  @for (asset of v.project.gallery; track asset.id) {
                    @if (asset.posterUrl ?? asset.renditions[0]?.url; as url) {
                      <li><img [src]="url" [alt]="v.title + ' — ' + asset.fileName" loading="lazy" decoding="async" /></li>
                    }
                  }
                </ul>
              </section>
            }

            <section class="project__cta">
              <h2 class="project__h2">{{ text.projects.similar }}</h2>
              <app-cta-button [href]="v.contactHref">{{ text.quoteCta }}</app-cta-button>
            </section>
          </div>
        </article>
      </main>

      <app-site-footer />
    }
  `,
  styles: [
    `
      @use 'tokens' as *;
      @use 'editorial' as *;

      .project {
        display: grid;
      }

      .project__breadcrumb {
        @include editorial-breadcrumb;

        padding: 20px $pad-x-mobile 0;
        margin: 0;

        @include tablet-up {
          padding: 24px $pad-x-desktop 0;
        }
      }

      .project__frame {
        display: block;
        margin-top: 16px;
      }

      .project__cover {
        display: block;
        width: 100%;
        max-height: 70vh;
        margin-top: 16px;
        object-fit: cover;
      }

      .project__body {
        display: grid;
        justify-items: start;
        gap: 16px;
        max-width: 78ch;
        padding: 28px $pad-x-mobile 64px;

        @include tablet-up {
          padding: 32px $pad-x-desktop 96px;
        }
      }

      .project__eyebrow {
        @include display-caps($fs-11, $ls-44, $weight-semibold);

        color: $color-amber;
        margin: 0;

        a {
          color: inherit;
          text-decoration: none;

          &:hover {
            color: $color-film;
          }
        }
      }

      .project__title {
        @include display-caps($fs-40, $ls-14);

        color: $color-film;
        line-height: $lh-tight;
        margin: 0;

        @include tablet-up {
          font-size: $fs-64;
        }
      }

      .project__summary {
        @include editorial-paragraph;

        color: $color-film;
      }

      .project__facts {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 4px 16px;
        margin: 0;
        padding: 12px 0;
        border-top: $rule-width solid $color-rule-10;
        border-bottom: $rule-width solid $color-rule-10;
        width: 100%;

        dt {
          @include display-caps($fs-11, $ls-20, $weight-semibold);

          color: $color-muted-45;
        }

        dd {
          margin: 0;
          color: $color-film;
          font-size: $fs-14;
        }
      }

      .project__p {
        @include editorial-paragraph;
      }

      .project__section {
        @include editorial-section;

        width: 100%;
      }

      .project__h2 {
        @include editorial-h2;
      }

      .project__gallery {
        display: grid;
        gap: $gutter;
        padding: 0;
        margin: 0;
        list-style: none;

        @include tablet-up {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        img {
          display: block;
          width: 100%;
          aspect-ratio: 3 / 2;
          object-fit: cover;
        }
      }

      .project__cta {
        @include editorial-cta;

        width: 100%;
      }
    `,
  ],
})
export class ProjectPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PublicApiService);
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);
  private readonly response = inject(RESPONSE_INIT, { optional: true });

  private readonly slug = toSignal(this.route.paramMap.pipe(map((p) => p.get('slug') ?? '')), {
    initialValue: this.route.snapshot.paramMap.get('slug') ?? '',
  });

  /** `undefined` tant que la requête est en vol, `null` si le projet n'existe pas. */
  private readonly project = toSignal(
    toObservable(this.slug).pipe(
      switchMap((slug) => this.api.project(slug).pipe(startWith(undefined as Project | null | undefined))),
    ),
  );

  protected readonly text = UI_TEXT[this.locale];
  protected readonly homePath = homePath(this.locale);
  protected readonly projectsPath = routePath(this.locale, 'projects');

  protected readonly missing = computed(() => {
    const project = this.project();
    return project === null || (project !== undefined && !project[this.locale]);
  });

  protected readonly view = computed(() => {
    const project: Project | null | undefined = this.project();
    const localized = project?.[this.locale];
    if (!project || !localized) {
      return null;
    }
    const region = project.regionId ? findRegion(project.regionId) : null;
    const key = project.categoryKey as CategoryKey;
    return {
      project,
      title: localized.title,
      summary: localized.summary,
      paragraphs: localized.paragraphs,
      year: project.date?.slice(0, 4) ?? '',
      place: [project.venue, project.city, COUNTRIES.find((c) => c.code === project.countryCode)?.name[this.locale]]
        .filter(Boolean)
        .join(', '),
      categoryName: CATEGORY_NAMES[key]?.[this.locale] ?? project.categoryKey,
      categoryHref: categoryPath(this.locale, categorySlug(this.locale, key)),
      regionName: region?.name[this.locale] ?? '',
      regionHref: region && region.languages.includes(this.locale) ? regionPath(this.locale, region) : null,
      packLabel: PACK_TYPES.includes(project.pack as PackType) ? PACK_LABELS[project.pack as PackType][this.locale] : '',
      coverUrl: project.cover?.posterUrl ?? project.cover?.renditions[0]?.url ?? null,
      contactHref: `${routePath(this.locale, 'contact')}?categorie=${project.categoryKey}${project.pack ? `&formule=${project.pack}` : ''}${project.regionId ? `&region=${project.regionId}` : ''}`,
    };
  });

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      if (this.missing() && this.response) {
        this.response.status = 404;
      }
    });

    effect(() => {
      const v = this.view();
      if (!v) {
        return;
      }
      const settings = this.store.settings();
      const path = projectPath(this.locale, v.project.slug);
      this.seo.apply({
        title: `${v.title} — ${v.categoryName} — ${settings.brandName}`,
        description: v.summary || v.paragraphs[0]?.slice(0, 155) || v.title,
        path,
        imagePath: v.coverUrl ?? undefined,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.homePath },
        { name: this.text.projects.eyebrow, path: this.projectsPath },
        { name: v.title, path },
      ]);
      this.seo.applyProject(settings, v.project, this.locale);
      const alternates = Object.fromEntries(
        SITE_LOCALES.filter((l) => v.project[l]).map((l) => [l, projectPath(l, v.project.slug)]),
      );
      this.seo.applyHreflang({ fr: alternates['fr'] ?? path, ...alternates });
    });
  }
}
