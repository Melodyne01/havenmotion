import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE } from '../../core/locale';
import { COMMUNES, CommuneInfo } from '../../core/communes';

/**
 * Page hub `/zones` : liste les 19 communes de la Région de
 * Bruxelles-Capitale, chacune avec sa propre page locale. Sert de maillage
 * interne entre la home et les 19 pages commune (silo SEO classique).
 */
@Component({
  selector: 'app-zones-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, SectionTitleComponent, RouterLink],
  template: `
    <a class="skip-link" href="#contenu">Aller au contenu</a>
    <app-site-header />

    <main id="contenu">
      <section class="zones-page">
        <app-section-title [eyebrow]="eyebrow()" [title]="title()" titleId="titre-zones" />
        <p class="zones-page__intro">{{ intro() }}</p>

        <ul class="zones-page__list">
          @for (commune of communes; track commune.slugFr) {
            <li><a [routerLink]="communeHref(commune)">{{ communeName(commune) }}</a></li>
          }
        </ul>
      </section>
    </main>

    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;

      .zones-page {
        padding: 32px $pad-x-mobile 64px;

        @include tablet-up {
          padding: 40px $pad-x-desktop 80px;
        }
      }

      .zones-page__intro {
        max-width: 640px;
        margin: 16px 0 0;
        color: $color-muted-60;
        font-size: $fs-14;
        line-height: $lh-body;
      }

      .zones-page__list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px 24px;
        padding: 0;
        margin: 24px 0 0;
        list-style: none;

        @include tablet-up {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      .zones-page__list a {
        display: block;
        padding: 12px 0;
        color: $color-film;
        text-decoration: none;
        font-size: $fs-14;
        border-bottom: $rule-width solid $color-rule-10;

        &:hover {
          color: $color-amber;
        }
      }
    `,
  ],
})
export class ZonesPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly communes = COMMUNES;

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = this.locale === 'nl' ? '/nl/zones' : '/zones';
      this.seo.apply({
        title:
          this.locale === 'nl'
            ? `Werkgebied — ${settings.brandName}`
            : `Zone d'intervention — ${settings.brandName}`,
        description:
          this.locale === 'nl'
            ? 'De 19 gemeenten van het Brussels Hoofdstedelijk Gewest waar we filmen, zonder extra verplaatsingskosten.'
            : "Les 19 communes de la Région de Bruxelles-Capitale où nous tournons, sans frais de déplacement supplémentaires.",
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: 'Accueil', path: this.locale === 'nl' ? '/nl' : '/' },
        { name: this.eyebrow(), path },
      ]);
      this.seo.applyHreflang({ fr: '/zones', nl: '/nl/zones' });
    });
  }

  protected eyebrow(): string {
    return this.locale === 'nl' ? 'Werkgebied' : "Zone d'intervention";
  }

  protected title(): string {
    return this.locale === 'nl' ? 'De 19 gemeenten van Brussel' : 'Les 19 communes de Bruxelles';
  }

  protected intro(): string {
    const brand = this.store.settings().brandName;
    return this.locale === 'nl'
      ? `${brand} filmt in de 19 gemeenten van het Brussels Hoofdstedelijk Gewest: huwelijk, bedrijfsvideo, sport, clip en lifestyle-content, zonder extra verplaatsingskosten.`
      : `${brand} tourne dans les 19 communes de la Région de Bruxelles-Capitale : mariage, vidéo d'entreprise, sport, clip et contenu lifestyle, sans frais de déplacement supplémentaires.`;
  }

  protected communeName(commune: CommuneInfo): string {
    return this.locale === 'nl' ? commune.nameNl : commune.nameFr;
  }

  protected communeHref(commune: CommuneInfo): string {
    const base = this.locale === 'nl' ? '/nl/zones' : '/zones';
    const slug = this.locale === 'nl' ? commune.slugNl : commune.slugFr;
    return `${base}/${slug}`;
  }
}
