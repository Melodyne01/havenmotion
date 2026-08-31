import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteHeaderComponent } from './sections/site-header.component';
import { SiteFooterComponent } from './sections/site-footer.component';
import { SiteStore } from './site-store';
import { SeoService } from '../core/seo.service';

interface LegalSection {
  title: string;
  body: string[];
}

/** Mentions légales et politique de confidentialité (obligations RGPD). */
@Component({
  selector: 'app-legal-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent],
  template: `
    <app-site-header />
    <main class="legal" id="contenu">
      <h1 class="legal__title">{{ pageTitle() }}</h1>
      @for (section of sections(); track section.title) {
        <section class="legal__section">
          <h2 class="legal__heading">{{ section.title }}</h2>
          @for (paragraph of section.body; track paragraph) {
            <p class="legal__body">{{ paragraph }}</p>
          }
        </section>
      }
    </main>
    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;

      .legal {
        max-width: 78ch;
        margin: 0 auto;

        @include section-padding;
      }

      .legal__title {
        @include display-caps($fs-40, $ls-14);

        margin-bottom: 40px;
        color: $color-film;
      }

      .legal__section {
        padding-top: 28px;
        margin-top: 28px;
        border-top: $rule-width solid $color-rule-10;
      }

      .legal__heading {
        @include display-caps($fs-18, $ls-20, $weight-semibold);

        margin-bottom: 12px;
        color: $color-amber;
      }

      .legal__body {
        margin-bottom: 10px;
        color: $color-muted-60;
        font-size: $fs-15;
      }
    `,
  ],
})
export class LegalPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);

  private readonly routeData = toSignal(this.route.data, { initialValue: {} as { document?: string } });

  protected readonly pageTitle = computed(() =>
    this.routeData().document === 'confidentialite'
      ? 'Politique de confidentialité'
      : 'Mentions légales',
  );

  protected readonly sections = computed<LegalSection[]>(() => {
    const settings = this.store.settings();
    if (this.routeData().document === 'confidentialite') {
      return [
        {
          title: 'Données collectées',
          body: [
            `Le formulaire de devis collecte votre nom, votre e-mail, le type de projet, la date envisagée, une fourchette de budget et votre message.`,
            `Ces données servent uniquement à répondre à votre demande. Elles ne sont ni vendues ni transmises à un tiers publicitaire.`,
          ],
        },
        {
          title: 'Durée de conservation',
          body: [
            `Les demandes de devis sont conservées 24 mois à compter du dernier échange, puis supprimées automatiquement.`,
          ],
        },
        {
          title: 'Mesure d’audience',
          body: [
            `Aucun traceur de mesure d’audience n’est déposé sans votre accord explicite. Le refus n’altère pas la navigation.`,
          ],
        },
        {
          title: 'Vos droits',
          body: [
            `Vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition.`,
            `Pour l’exercer, écrivez à ${settings.email}.`,
          ],
        },
      ];
    }
    return [
      {
        title: 'Éditeur',
        body: [settings.legalText, `${settings.city} — ${settings.region}`, settings.email],
      },
      {
        title: 'Hébergement',
        body: [`Hébergeur à préciser dans le backoffice avant la mise en ligne.`],
      },
      {
        title: 'Propriété intellectuelle',
        body: [
          `Les films, images et textes présentés appartiennent à ${settings.brandName} ou à leurs ayants droit. Toute réutilisation sans accord écrit est interdite.`,
        ],
      },
    ];
  });

  constructor() {
    this.store.load();
    this.seo.apply({
      title: `${this.pageTitle()} — Heaven Motion`,
      description: `${this.pageTitle()} du site Heaven Motion.`,
      path: this.routeData().document === 'confidentialite' ? '/confidentialite' : '/mentions-legales',
    });
  }
}
