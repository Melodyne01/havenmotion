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
    tagline: 'Photographe et vidéaste indépendant, basé en Belgique et disponible dans le monde entier.',
    city: 'Bruxelles',
    region: 'Bruxelles-Capitale',
    legalText: 'Heaven Motion — micro-entreprise. Mentions légales à compléter.',
    aboutParagraphs: [
      'Chaque histoire mérite d’être vécue. Chaque moment mérite d’être gardé.',
      'Chez Heaven Motion, nous créons des images qui racontent ce que vous vivez. Vidéo, photographie ou les deux, nous cherchons à capturer bien plus qu’un simple instant : une émotion, une ambiance, un regard, une énergie, tous ces détails qui rendent un moment unique.',
      'Un événement, un mariage, une soirée, un anniversaire, un restaurant, un projet professionnel, un voyage, une marque, un événement ou simplement une histoire que vous souhaitez raconter… peu importe le projet, nous pensons que chacun a quelque chose à montrer et que tout le monde mérite de belles images.',
      'Parce qu’une image ne sert pas seulement à montrer ce qui s’est passé. Elle permet de le ressentir à nouveau.',
      'Basé en Belgique et disponible partout dans le monde, Heaven Motion se déplace là où vos histoires nous emmènent. Nous avons déjà réalisé des projets au-delà de nos frontières et sommes toujours prêts à découvrir de nouveaux lieux, de nouvelles personnes et de nouvelles histoires.',
      'Chaque projet commence par un échange pour comprendre votre vision, vos envies et ce que vous souhaitez transmettre.',
      'Heaven Motion couvre 6 types de projets — événementiel, mariage, corporate, sport, lifestyle (vlog, interview) & clips — chacun avec son propre déroulé de tournage et de montage, détaillé dans le détail des prestations et des tarifs.',
      'Chaque projet démarre par un échange pour cadrer l’intention, le budget et la date, avec un devis chiffré sous 48 h. Le tournage se fait seul ou en équipe réduite, pour rester au plus près des personnes, et le montage suit deux allers-retours avant la livraison en ligne.',
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
    tagline: 'Onafhankelijke fotograaf en videograaf, gevestigd in België en wereldwijd beschikbaar.',
    city: 'Brussel',
    region: 'Brussels Hoofdstedelijk Gewest',
    legalText: 'Heaven Motion — eenmanszaak. Wettelijke vermeldingen aan te vullen.',
    aboutParagraphs: [
      'Elk verhaal verdient het om beleefd te worden. Elk moment verdient het om bewaard te blijven.',
      'Bij Heaven Motion maken we beelden die vertellen wat u beleeft. Video, fotografie of beide: we zoeken naar veel meer dan een simpel moment — een emotie, een sfeer, een blik, een energie, al die details die een moment uniek maken.',
      'Een evenement, een huwelijk, een feestavond, een verjaardag, een restaurant, een professioneel project, een reis, een merk, of gewoon een verhaal dat u wilt vertellen… welk project het ook is, wij denken dat iedereen iets te tonen heeft en dat iedereen mooie beelden verdient.',
      'Want een beeld toont niet alleen wat er is gebeurd. Het laat u dat moment opnieuw beleven.',
      'Gevestigd in België en wereldwijd beschikbaar, reist Heaven Motion overal waar uw verhalen ons brengen. We realiseerden al projecten buiten onze landsgrenzen en zijn altijd klaar om nieuwe plekken, nieuwe mensen en nieuwe verhalen te ontdekken.',
      'Elk project begint met een gesprek om uw visie, uw wensen en wat u wilt overbrengen te begrijpen.',
      'Heaven Motion behandelt 6 soorten projecten — evenementen, huwelijk, zakelijk, sport, lifestyle (vlog, interview) & clips — elk met een eigen verloop van opname en montage, in detail beschreven bij de diensten en tarieven.',
      'Elk project start met een gesprek om de intentie, het budget en de datum te bepalen, met een offerte binnen 48 u. De opname gebeurt alleen of met een klein team, om dicht bij de mensen te blijven, en de montage doorloopt twee rondes feedback voor de levering online.',
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
