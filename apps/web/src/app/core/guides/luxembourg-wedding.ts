import type { Guide } from '../guide-content';
import { formatPrice, pricingFor } from '../packs';

const m = pricingFor('mariage');
const price = (type: 'photo' | 'video' | 'combo') => formatPrice(m.packs.find((p) => p.type === type)!.price!);

/**
 * Guide organisation : se marier au Grand-Duché. FR et EN (le marché
 * luxembourgeois cherche dans les deux langues ; le luxembourgeois et
 * l'allemand sont servis par les mêmes pages). Les règles citées sont celles
 * du Code civil luxembourgeois telles que publiées par guichet.lu en 2026 ;
 * les délais et les salles relèvent de chaque commune.
 */
export const GUIDES_LUXEMBOURG: readonly Guide[] = [
  {
    slug: 'se-marier-au-luxembourg-lieux-et-demarches',
    locale: 'fr',
    group: 'mariage-luxembourg',
    category: 'mariage',
    title: 'Se marier au Luxembourg : lieux de réception, démarches et photos',
    metaTitle: 'Se marier au Luxembourg (2026) : démarches, communes, lieux, photographe',
    metaDescription: 'Qui peut se marier au Grand-Duché, la déclaration de mariage et les documents, la cérémonie à l’hôtel de ville, les châteaux et domaines de réception, les spots photo de la capitale et du pays, et le prix d’un photographe-vidéaste venu de Bruxelles.',
    eyebrow: 'Guide organisation',
    published: '2026-10-05',
    readingMinutes: 10,
    answer: `Au Luxembourg, le mariage civil se célèbre à la maison communale de la commune où l’un des deux futurs époux a sa résidence légale ; un couple non résident ne peut pas s’y marier. La déclaration se fait à la commune avec les actes de naissance, les pièces d’identité, un certificat de résidence et, pour les non-Luxembourgeois, un certificat de coutume ou de capacité matrimoniale, légalisés et traduits ; la cérémonie est en luxembourgeois, en français ou en allemand. Les réceptions se tiennent dans les châteaux et domaines du pays (Bourglinster, Urspelt, Septfontaines, Schengen, Neumünster) ou de l’autre côté de la frontière, où les prix sont plus bas. Un photographe-vidéaste en une seule personne depuis Bruxelles coûte ${price('combo')} TTC plus 190 € de déplacement et une nuit d’hôtel, souvent 20 à 30 % sous les prix du marché luxembourgeois.`,
    sections: [
      {
        title: 'Qui peut se marier au Luxembourg',
        paragraphs: [
          'Le mariage civil se célèbre dans la commune où l’un des futurs époux a sa résidence légale, c’est-à-dire où il est inscrit au registre de la population. Les deux peuvent être étrangers ; mais un couple dont aucun des deux ne réside au Grand-Duché ne peut pas s’y marier civilement, sauf cas particuliers de Luxembourgeois résidant à l’étranger. C’est la règle qui écarte les mariages de destination au Luxembourg : on y célèbre, on ne s’y marie pas sans y vivre.',
          'Le mariage entre personnes de même sexe est ouvert depuis 2015, avec les mêmes démarches. Le partenariat (PACS luxembourgeois) est l’alternative, déclaré à la commune, sans cérémonie.',
          'Une cérémonie religieuse ou laïque ne peut avoir lieu qu’après le mariage civil.',
        ],
      },
      {
        title: 'Les démarches, pas à pas',
        paragraphs: ['Comptez deux à quatre mois, davantage si des documents viennent de loin.'],
        list: [
          'Contactez le bureau de l’état civil de votre commune : guichet.lu publie la liste des pièces, et chaque commune précise ses jours et ses salles.',
          'Réunissez les documents : extrait d’acte de naissance récent, pièce d’identité, certificat de résidence, et pour les non-Luxembourgeois un certificat de coutume ou de capacité matrimoniale délivré par votre pays ou votre ambassade ; les actes étrangers sont apostillés ou légalisés, et traduits par un traducteur assermenté s’ils ne sont pas en français, allemand ou luxembourgeois. Les formulaires européens multilingues évitent la traduction.',
          'Déposez le dossier ensemble à la commune. L’officier de l’état civil procède à la publication des bans, affichée pendant dix jours à la maison communale ; le mariage peut être célébré à partir du onzième jour et dans l’année qui suit.',
          'Fixez la date et la salle : les communes célèbrent en semaine et, pour la plupart, le samedi matin ; Luxembourg-Ville marie à l’hôtel de ville de la place Guillaume II.',
          'La cérémonie : lecture des articles du Code civil, consentement, signatures des époux et des témoins (deux à quatre, majeurs). Quinze à trente minutes. Vous repartez avec le livret de famille.',
        ],
      },
      {
        title: 'Les lieux de réception',
        paragraphs: ['Les capacités et les prix sont ceux des lieux ; voici leur caractère et ce qu’ils donnent en image.'],
        table: {
          columns: ['Lieu', 'Où', 'Type', 'En image'],
          rows: [
            ['Château de Bourglinster', 'Bourglinster', 'Château et restaurant', 'La cour, les remparts, la vallée ; à vingt minutes de la capitale'],
            ['Château d’Urspelt', 'Urspelt (Clervaux)', 'Château-hôtel', 'Les Ardennes luxembourgeoises, le parc, les chambres sur place'],
            ['Château de Septfontaines', 'Luxembourg-Rollingergrund', 'Château (Villeroy & Boch)', 'Les jardins, les salons ; en ville'],
            ['Château de Schengen', 'Schengen', 'Château-hôtel', 'La Moselle, les vignes, les jardins'],
            ['Abbaye de Neumünster', 'Luxembourg-Grund', 'Centre culturel', 'Le cloître, la vue sur la Corniche ; réceptions et événements'],
            ['Cercle Cité', 'Luxembourg-Ville', 'Salles de réception', 'La place d’Armes, les salons historiques'],
            ['Domaine thermal de Mondorf', 'Mondorf-les-Bains', 'Hôtel et parc', 'Le parc, les thermes, le casino à côté'],
            ['Hôtel Le Place d’Armes', 'Luxembourg-Ville', 'Hôtel', 'Les préparatifs et la réception au centre'],
            ['Pont Adolphe, Chemin de la Corniche, Grund', 'Luxembourg-Ville', 'Spots photo', 'Les ponts, la vallée de la Pétrusse, les remparts'],
            ['Château de Vianden et Mullerthal', 'Nord et est', 'Spots photo', 'Le château sur son éperon, les rochers et les forêts'],
          ],
          note: 'Liste non exhaustive. Les prix de réception au Luxembourg sont parmi les plus élevés de la région ; beaucoup de couples reçoivent en Belgique (Arlon, Ardennes) ou en Lorraine à quelques kilomètres.',
        },
      },
      {
        title: 'Les photos : la capitale et le pays',
        paragraphs: [
          'Luxembourg-Ville se photographie en une heure à pied depuis la place Guillaume II : la place d’Armes, le Chemin de la Corniche au-dessus du Grund, le Pont Adolphe et la vallée de la Pétrusse, les casemates du Bock, l’ascenseur du Pfaffenthal pour la vue. Le soir, le Kirchberg et la Philharmonie pour un rendu contemporain.',
          'Hors de la ville : le château de Vianden, le Mullerthal et ses rochers, les vignes de la Moselle à Remich et Schengen, le lac de la Haute-Sûre. Le drone est possible hors de la capitale et des zones protégées, avec l’enregistrement européen de l’opérateur.',
        ],
      },
      {
        title: 'Le prix d’un photographe-vidéaste au Luxembourg',
        paragraphs: [
          `Le marché luxembourgeois est 15 à 30 % plus cher que le belge : un photographe de mariage y demande entre 1 800 et 4 000 €, un vidéaste entre 2 000 et 3 500 €, et les duos dépassent 4 000 €. Depuis Bruxelles, Heaven Motion facture ${price('photo')} TTC en photo, ${price('video')} en vidéo, ${price('combo')} pour les deux par la même personne, plus 190 € de déplacement (zone 3) et 150 € de nuit d’hôtel : environ 3 030 € tout compris pour la photo et la vidéo.`,
          'La TVA : pour un particulier, la facture est belge avec TVA belge de 21 % (le prix affiché est TTC) ; pour une entreprise luxembourgeoise assujettie, autoliquidation. Les films sont montés sur de la musique sous licence.',
        ],
      },
    ],
    faq: [
      { question: 'Peut-on se marier au Luxembourg sans y habiter ?', answer: 'Non : le mariage civil se célèbre dans la commune de résidence légale de l’un des deux futurs époux. Un couple non résident se marie dans son pays et célèbre au Luxembourg.' },
      { question: 'Combien de temps à l’avance faire les démarches ?', answer: 'Deux à quatre mois : le temps de réunir et de légaliser les documents, puis dix jours de publication des bans avant la cérémonie.' },
      { question: 'Dans quelle langue se déroule la cérémonie ?', answer: 'En luxembourgeois, en français ou en allemand, au choix des époux ; un interprète est possible pour les autres langues.' },
      { question: 'Combien coûte un photographe de mariage au Luxembourg ?', answer: 'Entre 1 800 et 4 000 € pour la photo seule sur le marché local. Depuis Bruxelles, ' + price('combo') + ' TTC pour la photo et la vidéo par la même personne, plus 190 € de déplacement et 150 € de nuit d’hôtel.' },
      { question: 'Un photographe belge peut-il travailler au Luxembourg sans formalité ?', answer: 'Oui : prestation de service intracommunautaire, facture belge pour un particulier, autoliquidation pour une entreprise. Rien à faire de votre côté.' },
    ],
    ctaTitle: 'Un devis pour votre mariage au Luxembourg',
    ctaBody: 'Dites-nous la commune, le lieu de réception et la date : vous recevez sous 48 h un devis avec la formule, le déplacement et la nuit d’hôtel.',
    related: [
      { label: 'Photographe & vidéaste au Luxembourg', path: '/zones/luxembourg/luxembourg' },
      { label: 'Photographe & vidéaste de mariage', path: '/prestations/mariage' },
      { label: 'Combien coûte un photographe-vidéaste de mariage en Belgique', path: '/guides/prix-photographe-videaste-mariage-belgique-2026' },
    ],
  },
  {
    slug: 'getting-married-in-luxembourg-venues-and-procedure',
    locale: 'en',
    group: 'mariage-luxembourg',
    category: 'mariage',
    title: 'Getting married in Luxembourg: procedure, venues and photos',
    metaTitle: 'Getting married in Luxembourg (2026): procedure, communes, venues, photographer',
    metaDescription: 'Who can marry in the Grand Duchy, the declaration and documents, the ceremony at the town hall, the châteaux and estates for the reception, the photo spots in the capital and the country, and the price of a Brussels-based photographer and videographer.',
    eyebrow: 'Planning guide',
    published: '2026-10-05',
    readingMinutes: 10,
    answer: `In Luxembourg, the civil wedding takes place at the town hall of the commune where one of you is legally resident; a non-resident couple cannot marry there. You file the declaration at the commune with birth certificates, IDs, a certificate of residence and, for non-Luxembourgers, a certificate of custom or of capacity to marry, legalised and translated; the ceremony is in Luxembourgish, French or German. Receptions are held in the country’s châteaux and estates (Bourglinster, Urspelt, Septfontaines, Schengen, Neumünster) or just across the border, where prices are lower. A photographer and videographer in one person from Brussels costs ${price('combo')} incl. VAT plus €190 of travel and a hotel night, often 20 to 30% below Luxembourg market prices, working in English.`,
    sections: [
      {
        title: 'Who can marry in Luxembourg',
        paragraphs: [
          'The civil wedding is celebrated in the commune where one of the future spouses is legally resident, meaning registered in the population register. Both can be foreign nationals; but a couple where neither lives in the Grand Duchy cannot marry there, apart from special cases for Luxembourg nationals living abroad. That is the rule that rules out destination weddings in Luxembourg: you can celebrate here, you cannot legally marry here without living here.',
          'Same-sex marriage has been open since 2015, with the same procedure. The partnership (Luxembourg PACS) is the alternative, declared at the commune, without a ceremony.',
          'A religious or symbolic ceremony can only take place after the civil wedding.',
        ],
      },
      {
        title: 'The procedure, step by step',
        paragraphs: ['Count two to four months, longer if documents come from far away.'],
        list: [
          'Contact the civil status office of your commune: guichet.lu lists the documents, and each commune states its days and halls.',
          'Gather the documents: a recent birth certificate extract, ID, certificate of residence, and for non-Luxembourgers a certificate of custom or of capacity to marry issued by your country or embassy; foreign documents are apostilled or legalised, and translated by a sworn translator unless in French, German or Luxembourgish. EU multilingual forms avoid translation.',
          'File the declaration together at the commune. The registrar publishes the banns, posted for ten days at the town hall; the wedding can be celebrated from the eleventh day and within the following year.',
          'Set the date and the hall: communes celebrate on weekdays and, most of them, on Saturday mornings; Luxembourg City marries at the town hall on place Guillaume II.',
          'The ceremony: reading of the Civil Code articles, consent, signatures of the spouses and witnesses (two to four adults). Fifteen to thirty minutes. You leave with the family record book.',
        ],
      },
      {
        title: 'Reception venues',
        paragraphs: ['Capacities and prices belong to the venues; here is their character and what they give in pictures.'],
        table: {
          columns: ['Venue', 'Where', 'Type', 'In pictures'],
          rows: [
            ['Château de Bourglinster', 'Bourglinster', 'Castle and restaurant', 'The courtyard, the ramparts, the valley; twenty minutes from the capital'],
            ['Château d’Urspelt', 'Urspelt (Clervaux)', 'Castle hotel', 'The Luxembourg Ardennes, the park, rooms on site'],
            ['Château de Septfontaines', 'Luxembourg-Rollingergrund', 'Castle (Villeroy & Boch)', 'The gardens, the salons; in the city'],
            ['Château de Schengen', 'Schengen', 'Castle hotel', 'The Moselle, the vineyards, the gardens'],
            ['Neumünster Abbey', 'Luxembourg-Grund', 'Cultural centre', 'The cloister, the view of the Corniche; receptions and events'],
            ['Cercle Cité', 'Luxembourg City', 'Reception halls', 'Place d’Armes, historic salons'],
            ['Domaine Thermal Mondorf', 'Mondorf-les-Bains', 'Hotel and park', 'The park, the spa, the casino next door'],
            ['Hôtel Le Place d’Armes', 'Luxembourg City', 'Hotel', 'Getting ready and reception in the centre'],
            ['Pont Adolphe, Chemin de la Corniche, Grund', 'Luxembourg City', 'Photo spots', 'The bridges, the Pétrusse valley, the ramparts'],
            ['Vianden Castle and the Mullerthal', 'North and east', 'Photo spots', 'The castle on its spur, the rocks and forests'],
          ],
          note: 'Not exhaustive. Reception prices in Luxembourg are among the highest in the region; many couples celebrate in Belgium (Arlon, the Ardennes) or in Lorraine a few kilometres away.',
        },
      },
      {
        title: 'Photos: the capital and the country',
        paragraphs: [
          'Luxembourg City is photographed in one hour on foot from place Guillaume II: place d’Armes, the Chemin de la Corniche above the Grund, the Pont Adolphe and the Pétrusse valley, the Bock casemates, the Pfaffenthal lift for the view. In the evening, the Kirchberg and the Philharmonie for a contemporary look.',
          'Outside the city: Vianden Castle, the Mullerthal and its rocks, the Moselle vineyards at Remich and Schengen, the Upper Sûre lake. Drones are possible outside the capital and protected areas, with the EU operator registration.',
        ],
      },
      {
        title: 'What a photographer and videographer costs in Luxembourg',
        paragraphs: [
          `The Luxembourg market is 15 to 30% dearer than the Belgian one: a wedding photographer charges between €1,800 and €4,000, a videographer between €2,000 and €3,500, and duos exceed €4,000. From Brussels, Heaven Motion charges ${price('photo')} incl. VAT for photo, ${price('video')} for video, ${price('combo')} for both by the same person, plus €190 of travel (zone 3) and a €150 hotel night: about €3,030 all in for photo and video.`,
          'VAT: for a private client the invoice is Belgian with 21% Belgian VAT (the displayed price is inclusive); for a VAT-registered Luxembourg company, reverse charge. Films are edited on licensed music.',
        ],
      },
    ],
    faq: [
      { question: 'Can we marry in Luxembourg without living there?', answer: 'No: the civil wedding is celebrated in the commune of legal residence of one of the future spouses. A non-resident couple marries at home and celebrates in Luxembourg.' },
      { question: 'How far ahead should we start the procedure?', answer: 'Two to four months: time to gather and legalise the documents, then ten days of banns before the ceremony.' },
      { question: 'In which language is the ceremony?', answer: 'In Luxembourgish, French or German, as the spouses choose; an interpreter is possible for other languages, and many registrars add a few words in English.' },
      { question: 'How much does a wedding photographer cost in Luxembourg?', answer: 'Between €1,800 and €4,000 for photography alone on the local market. From Brussels, ' + price('combo') + ' incl. VAT for photo and video by the same person, plus €190 of travel and a €150 hotel night.' },
      { question: 'Can a Belgian photographer work in Luxembourg without formalities?', answer: 'Yes: intra-EU service, Belgian invoice for a private client, reverse charge for a company. Nothing to do on your side.' },
    ],
    ctaTitle: 'A quote for your Luxembourg wedding',
    ctaBody: 'Tell us the commune, the reception venue and the date: you receive within 48 h a quote with the package, the travel fee and the hotel night.',
    related: [
      { label: 'Photographer & videographer in Luxembourg', path: '/en/areas/luxembourg/luxembourg' },
      { label: 'Wedding photographer & videographer', path: '/en/services/wedding' },
      { label: 'How much does a wedding photographer cost in Belgium', path: '/en/guides/wedding-photographer-cost-belgium-2026' },
    ],
  },
];
