import { Injectable, signal } from '@angular/core';
import { CategoryKey, SiteLocale, pick } from './locale';
import { PACK_LABELS, PACK_TYPES, PackType, VAT_LABELS, formatPrice, pricingFor } from './packs';
import { findRegion } from './regions';
import { travelZone } from './travel-zones';
import { CATEGORY_NAMES } from './site-content';

/**
 * Demande de devis par message pré-construit : le visiteur remplit un
 * formulaire court dans un popup, le site compose le message, et le
 * visiteur l'envoie lui-même sur WhatsApp ou par e-mail. Aucune donnée ne
 * transite par le serveur.
 */

export const CATEGORY_KEYS: readonly CategoryKey[] = ['evenementiel', 'mariage', 'corporate', 'sport', 'clip', 'lifestyle'];

/** Valeurs préremplies à l'ouverture, lues depuis le lien cliqué (`?categorie=…&formule=…&region=…`). */
export interface QuotePrefill {
  readonly category?: CategoryKey | null;
  readonly pack?: PackType | null;
  readonly region?: string | null;
}

export interface QuoteRequest {
  readonly name: string;
  /** Clé de catégorie, ou `null` pour « Autre ». */
  readonly category: CategoryKey | null;
  readonly pack: PackType | null;
  readonly region: string | null;
  readonly budget: string;
  readonly message: string;
}

/** Lit un préremplissage dans les paramètres d'une URL, en ignorant les valeurs inconnues. */
export function prefillFromParams(params: URLSearchParams | { get(name: string): string | null }): QuotePrefill {
  const category = params.get('categorie');
  const pack = params.get('formule');
  const region = params.get('region');
  return {
    category: CATEGORY_KEYS.includes(category as CategoryKey) ? (category as CategoryKey) : null,
    pack: PACK_TYPES.includes(pack as PackType) ? (pack as PackType) : null,
    region: region && findRegion(region) ? region : null,
  };
}

/** Prix de départ de la formule choisie, avec son régime de TVA : « 2 690 € TTC ». */
function packPrice(locale: SiteLocale, category: CategoryKey, pack: PackType): string | null {
  const pricing = pricingFor(category);
  const price = pricing.packs.find((p) => p.type === pack)?.price;
  return price ? `${formatPrice(price)} ${VAT_LABELS[pricing.vat][locale]}` : null;
}

/** Deux-points typographiques : espace avant en français seulement. */
function colon(locale: SiteLocale): string {
  return locale === 'fr' ? ' :' : ':';
}

/** Forfait de déplacement de la région, en clair. */
function travelText(locale: SiteLocale, regionKey: string): string | null {
  const region = findRegion(regionKey);
  if (!region) {
    return null;
  }
  const fee = travelZone(region.zone).fee;
  const value =
    fee === null
      ? pick(locale, { fr: 'sur devis', nl: 'op offerte', en: 'on quote' })
      : fee === 0
        ? pick(locale, { fr: 'inclus', nl: 'inbegrepen', en: 'included' })
        : formatPrice(fee);
  return `${region.name[locale]} (${pick(locale, { fr: 'déplacement', nl: 'verplaatsing', en: 'travel' })}${colon(locale)} ${value})`;
}

/** Compose le message envoyé au studio, dans la langue du visiteur. */
export function buildQuoteMessage(locale: SiteLocale, brand: string, request: QuoteRequest): string {
  const t = pick(locale, {
    fr: {
      hello: `Bonjour ${brand},`,
      intro: `Je m’appelle ${request.name} et je souhaite recevoir un devis.`,
      project: 'Projet',
      other: 'autre',
      pack: 'Formule',
      from: 'à partir de',
      region: 'Lieu',
      budget: 'Budget',
      undecided: 'à préciser',
      details: 'Détails',
      thanks: 'Merci !',
    },
    nl: {
      hello: `Hallo ${brand},`,
      intro: `Ik ben ${request.name} en ik had graag een offerte ontvangen.`,
      project: 'Project',
      other: 'ander',
      pack: 'Formule',
      from: 'vanaf',
      region: 'Locatie',
      budget: 'Budget',
      undecided: 'nog te bepalen',
      details: 'Details',
      thanks: 'Bedankt!',
    },
    en: {
      hello: `Hello ${brand},`,
      intro: `My name is ${request.name} and I would like a quote.`,
      project: 'Project',
      other: 'other',
      pack: 'Package',
      from: 'from',
      region: 'Location',
      budget: 'Budget',
      undecided: 'to be confirmed',
      details: 'Details',
      thanks: 'Thank you!',
    },
  });

  const c = colon(locale);
  const lines = [t.hello, '', t.intro, ''];
  lines.push(`• ${t.project}${c} ${request.category ? CATEGORY_NAMES[request.category][locale] : t.other}`);
  if (request.pack) {
    const price = request.category ? packPrice(locale, request.category, request.pack) : null;
    lines.push(`• ${t.pack}${c} ${PACK_LABELS[request.pack][locale]}${price ? ` (${t.from} ${price})` : ''}`);
  }
  lines.push(`• ${t.region}${c} ${(request.region && travelText(locale, request.region)) || t.undecided}`);
  lines.push(`• ${t.budget}${c} ${request.budget}`);
  const details = request.message.trim();
  if (details) {
    lines.push('', `${t.details}${c}`, details);
  }
  lines.push('', t.thanks);
  return lines.join('\n');
}

/** Lien `wa.me` qui ouvre WhatsApp avec le message prêt à envoyer. */
export function whatsappUrl(number: string, text: string): string {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

/** Lien `mailto:` avec l'objet et le corps du message. */
export function mailtoUrl(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** État du popup de devis, partagé par tous les boutons « Demander un devis » de la page. */
@Injectable({ providedIn: 'root' })
export class QuoteService {
  readonly isOpen = signal(false);
  readonly prefill = signal<QuotePrefill>({});

  open(prefill: QuotePrefill = {}): void {
    this.prefill.set(prefill);
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }
}
