import { ProcessStep, ServiceCard, Testimonial } from '../models';
import { CategoryKey, SiteLocale, SITE_LOCALES } from './locale';
import { PACK_LABELS, PRICING, VAT_LABELS, formatPrice, startingPrice } from './packs';

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
 * Nom d'affichage de chaque catégorie, par langue. Doublon assumé des noms
 * en base (`Category.Name`, une ligne par langue) : les fiches tarifaires
 * statiques doivent pouvoir nommer une catégorie sans attendre l'API, et
 * `CategoryLocaleMap` dans `SeedData.cs` reprend exactement ces valeurs.
 */
export const CATEGORY_NAMES: Readonly<Record<CategoryKey, Readonly<Record<SiteLocale, string>>>> = {
  evenementiel: { fr: 'Événementiel', nl: 'Evenementen', en: 'Events' },
  mariage: { fr: 'Mariage', nl: 'Huwelijk', en: 'Wedding' },
  corporate: { fr: 'Corporate', nl: 'Zakelijk', en: 'Corporate' },
  sport: { fr: 'Sport', nl: 'Sport', en: 'Sport' },
  clip: { fr: 'Clip', nl: 'Clip', en: 'Music video' },
  lifestyle: { fr: 'Lifestyle', nl: 'Lifestyle', en: 'Lifestyle' },
};

/**
 * Accroche courte de chaque catégorie, par langue. Sert au contenu de
 * démarrage (site affiché sans API) ; en base, `Category.Tagline` porte la
 * même valeur au premier démarrage (`SeedData.cs`), modifiable ensuite
 * depuis le backoffice.
 */
export const CATEGORY_TAGLINES: Readonly<Record<CategoryKey, Readonly<Record<SiteLocale, string>>>> = {
  evenementiel: {
    fr: "Soirées, anniversaires et événements privés, capturés dans l'instant et sans mise en scène.",
    nl: 'Feestjes, verjaardagen en privé-evenementen, vastgelegd in het moment en zonder regie.',
    en: 'Parties, birthdays and private events, captured as they happen with no staging.',
  },
  mariage: {
    fr: 'Le film de votre journée, monté comme une scène de cinéma.',
    nl: 'De film van uw dag, gemonteerd als een filmscène.',
    en: 'The film of your day, edited like a scene from a movie.',
  },
  corporate: {
    fr: 'Films de marque, portraits de métiers et captations d’événements.',
    nl: 'Bedrijfsfilms, teamportretten en verslaggeving van professionele evenementen.',
    en: 'Brand films, team portraits and coverage of professional events.',
  },
  sport: {
    fr: 'Athlètes, clubs et compétitions filmés au rythme de l’effort.',
    nl: 'Atleten, clubs en competities gefilmd op het ritme van de inspanning.',
    en: 'Athletes, clubs and competitions filmed at the pace of the effort.',
  },
  clip: {
    fr: 'Clips musicaux et formats courts à forte direction artistique.',
    nl: 'Videoclips en korte formaten met een sterke artistieke leiding.',
    en: 'Music videos and short formats with strong art direction.',
  },
  lifestyle: {
    fr: 'Séances couple, famille et contenu de marque, naturels plutôt que scénarisés.',
    nl: 'Koppel-, gezins- en merkcontent, natuurlijk in plaats van gescript.',
    en: 'Couple, family and brand content, natural rather than scripted.',
  },
};

/**
 * Fiches « prestation » dérivées de la grille tarifaire : une carte par
 * catégorie, avec le pack combo comme fiche de référence et le prix du pack
 * le moins cher comme prix d'appel. Avant les packs, ces quatre cartes
 * étaient saisies à la main avec des prix qui ne correspondaient plus à
 * rien ; les dériver de `PRICING` garantit qu'un seul endroit porte les
 * prix du site (JSON-LD `priceRange` de la home, pages commune, sitemap).
 */
function serviceCardsFor(locale: SiteLocale): readonly ServiceCard[] {
  const from = { fr: 'à partir de', nl: 'vanaf', en: 'from' }[locale];
  return PRICING.map((pricing, index) => {
    const combo = pricing.packs.find((p) => p.type === 'combo') ?? pricing.packs[0];
    return {
      id: pricing.key,
      name: CATEGORY_NAMES[pricing.key][locale],
      included: pricing.packs.map((p) => PACK_LABELS[p.type][locale]),
      duration: combo.duration[locale],
      deliverables: combo.deliverables[locale],
      startingPrice: `${from} ${formatPrice(startingPrice(pricing.key))} ${VAT_LABELS[pricing.vat][locale]}`,
      sortOrder: index + 1,
    };
  });
}

const SERVICES: Readonly<Record<SiteLocale, readonly ServiceCard[]>> = Object.fromEntries(
  SITE_LOCALES.map((locale) => [locale, serviceCardsFor(locale)]),
) as Record<SiteLocale, readonly ServiceCard[]>;

/**
 * Contenu marketing par langue (accroche, à propos, mentions légales,
 * étapes, témoignages) : un dictionnaire statique plutôt qu'un
 * aller-retour API filtré par `locale`, sur demande explicite du client.
 *
 * Contrepartie assumée : ce contenu n'est plus éditable depuis le
 * backoffice pour ce qui concerne son AFFICHAGE public — les onglets FR/NL
 * de l'admin (Réglages, Étapes, Témoignages) continuent d'écrire en base,
 * mais ces lignes ne sont plus lues par le site. Modifier ce texte demande
 * désormais un changement de code + déploiement. `id`/`sortOrder` sont
 * posés en dur : ces listes sont figées, elles ne sont plus créées ni
 * réordonnées à l'exécution.
 */
export const SITE_CONTENT: Record<SiteLocale, SiteContent> = {
  fr: {
    tagline: 'Photographe et vidéaste indépendant — une seule personne pour la photo et la vidéo. Belgique, France, Luxembourg, Pays-Bas.',
    city: 'Bruxelles',
    region: 'Bruxelles-Capitale',
    legalText: 'Heaven Motion — micro-entreprise. Mentions légales à compléter.',
    aboutParagraphs: [
      'Chaque histoire mérite d’être vécue. Chaque moment mérite d’être gardé.',
      'Chez Heaven Motion, nous créons des images qui racontent ce que vous vivez. Vidéo, photographie ou les deux, nous cherchons à capturer bien plus qu’un simple instant : une émotion, une ambiance, un regard, une énergie, tous ces détails qui rendent un moment unique.',
      'Un événement, un mariage, une soirée, un anniversaire, un restaurant, un projet professionnel, un voyage, une marque, ou simplement une histoire que vous souhaitez raconter… peu importe le projet, nous pensons que chacun a quelque chose à montrer et que tout le monde mérite de belles images.',
      'Parce qu’une image ne sert pas seulement à montrer ce qui s’est passé. Elle permet de le ressentir à nouveau.',
      'Basé à Bruxelles, Heaven Motion se déplace en Belgique, dans le nord de la France jusqu’à Paris, au Luxembourg et aux Pays-Bas, avec un forfait de déplacement fixe par zone — et plus loin encore là où vos histoires nous emmènent. Nous avons déjà réalisé des projets au-delà de nos frontières et sommes toujours prêts à découvrir de nouveaux lieux, de nouvelles personnes et de nouvelles histoires.',
      'La photo et la vidéo sont faites par la même personne : un seul style, un seul interlocuteur, moins de monde autour de vous le jour J, et un prix combiné inférieur à deux prestataires séparés.',
      'Heaven Motion couvre 6 types de projets — événementiel, mariage, corporate, sport, lifestyle & clips — chacun avec ses formules photo, vidéo ou photo + vidéo, détaillées dans les prestations et les tarifs.',
      'Chaque projet démarre par un échange pour cadrer l’intention, le budget et la date, avec un devis chiffré sous 48 h. Le montage suit deux allers-retours avant la livraison en ligne.',
    ],
    services: SERVICES.fr,
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
    tagline: 'Onafhankelijke fotograaf en videograaf — één persoon voor foto en video. België, Frankrijk, Luxemburg, Nederland.',
    city: 'Brussel',
    region: 'Brussels Hoofdstedelijk Gewest',
    legalText: 'Heaven Motion — eenmanszaak. Wettelijke vermeldingen aan te vullen.',
    aboutParagraphs: [
      'Elk verhaal verdient het om beleefd te worden. Elk moment verdient het om bewaard te blijven.',
      'Bij Heaven Motion maken we beelden die vertellen wat u beleeft. Video, fotografie of beide: we zoeken naar veel meer dan een simpel moment — een emotie, een sfeer, een blik, een energie, al die details die een moment uniek maken.',
      'Een evenement, een huwelijk, een feestavond, een verjaardag, een restaurant, een professioneel project, een reis, een merk, of gewoon een verhaal dat u wilt vertellen… welk project het ook is, wij denken dat iedereen iets te tonen heeft en dat iedereen mooie beelden verdient.',
      'Want een beeld toont niet alleen wat er is gebeurd. Het laat u dat moment opnieuw beleven.',
      'Gevestigd in Brussel verplaatst Heaven Motion zich in België, in Noord-Frankrijk tot Parijs, in Luxemburg en in Nederland, met een vast verplaatsingstarief per zone — en nog verder, overal waar uw verhalen ons brengen. We realiseerden al projecten buiten onze landsgrenzen en zijn altijd klaar om nieuwe plekken, nieuwe mensen en nieuwe verhalen te ontdekken.',
      'Foto en video worden door dezelfde persoon gemaakt: één stijl, één aanspreekpunt, minder volk rond u op de grote dag, en een gecombineerde prijs die lager ligt dan twee aparte leveranciers.',
      'Heaven Motion behandelt 6 soorten projecten — evenementen, huwelijk, zakelijk, sport, lifestyle & clips — elk met formules foto, video of foto + video, in detail beschreven bij de diensten en tarieven.',
      'Elk project start met een gesprek om de intentie, het budget en de datum te bepalen, met een offerte binnen 48 u. De montage doorloopt twee rondes feedback voor de levering online.',
    ],
    services: SERVICES.nl,
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
  en: {
    tagline: 'Independent photographer and videographer — one person for both photo and video. Belgium, France, Luxembourg, Netherlands.',
    city: 'Brussels',
    region: 'Brussels-Capital Region',
    legalText: 'Heaven Motion — sole trader. Legal notice to be completed.',
    aboutParagraphs: [
      'Every story deserves to be lived. Every moment deserves to be kept.',
      'At Heaven Motion, we create images that tell what you are living. Video, photography or both, we look for much more than a simple moment: an emotion, an atmosphere, a look, an energy — all the details that make a moment unique.',
      'An event, a wedding, a party, a birthday, a restaurant, a professional project, a trip, a brand, or simply a story you want to tell… whatever the project, we believe everyone has something to show and everyone deserves beautiful images.',
      'Because an image is not only there to show what happened. It lets you feel it again.',
      'Based in Brussels, Heaven Motion travels across Belgium, northern France up to Paris, Luxembourg and the Netherlands, with a flat travel fee per zone — and further still, wherever your stories take us. We have already worked beyond our borders and are always ready to discover new places, new people and new stories.',
      'Photo and video are made by the same person: one style, one point of contact, fewer people around you on the day, and a combined price lower than two separate suppliers.',
      'Heaven Motion covers 6 types of projects — events, weddings, corporate, sport, lifestyle & music videos — each with photo, video or photo + video packages, detailed under services and pricing.',
      'Every project starts with a conversation to frame the intent, the budget and the date, with an itemised quote within 48 h. The edit goes through two rounds of feedback before online delivery.',
    ],
    services: SERVICES.en,
    process: [
      { id: 'echange', index: '01', title: 'Conversation', body: 'We frame the intent, the budget and the date. Quote within 48 h.', sortOrder: 1 },
      { id: 'tournage', index: '02', title: 'Shoot', body: 'Scouting, shot plan, unobtrusive and well-framed coverage.', sortOrder: 2 },
      { id: 'livraison', index: '03', title: 'Delivery', body: 'Edit, colour grading, two rounds of feedback, then online delivery.', sortOrder: 3 },
    ],
    testimonials: [
      { id: 'temoin-mariage', quote: 'Testimonial to be added from the back office.', author: 'Client', role: 'Wedding', sortOrder: 1 },
      { id: 'temoin-corporate', quote: 'Testimonial to be added from the back office.', author: 'Client', role: 'Corporate', sortOrder: 2 },
      { id: 'temoin-sport', quote: 'Testimonial to be added from the back office.', author: 'Client', role: 'Sport', sortOrder: 3 },
    ],
  },
};
