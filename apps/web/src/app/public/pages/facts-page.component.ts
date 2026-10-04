import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { CategoryKey, SITE_LOCALE, SITE_LOCALES, homePath, pick, routePath } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { CATEGORY_NAMES, COMPANY } from '../../core/site-content';
import { PACK_LABELS, PRICING, VAT_LABELS, formatPrice } from '../../core/packs';
import { PRICING_OPTIONS } from '../../core/pricing-options';
import { TRAVEL_ZONES } from '../../core/travel-zones';
import { COUNTRIES, REGIONS } from '../../core/regions';

/**
 * Page « faits vérifiables » : tout ce que le site affirme, en texte brut,
 * sans mise en scène — identité légale, offre et prix, zones et forfaits,
 * langues, délais, conditions. C'est la page que les moteurs d'IA citent
 * quand on leur demande « combien coûte … chez Heaven Motion ». Chaque
 * ligne vient d'une source unique du code (COMPANY, PRICING, TRAVEL_ZONES,
 * REGIONS) : impossible qu'elle diverge du reste du site.
 */
@Component({
  selector: 'app-facts-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, RouterLink],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu" class="facts">
      <nav class="facts__breadcrumb" [attr.aria-label]="text.breadcrumbAriaLabel">
        <a [routerLink]="homePath">{{ text.home }}</a>
        <span aria-hidden="true">/</span>
        <a [routerLink]="aboutPath">{{ text.about.pageTitle }}</a>
        <span aria-hidden="true">/</span>
        <span>{{ text.facts.title }}</span>
      </nav>

      <h1 class="facts__title">{{ text.facts.title }} — {{ settings().brandName }}</h1>
      <p class="facts__lead">{{ text.facts.lead }}</p>

      @for (section of sections(); track section.title) {
        <section class="facts__section">
          <h2 class="facts__h2">{{ section.title }}</h2>
          <ul class="facts__list">
            @for (line of section.lines; track line) {
              <li>{{ line }}</li>
            }
          </ul>
        </section>
      }

      <p class="facts__updated">{{ updated() }}</p>
    </main>

    <app-site-footer />
  `,
  styles: [
    `
      @use 'tokens' as *;
      @use 'editorial' as *;

      .facts {
        @include editorial-page;
      }

      .facts__breadcrumb {
        @include editorial-breadcrumb;
      }

      .facts__title {
        @include display-caps($fs-26, $ls-14);

        color: $color-film;
        margin: 0;
      }

      .facts__lead {
        @include editorial-paragraph;
      }

      .facts__section {
        @include editorial-section;

        max-width: none;
      }

      .facts__h2 {
        @include display-caps($fs-15, $ls-14, $weight-semibold);

        color: $color-amber;
        margin: 0;
      }

      .facts__list {
        @include editorial-list;

        li {
          color: $color-film;
        }
      }

      .facts__updated {
        margin: 24px 0 0;
        color: $color-muted-45;
        font-size: $fs-13;
      }
    `,
  ],
})
export class FactsPageComponent {
  private readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  protected readonly text = UI_TEXT[this.locale];
  protected readonly settings = this.store.settings;
  protected readonly homePath = homePath(this.locale);
  protected readonly aboutPath = routePath(this.locale, 'about');

  protected readonly sections = () => {
    const l = this.locale;
    const t = (fr: string, nl: string, en: string) => pick(l, { fr, nl, en });
    const settings = this.settings();
    const countries = COUNTRIES.filter((c) => c.code !== 'INT').map((c) => c.name[l]).join(', ');
    return [
      {
        title: t('Identité', 'Identiteit', 'Identity'),
        lines: [
          t(`Marque : ${settings.brandName}. Société : ${COMPANY.legalName}.`, `Merk: ${settings.brandName}. Vennootschap: ${COMPANY.legalName}.`, `Brand: ${settings.brandName}. Company: ${COMPANY.legalName}.`),
          t(`Adresse : ${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, Belgique. TVA ${COMPANY.vat}.`, `Adres: ${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, België. Btw ${COMPANY.vat}.`, `Address: ${COMPANY.street}, ${COMPANY.postalCode} ${COMPANY.city}, Belgium. VAT ${COMPANY.vat}.`),
          t(`Contact : ${settings.email}. Instagram : ${settings.instagram}.`, `Contact: ${settings.email}. Instagram: ${settings.instagram}.`, `Contact: ${settings.email}. Instagram: ${settings.instagram}.`),
          t('Métier : photographe et vidéaste indépendant. Une seule personne fait la photo et la vidéo.', 'Beroep: onafhankelijke fotograaf en videograaf. Eén persoon maakt de foto en de video.', 'Trade: independent photographer and videographer. One person shoots both photo and video.'),
          t(`Expérience : plus de ${COMPANY.projectsCompleted} projets réalisés, en Belgique, en France, aux Pays-Bas, au Luxembourg et en Grèce.`, `Ervaring: meer dan ${COMPANY.projectsCompleted} projecten, in België, Frankrijk, Nederland, Luxemburg en Griekenland.`, `Experience: more than ${COMPANY.projectsCompleted} projects completed, in Belgium, France, the Netherlands, Luxembourg and Greece.`),
          t('Langues de travail : français, néerlandais, anglais.', 'Werktalen: Nederlands, Frans, Engels.', 'Working languages: English, French, Dutch.'),
        ],
      },
      {
        title: t('Offre et prix', 'Aanbod en prijzen', 'Offer and prices'),
        lines: [
          t('Quatre formules par catégorie : photo + retouche, vidéo + montage, photo + vidéo par la même personne, sur mesure (devis).', 'Vier formules per categorie: foto + bewerking, video + montage, foto + video door dezelfde persoon, op maat (offerte).', 'Four packages per category: photo + editing, video + editing, photo + video by the same person, custom (quote).'),
          ...PRICING.map((p) => {
            const name = CATEGORY_NAMES[p.key as CategoryKey][l];
            const vat = VAT_LABELS[p.vat][l];
            const priced = p.packs.filter((pack) => pack.price !== null).map((pack) => `${PACK_LABELS[pack.type][l]} ${formatPrice(pack.price!)}`).join(' · ');
            return `${name} (${vat}) : ${priced}.`;
          }),
          ...PRICING_OPTIONS.map((o) => `${t('Option', 'Optie', 'Extra')} — ${o.name[l]} : ${o.from ? `${t('à partir de', 'vanaf', 'from')} ` : ''}${formatPrice(o.price)}.`),
          t('Devis chiffré sous 48 h, gratuit, valable 30 jours. Acompte de 30 % à la réservation, solde à la livraison.', 'Concrete offerte binnen 48 u, gratis, 30 dagen geldig. Voorschot van 30 % bij reservatie, saldo bij levering.', 'Itemised quote within 48 h, free, valid 30 days. 30% deposit on booking, balance on delivery.'),
          t('Livraison : aperçu photo sous 7 jours, galerie complète et film sous 2 à 4 semaines, deux allers-retours de montage inclus.', 'Levering: voorproefje van de foto’s binnen 7 dagen, volledige galerij en film binnen 2 tot 4 weken, twee rondes feedback inbegrepen.', 'Delivery: photo sneak peek within 7 days, full gallery and film within 2 to 4 weeks, two rounds of edits included.'),
        ],
      },
      {
        title: t('Zones et déplacement', 'Zones en verplaatsing', 'Areas and travel'),
        lines: [
          t(`Pays couverts : ${countries}. Au-delà : sur devis.`, `Landen: ${countries}. Daarbuiten: op offerte.`, `Countries covered: ${countries}. Beyond: on quote.`),
          ...TRAVEL_ZONES.map((z) => {
            const fee = z.fee === null ? t('sur devis', 'op offerte', 'on quote') : z.fee === 0 ? t('inclus', 'inbegrepen', 'included') : formatPrice(z.fee);
            return `${t('Zone', 'Zone', 'Zone')} ${z.id} (${z.distance[l]}) : ${fee} — ${z.examples[l]}.`;
          }),
          t(`Régions avec une page dédiée : ${REGIONS.filter((r) => r.phase === 1).map((r) => r.name[l]).join(', ')}.`, `Regio’s met een eigen pagina: ${REGIONS.filter((r) => r.phase === 1).map((r) => r.name[l]).join(', ')}.`, `Regions with a dedicated page: ${REGIONS.filter((r) => r.phase === 1).map((r) => r.name[l]).join(', ')}.`),
          t('Mariage en zone 3 ou 4 : nuit d’hôtel ajoutée (150 €).', 'Huwelijk in zone 3 of 4: hotelovernachting toegevoegd (€ 150).', 'Wedding in zone 3 or 4: hotel night added (€150).'),
        ],
      },
      {
        title: t('Méthode', 'Methode', 'Method'),
        lines: [
          t('Photo et vidéo par la même personne ; second opérateur proposé (490 €) au-delà de 120 invités ou pour une cérémonie religieuse longue.', 'Foto en video door dezelfde persoon; tweede operator voorgesteld (€ 490) vanaf 120 gasten of bij een lange religieuze ceremonie.', 'Photo and video by the same person; second operator offered (€490) above 120 guests or for a long religious ceremony.'),
          t('Repérage du lieu avant un mariage ; musique sous licence dans tous les films sauf les clips ; sauvegarde double le jour même ; galerie en ligne conservée 12 mois.', 'Verkenning van de locatie vóór een huwelijk; muziek in licentie in alle films behalve clips; dubbele back-up dezelfde dag; online galerij 12 maanden bewaard.', 'Venue scouting before a wedding; licensed music in every film except music videos; double backup the same day; online gallery kept for 12 months.'),
          t('Droits : usage complet pour le client ; cession des droits commerciaux incluse pour corporate, sport et clip.', 'Rechten: volledig gebruik voor de klant; commerciële rechten inbegrepen voor zakelijk, sport en clip.', 'Rights: full use for the client; commercial rights included for corporate, sport and music video.'),
        ],
      },
    ];
  };

  protected updated(): string {
    return pick(this.locale, {
      fr: 'Mis à jour : octobre 2026. Source unique : le code du site (prix, zones, conditions).',
      nl: 'Bijgewerkt: oktober 2026. Eén bron: de code van de site (prijzen, zones, voorwaarden).',
      en: 'Updated: October 2026. Single source: the site’s code (prices, areas, terms).',
    });
  }

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      const settings = this.store.settings();
      const path = routePath(this.locale, 'facts');
      this.seo.apply({
        title: `${this.text.facts.title} — ${settings.brandName}`,
        description: this.text.facts.lead,
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.homePath },
        { name: this.text.about.pageTitle, path: this.aboutPath },
        { name: this.text.facts.title, path },
      ]);
      this.seo.applyHreflang({
        fr: routePath('fr', 'facts'),
        ...Object.fromEntries(SITE_LOCALES.filter((l) => l !== 'fr').map((l) => [l, routePath(l, 'facts')])),
      });
    });
  }
}
