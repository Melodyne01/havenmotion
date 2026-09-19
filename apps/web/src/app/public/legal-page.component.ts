import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteHeaderComponent } from './sections/site-header.component';
import { SiteFooterComponent } from './sections/site-footer.component';
import { SiteStore } from './site-store';
import { SeoService } from '../core/seo.service';
import { SITE_LOCALE } from '../core/locale';

interface LegalSection {
  title: string;
  body: string[];
}

/**
 * Mentions légales et politique de confidentialité (obligations RGPD).
 * Traduites en NL sur demande du client (texte juridique déjà validé en
 * FR, reformulé fidèlement — pas de nouveau contenu inventé). `settings`
 * porte déjà legalText/city/region par langue via SITE_CONTENT
 * (voir SiteStore.load), seul le texte fixe de cette page doit l'être ici.
 */
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
  private readonly locale = inject(SITE_LOCALE);

  private readonly routeData = toSignal(this.route.data, { initialValue: {} as { document?: string } });
  private readonly isConfidentialite = computed(() => this.routeData().document === 'confidentialite');

  protected readonly pageTitle = computed(() => {
    if (this.locale === 'nl') {
      return this.isConfidentialite() ? 'Privacybeleid' : 'Wettelijke vermeldingen';
    }
    return this.isConfidentialite() ? 'Politique de confidentialité' : 'Mentions légales';
  });

  protected readonly sections = computed<LegalSection[]>(() => {
    const settings = this.store.settings();

    if (this.isConfidentialite()) {
      if (this.locale === 'nl') {
        return [
          {
            title: 'Verzamelde gegevens',
            body: [
              `Het offerteformulier verzamelt uw naam, uw e-mailadres, het type project, de beoogde datum, een budgetvork en uw bericht.`,
              `Deze gegevens dienen uitsluitend om op uw aanvraag te antwoorden. Ze worden niet verkocht en niet doorgegeven aan een externe adverteerder.`,
            ],
          },
          {
            title: 'Bewaartermijn',
            body: [
              `Offerteaanvragen worden 24 maanden bewaard vanaf de laatste uitwisseling, en daarna automatisch verwijderd.`,
            ],
          },
          {
            title: 'Bezoekersstatistieken',
            body: [
              `Er wordt geen enkele tracker voor bezoekersstatistieken geplaatst zonder uw uitdrukkelijke toestemming. Een weigering heeft geen invloed op de navigatie.`,
            ],
          },
          {
            title: 'Uw rechten',
            body: [
              `U beschikt over een recht op inzage, rectificatie, verwijdering en bezwaar.`,
              `Om dit recht uit te oefenen, schrijft u naar ${settings.email}.`,
            ],
          },
        ];
      }
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

    if (this.locale === 'nl') {
      return [
        {
          title: 'Uitgever',
          body: [settings.legalText, `${settings.city} — ${settings.region}`, settings.email],
        },
        {
          title: 'Hosting',
          body: [`Hostingprovider te vermelden in het backoffice vóór de livegang.`],
        },
        {
          title: 'Intellectuele eigendom',
          body: [
            `De getoonde films, beelden en teksten zijn eigendom van ${settings.brandName} of hun rechthebbenden. Elk hergebruik zonder schriftelijke toestemming is verboden.`,
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
    this.store.load(this.locale);

    effect(() => {
      const isConfidentialite = this.isConfidentialite();
      const path = this.frPath(isConfidentialite);
      const nlPath = this.nlPath(isConfidentialite);
      const currentPath = this.locale === 'nl' ? nlPath : path;
      this.seo.apply({
        title: `${this.pageTitle()} — Heaven Motion`,
        description:
          this.locale === 'nl'
            ? `${this.pageTitle()} van de website Heaven Motion.`
            : `${this.pageTitle()} du site Heaven Motion.`,
        path: currentPath,
        locale: this.locale,
      });
      this.seo.applyHreflang({ fr: path, nl: nlPath });
    });
  }

  private frPath(isConfidentialite: boolean): string {
    return isConfidentialite ? '/confidentialite' : '/mentions-legales';
  }

  private nlPath(isConfidentialite: boolean): string {
    return isConfidentialite ? '/nl/privacybeleid' : '/nl/wettelijke-vermeldingen';
  }
}
