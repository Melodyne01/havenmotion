import { ProcessStep, ServiceCard, Testimonial } from '../models';
import { SiteLocale } from './locale';

export interface SiteContent {
  readonly tagline: string;
  readonly city: string;
  readonly region: string;
  readonly legalText: string;
  readonly aboutParagraphs: readonly string[];
  readonly services: readonly ServiceCard[];
  readonly process: readonly ProcessStep[];
  readonly testimonials: readonly Testimonial[];
}

/**
 * Contenu marketing par langue (accroche, à propos, mentions légales,
 * prestations, étapes, témoignages) : un dictionnaire statique plutôt qu'un
 * aller-retour API filtré par `locale`, sur demande explicite du client.
 *
 * Contrepartie assumée : ce contenu n'est plus éditable depuis le
 * backoffice pour ce qui concerne son AFFICHAGE public — les onglets FR/NL
 * de l'admin (Réglages, Prestations, Étapes, Témoignages) continuent
 * d'écrire en base côté NL, mais ces lignes ne sont plus lues par le site.
 * Modifier ce texte demande désormais un changement de code + déploiement.
 * `id`/`sortOrder` sont posés en dur (pas de génération dynamique) : ces
 * listes sont figées, elles ne sont plus créées ni réordonnées à l'exécution.
 */
export const SITE_CONTENT: Record<SiteLocale, SiteContent> = {
  fr: {
    tagline: 'Vidéaste freelance — mariages, marques, sport et clips.',
    city: 'Bruxelles',
    region: 'Bruxelles-Capitale',
    legalText: 'Heaven Motion — micro-entreprise. Mentions légales à compléter.',
    aboutParagraphs: [
      'Heaven Motion est un studio vidéo indépendant basé à Bruxelles.',
      'Je filme seul ou en équipe réduite, pour rester au plus près des gens.',
      'Le montage cherche le rythme d’un film, pas celui d’un résumé.',
      'Chaque projet part d’un échange, jamais d’un catalogue.',
    ],
    services: [
      {
        id: 'mariage',
        name: 'Mariage',
        included: ['Repérage', 'Captation cérémonie et soirée', 'Étalonnage', 'Musique sous licence'],
        duration: 'Journée complète',
        deliverables: 'Film 5–8 min + teaser 60 s',
        startingPrice: 'à partir de 1 400 €',
        sortOrder: 1,
      },
      {
        id: 'corporate',
        name: 'Corporate',
        included: ['Script', 'Tournage', 'Interviews', 'Habillage graphique'],
        duration: '1 à 2 jours',
        deliverables: 'Film 2–3 min + formats réseaux',
        startingPrice: 'à partir de 1 800 €',
        sortOrder: 2,
      },
      {
        id: 'sport-event',
        name: 'Sport & event',
        included: ['Captation multi-focale', 'Ralentis', 'Sound design'],
        duration: 'Demi-journée à 2 jours',
        deliverables: 'Aftermovie 2 min + 3 formats verticaux',
        startingPrice: 'à partir de 900 €',
        sortOrder: 3,
      },
      {
        id: 'clip-lifestyle',
        name: 'Clip & lifestyle',
        included: ['Direction artistique', 'Tournage', 'Montage rythmique'],
        duration: '1 journée',
        deliverables: 'Clip complet + déclinaisons courtes',
        startingPrice: 'à partir de 1 200 €',
        sortOrder: 4,
      },
    ],
    process: [
      { id: 'echange', index: '01', title: 'Échange', body: 'On cadre l’intention, le budget et la date. Devis sous 48 h.', sortOrder: 1 },
      { id: 'tournage', index: '02', title: 'Tournage', body: 'Repérage, plan de tournage, captation discrète et cadrée.', sortOrder: 2 },
      { id: 'livraison', index: '03', title: 'Livraison', body: 'Montage, étalonnage, deux allers-retours puis livraison en ligne.', sortOrder: 3 },
    ],
    testimonials: [
      { id: 'temoin-mariage', quote: 'Témoignage à compléter depuis le backoffice.', author: 'Client·e', role: 'Mariage', sortOrder: 1 },
      { id: 'temoin-corporate', quote: 'Témoignage à compléter depuis le backoffice.', author: 'Client·e', role: 'Corporate', sortOrder: 2 },
      { id: 'temoin-sport', quote: 'Témoignage à compléter depuis le backoffice.', author: 'Client·e', role: 'Sport', sortOrder: 3 },
    ],
  },
  nl: {
    tagline: 'Freelance videograaf — huwelijken, merken, sport en clips.',
    city: 'Brussel',
    region: 'Brussels Hoofdstedelijk Gewest',
    legalText: 'Heaven Motion — eenmanszaak. Wettelijke vermeldingen aan te vullen.',
    aboutParagraphs: [
      'Heaven Motion is een onafhankelijke videostudio gevestigd in Brussel.',
      'Ik film alleen of met een klein team, om dicht bij de mensen te blijven.',
      'De montage zoekt het ritme van een film, niet dat van een samenvatting.',
      'Elk project vertrekt van een gesprek, nooit van een catalogus.',
    ],
    services: [
      {
        id: 'huwelijk',
        name: 'Huwelijk',
        included: ['Verkenning', 'Opname ceremonie en feest', 'Kleurcorrectie', 'Muziek in licentie'],
        duration: 'Volledige dag',
        deliverables: 'Film 5–8 min + teaser 60 s',
        startingPrice: 'vanaf € 1 400',
        sortOrder: 1,
      },
      {
        id: 'zakelijk',
        name: 'Zakelijk',
        included: ['Script', 'Opname', 'Interviews', 'Grafische opmaak'],
        duration: '1 tot 2 dagen',
        deliverables: 'Film 2–3 min + formaten voor sociale media',
        startingPrice: 'vanaf € 1 800',
        sortOrder: 2,
      },
      {
        id: 'sport-event',
        name: 'Sport & event',
        included: ['Opname vanuit meerdere hoeken', 'Slow motion', 'Sound design'],
        duration: 'Halve dag tot 2 dagen',
        deliverables: 'Aftermovie 2 min + 3 verticale formaten',
        startingPrice: 'vanaf € 900',
        sortOrder: 3,
      },
      {
        id: 'clip-lifestyle',
        name: 'Clip & lifestyle',
        included: ['Artistieke leiding', 'Opname', 'Ritmische montage'],
        duration: '1 dag',
        deliverables: 'Volledige clip + korte varianten',
        startingPrice: 'vanaf € 1 200',
        sortOrder: 4,
      },
    ],
    process: [
      { id: 'echange', index: '01', title: 'Gesprek', body: 'We bepalen de intentie, het budget en de datum. Offerte binnen 48 u.', sortOrder: 1 },
      { id: 'tournage', index: '02', title: 'Opname', body: 'Verkenning, opnameplan, discrete en gerichte captatie.', sortOrder: 2 },
      { id: 'livraison', index: '03', title: 'Levering', body: 'Montage, kleurcorrectie, twee rondes feedback en levering online.', sortOrder: 3 },
    ],
    testimonials: [
      { id: 'temoin-mariage', quote: 'Getuigenis aan te vullen vanuit het backoffice.', author: 'Klant', role: 'Huwelijk', sortOrder: 1 },
      { id: 'temoin-corporate', quote: 'Getuigenis aan te vullen vanuit het backoffice.', author: 'Klant', role: 'Zakelijk', sortOrder: 2 },
      { id: 'temoin-sport', quote: 'Getuigenis aan te vullen vanuit het backoffice.', author: 'Klant', role: 'Sport', sortOrder: 3 },
    ],
  },
};
