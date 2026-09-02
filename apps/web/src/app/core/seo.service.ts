import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_CONFIG } from './app-config';
import { SiteLocale } from './locale';
import { Category, ServiceCard, SiteSettings } from '../models';

export interface SeoInput {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
  /** Sert à `og:locale` (fr_BE / nl_BE). Par défaut "fr". */
  locale?: SiteLocale;
}

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
    const image = `${this.origin}${imagePath ?? '/placeholders/showreel-2026.svg'}`;

    this.titleService.setTitle(title);
    this.setTag('name', 'description', description);
    this.setTag('property', 'og:type', 'website');
    this.setTag('property', 'og:title', title);
    this.setTag('property', 'og:description', description);
    this.setTag('property', 'og:url', url);
    this.setTag('property', 'og:image', image);
    this.setTag('property', 'og:locale', locale === 'nl' ? 'nl_BE' : 'fr_BE');
    this.setTag('name', 'twitter:card', 'summary_large_image');
    this.setTag('name', 'twitter:title', title);
    this.setTag('name', 'twitter:description', description);
    this.setTag('name', 'twitter:image', image);
    this.setCanonical(url);
    this.document.documentElement.lang = locale;
  }

  /**
   * Balises `hreflang` reliant les deux versions d'une même page. `paths`
   * doit contenir le chemin FR et le chemin NL — l'appelant sait déjà lequel
   * est lequel (mapping de slugs pour les catégories, chemin fixe sinon).
   * Le FR sert de `x-default` : c'est le marché majoritaire et la version
   * non préfixée.
   */
  applyHreflang(paths: { fr: string; nl: string }): void {
    this.setAlternate('fr', `${this.origin}${paths.fr}`);
    this.setAlternate('nl', `${this.origin}${paths.nl}`);
    this.setAlternate('x-default', `${this.origin}${paths.fr}`);
  }

  /** Publie le bloc JSON-LD `LocalBusiness` + `VideoObject` du showreel. */
  applyStructuredData(settings: SiteSettings, categories: Category[]): void {
    const graph: unknown[] = [
      {
        '@type': 'LocalBusiness',
        '@id': `${this.origin}/#studio`,
        name: settings.brandName,
        description: settings.tagline,
        email: settings.email,
        url: this.origin,
        areaServed: settings.region,
        address: { '@type': 'PostalAddress', addressLocality: settings.city, addressCountry: 'BE' },
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
   * Publie le bloc JSON-LD `Service` d'une page catégorie, quand une fiche
   * tarifaire correspondante existe (elles ne sont pas nommées à l'identique
   * — "Sport & event" couvre la catégorie "Sport", "Clip & lifestyle" couvre
   * "Clip" et "Lifestyle" — d'où le rapprochement souple plutôt qu'une
   * correspondance exacte).
   */
  applyService(settings: SiteSettings, category: Category, services: readonly ServiceCard[]): void {
    const needle = category.name.toLowerCase();
    const match = services.find(
      (s) => s.name.toLowerCase().includes(needle) || needle.includes(s.name.toLowerCase()),
    );
    if (!match) {
      return;
    }
    const graph = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: category.name,
      name: `${settings.brandName} — ${category.name}`,
      description: category.tagline,
      provider: { '@type': 'LocalBusiness', name: settings.brandName, '@id': `${this.origin}/#studio` },
      areaServed: settings.region,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: this.extractPrice(match.startingPrice),
        description: match.startingPrice,
      },
    };
    this.writeJsonLd('vnl-service', graph);
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

  /**
   * "à partir de 1 400 €" → "1400". Les prix du site sont toujours des
   * montants entiers en euros avec un espace comme séparateur de milliers
   * (jamais de décimales) : ne garder que les chiffres suffit, pas besoin
   * de gérer virgule décimale ou autre devise.
   */
  private extractPrice(text: string): string | undefined {
    const digits = text.replace(/[^\d]/g, '');
    return digits || undefined;
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
}
