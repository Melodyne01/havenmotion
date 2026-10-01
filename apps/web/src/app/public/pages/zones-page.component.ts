import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE, homePath, pick, routePath } from '../../core/locale';
import { BRUSSELS_COMMUNES, PERIPHERY_COMMUNES, CommuneInfo } from '../../core/communes';
import { UI_TEXT } from '../../core/ui-text';

/**
 * Page hub `/zones` : liste les 19 communes de la Région de
 * Bruxelles-Capitale, plus Wemmel et sa périphérie flamande, chacune avec sa
 * propre page locale. Sert de maillage interne entre la home et les pages
 * commune (silo SEO classique). Les deux groupes sont présentés à part :
 * Wemmel et ses voisines ne sont pas des communes bruxelloises, les
 * confondre dans une seule liste "communes de Bruxelles" serait inexact.
 */
@Component({
  selector: 'app-zones-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, SectionTitleComponent, RouterLink],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu">
      <section class="zones-page">
        <app-section-title [eyebrow]="eyebrow()" [title]="title()" titleId="titre-zones" level="h1" />
        <p class="zones-page__intro">{{ intro() }}</p>

        <h2 class="zones-page__group-title">{{ peripheryGroupTitle() }}</h2>
        <ul class="zones-page__list">
          @for (commune of peripheryCommunes; track commune.slugFr) {
            <li><a [routerLink]="communeHref(commune)">{{ communeName(commune) }}</a></li>
          }
        </ul>

        <h2 class="zones-page__group-title">{{ brusselsGroupTitle() }}</h2>
        <ul class="zones-page__list">
          @for (commune of brusselsCommunes; track commune.slugFr) {
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

      .zones-page__group-title {
        @include display-caps($fs-13, $ls-14, $weight-semibold);

        color: $color-amber;
        margin: 32px 0 0;
        padding-top: 16px;
        border-top: $rule-width solid $color-rule-10;
      }

      .zones-page__list {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px 24px;
        padding: 0;
        margin: 8px 0 0;
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

  protected readonly brusselsCommunes = BRUSSELS_COMMUNES;
  protected readonly peripheryCommunes = PERIPHERY_COMMUNES;
  protected readonly text = UI_TEXT[this.locale];

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = routePath(this.locale, 'zones');
      this.seo.apply({
        title: `${this.text.zones.eyebrow} — ${settings.brandName}`,
        description: pick(this.locale, {
          fr: "Les 19 communes de la Région de Bruxelles-Capitale, plus Wemmel et sa périphérie, où nous tournons sans frais de déplacement — et les forfaits pour la Belgique, la France, le Luxembourg et les Pays-Bas.",
          nl: 'De 19 gemeenten van het Brussels Hoofdstedelijk Gewest, plus Wemmel en de Vlaamse rand, waar we filmen zonder verplaatsingskosten — en de tarieven voor België, Frankrijk, Luxemburg en Nederland.',
          en: 'The 19 municipalities of the Brussels-Capital Region, plus Wemmel and its periphery, where we shoot with no travel fee — and the flat fees for Belgium, France, Luxembourg and the Netherlands.',
        }),
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: homePath(this.locale) },
        { name: this.eyebrow(), path },
      ]);
      // Pas encore de version anglaise de cette page (chantier 5).
      this.seo.applyHreflang({ fr: routePath('fr', 'zones'), nl: routePath('nl', 'zones') });
    });
  }

  protected eyebrow(): string {
    return this.text.zones.eyebrow;
  }

  protected title(): string {
    return this.text.zones.title;
  }

  protected intro(): string {
    const brand = this.store.settings().brandName;
    return pick(this.locale, {
      fr: `${brand} tourne dans les 19 communes de la Région de Bruxelles-Capitale, ainsi qu'à Wemmel et dans les communes environnantes de la périphérie flamande : mariage, vidéo d'entreprise, sport, clip et contenu lifestyle, sans frais de déplacement supplémentaires. Au-delà, un forfait fixe par zone couvre la Belgique, le nord de la France, le Luxembourg et les Pays-Bas.`,
      nl: `${brand} filmt in de 19 gemeenten van het Brussels Hoofdstedelijk Gewest, en ook in Wemmel en de omliggende gemeenten van de Vlaamse rand: huwelijk, bedrijfsvideo, sport, clip en lifestyle-content, zonder extra verplaatsingskosten. Daarbuiten dekt een vast tarief per zone België, Noord-Frankrijk, Luxemburg en Nederland.`,
      en: `${brand} shoots in the 19 municipalities of the Brussels-Capital Region, plus Wemmel and its surrounding municipalities: weddings, corporate video, sport, music videos and lifestyle content, with no extra travel fee. Beyond that, a flat fee per zone covers Belgium, northern France, Luxembourg and the Netherlands.`,
    });
  }

  protected brusselsGroupTitle(): string {
    return this.text.zones.brusselsGroup;
  }

  protected peripheryGroupTitle(): string {
    return this.text.zones.peripheryGroup;
  }

  protected communeName(commune: CommuneInfo): string {
    return this.locale === 'nl' ? commune.nameNl : commune.nameFr;
  }

  protected communeHref(commune: CommuneInfo): string {
    const slug = this.locale === 'nl' ? commune.slugNl : commune.slugFr;
    return `${routePath(this.locale, 'zones')}/${slug}`;
  }
}
