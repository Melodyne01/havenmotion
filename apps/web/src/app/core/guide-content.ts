import { FaqEntry } from './faq-content';
import { CategoryKey, SiteLocale } from './locale';
import { formatPrice, pricingFor } from './packs';
import { GUIDES_BRABANT_WALLON_VENUES } from './guides/brabant-wallon-venues';
import { GUIDES_BRUSSELS_EXPAT } from './guides/brussels-expat';
import { GUIDES_CHOOSE } from './guides/photo-or-video';
import { GUIDES_CORPORATE_PRICE } from './guides/corporate-video-price';

export interface GuideTable {
  readonly columns: readonly string[];
  readonly rows: readonly (readonly string[])[];
  readonly note?: string;
}

export interface GuideSection {
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly list?: readonly string[];
  readonly table?: GuideTable;
}

export interface GuideLink {
  readonly label: string;
  readonly path: string;
}

export interface Guide {
  readonly slug: string;
  readonly locale: SiteLocale;
  /**
   * Clé commune aux versions d'un même guide dans plusieurs langues : sert
   * aux hreflang. Un guide n'est pas traduit mot à mot, mais répond à la
   * même intention sur chaque marché.
   */
  readonly group: string;
  /** Catégorie dont la grille est affichée et préremplie dans le devis. */
  readonly category: CategoryKey;
  readonly title: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly eyebrow: string;
  readonly published: string;
  readonly readingMinutes: number;
  /** Réponse directe, dans les 100 premiers mots. */
  readonly answer: string;
  readonly sections: readonly GuideSection[];
  readonly faq: readonly FaqEntry[];
  readonly ctaTitle: string;
  readonly ctaBody: string;
  /** Maillage vers les pages commerciales que le guide alimente. */
  readonly related: readonly GuideLink[];
}

const m = pricingFor('mariage');
const price = (type: 'photo' | 'video' | 'combo') => formatPrice(m.packs.find((p) => p.type === type)!.price!);
const saving = formatPrice(
  m.packs.find((p) => p.type === 'photo')!.price! + m.packs.find((p) => p.type === 'video')!.price! - m.packs.find((p) => p.type === 'combo')!.price!,
);

/**
 * Guides éditoriaux. Chaque guide est écrit dans la langue de son marché,
 * pas traduit : « wat kost een trouwfotograaf » et « combien coûte un
 * photographe de mariage » ne se répondent pas avec les mêmes repères, les
 * mêmes concurrents ni le même vocabulaire. Les fourchettes de marché
 * viennent de l'analyse concurrentielle de septembre 2026, citées avec
 * leur source ; nos prix viennent de la grille (`packs.ts`).
 */
const PRICE_GUIDES: readonly Guide[] = [
  {
    slug: 'prix-photographe-videaste-mariage-belgique-2026',
    locale: 'fr',
    group: 'prix-mariage',
    category: 'mariage',
    related: [
      { label: 'La grille complète et les options', path: '/tarifs' },
      { label: 'Photographe & vidéaste de mariage', path: '/prestations/mariage' },
      { label: 'Photo et vidéo par une seule personne', path: '/photo-et-video-une-seule-personne' },
    ],
    title: 'Combien coûte un photographe-vidéaste de mariage en Belgique en 2026 ?',
    metaTitle: 'Prix d’un photographe et vidéaste de mariage en Belgique (2026)',
    metaDescription: `Fourchettes réelles du marché belge, ce qui fait varier le prix, combien de photos et quelle durée de film attendre, les frais cachés, et ce que coûte une seule personne pour les deux : ${price('combo')} TTC.`,
    eyebrow: 'Guide prix',
    published: '2026-10-04',
    readingMinutes: 9,
    answer: `En Belgique, un photographe de mariage professionnel demande entre 1 400 et 3 500 € pour une journée complète, un vidéaste entre 1 500 et 3 000 €, et un duo photo + vidéo entre 3 000 et 5 500 €. Les débutants commencent vers 600 à 900 €, le haut de gamme dépasse 4 000 €. Chez Heaven Motion, la photo est à ${price('photo')} TTC, le film à ${price('video')} TTC, et les deux par la même personne à ${price('combo')} TTC — soit ${saving} de moins que les deux formules séparées. Le détail, les sources et ce qui fait bouger ces chiffres sont ci-dessous.`,
    sections: [
      {
        title: 'Les fourchettes du marché belge, avec leurs sources',
        paragraphs: [
          'Les prix ci-dessous sont ceux que les photographes et vidéastes belges publient eux-mêmes, relevés en septembre 2026. Ils changent ; la source est indiquée pour que vous puissiez vérifier.',
        ],
        table: {
          columns: ['Prestation', 'Fourchette', 'Source'],
          rows: [
            ['Photographe débutant, journée', '600 – 1 000 €', 'prophotos.be, davidorban.be'],
            ['Photographe confirmé, 8 à 10 h', '1 400 – 2 800 €', 'wewed.be'],
            ['Photographe établi, reportage complet', '2 200 – 3 500 €', 'wewed.be, Anvers 1 600 – 3 800 € (huwelijksfotograafvlaamsbrabant.be)'],
            ['Photographe haut de gamme', '4 000 € et plus', 'davidorban.be'],
            ['Cérémonie civile seule, 1 à 2 h', '300 – 600 €', 'prophotos.be'],
            ['Vidéaste, journée', '1 500 – 3 000 € (moyenne ~2 800 € pour un film de 4 à 6 min)', 'tosanproductions.com, sylvainb-videaste.com'],
            ['Duo photo + vidéo, deux personnes', '2 600 – 3 600 €', 'témoignages mariages.net, lovemotion.be'],
          ],
          note: 'Les annuaires affichent des planchers d’appel (« dès 50 € ») qui ne correspondent à aucune prestation réelle de mariage.',
        },
      },
      {
        title: 'Ce qui fait varier le prix',
        paragraphs: [
          'Deux mariages au même prix affiché ne couvrent pas la même chose. Avant de comparer deux devis, vérifiez ces six points : ils expliquent l’essentiel des écarts.',
        ],
        list: [
          'La durée de présence : 4 h (cérémonie et cocktail), 8 h (jusqu’au repas) ou la journée complète (préparatifs à ouverture de bal). Chaque heure supplémentaire se paie 100 à 220 € selon le prestataire.',
          'Le nombre de personnes : un second photographe ou vidéaste ajoute 400 à 700 € ; un duo photo + vidéo, c’est deux salaires, deux déplacements, deux repérages.',
          'Les livrables : nombre de photos retouchées (200 à 600), durée du film (teaser de 1 min, film de 5 à 8 min, long format de 30 min), album imprimé (300 à 800 €).',
          'Le délai : certains livrent en 2 semaines, d’autres en 3 mois. L’express coûte 150 à 300 €.',
          'Le déplacement : inclus dans un rayon de 30 à 60 km chez la plupart, puis 0,50 à 0,60 €/km ou un forfait. Pour un mariage loin de chez le prestataire, comptez aussi une nuit d’hôtel.',
          'La saison et le jour : un samedi de juin se vend plein tarif ; un vendredi d’octobre se négocie souvent 10 à 20 % moins cher.',
        ],
      },
      {
        title: 'Combien de photos, quelle durée de film : les repères',
        paragraphs: [
          'Pour une journée complète, le marché livre entre 300 et 600 photos retouchées, soit environ 25 à 50 photos par heure de présence, triées à partir de 2 000 à 5 000 prises. Un aperçu de 20 à 50 photos arrive sous 7 à 14 jours chez les meilleurs, la galerie complète sous 4 à 8 semaines.',
          'Côté film, le format standard est un film de 4 à 8 minutes qui raconte la journée, souvent accompagné d’un teaser d’une minute pour les réseaux. Le long format (20 à 30 minutes, cérémonie et discours en intégralité) est une option chez la plupart, comprise chez certains. Livraison : 1 à 3 mois en moyenne.',
          'Chez Heaven Motion : environ 400 photos, aperçu sous 7 jours, galerie et film de 5 à 8 minutes avec teaser sous 2 à 4 semaines.',
        ],
      },
      {
        title: 'Photo seule, vidéo seule, ou les deux ?',
        paragraphs: [
          'La photo reste le choix par défaut : on l’imprime, on l’encadre, on la regarde vingt ans après. La vidéo garde ce que la photo ne peut pas : les voix, les vœux, le discours du témoin, l’ouverture de bal. Les couples qui ne prennent que la photo regrettent rarement ; ceux qui ne prennent que la vidéo regrettent souvent de ne pas avoir de tirages.',
          'Prendre les deux coûte, en Belgique, entre 3 000 et 5 500 € avec deux prestataires séparés — et il faut les coordonner. L’alternative, c’est une seule personne qui fait les deux : moins cher (un seul déplacement, un seul repérage), un seul style, un seul interlocuteur, moins de monde autour de vous. La limite est honnête : pendant les secondes où photo et vidéo se disputent le même instant, une seule personne ne donne pas deux angles. C’est pour ça qu’un second opérateur est proposé au-delà de 120 invités ou pour une cérémonie religieuse longue.',
          `Notre pack photo + vidéo mariage est à ${price('combo')} TTC pour la journée complète, contre ${price('photo')} + ${price('video')} pour les deux formules séparées.`,
        ],
      },
      {
        title: 'Les frais qu’on découvre sur le devis',
        paragraphs: ['Un prix « à partir de » n’est pas un prix. Demandez, avant de signer, si ces postes sont compris :'],
        list: [
          'Le déplacement et, pour un mariage loin, la nuit d’hôtel.',
          'La TVA : un prix « HTVA » prend 21 % de plus pour un particulier.',
          'Les fichiers en haute définition : certains ne livrent que des formats web, les originaux sont en supplément.',
          'La retouche de toutes les photos, ou seulement d’une sélection.',
          'La musique du film : une musique sous licence évite que le film soit coupé ou mis en sourdine sur Instagram et YouTube.',
          'Les droits : pouvez-vous imprimer, partager, offrir les images sans limite ?',
          'L’acompte et les conditions d’annulation ou de report.',
        ],
      },
      {
        title: 'Un exemple de budget pour un mariage de 100 invités',
        paragraphs: ['Pour un mariage en Brabant wallon un samedi de juin, préparatifs à 11 h, ouverture de bal à 22 h :'],
        table: {
          columns: ['Option', 'Marché belge', 'Heaven Motion'],
          rows: [
            ['Photo seule, journée', '1 400 – 2 800 €', `${price('photo')} TTC`],
            ['Vidéo seule, journée', '1 500 – 3 000 €', `${price('video')} TTC`],
            ['Photo + vidéo, deux prestataires', '3 000 – 5 500 €', '—'],
            ['Photo + vidéo, une seule personne', 'rare sur le marché', `${price('combo')} TTC`],
            ['Déplacement', 'inclus 30 km puis 0,50 – 0,60 €/km', 'inclus jusqu’à 60 km'],
            ['Second opérateur (optionnel)', '400 – 700 €', '490 €'],
            ['Album imprimé (optionnel)', '300 – 800 €', 'dès 390 €'],
          ],
        },
      },
      {
        title: 'Quand réserver, et comment comparer',
        paragraphs: [
          'Les photographes et vidéastes établis sont réservés 10 à 14 mois à l’avance pour un samedi de mai à septembre ; certains à 18 mois. Un acompte de 30 à 50 % bloque la date. Pour un mariage hors saison ou en semaine, 3 à 6 mois suffisent souvent.',
          'Pour comparer deux devis, mettez-les sur la même durée, le même nombre de personnes et les mêmes livrables, TVA comprise. Demandez à voir un mariage complet — la galerie entière et le film, pas seulement les dix meilleures images — et un contact d’un couple de l’année précédente.',
        ],
      },
    ],
    faq: [
      { question: 'Quel est le prix moyen d’un photographe de mariage en Belgique ?', answer: 'Entre 1 400 et 2 800 € pour un professionnel confirmé sur 8 à 10 heures, selon wewed.be et prophotos.be. Les débutants sont sous 1 000 €, le haut de gamme au-dessus de 3 500 €.' },
      { question: 'Et un vidéaste de mariage ?', answer: 'Entre 1 500 et 3 000 € pour une journée et un film de 4 à 8 minutes. Les sites français qui se classent sur la requête belge citent une moyenne de 2 800 €.' },
      { question: 'Une seule personne peut-elle faire la photo et la vidéo ?', answer: 'Oui, avec une méthode (les moments clés préparés au repérage, une priorité décidée avec vous) et une limite honnête : pas deux angles à la même seconde. Un second opérateur couvre les grands mariages. Le combo coûte nettement moins cher que deux prestataires.' },
      { question: 'Les prix sont-ils plus élevés à Bruxelles qu’en Wallonie ?', answer: 'Légèrement : Bruxelles et Anvers sont les marchés les plus chers, Liège, Namur et le Hainaut un peu moins. L’écart tient surtout au prestataire, pas à la ville.' },
      { question: 'Peut-on négocier ?', answer: 'Sur une date hors saison ou en semaine, souvent oui. Sur un samedi de juin, rarement. Chez Heaven Motion la grille est la même pour tous, mais le sur mesure permet d’ajuster la durée et les livrables au budget.' },
      { question: 'Combien coûte un mariage civil seul ?', answer: 'Entre 300 et 600 € pour 1 à 2 heures sur le marché belge. Chez Heaven Motion, la séance de 1 h 30 à 250 € TTC couvre une cérémonie civile courte.' },
    ],
    ctaTitle: 'Un devis chiffré pour votre date',
    ctaBody: 'Date, lieu, nombre d’invités : vous recevez sous 48 h un devis avec la formule, le déplacement et, si la journée le justifie, le second opérateur.',
  },
  {
    slug: 'wat-kost-een-huwelijksfotograaf-en-videograaf-belgie-2026',
    locale: 'nl',
    group: 'prix-mariage',
    category: 'mariage',
    related: [
      { label: 'De volledige tarieven en opties', path: '/nl/tarieven' },
      { label: 'Huwelijksfotograaf & videograaf', path: '/nl/diensten/huwelijk' },
      { label: 'Foto en video door één persoon', path: '/nl/foto-en-video-door-een-persoon' },
    ],
    title: 'Wat kost een huwelijksfotograaf én videograaf in België in 2026?',
    metaTitle: 'Prijs van een trouwfotograaf en trouwvideograaf in België (2026)',
    metaDescription: `Echte prijsvorken van de Belgische markt, wat de prijs doet schommelen, hoeveel foto’s en welke trouwfilm u mag verwachten, de verborgen kosten, en wat één persoon voor beide kost: ${price('combo')} incl. btw.`,
    eyebrow: 'Prijsgids',
    published: '2026-10-04',
    readingMinutes: 9,
    answer: `In België vraagt een professionele trouwfotograaf tussen € 1 200 en € 3 500 voor een volledige dag, een trouwvideograaf tussen € 1 450 en € 3 000, en een duo foto + video tussen € 3 000 en € 5 500. Beginners starten rond € 800, het topsegment gaat boven € 4 000. Bij Heaven Motion kost de foto ${price('photo')} incl. btw, de trouwfilm ${price('video')} incl. btw, en beide door dezelfde persoon ${price('combo')} incl. btw — dat is ${saving} minder dan de twee formules apart. De details, de bronnen en wat die cijfers doet bewegen staan hieronder.`,
    sections: [
      {
        title: 'De prijsvorken van de Belgische markt, met bronnen',
        paragraphs: [
          'Onderstaande prijzen publiceren Belgische fotografen en videografen zelf, opgetekend in september 2026. Ze veranderen; de bron staat erbij zodat u kunt controleren.',
        ],
        table: {
          columns: ['Dienst', 'Prijsvork', 'Bron'],
          rows: [
            ['Beginnende fotograaf, dag', '€ 800 – 1 000', 'salino.be, framepunt.be'],
            ['Gemiddelde trouwfotograaf, 10 u', '€ 2 000 – 2 500', 'driesrengle.be, mijntrouwfoto.be'],
            ['Trouwfotograaf Antwerpen', '€ 1 600 – 3 800', 'huwelijksfotograafvlaamsbrabant.be'],
            ['Trouwfotograaf Vlaams-Brabant', '€ 1 500 – 3 000', 'huwelijksfotograafvlaamsbrabant.be'],
            ['Uurtarief', '€ 75 – 175', 'salino.be'],
            ['Trouwvideograaf, dag', '€ 1 450 – 1 850 (Love Motion), gemiddeld € 1 500', 'lovemotion.be, fotograafkiezen.nl'],
            ['Foto + video, twee personen', '€ 3 240 (Love Motion, −10 % combo) tot € 3 500', 'lovemotion.be, shotsbycharlotte.com'],
          ],
          note: 'Annuaires als Trustlocal tonen lokprijzen die niet overeenkomen met een echte huwelijksreportage.',
        },
      },
      {
        title: 'Wat de prijs doet schommelen',
        paragraphs: ['Twee huwelijken aan dezelfde prijs dekken zelden hetzelfde. Controleer deze zes punten vóór u twee offertes vergelijkt.'],
        list: [
          'De aanwezigheid: 4 u (ceremonie en receptie), 8 u (tot het diner) of de volledige dag (voorbereidingen tot openingsdans). Een extra uur kost € 100 tot 220.',
          'Het aantal personen: een tweede fotograaf of videograaf kost € 400 tot 700 extra; een duo foto + video is twee lonen, twee verplaatsingen, twee verkenningen.',
          'De eindproducten: aantal bewerkte foto’s (200 tot 600), lengte van de trouwfilm (teaser van 1 min, film van 5 tot 8 min, lange versie van 30 min), gedrukt album (€ 300 tot 800).',
          'De levertijd: sommigen leveren in 2 weken, anderen in 8 weken voor de foto’s en 10 weken voor de film. Express kost € 150 tot 300.',
          'De verplaatsing: inbegrepen tot 25 à 50 km bij de meesten, daarna per kilometer of een vast tarief, soms « buiten Vlaanderen aangerekend ».',
          'Seizoen en dag: een zaterdag in juni gaat aan volle prijs; een vrijdag in oktober is vaak 10 tot 20 % goedkoper.',
        ],
      },
      {
        title: 'Hoeveel foto’s, hoe lang een trouwfilm: de referenties',
        paragraphs: [
          'Voor een volledige dag levert de markt 300 tot 500 bewerkte foto’s, ongeveer 25 per uur aanwezigheid, geselecteerd uit enkele duizenden opnames. Een sneak peek volgt binnen een week bij de beteren, de volledige galerij binnen 6 tot 8 weken.',
          'Voor de film is de standaard een trouwfilm van 4 tot 8 minuten met daarnaast een trailer van 1 minuut voor sociale media. Een lange versie (ceremonie en speeches integraal) is meestal een optie. Levering: 8 tot 10 weken bij de gevestigde studio’s.',
          'Bij Heaven Motion: ongeveer 400 foto’s, voorproefje binnen 7 dagen, galerij en trouwfilm van 5 tot 8 minuten met teaser binnen 2 tot 4 weken.',
        ],
      },
      {
        title: 'Alleen foto, alleen video, of beide?',
        paragraphs: [
          'Foto blijft de standaardkeuze: je drukt ze af, je kadert ze in, je bekijkt ze twintig jaar later. Video bewaart wat foto niet kan: de stemmen, de geloften, de speech van de getuige, de openingsdans. Koppels die enkel foto nemen hebben zelden spijt; wie enkel video neemt mist vaak afdrukken.',
          'Beide nemen kost in België € 3 000 tot 5 500 met twee aparte leveranciers — en u moet ze op elkaar afstemmen. Het alternatief is één persoon die beide doet: goedkoper (één verplaatsing, één verkenning), één stijl, één aanspreekpunt, minder volk rond u. De grens is eerlijk: tijdens de seconden waarin foto en video hetzelfde moment opeisen, geeft één persoon geen twee hoeken. Daarom wordt een tweede operator voorgesteld vanaf 120 gasten of bij een lange kerkelijke ceremonie.',
          `Ons pakket foto + video huwelijk kost ${price('combo')} incl. btw voor de volledige dag, tegenover ${price('photo')} + ${price('video')} voor de twee formules apart.`,
        ],
      },
      {
        title: 'De kosten die u op de offerte ontdekt',
        paragraphs: ['Een prijs « vanaf » is geen prijs. Vraag vóór u tekent of deze posten inbegrepen zijn:'],
        list: [
          'Verplaatsing en, voor een huwelijk ver weg, de hotelovernachting.',
          'Btw: een prijs « excl. btw » wordt 21 % duurder voor een particulier.',
          'Bestanden in hoge resolutie: sommigen leveren enkel webformaten, de originelen zijn een supplement.',
          'Bewerking van alle foto’s, of enkel van een selectie.',
          'De muziek van de film: muziek in licentie voorkomt dat Instagram of YouTube de film dempt of verwijdert.',
          'Rechten: mag u de beelden onbeperkt afdrukken, delen, weggeven?',
          'Voorschot en annulerings- of verplaatsingsvoorwaarden.',
        ],
      },
      {
        title: 'Een voorbeeldbudget voor een huwelijk met 100 gasten',
        paragraphs: ['Voor een huwelijk in Vlaams-Brabant op een zaterdag in juni, voorbereidingen om 11 u, openingsdans om 22 u:'],
        table: {
          columns: ['Optie', 'Belgische markt', 'Heaven Motion'],
          rows: [
            ['Alleen foto, dag', '€ 1 500 – 3 000', `${price('photo')} incl. btw`],
            ['Alleen video, dag', '€ 1 450 – 3 000', `${price('video')} incl. btw`],
            ['Foto + video, twee leveranciers', '€ 3 000 – 5 500', '—'],
            ['Foto + video, één persoon', 'zeldzaam op de markt', `${price('combo')} incl. btw`],
            ['Verplaatsing', 'inbegrepen 25 – 50 km, daarna per km', 'inbegrepen tot 60 km'],
            ['Tweede operator (optie)', '€ 400 – 700', '€ 490'],
            ['Gedrukt album (optie)', '€ 300 – 800', 'vanaf € 390'],
          ],
        },
      },
      {
        title: 'Wanneer boeken, en hoe vergelijken',
        paragraphs: [
          'Gevestigde fotografen en videografen zijn 10 tot 14 maanden vooraf volgeboekt voor een zaterdag van mei tot september; in Nederland vaak 9 tot 12 maanden. Een voorschot van 20 tot 50 % legt de datum vast. Buiten het seizoen of in de week volstaan vaak 3 tot 6 maanden.',
          'Om twee offertes te vergelijken, zet u ze op dezelfde duur, hetzelfde aantal personen en dezelfde eindproducten, btw inbegrepen. Vraag een volledig huwelijk te zien — de hele galerij en de film, niet enkel de tien beste beelden — en een contact van een koppel van vorig jaar.',
        ],
      },
    ],
    faq: [
      { question: 'Wat is de gemiddelde prijs van een trouwfotograaf in België?', answer: 'De meeste fotografen vragen € 2 000 tot 2 500 voor 10 uur, volgens driesrengle.be en mijntrouwfoto.be. Beginners zitten rond € 800 tot 1 000, het topsegment boven € 3 500.' },
      { question: 'En een trouwvideograaf?', answer: 'Gemiddeld € 1 500 voor bijna een volledige dag; Love Motion rekent € 1 450 tot 1 850 voor 8 uur met trouwfilm en trailer.' },
      { question: 'Kan één persoon foto én video maken?', answer: 'Ja, met een methode (sleutelmomenten voorbereid bij de verkenning, een voorrang die we samen bepalen) en een eerlijke grens: geen twee hoeken op dezelfde seconde. Een tweede operator dekt grote huwelijken. De combinatie kost veel minder dan twee leveranciers.' },
      { question: 'Is Antwerpen duurder dan de rest van Vlaanderen?', answer: 'Iets: Antwerpen en Brussel zijn de duurste markten (€ 1 600 tot 3 800), Vlaams-Brabant en Limburg zitten iets lager. Het verschil zit vooral bij de fotograaf, niet bij de stad.' },
      { question: 'Trouwfotograaf of huwelijksfotograaf: is er een verschil?', answer: 'Nee, het zijn twee woorden voor hetzelfde beroep. « Trouwfotograaf » wordt in Vlaanderen en Nederland gebruikt, « huwelijksfotograaf » vooral in Vlaanderen. Zoek op beide.' },
      { question: 'Wat kost enkel het burgerlijk huwelijk?', answer: 'Op de markt € 300 tot 600 voor 1 tot 2 uur. Bij Heaven Motion dekt de sessie van 1 u 30 aan € 250 incl. btw een korte burgerlijke ceremonie.' },
    ],
    ctaTitle: 'Een concrete offerte voor uw datum',
    ctaBody: 'Datum, locatie, aantal gasten: u ontvangt binnen 48 u een offerte met de formule, de verplaatsing en, als de dag het rechtvaardigt, de tweede operator.',
  },
  {
    slug: 'wedding-photographer-cost-belgium-2026',
    locale: 'en',
    group: 'prix-mariage',
    category: 'mariage',
    related: [
      { label: 'Full pricing and options', path: '/en/pricing' },
      { label: 'Wedding photographer & videographer', path: '/en/services/wedding' },
      { label: 'Photo and video by one person', path: '/en/one-photographer-videographer' },
    ],
    title: 'How much does a wedding photographer cost in Belgium in 2026?',
    metaTitle: 'Wedding photographer and videographer prices in Belgium (2026)',
    metaDescription: `Real price ranges on the Belgian market, what moves the price, how many photos and what film to expect, the hidden costs, and what one person for both costs: ${price('combo')} incl. VAT. Written for international couples marrying in Belgium.`,
    eyebrow: 'Price guide',
    published: '2026-10-04',
    readingMinutes: 9,
    answer: `In Belgium, a professional wedding photographer charges between €1,400 and €3,500 for a full day, a videographer between €1,500 and €3,000, and a photo + video duo between €3,000 and €5,500. Beginners start around €600 to €900; the top end goes above €4,000. Luxembourg runs 15 to 30% higher. At Heaven Motion, photography is ${price('photo')} incl. VAT, the film ${price('video')} incl. VAT, and both by the same person ${price('combo')} incl. VAT — ${saving} less than the two packages separately. Details, sources and what moves these figures are below.`,
    sections: [
      {
        title: 'Belgian market ranges, with sources',
        paragraphs: [
          'The prices below are published by Belgian photographers and videographers themselves, recorded in September 2026. They move; the source is given so you can check.',
        ],
        table: {
          columns: ['Service', 'Range', 'Source'],
          rows: [
            ['Beginner photographer, full day', '€600 – 1,000', 'prophotos.be, davidorban.be'],
            ['Established photographer, 8 to 10 h', '€1,400 – 2,800', 'wewed.be'],
            ['Full-day photographer, Brussels', '€2,000 – 3,500 average', 'yourhappymoments.net'],
            ['Antwerp photographer', '€1,600 – 3,800', 'huwelijksfotograafvlaamsbrabant.be'],
            ['Civil ceremony only, 1 to 2 h', '€300 – 600', 'prophotos.be'],
            ['Videographer, full day', '€1,500 – 3,000', 'tosanproductions.com, lovemotion.be'],
            ['Photo + video duo, two people', '€2,600 – 3,600', 'mariages.net forums, lovemotion.be'],
            ['Luxembourg, experienced photographer', '€1,500 – 3,000, luxury €5,000+', 'wezoree.com'],
          ],
          note: 'Directories show teaser floors (“from €50”) that do not correspond to any real wedding service.',
        },
      },
      {
        title: 'What moves the price',
        paragraphs: ['Two weddings at the same displayed price rarely cover the same thing. Check these six points before comparing two quotes.'],
        list: [
          'Hours on site: 4 h (ceremony and drinks), 8 h (through dinner) or the full day (getting ready to first dance). An extra hour costs €100 to €220.',
          'Number of people: a second photographer or videographer adds €400 to €700; a photo + video duo is two salaries, two trips, two scouting visits.',
          'Deliverables: number of edited photos (200 to 600), film length (1-minute teaser, 5 to 8 minute film, 30-minute long cut), printed album (€300 to €800).',
          'Turnaround: some deliver in 2 weeks, others in 3 months. Express costs €150 to €300.',
          'Travel: included within 30 to 60 km for most, then €0.50 to €0.60 per km or a flat fee. For a wedding far from the supplier, add a hotel night.',
          'Season and day: a Saturday in June sells at full price; a Friday in October is often 10 to 20% cheaper.',
        ],
      },
      {
        title: 'How many photos, how long a film: the benchmarks',
        paragraphs: [
          'For a full day, the market delivers 300 to 600 edited photos — roughly 25 to 50 per hour on site, selected from 2,000 to 5,000 frames. A sneak peek of 20 to 50 photos arrives within 7 to 14 days from the best, the full gallery within 4 to 8 weeks.',
          'For film, the standard is a 4 to 8 minute highlight film telling the day, usually with a one-minute teaser for social media. A long cut (20 to 30 minutes, full ceremony and speeches) is an option with most. Delivery: 1 to 3 months on average.',
          'At Heaven Motion: around 400 photos, sneak peek within 7 days, gallery and 5 to 8 minute film with teaser within 2 to 4 weeks.',
        ],
      },
      {
        title: 'Getting married in Belgium as an expat: what changes the budget',
        paragraphs: [
          'A civil wedding in Belgium takes place at the town hall of the municipality where one of you is registered, often in the morning, with the party in the afternoon and evening. Many international couples do town hall plus a celebration on the same day, or a short civil ceremony now and a bigger party abroad later — two very different budgets.',
          'Language matters for the quote and the day: a supplier working in English, French and Dutch avoids a translator at the town hall and a misunderstanding with the venue. Ask whether the contract, the invoice and the day itself are in English.',
          'Brussels venues range from the Grand-Place town hall to the Château de la Hulpe or the Abbaye de la Cambre; Bruges and Ghent are the classic elopement cities. Travel from Brussels is included within 60 km with us, so Bruges, Antwerp, Ghent and both Brabants cost nothing extra.',
        ],
      },
      {
        title: 'Photo only, video only, or both?',
        paragraphs: [
          'Photography remains the default: you print it, frame it, look at it twenty years on. Video keeps what photography cannot: the voices, the vows, the best man’s speech, the first dance. Couples who book only photos rarely regret it; those who book only video often miss having prints.',
          'Booking both in Belgium costs €3,000 to €5,500 with two separate suppliers — and you have to coordinate them. The alternative is one person doing both: cheaper (one trip, one scouting visit), one style, one point of contact, fewer people around you. The honest limit: during the seconds when photo and video compete for the same instant, one person does not give two angles. That is why a second operator is offered above 120 guests or for a long religious ceremony.',
          `Our wedding photo + video package is ${price('combo')} incl. VAT for the full day, against ${price('photo')} + ${price('video')} for the two packages separately.`,
        ],
      },
      {
        title: 'The costs you find on the quote',
        paragraphs: ['A “from” price is not a price. Ask, before signing, whether these items are included:'],
        list: [
          'Travel and, for a wedding far away, the hotel night.',
          'VAT: a price “excl. VAT” is 21% more for a private client in Belgium (17% in Luxembourg).',
          'High-resolution files: some deliver web formats only, originals cost extra.',
          'Editing of every photo, or only a selection.',
          'The film’s music: licensed music keeps the film from being muted or removed on Instagram and YouTube.',
          'Rights: can you print, share and give the images without limit?',
          'Deposit, cancellation and rescheduling terms.',
        ],
      },
      {
        title: 'A sample budget for a 100-guest wedding',
        paragraphs: ['For a wedding in Brussels on a Saturday in June, getting ready at 11 am, first dance at 10 pm:'],
        table: {
          columns: ['Option', 'Belgian market', 'Heaven Motion'],
          rows: [
            ['Photo only, full day', '€1,400 – 2,800', `${price('photo')} incl. VAT`],
            ['Video only, full day', '€1,500 – 3,000', `${price('video')} incl. VAT`],
            ['Photo + video, two suppliers', '€3,000 – 5,500', '—'],
            ['Photo + video, one person', 'rare on the market', `${price('combo')} incl. VAT`],
            ['Travel', 'included 30 km then €0.50 – 0.60/km', 'included up to 60 km'],
            ['Second operator (optional)', '€400 – 700', '€490'],
            ['Printed album (optional)', '€300 – 800', 'from €390'],
          ],
        },
      },
      {
        title: 'When to book, and how to compare',
        paragraphs: [
          'Established photographers and videographers are booked 10 to 14 months ahead for a Saturday from May to September; some 18 months. A 30 to 50% deposit secures the date. For an off-season or weekday wedding, 3 to 6 months is often enough.',
          'To compare two quotes, put them on the same hours, the same number of people and the same deliverables, VAT included. Ask to see a complete wedding — the whole gallery and the film, not just the ten best images — and a contact from a couple married last year.',
        ],
      },
    ],
    faq: [
      { question: 'What is the average price of a wedding photographer in Belgium?', answer: 'Between €1,400 and €2,800 for an established professional over 8 to 10 hours, according to wewed.be and prophotos.be. Beginners are under €1,000, the top end above €3,500.' },
      { question: 'And a wedding videographer?', answer: 'Between €1,500 and €3,000 for a full day and a 4 to 8 minute film.' },
      { question: 'Can one person shoot both photo and video?', answer: 'Yes, with a method (key moments prepared during scouting, a priority agreed with you) and an honest limit: no two angles in the same second. A second operator covers large weddings. The combo costs far less than two suppliers.' },
      { question: 'Do Belgian photographers work in English?', answer: 'Many in Brussels do; fewer outside the capital. Heaven Motion works in English, French and Dutch — quote, contract and the day itself.' },
      { question: 'Is Luxembourg more expensive than Belgium?', answer: 'Yes, by 15 to 30% for an equivalent service. A Belgian supplier travelling to Luxembourg (€190 flat fee with us) is often cheaper than a local one.' },
      { question: 'How much does a civil ceremony alone cost?', answer: 'Between €300 and €600 for 1 to 2 hours on the Belgian market. At Heaven Motion, the 1.5-hour session at €250 incl. VAT covers a short civil ceremony.' },
    ],
    ctaTitle: 'An itemised quote for your date',
    ctaBody: 'Date, venue, guest count: you receive within 48 h a quote with the package, the travel fee and, if the day calls for it, the second operator.',
  },
];

/** Tous les guides publiés, dans l'ordre d'affichage du hub. */
export const GUIDES: readonly Guide[] = [...PRICE_GUIDES, ...GUIDES_CHOOSE, ...GUIDES_CORPORATE_PRICE, ...GUIDES_BRUSSELS_EXPAT, ...GUIDES_BRABANT_WALLON_VENUES];

export function guidesFor(locale: SiteLocale): readonly Guide[] {
  return GUIDES.filter((g) => g.locale === locale);
}

export function findGuide(locale: SiteLocale, slug: string): Guide | null {
  return GUIDES.find((g) => g.locale === locale && g.slug === slug) ?? null;
}

/** Les versions d'un guide dans les autres langues, pour les hreflang. */
export function guideAlternates(guide: Guide): readonly Guide[] {
  return GUIDES.filter((g) => g.group === guide.group);
}
