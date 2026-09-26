import { FaqEntry } from './faq-content';
import { SiteLocale } from './locale';
import { formatPrice, startingPrice } from './packs';

export interface PricingContent {
  /** Titre de la page (H1), avec l'année : les requêtes « prix 2026 » se classent. */
  readonly title: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly eyebrow: string;
  /** Bloc « En bref » : faits courts, repris tels quels par les moteurs. */
  readonly inBrief: readonly string[];
  readonly packTypesTitle: string;
  readonly packTypes: readonly { readonly name: string; readonly body: string }[];
  readonly gridsTitle: string;
  readonly gridsLead: string;
  readonly optionsTitle: string;
  readonly optionsLead: string;
  readonly travelTitle: string;
  readonly travelLead: string;
  readonly travelColumns: { readonly zone: string; readonly distance: string; readonly fee: string; readonly examples: string };
  readonly travelIncluded: string;
  readonly travelOnQuote: string;
  readonly travelHotel: string;
  readonly whyTitle: string;
  readonly why: readonly string[];
  readonly marketTitle: string;
  readonly market: readonly { readonly label: string; readonly range: string; readonly source: string }[];
  readonly marketNote: string;
  readonly termsTitle: string;
  readonly terms: readonly { readonly name: string; readonly body: string }[];
  readonly faqTitle: string;
  readonly faq: readonly FaqEntry[];
  readonly ctaTitle: string;
  readonly ctaBody: string;
}

const mariage = formatPrice(startingPrice('mariage'));
const mariageCombo = '2 690 €';
const lifestyle = formatPrice(startingPrice('lifestyle'));

/**
 * Texte de la page tarifs. Les fourchettes de marché citées viennent de
 * l'analyse concurrentielle de septembre 2026 (rapports mariages.net,
 * wewed.be, prophotos.be, fynd.lu, theperfectwedding.nl) : ce sont des
 * repères publics, cités avec leur source, pas des chiffres du studio.
 */
export const PRICING_CONTENT: Record<SiteLocale, PricingContent> = {
  fr: {
    title: 'Tarifs photo & vidéo 2026',
    metaTitle: 'Tarifs photographe & vidéaste 2026 — Belgique, France, Luxembourg, Pays-Bas',
    metaDescription: `Prix affichés, TTC ou HTVA : photo, vidéo ou photo + vidéo par la même personne, dans 6 catégories. Mariage dès ${mariage}, séance lifestyle dès ${lifestyle}. Options, forfaits de déplacement, conditions.`,
    eyebrow: 'Tarifs',
    inBrief: [
      '6 catégories : mariage, événementiel, corporate, sport, clip, lifestyle.',
      '4 formules par catégorie : photo, vidéo, photo + vidéo par la même personne, ou sur mesure.',
      `Prix affichés, de ${lifestyle} (séance lifestyle) à ${mariageCombo} (mariage photo + vidéo, journée complète).`,
      'TTC pour les particuliers, HTVA pour les entreprises — la mention figure à côté de chaque prix.',
      'Déplacement inclus jusqu’à 60 km de Bruxelles, puis forfait fixe : 90 €, 190 €, 290 €.',
      'Devis chiffré sous 48 h, deux allers-retours de montage inclus, aperçu photo sous 7 jours.',
    ],
    packTypesTitle: 'Quatre formules, une logique',
    packTypes: [
      {
        name: 'Photo + retouche',
        body: 'La prise de vue et la retouche de toutes les photos, livrées dans une galerie en ligne. Pour ceux qui veulent des images à garder, imprimer et partager.',
      },
      {
        name: 'Vidéo + montage',
        body: 'Le tournage, le montage, l’étalonnage et une musique sous licence. Un film qui raconte, plus les formats courts pour les réseaux.',
      },
      {
        name: 'Photo + vidéo',
        body: 'Les deux, par la même personne, le même jour. Un seul style, un seul interlocuteur, moins de monde autour de vous — et un prix inférieur aux deux formules séparées.',
      },
      {
        name: 'Sur mesure',
        body: 'Une durée, des livrables ou des options qui sortent de la grille : mariage sur deux jours, compétition sur un week-end, contenu mensuel pour une marque. Devis sous 48 h.',
      },
    ],
    gridsTitle: 'Les prix, catégorie par catégorie',
    gridsLead: 'Chaque tableau donne la durée, ce que vous recevez et ce qui est inclus. Le combo est encadré : c’est la formule la plus demandée, et la plus avantageuse.',
    optionsTitle: 'Options à la carte',
    optionsLead: 'Ajoutables à n’importe quelle formule, chiffrées d’avance pour qu’il n’y ait rien à découvrir sur le devis.',
    travelTitle: 'Déplacement : un forfait par zone',
    travelLead: 'Calculé depuis Bruxelles / Wemmel. Pas de tarif au kilomètre, pas de « nous consulter » : le forfait est connu avant le premier échange.',
    travelColumns: { zone: 'Zone', distance: 'Distance', fee: 'Forfait', examples: 'Exemples' },
    travelIncluded: 'Inclus',
    travelOnQuote: 'Sur devis',
    travelHotel: 'Mariage en zone 3 ou 4 : une nuit d’hôtel (150 €) est ajoutée, parce que la soirée finit tard.',
    whyTitle: 'Pourquoi ces prix',
    why: [
      'Une seule personne, pas d’agence : pas de marge intermédiaire, pas de sous-traitance du montage, pas de commercial. Vous parlez à celui qui tient la caméra.',
      'La photo et la vidéo par la même personne coûtent moins cher que deux prestataires : un seul déplacement, un seul repérage, un seul jour de travail. L’économie vous est reversée sur le combo.',
      'Les prix sont les mêmes dans les quatre pays. Seul le forfait de déplacement change, et il est affiché. Au Luxembourg, où le marché est 15 à 30 % plus cher, c’est un avantage réel.',
      'Le matériel, les sauvegardes doubles, les licences musicales et les assurances sont compris. Ce qui est en option est listé ci-dessus, avec son prix.',
    ],
    marketTitle: 'Pour comparer : les fourchettes du marché',
    market: [
      { label: 'Photographe de mariage en Belgique, journée', range: '1 400 – 3 500 €', source: 'wewed.be, prophotos.be' },
      { label: 'Vidéaste de mariage en Belgique', range: '1 500 – 3 000 €', source: 'tosanproductions.com, fotograafkiezen.nl' },
      { label: 'Photo + vidéo aux Pays-Bas (deux personnes)', range: '3 100 – 4 700 €', source: 'shotsbycharlotte.com, royvanderwens.com' },
      { label: 'Photographe de mariage en France, médiane', range: '1 800 – 2 200 €', source: 'mariages.net, noxio.fr' },
      { label: 'Vidéo d’entreprise en agence', range: '2 000 – 10 000 €', source: 'bataljon.be, flashbiz.fr' },
      { label: 'Portrait LinkedIn à Bruxelles', range: '150 – 350 €', source: 'sanderdewilde.com' },
    ],
    marketNote: 'Relevé en septembre 2026 sur les sites cités. Les fourchettes changent ; vérifiez-les avant de comparer.',
    termsTitle: 'Conditions',
    terms: [
      { name: 'Réservation', body: 'Un acompte de 30 % bloque la date. Le solde est dû à la livraison.' },
      { name: 'Annulation', body: 'Acompte remboursé si l’annulation intervient plus de 90 jours avant la date ; report gratuit une fois, selon disponibilités.' },
      { name: 'Livraison', body: 'Aperçu photo sous 7 jours, galerie complète et film sous 2 à 4 semaines selon la période. Deux allers-retours de montage inclus.' },
      { name: 'Droits', body: 'Usage complet des images pour vos besoins propres ; cession des droits commerciaux incluse dans les formules corporate, sport et clip. Le studio garde le droit de montrer son travail, sauf refus de votre part.' },
      { name: 'Sauvegarde', body: 'Double carte mémoire à la prise de vue, copie sur deux supports le soir même, galerie en ligne conservée 12 mois.' },
      { name: 'TVA', body: 'TVA belge de 21 % incluse dans les prix TTC. Pour une entreprise assujettie hors Belgique, facture en autoliquidation.' },
    ],
    faqTitle: 'Questions sur les tarifs',
    faq: [
      {
        question: 'Y a-t-il des frais cachés ?',
        answer: 'Non. Le prix de la formule, le forfait de déplacement de votre zone et les options que vous choisissez : c’est tout ce qui figure sur le devis.',
      },
      {
        question: 'Peut-on payer en plusieurs fois ?',
        answer: 'Oui : 30 % à la réservation, le solde à la livraison, ou en trois fois sur demande pour un mariage.',
      },
      {
        question: 'Le prix change-t-il selon le pays ?',
        answer: 'Non, seul le forfait de déplacement change. Un mariage à Lille ou à Luxembourg-Ville coûte le prix belge plus 90 € ou 190 € de déplacement.',
      },
      {
        question: 'Que se passe-t-il s’il pleut ?',
        answer: 'On tourne. Le repérage prévoit toujours un plan intérieur, et l’option drone est simplement reportée ou remboursée si le vol est impossible.',
      },
      {
        question: 'Y a-t-il une réduction hors saison ou en semaine ?',
        answer: 'Oui, pour un mariage de novembre à mars ou un jour de semaine : demandez-le dans le message du formulaire, le devis en tient compte.',
      },
      {
        question: 'Combien coûte un second photographe ou vidéaste ?',
        answer: '490 € pour la journée. Il est proposé, pas imposé, au-delà de 120 invités ou pour une cérémonie religieuse longue.',
      },
      {
        question: 'Les prix sont-ils négociables ?',
        answer: 'La grille est la même pour tout le monde, c’est ce qui la rend juste. Le sur mesure permet en revanche d’ajuster la durée et les livrables à votre budget.',
      },
      {
        question: 'Le devis engage-t-il à quelque chose ?',
        answer: 'Non. Il est gratuit, chiffré sous 48 h et valable 30 jours. La date n’est bloquée qu’à réception de l’acompte.',
      },
    ],
    ctaTitle: 'Un devis en 48 h',
    ctaBody: 'Dites-nous la catégorie, la formule qui vous parle, la région et la date : vous recevez un devis chiffré, forfait de déplacement compris.',
  },
  nl: {
    title: 'Tarieven foto & video 2026',
    metaTitle: 'Tarieven fotograaf & videograaf 2026 — België, Frankrijk, Luxemburg, Nederland',
    metaDescription: `Transparante prijzen, incl. of excl. btw: foto, video of foto + video door dezelfde persoon, in 6 categorieën. Huwelijk vanaf ${mariage}, lifestyle-sessie vanaf ${lifestyle}. Opties, verplaatsingstarieven, voorwaarden.`,
    eyebrow: 'Tarieven',
    inBrief: [
      '6 categorieën: huwelijk, evenementen, zakelijk, sport, clip, lifestyle.',
      '4 formules per categorie: foto, video, foto + video door dezelfde persoon, of op maat.',
      `Prijzen online, van ${lifestyle} (lifestyle-sessie) tot ${mariageCombo} (huwelijk foto + video, volledige dag).`,
      'Incl. btw voor particulieren, excl. btw voor bedrijven — de vermelding staat naast elke prijs.',
      'Verplaatsing inbegrepen tot 60 km van Brussel, daarna een vast tarief: € 90, € 190, € 290.',
      'Concrete offerte binnen 48 u, twee rondes feedback inbegrepen, voorproefje van de foto’s binnen 7 dagen.',
    ],
    packTypesTitle: 'Vier formules, één logica',
    packTypes: [
      {
        name: 'Foto + bewerking',
        body: 'De opnames en de bewerking van alle foto’s, geleverd in een online galerij. Voor wie beelden wil bewaren, afdrukken en delen.',
      },
      {
        name: 'Video + montage',
        body: 'De opname, de montage, de kleurcorrectie en muziek in licentie. Een film die vertelt, plus korte formaten voor sociale media.',
      },
      {
        name: 'Foto + video',
        body: 'Beide, door dezelfde persoon, op dezelfde dag. Eén stijl, één aanspreekpunt, minder volk rond u — en een prijs lager dan de twee formules apart.',
      },
      {
        name: 'Op maat',
        body: 'Een duur, eindproducten of opties buiten de grille: huwelijk over twee dagen, competitie over een weekend, maandelijkse content voor een merk. Offerte binnen 48 u.',
      },
    ],
    gridsTitle: 'De prijzen, categorie per categorie',
    gridsLead: 'Elke tabel geeft de duur, wat u ontvangt en wat inbegrepen is. De combinatie is omkaderd: het is de meest gevraagde formule, en de voordeligste.',
    optionsTitle: 'Opties à la carte',
    optionsLead: 'Toe te voegen aan elke formule, vooraf geprijsd zodat er niets te ontdekken valt op de offerte.',
    travelTitle: 'Verplaatsing: een vast tarief per zone',
    travelLead: 'Berekend vanuit Brussel / Wemmel. Geen kilometertarief, geen « contacteer ons »: het tarief is gekend vóór het eerste gesprek.',
    travelColumns: { zone: 'Zone', distance: 'Afstand', fee: 'Tarief', examples: 'Voorbeelden' },
    travelIncluded: 'Inbegrepen',
    travelOnQuote: 'Op offerte',
    travelHotel: 'Huwelijk in zone 3 of 4: een hotelovernachting (€ 150) wordt toegevoegd, omdat het feest laat eindigt.',
    whyTitle: 'Waarom deze prijzen',
    why: [
      'Eén persoon, geen agentschap: geen tussenmarge, geen uitbestede montage, geen verkoper. U praat met wie de camera vasthoudt.',
      'Foto en video door dezelfde persoon kosten minder dan twee leveranciers: één verplaatsing, één verkenning, één werkdag. Die besparing krijgt u terug op de combinatie.',
      'De prijzen zijn dezelfde in de vier landen. Alleen het verplaatsingstarief verandert, en dat staat online. In Luxemburg, waar de markt 15 tot 30 % duurder is, is dat een echt voordeel.',
      'Materiaal, dubbele back-ups, muzieklicenties en verzekeringen zijn inbegrepen. Wat optioneel is, staat hierboven, met zijn prijs.',
    ],
    marketTitle: 'Ter vergelijking: de marktprijzen',
    market: [
      { label: 'Trouwfotograaf in België, volledige dag', range: '€ 1 400 – 3 500', source: 'wewed.be, prophotos.be' },
      { label: 'Trouwvideograaf in België', range: '€ 1 500 – 3 000', source: 'tosanproductions.com, fotograafkiezen.nl' },
      { label: 'Foto + video in Nederland (twee personen)', range: '€ 3 100 – 4 700', source: 'shotsbycharlotte.com, royvanderwens.com' },
      { label: 'Trouwfotograaf in Frankrijk, mediaan', range: '€ 1 800 – 2 200', source: 'mariages.net, noxio.fr' },
      { label: 'Bedrijfsvideo via een agentschap', range: '€ 2 000 – 10 000', source: 'bataljon.be, flashbiz.fr' },
      { label: 'LinkedIn-portret in Brussel', range: '€ 150 – 350', source: 'sanderdewilde.com' },
    ],
    marketNote: 'Opgetekend in september 2026 op de vermelde sites. Prijsvorken veranderen; controleer ze voor u vergelijkt.',
    termsTitle: 'Voorwaarden',
    terms: [
      { name: 'Reservatie', body: 'Een voorschot van 30 % legt de datum vast. Het saldo is verschuldigd bij levering.' },
      { name: 'Annulering', body: 'Voorschot terugbetaald bij annulering meer dan 90 dagen vóór de datum; één gratis verplaatsing van datum, volgens beschikbaarheid.' },
      { name: 'Levering', body: 'Voorproefje van de foto’s binnen 7 dagen, volledige galerij en film binnen 2 tot 4 weken naargelang het seizoen. Twee rondes feedback inbegrepen.' },
      { name: 'Rechten', body: 'Volledig gebruik van de beelden voor eigen doeleinden; commerciële rechten inbegrepen in de formules zakelijk, sport en clip. De studio behoudt het recht om zijn werk te tonen, tenzij u dat weigert.' },
      { name: 'Back-up', body: 'Dubbele geheugenkaart bij de opname, kopie op twee dragers dezelfde avond, online galerij 12 maanden bewaard.' },
      { name: 'Btw', body: 'Belgische btw van 21 % inbegrepen in de prijzen incl. btw. Voor een btw-plichtig bedrijf buiten België: factuur met verlegde btw.' },
    ],
    faqTitle: 'Vragen over de tarieven',
    faq: [
      { question: 'Zijn er verborgen kosten?', answer: 'Nee. De prijs van de formule, het verplaatsingstarief van uw zone en de opties die u kiest: meer staat er niet op de offerte.' },
      { question: 'Kunnen we in schijven betalen?', answer: 'Ja: 30 % bij reservatie, het saldo bij levering, of in drie keer op aanvraag voor een huwelijk.' },
      { question: 'Verandert de prijs per land?', answer: 'Nee, alleen het verplaatsingstarief verandert. Een huwelijk in Maastricht of Luxemburg-Stad kost de Belgische prijs plus € 90 of € 190 verplaatsing.' },
      { question: 'Wat als het regent?', answer: 'We filmen. De verkenning voorziet altijd een binnenplan, en de drone-optie wordt gewoon verplaatst of terugbetaald als vliegen onmogelijk is.' },
      { question: 'Is er korting buiten het seizoen of in de week?', answer: 'Ja, voor een huwelijk van november tot maart of op een weekdag: vermeld het in het bericht van het formulier, de offerte houdt er rekening mee.' },
      { question: 'Hoeveel kost een tweede fotograaf of videograaf?', answer: '€ 490 voor de dag. Hij wordt voorgesteld, niet opgelegd, vanaf 120 gasten of bij een lange religieuze ceremonie.' },
      { question: 'Zijn de prijzen onderhandelbaar?', answer: 'De grille is dezelfde voor iedereen, dat maakt ze eerlijk. Op maat laat wel toe om duur en eindproducten aan uw budget aan te passen.' },
      { question: 'Verbindt de offerte ergens toe?', answer: 'Nee. Ze is gratis, concreet binnen 48 u en 30 dagen geldig. De datum wordt pas vastgelegd bij ontvangst van het voorschot.' },
    ],
    ctaTitle: 'Een offerte binnen 48 u',
    ctaBody: 'Geef ons de categorie, de formule die u aanspreekt, de regio en de datum: u ontvangt een concrete offerte, verplaatsing inbegrepen.',
  },
  en: {
    title: 'Photo & video pricing 2026',
    metaTitle: 'Photographer & videographer pricing 2026 — Belgium, France, Luxembourg, Netherlands',
    metaDescription: `Published prices, incl. or excl. VAT: photo, video or photo + video by the same person, across 6 categories. Weddings from ${mariage}, lifestyle sessions from ${lifestyle}. Extras, travel fees, terms.`,
    eyebrow: 'Pricing',
    inBrief: [
      '6 categories: wedding, events, corporate, sport, music video, lifestyle.',
      '4 packages per category: photo, video, photo + video by the same person, or custom.',
      `Published prices, from ${lifestyle} (lifestyle session) to ${mariageCombo} (wedding photo + video, full day).`,
      'VAT included for private clients, excluded for businesses — the mention sits next to every price.',
      'Travel included up to 60 km from Brussels, then a flat fee: €90, €190, €290.',
      'Itemised quote within 48 h, two rounds of edits included, photo sneak peek within 7 days.',
    ],
    packTypesTitle: 'Four packages, one logic',
    packTypes: [
      { name: 'Photo + editing', body: 'The shoot and the editing of every photo, delivered in an online gallery. For those who want images to keep, print and share.' },
      { name: 'Video + editing', body: 'The shoot, the edit, colour grading and licensed music. A film that tells the story, plus short cuts for social media.' },
      { name: 'Photo + video', body: 'Both, by the same person, on the same day. One style, one point of contact, fewer people around you — and a price below the two packages separately.' },
      { name: 'Custom', body: 'A duration, deliverables or extras outside the grid: a two-day wedding, a weekend competition, monthly content for a brand. Quote within 48 h.' },
    ],
    gridsTitle: 'Prices, category by category',
    gridsLead: 'Each table gives the duration, what you receive and what is included. The combo is outlined: it is the most requested package, and the best value.',
    optionsTitle: 'Optional extras',
    optionsLead: 'Can be added to any package, priced upfront so there is nothing to discover on the quote.',
    travelTitle: 'Travel: a flat fee per zone',
    travelLead: 'Measured from Brussels / Wemmel. No per-kilometre rate, no “contact us”: the fee is known before the first conversation.',
    travelColumns: { zone: 'Zone', distance: 'Distance', fee: 'Fee', examples: 'Examples' },
    travelIncluded: 'Included',
    travelOnQuote: 'On quote',
    travelHotel: 'Wedding in zone 3 or 4: a hotel night (€150) is added, because the party ends late.',
    whyTitle: 'Why these prices',
    why: [
      'One person, no agency: no middle margin, no outsourced editing, no sales rep. You talk to the one holding the camera.',
      'Photo and video by the same person cost less than two suppliers: one trip, one scouting visit, one day of work. That saving goes back to you on the combo.',
      'Prices are the same in all four countries. Only the travel fee changes, and it is published. In Luxembourg, where the market is 15 to 30% more expensive, that is a real advantage.',
      'Equipment, double backups, music licences and insurance are included. What is optional is listed above, with its price.',
    ],
    marketTitle: 'For comparison: market ranges',
    market: [
      { label: 'Wedding photographer in Belgium, full day', range: '€1,400 – 3,500', source: 'wewed.be, prophotos.be' },
      { label: 'Wedding videographer in Belgium', range: '€1,500 – 3,000', source: 'tosanproductions.com, fotograafkiezen.nl' },
      { label: 'Photo + video in the Netherlands (two people)', range: '€3,100 – 4,700', source: 'shotsbycharlotte.com, royvanderwens.com' },
      { label: 'Wedding photographer in France, median', range: '€1,800 – 2,200', source: 'mariages.net, noxio.fr' },
      { label: 'Corporate video from an agency', range: '€2,000 – 10,000', source: 'bataljon.be, flashbiz.fr' },
      { label: 'LinkedIn headshot in Brussels', range: '€150 – 350', source: 'sanderdewilde.com' },
    ],
    marketNote: 'Recorded in September 2026 on the sites cited. Ranges move; check them before comparing.',
    termsTitle: 'Terms',
    terms: [
      { name: 'Booking', body: 'A 30% deposit secures the date. The balance is due on delivery.' },
      { name: 'Cancellation', body: 'Deposit refunded if you cancel more than 90 days before the date; one free reschedule, subject to availability.' },
      { name: 'Delivery', body: 'Photo sneak peek within 7 days, full gallery and film within 2 to 4 weeks depending on the season. Two rounds of edits included.' },
      { name: 'Rights', body: 'Full use of the images for your own needs; commercial rights included in the corporate, sport and music video packages. The studio keeps the right to show its work, unless you say otherwise.' },
      { name: 'Backup', body: 'Dual memory cards during the shoot, copied to two drives the same evening, online gallery kept for 12 months.' },
      { name: 'VAT', body: 'Belgian VAT of 21% included in VAT-inclusive prices. For a VAT-registered business outside Belgium, invoices are issued under the reverse-charge mechanism.' },
    ],
    faqTitle: 'Questions about pricing',
    faq: [
      { question: 'Are there any hidden fees?', answer: 'No. The package price, the travel fee for your zone and the extras you choose: that is everything on the quote.' },
      { question: 'Can we pay in instalments?', answer: 'Yes: 30% on booking, the balance on delivery, or in three instalments on request for a wedding.' },
      { question: 'Does the price change by country?', answer: 'No, only the travel fee changes. A wedding in Lille or Luxembourg City costs the Belgian price plus €90 or €190 of travel.' },
      { question: 'What if it rains?', answer: 'We shoot. Scouting always includes an indoor plan, and the drone option is simply rescheduled or refunded if flying is impossible.' },
      { question: 'Is there an off-season or weekday discount?', answer: 'Yes, for a wedding from November to March or on a weekday: mention it in the form message, the quote takes it into account.' },
      { question: 'How much is a second photographer or videographer?', answer: '€490 for the day. Offered, never imposed, above 120 guests or for a long religious ceremony.' },
      { question: 'Are prices negotiable?', answer: 'The grid is the same for everyone, which is what makes it fair. The custom option does let you adjust duration and deliverables to your budget.' },
      { question: 'Does a quote commit me to anything?', answer: 'No. It is free, itemised within 48 h and valid for 30 days. The date is only secured once the deposit is received.' },
    ],
    ctaTitle: 'A quote within 48 h',
    ctaBody: 'Tell us the category, the package that speaks to you, the region and the date: you receive an itemised quote, travel fee included.',
  },
};
