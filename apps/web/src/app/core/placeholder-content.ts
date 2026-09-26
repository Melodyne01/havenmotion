import { Category, Film, SitePayload } from '../models';
import { AMBIENCE_CLIPS, ambienceMedia } from './ambience';
import { CategoryKey, SiteLocale, categoryKeyFromSlug, categorySlug } from './locale';
import { CATEGORY_NAMES, CATEGORY_TAGLINES, SITE_CONTENT } from './site-content';

/**
 * Contenu de démarrage. Il sert de repli si l'API est injoignable et de
 * référence pour le seed .NET (`SeedData.cs`).
 *
 * En attendant les vraies vidéos du studio, les bandes et le showreel portent
 * des boucles d'ambiance fabriquées pour le site (`ambience.ts`), servies
 * depuis `public/ambience/`.
 */

export const PLACEHOLDER_CATEGORIES: Category[] = [
  {
    id: 'placeholder-evenementiel',
    slug: 'evenementiel',
    name: 'Événementiel',
    tagline: "Soirées, anniversaires et événements privés, capturés dans l'instant et sans mise en scène.",
    sortOrder: 1,
    filmCount: 0,
    isPublished: true,
    reel: ambienceMedia(AMBIENCE_CLIPS.evenementiel),
    poster: null,
  },
  {
    id: 'placeholder-mariage',
    slug: 'mariage',
    name: 'Mariage',
    tagline: "Le film de votre journée, monté comme une scène de cinéma.",
    sortOrder: 2,
    filmCount: 2,
    isPublished: true,
    reel: ambienceMedia(AMBIENCE_CLIPS.mariage),
    poster: null,
  },
  {
    id: 'placeholder-corporate',
    slug: 'corporate',
    name: 'Corporate',
    tagline: 'Films de marque, portraits de métiers et captations d’événements.',
    sortOrder: 3,
    filmCount: 2,
    isPublished: true,
    reel: ambienceMedia(AMBIENCE_CLIPS.corporate),
    poster: null,
  },
  {
    id: 'placeholder-sport',
    slug: 'sport',
    name: 'Sport',
    tagline: 'Athlètes, clubs et compétitions filmés au rythme de l’effort.',
    sortOrder: 4,
    filmCount: 2,
    isPublished: true,
    reel: ambienceMedia(AMBIENCE_CLIPS.sport),
    poster: null,
  },
  {
    id: 'placeholder-clip',
    slug: 'clip',
    name: 'Clip',
    tagline: 'Clips musicaux et formats courts à forte direction artistique.',
    sortOrder: 5,
    filmCount: 2,
    isPublished: true,
    reel: ambienceMedia(AMBIENCE_CLIPS.clip),
    poster: null,
  },
  {
    id: 'placeholder-lifestyle',
    slug: 'lifestyle',
    name: 'Lifestyle',
    tagline: 'Vlogs, séries sociales et contenus de marque au quotidien.',
    sortOrder: 6,
    filmCount: 2,
    isPublished: true,
    reel: ambienceMedia(AMBIENCE_CLIPS.lifestyle),
    poster: null,
  },
];

/**
 * Les mêmes catégories de départ dans la langue demandée : slug, nom et
 * accroche traduits (voir `CATEGORY_SLUG_MAP`, `CATEGORY_NAMES`,
 * `CATEGORY_TAGLINES`). Sans ça, un poste de dev sans backend — ou les
 * parcours e2e, hermétiques — affichait les slugs FR sur /nl et /en, et une
 * page catégorie traduite ne trouvait jamais sa catégorie.
 */
export function placeholderCategories(locale: SiteLocale): Category[] {
  return PLACEHOLDER_CATEGORIES.map((category) => {
    const key = category.slug as CategoryKey;
    return {
      ...category,
      slug: categorySlug(locale, key),
      name: CATEGORY_NAMES[key][locale],
      tagline: CATEGORY_TAGLINES[key][locale],
    };
  });
}

/**
 * Films de démonstration affichés dans la modale quand l'API n'est pas
 * joignable. Ils rejouent l'extrait de banque de leur catégorie : la modale
 * montre une vraie liste plutôt qu'un panneau vide.
 */
export const PLACEHOLDER_FILMS: Record<string, Film[]> = Object.fromEntries(
  PLACEHOLDER_CATEGORIES.map((category) => [
    category.slug,
    [
      film(category, 1, 'Extrait de démonstration', 'Projet à venir', '1 min 30'),
      film(category, 2, 'Second extrait', 'Projet à venir', '2 min 10'),
    ],
  ]),
);

/** Films de démonstration d'une catégorie, quelle que soit la langue du slug. */
export function placeholderFilms(slug: string, locale: SiteLocale): Film[] {
  const key = categoryKeyFromSlug(locale, slug);
  return key ? (PLACEHOLDER_FILMS[key] ?? []) : [];
}

function film(category: Category, index: number, title: string, client: string, duration: string): Film {
  return {
    id: `placeholder-film-${category.slug}-${index}`,
    categoryId: category.id,
    categorySlug: category.slug,
    title: `${category.name} — ${title}`,
    client,
    date: null,
    duration,
    description: 'Contenu provisoire : à remplacer par un film du studio depuis le backoffice.',
    sortOrder: index,
    isFeatured: index === 1,
    status: 'Published',
    media: category.reel,
    poster: null,
  };
}

export const PLACEHOLDER_SITE: SitePayload = {
  settings: {
    brandName: 'Heaven Motion',
    tagline: 'Photographe et vidéaste indépendant, basé en Belgique et disponible dans le monde entier.',
    email: 'contact@heavenmotion.be',
    instagram: '@heavenmotion',
    city: 'Bruxelles',
    region: 'Bruxelles-Capitale',
    legalText: 'Heaven Motion — micro-entreprise. Mentions légales à compléter.',
    showreel: ambienceMedia(AMBIENCE_CLIPS.showreel),
  },
  // Les fiches prestation viennent de la grille tarifaire, comme sur le site.
  services: [...SITE_CONTENT.fr.services],
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
      'Heaven Motion est un studio photo et vidéo indépendant, basé à Bruxelles et disponible dans le monde entier.',
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
