import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

/**
 * FAQ statique : questions transactionnelles (tarif, délai, zone, droits)
 * répondues directement en 1-2 phrases, format pensé pour être repris tel
 * quel par un moteur de recherche ou une IA conversationnelle. Contenu géré
 * ici plutôt que depuis le backoffice pour l'instant — pas d'entité FAQ côté
 * API à ce stade. Traduit pour de vrai en NL (pas de lorem) : c'est
 * justement le contenu dont la valeur SEO/GEO dépend du fait qu'il soit
 * dans la bonne langue.
 */
const FAQ_ENTRIES_FR: readonly FaqEntry[] = [
  {
    question: 'Combien coûte un vidéaste à Bruxelles ?',
    answer:
      "Le tarif dépend du projet : comptez entre 900 € et 1 800 € selon la catégorie (mariage, corporate, sport, clip), la durée de tournage et le nombre de livrables. Un devis chiffré est envoyé sous 48 h après un premier échange.",
  },
  {
    question: 'Quel est le délai de livraison d’une vidéo ?',
    answer:
      "En moyenne 2 à 4 semaines après le tournage, selon la complexité du montage et la période de l'année. Le devis précise toujours une date de livraison ferme.",
  },
  {
    question: 'Quelle zone géographique est couverte ?',
    answer:
      'Bruxelles et les communes environnantes. Un déplacement plus loin en Belgique reste possible, à discuter selon le projet.',
  },
  {
    question: 'Comment se déroule une prestation, de la demande à la livraison ?',
    answer:
      'Trois étapes : un échange pour cadrer l’intention, le budget et la date ; le tournage, avec repérage si besoin ; puis le montage et l’étalonnage, livrés en ligne après un à deux allers-retours.',
  },
  {
    question: 'Qui détient les droits sur la vidéo finale ?',
    answer:
      'Le client reçoit un usage complet du film livré pour ses propres besoins (site, réseaux, diffusion interne). La musique utilisée est systématiquement sous licence pour éviter tout retrait sur les plateformes.',
  },
  {
    question: 'Le tournage se fait-il seul ou en équipe ?',
    answer:
      "Selon le projet : seul pour rester discret sur un mariage ou un tournage de marque léger, en équipe réduite dès que la prestation demande plusieurs angles de caméra (sport, événements avec plusieurs temps forts).",
  },
];

const FAQ_ENTRIES_NL: readonly FaqEntry[] = [
  {
    question: 'Hoeveel kost een videograaf in Brussel?',
    answer:
      'De prijs hangt af van het project: reken tussen € 900 en € 1 800 naargelang de categorie (huwelijk, zakelijk, sport, clip), de opnameduur en het aantal eindproducten. Een concrete offerte volgt binnen 48 u na een eerste gesprek.',
  },
  {
    question: 'Wat is de levertijd van een video?',
    answer:
      'Gemiddeld 2 tot 4 weken na de opname, afhankelijk van de complexiteit van de montage en het seizoen. De offerte vermeldt altijd een vaste leverdatum.',
  },
  {
    question: 'Welk gebied wordt gedekt?',
    answer: 'Brussel en de omliggende gemeenten. Verplaatsing verder in België is bespreekbaar per project.',
  },
  {
    question: 'Hoe verloopt een opdracht, van aanvraag tot levering?',
    answer:
      'Drie stappen: een gesprek om de intentie, het budget en de datum af te bakenen; de opname, met verkenning indien nodig; en tot slot de montage en kleurcorrectie, geleverd online na één à twee rondes feedback.',
  },
  {
    question: 'Wie heeft de rechten op de eindvideo?',
    answer:
      'De klant krijgt volledig gebruiksrecht op de geleverde film voor eigen doeleinden (website, sociale media, interne verspreiding). Gebruikte muziek is steeds in licentie, zodat platforms de video nooit kunnen blokkeren.',
  },
  {
    question: 'Wordt er alleen of met een team gefilmd?',
    answer:
      'Naargelang het project: alleen om discreet te blijven bij een huwelijk of een lichte merkopname, met een klein team zodra meerdere camerahoeken nodig zijn (sport, evenementen met meerdere hoogtepunten).',
  },
];

@Component({
  selector: 'app-faq-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, SectionTitleComponent],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu">
      <section class="faq-page">
        <app-section-title eyebrow="FAQ" [title]="faqTitle()" titleId="titre-faq" level="h1" />

        <dl class="faq-page__list">
          @for (entry of entries; track entry.question) {
            <div class="faq-page__item">
              <dt class="faq-page__question">{{ entry.question }}</dt>
              <dd class="faq-page__answer">{{ entry.answer }}</dd>
            </div>
          }
        </dl>
      </section>
    </main>

    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;

      .faq-page {
        padding: 32px $pad-x-mobile 64px;

        @include tablet-up {
          padding: 40px $pad-x-desktop 80px;
        }
      }

      .faq-page__list {
        display: grid;
        gap: 0;
        margin: 24px 0 0;
        border-top: $rule-width solid $color-rule-10;
      }

      .faq-page__item {
        padding: 20px 0;
        border-bottom: $rule-width solid $color-rule-10;
      }

      .faq-page__question {
        @include display-caps($fs-15, $ls-14, $weight-semibold);

        color: $color-film;
        margin: 0 0 8px;
      }

      .faq-page__answer {
        margin: 0;
        color: $color-muted-60;
        font-size: $fs-14;
        line-height: $lh-body;
      }
    `,
  ],
})
export class FaqPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly entries = this.locale === 'nl' ? FAQ_ENTRIES_NL : FAQ_ENTRIES_FR;
  protected readonly text = UI_TEXT[this.locale];

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = this.locale === 'nl' ? '/nl/faq' : '/faq';
      this.seo.apply({
        title: `FAQ — ${settings.brandName}`,
        description:
          this.locale === 'nl'
            ? 'Prijzen, levertijden, werkgebied: antwoorden op de meest gestelde vragen.'
            : 'Tarifs, délais, zone d’intervention : les réponses aux questions les plus fréquentes.',
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.locale === 'nl' ? '/nl' : '/' },
        { name: 'FAQ', path },
      ]);
      this.seo.applyFaq(this.entries);
      this.seo.applyHreflang({ fr: '/faq', nl: '/nl/faq' });
    });
  }

  protected faqTitle(): string {
    return this.locale === 'nl' ? 'Veelgestelde vragen' : 'Questions fréquentes';
  }
}
