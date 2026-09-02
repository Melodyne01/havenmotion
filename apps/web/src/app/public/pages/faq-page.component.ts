import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SectionTitleComponent } from '../../shared/ui/section-title.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';

interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

/**
 * FAQ statique : questions transactionnelles (tarif, délai, zone, droits)
 * répondues directement en 1-2 phrases, format pensé pour être repris tel
 * quel par un moteur de recherche ou une IA conversationnelle. Contenu géré
 * ici plutôt que depuis le backoffice pour l'instant — pas d'entité FAQ côté
 * API à ce stade.
 */
const FAQ_ENTRIES: readonly FaqEntry[] = [
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

@Component({
  selector: 'app-faq-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, SectionTitleComponent],
  template: `
    <a class="skip-link" href="#contenu">Aller au contenu</a>
    <app-site-header />

    <main id="contenu">
      <section class="faq-page">
        <app-section-title eyebrow="FAQ" title="Questions fréquentes" titleId="titre-faq" />

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

  protected readonly entries = FAQ_ENTRIES;

  constructor() {
    this.store.load();

    effect(() => {
      const settings = this.store.settings();
      this.seo.apply({
        title: `FAQ — ${settings.brandName}`,
        description: 'Tarifs, délais, zone d’intervention : les réponses aux questions les plus fréquentes.',
        path: '/faq',
      });
      this.seo.applyBreadcrumbs([
        { name: 'Accueil', path: '/' },
        { name: 'FAQ', path: '/faq' },
      ]);
      this.seo.applyFaq(FAQ_ENTRIES);
    });
  }
}
