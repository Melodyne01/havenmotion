import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { APP_CONFIG } from './app-config';
import { Category, SiteSettings } from '../models';

export interface SeoInput {
  title: string;
  description: string;
  path: string;
  imagePath?: string;
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

  apply({ title, description, path, imagePath }: SeoInput): void {
    const url = `${this.origin}${path}`;
    const image = `${this.origin}${imagePath ?? '/placeholders/showreel-2026.svg'}`;

    this.titleService.setTitle(title);
    this.setTag('name', 'description', description);
    this.setTag('property', 'og:type', 'website');
    this.setTag('property', 'og:title', title);
    this.setTag('property', 'og:description', description);
    this.setTag('property', 'og:url', url);
    this.setTag('property', 'og:image', image);
    this.setTag('property', 'og:locale', 'fr_BE');
    this.setTag('name', 'twitter:card', 'summary_large_image');
    this.setTag('name', 'twitter:title', title);
    this.setTag('name', 'twitter:description', description);
    this.setTag('name', 'twitter:image', image);
    this.setCanonical(url);
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

    const payload = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    const id = 'vnl-jsonld';
    let script = this.document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = payload;
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
}
