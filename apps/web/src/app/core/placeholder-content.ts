import { Category, MediaAsset, SitePayload } from '../models';

/**
 * Contenu de démarrage. Il sert de repli si l'API est injoignable et de
 * référence pour le seed .NET (`SeedData.cs`). Les visuels sont des
 * emplacements 2.39:1 noirs portant le nom du fichier attendu : aucune image
 * de banque n'est utilisée, conformément à la section 5 du cahier des charges.
 */

function placeholderMedia(fileName: string, posterUrl: string, portrait = false): MediaAsset {
  return {
    id: `placeholder-${fileName.toLowerCase()}`,
    kind: 'Video',
    fileName,
    posterUrl,
    width: portrait ? 900 : 2390,
    height: portrait ? 1200 : 1000,
    durationSec: 0,
    sizeBytes: 0,
    processingStatus: 'Pending',
    renditions: [],
    createdAt: '1970-01-01T00:00:00Z',
  };
}

export const PLACEHOLDER_CATEGORIES: Category[] = [
  {
    id: 'placeholder-mariage',
    slug: 'mariage',
    name: 'Mariage',
    tagline: "Le film de votre journée, monté comme une scène de cinéma.",
    sortOrder: 1,
    filmCount: 0,
    isPublished: true,
    reel: placeholderMedia('MARIAGE_REEL.MP4', '/placeholders/mariage-reel.svg'),
    poster: null,
  },
  {
    id: 'placeholder-corporate',
    slug: 'corporate',
    name: 'Corporate',
    tagline: 'Films de marque, portraits de métiers et captations d’événements.',
    sortOrder: 2,
    filmCount: 0,
    isPublished: true,
    reel: placeholderMedia('CORPORATE_REEL.MP4', '/placeholders/corporate-reel.svg'),
    poster: null,
  },
  {
    id: 'placeholder-sport',
    slug: 'sport',
    name: 'Sport',
    tagline: 'Athlètes, clubs et compétitions filmés au rythme de l’effort.',
    sortOrder: 3,
    filmCount: 0,
    isPublished: true,
    reel: placeholderMedia('SPORT_REEL.MP4', '/placeholders/sport-reel.svg'),
    poster: null,
  },
  {
    id: 'placeholder-clip',
    slug: 'clip',
    name: 'Clip',
    tagline: 'Clips musicaux et formats courts à forte direction artistique.',
    sortOrder: 4,
    filmCount: 0,
    isPublished: true,
    reel: placeholderMedia('CLIP_REEL.MP4', '/placeholders/clip-reel.svg'),
    poster: null,
  },
  {
    id: 'placeholder-lifestyle',
    slug: 'lifestyle',
    name: 'Lifestyle',
    tagline: 'Vlogs, séries sociales et contenus de marque au quotidien.',
    sortOrder: 5,
    filmCount: 0,
    isPublished: true,
    reel: placeholderMedia('LIFESTYLE_REEL.MP4', '/placeholders/lifestyle-reel.svg'),
    poster: null,
  },
];

export const PLACEHOLDER_SITE: SitePayload = {
  settings: {
    brandName: 'Studio VNL',
    tagline: 'Vidéaste freelance — mariages, marques, sport et clips.',
    email: 'contact@studiovnl.fr',
    instagram: '@studiovnl',
    city: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    legalText: 'Studio VNL — micro-entreprise. Mentions légales à compléter.',
    showreel: placeholderMedia('SHOWREEL_2026.MP4', '/placeholders/showreel-2026.svg'),
  },
  services: [
    {
      id: 'placeholder-service-mariage',
      name: 'Mariage',
      included: ['Repérage', 'Captation cérémonie et soirée', 'Étalonnage', 'Musique sous licence'],
      duration: 'Journée complète',
      deliverables: 'Film 5–8 min + teaser 60 s',
      startingPrice: 'à partir de 1 400 €',
      sortOrder: 1,
    },
    {
      id: 'placeholder-service-corporate',
      name: 'Corporate',
      included: ['Script', 'Tournage', 'Interviews', 'Habillage graphique'],
      duration: '1 à 2 jours',
      deliverables: 'Film 2–3 min + formats réseaux',
      startingPrice: 'à partir de 1 800 €',
      sortOrder: 2,
    },
    {
      id: 'placeholder-service-sport',
      name: 'Sport & event',
      included: ['Captation multi-focale', 'Ralentis', 'Sound design'],
      duration: 'Demi-journée à 2 jours',
      deliverables: 'Aftermovie 2 min + 3 formats verticaux',
      startingPrice: 'à partir de 900 €',
      sortOrder: 3,
    },
    {
      id: 'placeholder-service-clip',
      name: 'Clip & lifestyle',
      included: ['Direction artistique', 'Tournage', 'Montage rythmique'],
      duration: '1 journée',
      deliverables: 'Clip complet + déclinaisons courtes',
      startingPrice: 'à partir de 1 200 €',
      sortOrder: 4,
    },
  ],
  process: [
    {
      id: 'placeholder-step-1',
      index: '01',
      title: 'Échange',
      body: 'On cadre l’intention, le budget et la date. Devis sous 48 h.',
      sortOrder: 1,
    },
    {
      id: 'placeholder-step-2',
      index: '02',
      title: 'Tournage',
      body: 'Repérage, plan de tournage, captation discrète et cadrée.',
      sortOrder: 2,
    },
    {
      id: 'placeholder-step-3',
      index: '03',
      title: 'Livraison',
      body: 'Montage, étalonnage, deux allers-retours puis livraison en ligne.',
      sortOrder: 3,
    },
  ],
  about: {
    portraitUrl: '/placeholders/portrait.svg',
    paragraphs: [
      'Studio VNL est un studio vidéo indépendant basé à Lyon.',
      'Je filme seul ou en équipe réduite, pour rester au plus près des gens.',
      'Le montage cherche le rythme d’un film, pas celui d’un résumé.',
      'Chaque projet part d’un échange, jamais d’un catalogue.',
    ],
  },
  testimonials: [
    {
      id: 'placeholder-testimonial-1',
      quote: 'Témoignage à compléter depuis le backoffice.',
      author: 'Client·e',
      role: 'Mariage',
      sortOrder: 1,
    },
    {
      id: 'placeholder-testimonial-2',
      quote: 'Témoignage à compléter depuis le backoffice.',
      author: 'Client·e',
      role: 'Corporate',
      sortOrder: 2,
    },
    {
      id: 'placeholder-testimonial-3',
      quote: 'Témoignage à compléter depuis le backoffice.',
      author: 'Client·e',
      role: 'Sport',
      sortOrder: 3,
    },
  ],
  logos: [],
};
