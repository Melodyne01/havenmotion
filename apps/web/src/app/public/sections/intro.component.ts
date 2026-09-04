import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/**
 * Présentation en toutes lettres, juste sous le hero : un premier visiteur
 * doit comprendre qui est le studio, ce qu'il couvre et comment se déroule
 * un projet sans avoir à faire défiler toute la page. Les trois paragraphes
 * ne réintroduisent aucun fait nouveau — ils reformulent en prose ce qui
 * est déjà réel et déjà affiché ailleurs (zone d'intervention, catégories
 * chargées depuis l'API, étapes du process, ligne "seul ou en équipe
 * réduite" de la page à propos), pour éviter tout mot-clé sans substance.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, RouterLink],
  template: `
    <section class="intro" aria-labelledby="titre-intro">
      <app-section-title [eyebrow]="text.intro.eyebrow" [title]="text.intro.title" titleId="titre-intro" />

      <p class="intro__line">
        {{ identityText() }}
        <a [routerLink]="zonesPath()">{{ text.intro.zonesLinkLabel }}</a>
      </p>
      <p class="intro__line">
        {{ categoriesTextBefore() }}<a href="#prestations">{{ text.intro.prestationsLinkLabel }}</a>.
      </p>
      <p class="intro__line">{{ processText() }}</p>
    </section>
  `,
  styleUrl: './intro.component.scss',
})
export class IntroComponent {
  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);
  protected readonly text = UI_TEXT[this.locale];
  private readonly categories = this.store.categories;

  protected identityText(): string {
    const brand = this.store.settings().brandName;
    return this.locale === 'nl'
      ? `Onafhankelijke videograaf gevestigd in Brussel, ${brand} filmt in het Frans en het Nederlands in de 19 gemeenten van het Brussels Hoofdstedelijk Gewest, en ook in Wemmel en de Vlaamse rand.`
      : `Vidéaste indépendant basé à Bruxelles, ${brand} tourne en français et en néerlandais dans les 19 communes de la Région de Bruxelles-Capitale, ainsi qu'à Wemmel et dans sa périphérie flamande.`;
  }

  protected categoriesTextBefore(): string {
    const list = this.categoriesList();
    return this.locale === 'nl'
      ? `De studio dekt vijf soorten projecten — ${list} — elk met een eigen opname- en montagetraject, verder uitgewerkt in `
      : `Le studio couvre cinq types de projets — ${list} — chacun avec son propre déroulé de tournage et de montage, détaillé dans `;
  }

  protected processText(): string {
    return this.locale === 'nl'
      ? "Elk project begint met een gesprek om de intentie, het budget en de datum te bepalen, met een concrete offerte binnen 48 u. Er wordt alleen of met een klein team gefilmd, om dicht bij de mensen te blijven, en de montage volgt twee rondes feedback vóór de levering online."
      : "Chaque projet démarre par un échange pour cadrer l'intention, le budget et la date, avec un devis chiffré sous 48 h. Le tournage se fait seul ou en équipe réduite, pour rester au plus près des gens, et le montage suit deux allers-retours avant la livraison en ligne.";
  }

  private categoriesList(): string {
    const names = this.categories().map((c) => c.name.toLowerCase());
    if (names.length === 0) {
      return '';
    }
    if (names.length === 1) {
      return names[0];
    }
    const last = names[names.length - 1];
    const rest = names.slice(0, -1).join(', ');
    const sep = this.locale === 'nl' ? ' en ' : ' et ';
    return `${rest}${sep}${last}`;
  }

  protected zonesPath(): string {
    return this.locale === 'nl' ? '/nl/zones' : '/zones';
  }
}
