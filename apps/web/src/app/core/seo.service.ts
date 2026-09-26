import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_CONFIG } from './app-config';
import { CategoryKey, SITE_LOCALES, SiteLocale, categoryKeyFromSlug } from './locale';
import { Category, SiteSettings } from '../models';
import { CategoryPricing, PACK_LABELS, PRICING, pricingFor } from './packs';
import { COUNTRIES, REGIONS } from './regions';
import { CATEGORY_NAMES } from './site-content';

export interface SeoInput {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  /** Sert à `og:locale` (fr_BE / nl_BE / en_GB). Par défaut "fr". */
  locale?: SiteLocale;
}

/** Chemins d'une même page dans chaque langue où elle existe ; FR obligatoire. */
export type HreflangPaths = { fr: string } & Partial<Record<SiteLocale, string>>;

const OG_LOCALES: Readonly<Record<SiteLocale, string>> = { fr: 'fr_BE', nl: 'nl_BE', en: 'en_GB' };

/**
 * Métadonnées, OpenGraph et JSON-LD. Le rendu se fait pendant le SSR, ce qui
 * garantit que les robots reçoivent les balises sans exécuter de JavaScript.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly document = inject(DOCUMENT);
  private readonly origin = inject(APP_CONFIG).siteOrigin;

  apply({ title, description, path, imagePath, locale = 'fr' }: SeoInput): void {
    const url = `${this.origin}${path}`;
    // Recadrage 1200×630 (ratio standard des aperçus de lien) du vrai
    // showreel.jpg (2.39:1, cinémascope) : un format non standard se fait
    // recadrer différemment par chaque réseau, parfois en perdant le sujet.
    const image = `${this.origin}${imagePath ?? '/ambience/showreel-og.jpg'}`;

    this.titleService.setTitle(title);
    this.setTag('name', 'description', description);
    this.setTag('property', 'og:type', 'website');
    this.setTag('property', 'og:title', title);
    this.setTag('property', 'og:description', description);
    this.setTag('property', 'og:url', url);
    this.setTag('property', 'og:image', image);
    this.setTag('property', 'og:locale', OG_LOCALES[locale]);
    this.setTag('name', 'twitter:card', 'summary_large_image');
    this.setTag('name', 'twitter:title', title);
    this.setTag('name', 'twitter:description', description);
    this.setTag('name', 'twitter:image', image);
    this.setCanonical(url);
    this.document.documentElement.lang = locale;
  }

  /**
   * Balises `hreflang` reliant les versions d'une même page. Seules les
   * langues fournies sont déclarées : une page qui n'existe qu'en FR et NL
   * (pages commune) ne doit pas annoncer un `/en/…` inexistant. Le FR sert
   * de `x-default` : c'est le marché majoritaire et la version non
   * préfixée. Les balises des langues absentes sont retirées, pour qu'une
   * navigation côté client d'une page trilingue vers une page bilingue ne
   * laisse pas traîner un `hreflang="en"` périmé.
   */
  applyHreflang(paths: HreflangPaths): void {
    for (const locale of SITE_LOCALES) {
      const path = paths[locale];
      if (path) {
        this.setAlternate(locale, `${this.origin}${path}`);
      } else {
        this.removeAlternate(locale);
      }
    }
    this.setAlternate('x-default', `${this.origin}${paths.fr}`);
  }

  /**
   * Publie le bloc JSON-LD `LocalBusiness` + `VideoObject` du showreel.
   * `areaServed` liste les quatre pays et chaque région couverte (voir
   * `regions.ts`) : c'est ce qui dit aux moteurs que le studio travaille à
   * Lille ou à Luxembourg-Ville, pas seulement à Bruxelles. `priceRange`
   * est calculé depuis la grille tarifaire, jamais une fourchette inventée.
   */
  applyStructuredData(settings: SiteSettings, categories: Category[], locale: SiteLocale = 'fr'): void {
    const prices = PRICING.flatMap((p) => p.packs.flatMap((pack) => (pack.price === null ? [] : [pack.price])));
    const priceRange = `${Math.min(...prices)}-${Math.max(...prices)} EUR`;
    const graph: unknown[] = [
      {
        '@type': 'LocalBusiness',
        '@id': `${this.origin}/#studio`,
        name: settings.brandName,
        description: settings.tagline,
        image: `${this.origin}/ambience/showreel-og.jpg`,
        logo: `${this.origin}/icons/icon-512.png`,
        email: settings.email,
        url: this.origin,
        areaServed: [
          ...COUNTRIES.filter((c) => c.code !== 'INT').map((c) => ({ '@type': 'Country', name: c.name[locale] })),
          ...REGIONS.filter((r) => r.country !== 'INT').map((r) => ({
            '@type': 'AdministrativeArea',
            name: r.name[locale],
            containedInPlace: { '@type': 'Country', name: COUNTRIES.find((c) => c.code === r.country)?.name[locale] },
          })),
        ],
        knowsLanguage: ['fr', 'nl', 'en'],
        address: { '@type': 'PostalAddress', addressLocality: settings.city, addressCountry: 'BE' },
        priceRange,
        sameAs: settings.instagram
          ? [`https://instagram.com/${settings.instagram.replace('@', '')}`]
          : [],
      },
    ];

    if (settings.showreel) {
      graph.push({
        '@type': 'VideoObject',
        name: `${settings.brandName} — showreel`,
        description: settings.tagline,
        thumbnailUrl: this.absolute(settings.showreel.posterUrl),
        uploadDate: settings.showreel.createdAt,
        contentUrl: this.absolute(settings.showreel.renditions[0]?.url ?? null),
      });
    }

    for (const category of categories) {
      if (!category.reel) {
        continue;
      }
      graph.push({
        '@type': 'VideoObject',
        name: `${settings.brandName} — ${category.name}`,
        description: category.tagline,
        thumbnailUrl: this.absolute(category.reel.posterUrl),
        uploadDate: category.reel.createdAt,
        contentUrl: this.absolute(category.reel.renditions[0]?.url ?? null),
      });
    }

    this.writeJsonLd('vnl-jsonld', { '@context': 'https://schema.org', '@graph': graph });
  }

  /**
   * Publie le bloc JSON-LD `Service` d'une page catégorie, avec une `Offer`
   * par formule à prix affiché (photo, vidéo, photo + vidéo) et le régime de
   * TVA de chacune (`valueAddedTaxIncluded`). Le sur mesure n'a pas de
   * prix : il n'apparaît pas, plutôt qu'avec un montant inventé.
   */
  applyService(settings: SiteSettings, category: Category, locale: SiteLocale = 'fr'): void {
    const key = categoryKeyFromSlug(locale, category.slug);
    if (!key) {
      this.removeJsonLd('vnl-service');
      return;
    }
    const pricing = pricingFor(key);
    const graph = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: category.name,
      name: `${settings.brandName} — ${category.name}`,
      description: category.tagline,
      provider: { '@type': 'LocalBusiness', name: settings.brandName, '@id': `${this.origin}/#studio` },
      areaServed: COUNTRIES.filter((c) => c.code !== 'INT').map((c) => ({ '@type': 'Country', name: c.name[locale] })),
      offers: this.offersOf(pricing, locale),
    };
    this.writeJsonLd('vnl-service', graph);
  }

  /**
   * Publie le catalogue complet de la page tarifs : un `OfferCatalog` avec
   * une `Offer` par formule à prix affiché, sur les six catégories.
   */
  applyPricingCatalog(settings: SiteSettings, locale: SiteLocale): void {
    const graph = {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: `${settings.brandName} — ${{ fr: 'Tarifs', nl: 'Tarieven', en: 'Pricing' }[locale]}`,
      itemListElement: PRICING.map((pricing) => ({
        '@type': 'OfferCatalog',
        name: CATEGORY_NAMES[pricing.key][locale],
        itemListElement: this.offersOf(pricing, locale),
      })),
    };
    this.writeJsonLd('vnl-pricing', graph);
  }

  private offersOf(pricing: CategoryPricing, locale: SiteLocale): unknown[] {
    const name = CATEGORY_NAMES[pricing.key as CategoryKey][locale];
    return pricing.packs
      .filter((pack) => pack.price !== null)
      .map((pack) => ({
        '@type': 'Offer',
        name: `${name} — ${PACK_LABELS[pack.type][locale]}`,
        description: pack.deliverables[locale],
        priceCurrency: 'EUR',
        price: pack.price,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: pack.price,
          priceCurrency: 'EUR',
          valueAddedTaxIncluded: pricing.vat === 'ttc',
        },
        availability: 'https://schema.org/InStock',
        eligibleRegion: COUNTRIES.filter((c) => c.code !== 'INT').map((c) => c.code),
      }));
  }

  /**
   * Publie le bloc JSON-LD `Service` d'une page zone/commune : même forme
   * que `applyService`, mais `areaServed` pointe sur une `City` précise
   * (nom + code postal) plutôt que sur la région entière — c'est tout
   * l'intérêt local SEO de ces pages par rapport à la home. `serviceType`
   * dépend de la locale : servir du texte FR dans le JSON-LD d'une page NL
   * était une incohérence de langue aux yeux des moteurs de recherche.
   */
  applyAreaServed(
    settings: SiteSettings,
    communeName: string,
    postalCode: string,
    locale: SiteLocale = 'fr',
  ): void {
    const serviceType = {
      fr: 'Photographe et vidéaste événementiel et corporate',
      nl: 'Fotograaf en videograaf voor evenementen en bedrijven',
      en: 'Event and corporate photographer and videographer',
    }[locale];
    const graph = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType,
      name: `${settings.brandName} — ${communeName}`,
      provider: { '@type': 'LocalBusiness', name: settings.brandName, '@id': `${this.origin}/#studio` },
      areaServed: {
        '@type': 'City',
        name: communeName,
        address: { '@type': 'PostalAddress', postalCode, addressCountry: 'BE' },
      },
    };
    this.writeJsonLd('vnl-area', graph);
  }

  /** Publie le bloc JSON-LD `BreadcrumbList` de la page courante. */
  applyBreadcrumbs(items: readonly { name: string; path: string }[]): void {
    const graph = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.origin}${item.path}`,
      })),
    };
    this.writeJsonLd('vnl-breadcrumb', graph);
  }

  /** Publie le bloc JSON-LD `FAQPage` de la page courante. */
  applyFaq(items: readonly { question: string; answer: string }[]): void {
    const graph = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    };
    this.writeJsonLd('vnl-faq', graph);
  }

  private writeJsonLd(id: string, payload: unknown): void {
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);
  }

  private removeJsonLd(id: string): void {
    this.document.getElementById(id)?.remove();
  }

  private absolute(path: string | null): string | undefined {
    if (!path) {
      return undefined;
    }
    return path.startsWith('http') ? path : `${this.origin}${path}`;
  }

  private setTag(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content }, `${attr}='${key}'`);
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'canonical';
      this.document.head.appendChild(link);
    }
    link.href = url;
  }

  private setAlternate(hreflang: string, href: string): void {
    let link = this.document.querySelector<HTMLLinkElement>(
      `link[rel='alternate'][hreflang='${hreflang}']`,
    );
    if (!link) {
      link = this.document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflang;
      this.document.head.appendChild(link);
    }
    link.href = href;
  }

  private removeAlternate(hreflang: string): void {
    this.document.querySelector(`link[rel='alternate'][hreflang='${hreflang}']`)?.remove();
  }
}
