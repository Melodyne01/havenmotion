import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SITE_LOCALE, pick, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/**
 * Présentation en toutes lettres, juste sous le hero : un premier visiteur
 * doit comprendre qui est le studio, ce qu'il couvre et comment se déroule
 * un projet sans avoir à faire défiler toute la page. Les paragraphes ne
 * réintroduisent aucun fait nouveau — ils reformulent en prose ce qui est
 * déjà réel et déjà affiché ailleurs (zones et forfaits de déplacement,
 * catégories chargées depuis l'API, formules, étapes du process), pour
 * éviter tout mot-clé sans substance. Le studio se présente comme basé à
 * Bruxelles et travaillant en Belgique, dans le nord de la France, au
 * Luxembourg et aux Pays-Bas — c'est le positionnement de la stratégie par
 * régions — et plus loin sur demande.
 */
@Component({
  selector: 'app-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionTitleComponent, RouterLink],
  template: `
    <section class="intro" aria-labelledby="titre-intro">
      <app-section-title [eyebrow]="text.intro.eyebrow" [title]="text.intro.title" titleId="titre-intro" />
      <p class="intro__line">{{ openingText() }}</p>
      <p class="intro__line">{{ anyProjectText() }}</p>
      <p class="intro__line">{{ feelAgainText() }}</p>
      <p class="intro__line">{{ onePersonText() }}</p>
      <p class="intro__line">
        {{ zonesText() }}
        @if (zonesPath) {
          <a [routerLink]="zonesPath">{{ text.intro.zonesLinkLabel }}</a>
        }
      </p>
      <p class="intro__line">{{ visionCallText() }}</p>
      <p class="intro__line">
        {{ categoriesTextBefore() }}<a [routerLink]="pricingPath">{{ text.intro.prestationsLinkLabel }}</a>.
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

  /** Les pages zones n'existent pas encore en anglais (chantier 5). */
  protected readonly zonesPath = this.locale === 'en' ? null : routePath(this.locale, 'zones');
  protected readonly pricingPath = routePath(this.locale, 'pricing');

  protected openingText(): string {
    const brand = this.store.settings().brandName;
    return pick(this.locale, {
      fr: `Chez ${brand}, nous créons des images qui racontent ce que vous vivez. Vidéo, photographie ou les deux, nous cherchons à capturer bien plus qu'un simple instant : une émotion, une ambiance, un regard, une énergie, tous ces détails qui rendent un moment unique.`,
      nl: `Bij ${brand} creëren we beelden die vertellen wat u beleeft. Video, fotografie of allebei, we willen veel meer vastleggen dan een eenvoudig moment: een emotie, een sfeer, een blik, een energie — al die details die een moment uniek maken.`,
      en: `At ${brand}, we create images that tell what you are living. Video, photography or both, we look for much more than a simple moment: an emotion, an atmosphere, a look, an energy — all the details that make a moment unique.`,
    });
  }

  protected anyProjectText(): string {
    return pick(this.locale, {
      fr: 'Un événement, un mariage, une soirée, un anniversaire, un restaurant, un projet professionnel, un voyage, une marque, ou simplement une histoire que vous souhaitez raconter… peu importe le projet, chacun a quelque chose à montrer et mérite de belles images.',
      nl: 'Een evenement, een huwelijk, een feestje, een verjaardag, een restaurant, een professioneel project, een reis, een merk, of gewoon een verhaal dat u wilt vertellen… welk project het ook is, elk verhaal heeft iets te tonen en verdient mooie beelden.',
      en: 'An event, a wedding, a party, a birthday, a restaurant, a professional project, a trip, a brand, or simply a story you want to tell… whatever the project, everyone has something to show and deserves beautiful images.',
    });
  }

  protected feelAgainText(): string {
    return pick(this.locale, {
      fr: "Parce qu'une image ne sert pas seulement à montrer ce qui s'est passé. Elle permet de le ressentir à nouveau.",
      nl: 'Een beeld dient niet alleen om te tonen wat er gebeurd is. Het laat toe om het opnieuw te voelen.',
      en: 'Because an image is not only there to show what happened. It lets you feel it again.',
    });
  }

  protected onePersonText(): string {
    return pick(this.locale, {
      fr: 'La photo et la vidéo sont faites par la même personne : un seul style, un seul interlocuteur, moins de monde autour de vous le jour J — et un prix combiné inférieur à deux prestataires séparés.',
      nl: 'Foto en video worden door dezelfde persoon gemaakt: één stijl, één aanspreekpunt, minder volk rond u op de grote dag — en een gecombineerde prijs die lager ligt dan twee aparte leveranciers.',
      en: 'Photo and video are made by the same person: one style, one point of contact, fewer people around you on the day — and a combined price lower than two separate suppliers.',
    });
  }

  protected zonesText(): string {
    const brand = this.store.settings().brandName;
    return pick(this.locale, {
      fr: `Basé à Bruxelles, ${brand} travaille en français, en néerlandais et en anglais, en Belgique, dans le nord de la France jusqu'à Paris, au Luxembourg et aux Pays-Bas, avec un forfait de déplacement fixe par zone — et plus loin encore là où vos histoires nous emmènent.`,
      nl: `Gevestigd in Brussel werkt ${brand} in het Nederlands, het Frans en het Engels, in België, in Noord-Frankrijk tot Parijs, in Luxemburg en in Nederland, met een vast verplaatsingstarief per zone — en nog verder, overal waar uw verhalen ons brengen.`,
      en: `Based in Brussels, ${brand} works in English, French and Dutch, across Belgium, northern France up to Paris, Luxembourg and the Netherlands, with a flat travel fee per zone — and further still, wherever your stories take us.`,
    });
  }

  protected visionCallText(): string {
    return pick(this.locale, {
      fr: 'Chaque projet commence par un échange pour comprendre votre vision, vos envies et ce que vous souhaitez transmettre.',
      nl: 'Elk project begint met een gesprek om uw visie, uw wensen en wat u wilt overbrengen te begrijpen.',
      en: 'Every project starts with a conversation to understand your vision, your wishes and what you want to convey.',
    });
  }

  protected categoriesTextBefore(): string {
    const brand = this.store.settings().brandName;
    const list = this.categoriesList();
    const count = this.categoryCountWord();
    return pick(this.locale, {
      fr: `${brand} couvre ${count} types de projets — ${list} — chacun avec ses formules photo, vidéo ou photo + vidéo, détaillées dans `,
      nl: `${brand} dekt ${count} soorten projecten — ${list} — elk met formules foto, video of foto + video, verder uitgewerkt in `,
      en: `${brand} covers ${count} types of projects — ${list} — each with photo, video or photo + video packages, detailed in `,
    });
  }

  protected processText(): string {
    return pick(this.locale, {
      fr: "Chaque projet démarre par un échange pour cadrer l'intention, le budget et la date, avec un devis chiffré sous 48 h. Le montage suit deux allers-retours avant la livraison en ligne.",
      nl: 'Elk project begint met een gesprek om de intentie, het budget en de datum te bepalen, met een concrete offerte binnen 48 u. De montage volgt twee rondes feedback vóór de levering online.',
      en: 'Every project starts with a conversation to frame the intent, the budget and the date, with an itemised quote within 48 h. The edit goes through two rounds of feedback before online delivery.',
    });
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
    const sep = pick(this.locale, { fr: ' et ', nl: ' en ', en: ' and ' });
    return `${rest}${sep}${last}`;
  }

  /**
   * Évite de coder "six" en dur : le nombre de catégories vient de l'API
   * (store.categories()) et changera dès qu'une catégorie sera ajoutée ou
   * retirée depuis le backoffice — cette phrase doit rester exacte sans
   * qu'on ait à y repenser à ce moment-là.
   */
  private categoryCountWord(): string {
    const count = this.categories().length;
    const words = pick(this.locale, {
      fr: ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'],
      nl: ['nul', 'één', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien'],
      en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
    });
    return words[count] ?? String(count);
  }
}
