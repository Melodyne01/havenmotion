import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteHeaderComponent } from './sections/site-header.component';
import { SiteFooterComponent } from './sections/site-footer.component';
import { SiteStore } from './site-store';
import { SeoService } from '../core/seo.service';
import { RouteKey, SITE_LOCALE, SITE_LOCALES, pick, routePath } from '../core/locale';
import { COMPANY } from '../core/site-content';

interface LegalSection {
  title: string;
  body: string[];
}

/**
 * Mentions légales et politique de confidentialité (obligations RGPD).
 * Traduites en NL puis en EN (texte juridique déjà validé en FR, reformulé
 * fidèlement — pas de nouveau contenu inventé). `settings` porte déjà
 * legalText/city/region par langue via SITE_CONTENT (voir SiteStore.load),
 * seul le texte fixe de cette page doit l'être ici.
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
      @use 'editorial' as *;

      .legal {
        max-width: 78ch;
        margin: 0 auto;

        @include section-padding;

        @include laptop-up {
          max-width: $content-max;
        }
      }

      .legal__title {
        @include display-caps($fs-40, $ls-14);

        margin-bottom: 40px;
        color: $color-film;
      }

      .legal__section {
        display: grid;
        gap: 8px;

        @include editorial-split(8px, false);

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
  private readonly routeKey = computed<RouteKey>(() => (this.isConfidentialite() ? 'privacy' : 'legal'));

  protected readonly pageTitle = computed(() =>
    this.isConfidentialite()
      ? pick(this.locale, { fr: 'Politique de confidentialité', nl: 'Privacybeleid', en: 'Privacy policy' })
      : pick(this.locale, { fr: 'Mentions légales', nl: 'Wettelijke vermeldingen', en: 'Legal notice' }),
  );

  protected readonly sections = computed<LegalSection[]>(() => {
    const settings = this.store.settings();

    if (this.isConfidentialite()) {
      return pick<LegalSection[]>(this.locale, {
        fr: [
          {
            title: 'Données collectées',
            body: [
              'Le formulaire de devis collecte votre nom, votre e-mail, le type de projet, la formule et la région envisagées, la date, une fourchette de budget et votre message.',
              'Ces données servent uniquement à répondre à votre demande. Elles ne sont ni vendues ni transmises à un tiers publicitaire.',
            ],
          },
          {
            title: 'Durée de conservation',
            body: ['Les demandes de devis sont conservées 24 mois à compter du dernier échange, puis supprimées automatiquement.'],
          },
          {
            title: 'Mesure d’audience',
            body: [
              'Le site mesure son audience avec Umami, un outil de mesure d’audience qui ne dépose aucun cookie et anonymise l’adresse IP. Il compte les pages vues et quelques actions (ouverture du formulaire de devis, étapes franchies, choix d’envoyer par WhatsApp ou par e-mail, lecture d’un film, profondeur de lecture), sans jamais enregistrer votre nom, votre message ni aucune donnée qui vous identifie.',
              'Cette mesure, exemptée de consentement, sert uniquement à améliorer le site. Aucun autre traceur, publicitaire ou de réseau social, n’est utilisé.',
            ],
          },
          {
            title: 'Vos droits',
            body: [
              'Vous disposez d’un droit d’accès, de rectification, d’effacement et d’opposition.',
              `Pour l’exercer, écrivez à ${settings.email}.`,
            ],
          },
        ],
        nl: [
          {
            title: 'Verzamelde gegevens',
            body: [
              'Het offerteformulier verzamelt uw naam, uw e-mailadres, het type project, de gewenste formule en regio, de datum, een budgetvork en uw bericht.',
              'Deze gegevens dienen uitsluitend om op uw aanvraag te antwoorden. Ze worden niet verkocht en niet doorgegeven aan een externe adverteerder.',
            ],
          },
          {
            title: 'Bewaartermijn',
            body: ['Offerteaanvragen worden 24 maanden bewaard vanaf de laatste uitwisseling, en daarna automatisch verwijderd.'],
          },
          {
            title: 'Bezoekersstatistieken',
            body: [
              'De site meet zijn bezoekers met Umami, een meetinstrument voor bezoekers dat geen cookies plaatst en het IP-adres anonimiseert. Het telt de bekeken pagina’s en enkele acties (openen van het offerteformulier, doorlopen stappen, keuze om via WhatsApp of e-mail te versturen, afspelen van een film, leesdiepte), zonder ooit uw naam, uw bericht of gegevens die u identificeren op te slaan.',
              'Deze meting, vrijgesteld van toestemming, dient enkel om de site te verbeteren. Er wordt geen andere tracker gebruikt, ook geen advertentie- of socialemediatracker.',
            ],
          },
          {
            title: 'Uw rechten',
            body: [
              'U beschikt over een recht op inzage, rectificatie, verwijdering en bezwaar.',
              `Om dit recht uit te oefenen, schrijft u naar ${settings.email}.`,
            ],
          },
        ],
        en: [
          {
            title: 'Data collected',
            body: [
              'The quote form collects your name, your email, the type of project, the package and region you have in mind, the date, a budget range and your message.',
              'This data is used only to answer your request. It is neither sold nor passed on to any advertising third party.',
            ],
          },
          {
            title: 'Retention period',
            body: ['Quote requests are kept for 24 months from the last exchange, then deleted automatically.'],
          },
          {
            title: 'Analytics',
            body: [
              'The site measures its audience with Umami, an audience measurement tool that sets no cookies and anonymises IP addresses. It counts page views and a few actions (opening the quote form, steps completed, choosing to send by WhatsApp or email, playing a film, reading depth), without ever recording your name, your message or any data that identifies you.',
              'This measurement, exempt from consent, is used only to improve the site. No other tracker, advertising or social media, is used.',
            ],
          },
          {
            title: 'Your rights',
            body: [
              'You have the right to access, rectify, erase and object.',
              `To exercise it, write to ${settings.email}.`,
            ],
          },
        ],
      });
    }

    return pick<LegalSection[]>(this.locale, {
      fr: [
        { title: 'Éditeur', body: [COMPANY.legalName, `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, Belgique`, `TVA ${COMPANY.vat}`, settings.email] },
        { title: 'Hébergement', body: ['Hébergeur à préciser dans le backoffice avant la mise en ligne.'] },
        {
          title: 'Propriété intellectuelle',
          body: [`Les films, images et textes présentés appartiennent à ${settings.brandName} ou à leurs ayants droit. Toute réutilisation sans accord écrit est interdite.`],
        },
      ],
      nl: [
        { title: 'Uitgever', body: [COMPANY.legalName, `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, België`, `Btw ${COMPANY.vat}`, settings.email] },
        { title: 'Hosting', body: ['Hostingprovider te vermelden in het backoffice vóór de livegang.'] },
        {
          title: 'Intellectuele eigendom',
          body: [`De getoonde films, beelden en teksten zijn eigendom van ${settings.brandName} of hun rechthebbenden. Elk hergebruik zonder schriftelijke toestemming is verboden.`],
        },
      ],
      en: [
        { title: 'Publisher', body: [COMPANY.legalName, `${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, Belgium`, `VAT ${COMPANY.vat}`, settings.email] },
        { title: 'Hosting', body: ['Hosting provider to be specified in the back office before going live.'] },
        {
          title: 'Intellectual property',
          body: [`The films, images and texts shown belong to ${settings.brandName} or their rights holders. Any reuse without written consent is prohibited.`],
        },
      ],
    });
  });

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const key = this.routeKey();
      this.seo.apply({
        title: `${this.pageTitle()} — Heaven Motion`,
        description: pick(this.locale, {
          fr: `${this.pageTitle()} du site Heaven Motion.`,
          nl: `${this.pageTitle()} van de website Heaven Motion.`,
          en: `${this.pageTitle()} of the Heaven Motion website.`,
        }),
        path: routePath(this.locale, key),
        locale: this.locale,
      });
      this.seo.applyHreflang({
        fr: routePath('fr', key),
        ...Object.fromEntries(SITE_LOCALES.filter((l) => l !== 'fr').map((l) => [l, routePath(l, key)])),
      });
    });
  }
}
