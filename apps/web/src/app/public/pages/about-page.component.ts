import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { AboutComponent } from '../sections/about.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { RouterLink } from '@angular/router';
import { COMPANY } from '../../core/site-content';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE, SITE_LOCALES, homePath, pick, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/** Page « À propos » dédiée : même contenu que la section home, sa propre URL. */
@Component({
  selector: 'app-about-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, AboutComponent, SiteFooterComponent, RouterLink],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />
    <main id="contenu">
      <app-about headingLevel="h1" />
      <section class="about-facts" aria-labelledby="titre-about-facts">
        <h2 id="titre-about-facts" class="about-facts__title">{{ factsTitle() }}</h2>
        <dl class="about-facts__grid">
          <div><dt>{{ projectsValue }}</dt><dd>{{ projectsLabel() }}</dd></div>
          <div><dt>5</dt><dd>{{ countriesLabel() }}</dd></div>
          <div><dt>3</dt><dd>{{ languagesLabel() }}</dd></div>
          <div><dt>1</dt><dd>{{ onePersonLabel() }}</dd></div>
        </dl>
        <p class="about-facts__links">
          <a [routerLink]="onePersonPath">{{ onePersonLink() }} →</a>
          <a [routerLink]="factsPath">{{ text.facts.title }} →</a>
          <a [routerLink]="projectsPath">{{ text.projects.seeAll }} →</a>
        </p>
      </section>
    </main>
    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;

      .about-facts {
        display: grid;
        gap: 24px;
        padding: 0 $pad-x-mobile 64px;

        @include tablet-up {
          padding: 0 $pad-x-desktop 96px;
        }
      }

      .about-facts__title {
        @include display-caps($fs-15, $ls-14, $weight-semibold);

        color: $color-amber;
        margin: 0;
      }

      .about-facts__grid {
        display: grid;
        gap: $gutter;
        margin: 0;

        @include tablet-up {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        div {
          padding: 20px;
          background: $color-surface;
          border: $rule-width solid $color-rule-10;
        }

        dt {
          @include display-caps($fs-40, $ls-10);

          color: $color-amber;
        }

        dd {
          margin: 8px 0 0;
          color: $color-muted-60;
          font-size: $fs-14;
          line-height: $lh-body;
        }
      }

      .about-facts__links {
        display: flex;
        flex-wrap: wrap;
        gap: 12px 24px;
        margin: 0;

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
export class AboutPageComponent {
  protected readonly projectsValue = `${COMPANY.projectsCompleted}+`;
  protected readonly onePersonPath = routePath(inject(SITE_LOCALE), 'onePerson');
  protected readonly factsPath = routePath(inject(SITE_LOCALE), 'facts');
  protected readonly projectsPath = routePath(inject(SITE_LOCALE), 'projects');

  protected factsTitle(): string {
    return pick(this.locale, { fr: 'En chiffres', nl: 'In cijfers', en: 'In numbers' });
  }

  protected projectsLabel(): string {
    return pick(this.locale, { fr: 'projets réalisés', nl: 'gerealiseerde projecten', en: 'projects completed' });
  }

  protected countriesLabel(): string {
    return pick(this.locale, { fr: 'pays : Belgique, France, Pays-Bas, Luxembourg, Grèce', nl: 'landen: België, Frankrijk, Nederland, Luxemburg, Griekenland', en: 'countries: Belgium, France, Netherlands, Luxembourg, Greece' });
  }

  protected languagesLabel(): string {
    return pick(this.locale, { fr: 'langues de travail : français, néerlandais, anglais', nl: 'werktalen: Nederlands, Frans, Engels', en: 'working languages: English, French, Dutch' });
  }

  protected onePersonLabel(): string {
    return pick(this.locale, { fr: 'seule personne pour la photo et la vidéo', nl: 'persoon voor foto en video', en: 'person for both photo and video' });
  }

  protected onePersonLink(): string {
    return pick(this.locale, { fr: 'Comment je fais les deux', nl: 'Hoe ik beide doe', en: 'How I do both' });
  }

  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);
  protected readonly text = UI_TEXT[this.locale];

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = routePath(this.locale, 'about');
      const title = this.text.about.pageTitle;
      this.seo.apply({
        title: `${title} — ${settings.brandName}`,
        description: pick(this.locale, {
          fr: `${settings.tagline} Studio installé à ${settings.city}.`,
          nl: `${settings.tagline} Studio gevestigd in ${settings.city}.`,
          en: `${settings.tagline} Studio based in ${settings.city}.`,
        }),
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: homePath(this.locale) },
        { name: title, path },
      ]);
      this.seo.applyHreflang({
        fr: routePath('fr', 'about'),
        ...Object.fromEntries(SITE_LOCALES.filter((l) => l !== 'fr').map((l) => [l, routePath(l, 'about')])),
      });
    });
  }
}
