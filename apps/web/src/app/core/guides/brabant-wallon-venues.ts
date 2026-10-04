import type { Guide } from '../guide-content';
import { formatPrice, pricingFor } from '../packs';

const m = pricingFor('mariage');
const price = (type: 'photo' | 'video' | 'combo') => formatPrice(m.packs.find((p) => p.type === type)!.price!);

/**
 * Guide « choisir un lieu » : les lieux de mariage du Brabant wallon. En
 * français seulement (le marché NL cherche « trouwlocatie Waals-Brabant »
 * très peu). Les lieux sont réels et décrits par leur caractère et ce
 * qu'ils donnent en photo ; aucune capacité ni aucun prix de location n'est
 * avancé, ce sont des données que seul le lieu peut confirmer. Aucun lieu
 * n'est présenté comme déjà tourné tant que le projet n'est pas publié.
 */
export const GUIDES_BRABANT_WALLON_VENUES: readonly Guide[] = [
  {
    slug: 'lieux-mariage-brabant-wallon',
    locale: 'fr',
    group: 'lieux-brabant-wallon',
    category: 'mariage',
    title: 'Les plus beaux lieux de mariage en Brabant wallon : châteaux, fermes, domaines et maisons communales',
    metaTitle: 'Lieux de mariage en Brabant wallon : 12 châteaux, fermes et domaines (2026)',
    metaDescription: 'Douze lieux de réception du Brabant wallon décrits par leur caractère et ce qu’ils donnent en photo, les maisons communales pour le civil, les spots de séance couple, le calendrier de réservation et le budget.',
    eyebrow: 'Guide lieux',
    published: '2026-10-05',
    readingMinutes: 10,
    answer: 'Le Brabant wallon concentre, à trente minutes de Bruxelles, trois types de lieux de mariage : les châteaux et abbayes (Château de La Hulpe, Château de Limelette, Abbaye de Villers-la-Ville), les fermes et châteaux-fermes brabançons (Ferme de La Hulpe, Ferme de Bousval, Moriensart, Grambais, Dion-Valmont) et les domaines au bord de l’eau (Domaine du Lac et Château du Lac à Genval). Le civil se célèbre à la maison communale de la commune où l’un de vous est domicilié, Wavre, Waterloo, Nivelles, Ottignies-Louvain-la-Neuve ou La Hulpe le plus souvent. Les bons samedis de mai à septembre se réservent 12 à 18 mois à l’avance. Voici les douze lieux, ce qu’ils donnent en image, et comment organiser la journée.',
    sections: [
      {
        title: 'Les douze lieux, en un tableau',
        paragraphs: ['Les lieux sont classés par type. Capacités, prix de location et disponibilités sont à demander au lieu : ils changent chaque saison.'],
        table: {
          columns: ['Lieu', 'Commune', 'Type', 'Ce qu’il donne en photo'],
          rows: [
            ['Château de La Hulpe (domaine Solvay)', 'La Hulpe', 'Château et parc', 'Les terrasses, le parc de 220 hectares et ses rhododendrons en mai, la lumière du soir sur la façade'],
            ['Ferme de La Hulpe', 'La Hulpe', 'Ferme brabançonne', 'La cour carrée, les briques, la grange pour la soirée ; le parc du château à côté pour la séance'],
            ['Abbaye de Villers-la-Ville', 'Villers-la-Ville', 'Ruines d’abbaye', 'Les arches à ciel ouvert, le cloître, les contre-jours ; un décor que rien ne remplace'],
            ['Château de Limelette', 'Ottignies-Louvain-la-Neuve', 'Château-hôtel', 'Le parc et les étangs, les salons ; tout sur place, des préparatifs à la nuit'],
            ['Ferme de Bousval', 'Genappe', 'Ferme', 'Le verger, la grange, les champs autour ; le mariage champêtre du Brabant'],
            ['Château-ferme de Moriensart', 'Céroux-Mousty', 'Château-ferme', 'Le donjon médiéval, la cour, le jardin ; une sortie de cérémonie sous la tour'],
            ['Domaine du Lac de Genval', 'Genval', 'Domaine au bord du lac', 'Le lac au coucher du soleil, les pontons, les terrasses'],
            ['Château du Lac', 'Genval', 'Hôtel et salles', 'La façade néo-normande, le lac, les salons ; pratique pour les invités qui dorment'],
            ['Ferme de Grambais', 'Nivelles', 'Ferme', 'La grange restaurée, la cour, les champs ; la lumière du Roman Païs'],
            ['Ferme de Dion-Valmont', 'Chaumont-Gistoux', 'Ferme', 'Les bâtiments en pierre, le jardin, la campagne autour'],
            ['Collégiale Sainte-Gertrude', 'Nivelles', 'Église romane', 'La nef, le parvis, la Grand-Place pour la sortie'],
            ['Butte du Lion', 'Waterloo (Braine-l’Alleud)', 'Site et plaine', 'Pour la séance couple : les escaliers, la plaine, le ciel'],
          ],
          note: 'Liste non exhaustive. Aucun de ces lieux n’est présenté comme une référence de Heaven Motion tant que le projet correspondant n’est pas publié.',
        },
      },
      {
        title: 'Les châteaux et l’abbaye',
        paragraphs: [
          'Le Château de La Hulpe est le lieu le plus demandé de la province : un château de 1842 au milieu d’un domaine régional de 220 hectares, avec des terrasses à degrés et des pelouses qui descendent vers les étangs. En photo, le soir de mai et juin est imbattable : les rhododendrons sont en fleur et la façade prend la lumière rasante. Le parc est public, ce qui impose une séance couple matinale ou en semaine pour éviter les promeneurs ; le domaine a ses règles de prise de vue, à confirmer au repérage.',
          'L’Abbaye de Villers-la-Ville est un cas à part : des ruines cisterciennes du XIIIe siècle, à ciel ouvert, avec des arches, un cloître et un jardin de plantes médicinales. On s’y marie sous les voûtes effondrées, avec une lumière qui tombe de partout ; le risque, c’est la pluie, et le plan B doit être prévu avec le lieu. Rien d’autre en Belgique ne ressemble à ça.',
          'Le Château de Limelette, à Ottignies, est un château-hôtel : les préparatifs dans les chambres, la cérémonie dans le parc, la réception dans les salons et la nuit sur place. C’est la journée la plus simple à organiser, et la plus reposante à couvrir.',
        ],
      },
      {
        title: 'Les fermes et châteaux-fermes',
        paragraphs: [
          'Le Brabant wallon est une terre de fermes en carré : une cour fermée, des bâtiments en brique ou en pierre, une grange qui devient salle de réception. La Ferme de La Hulpe, à côté du château, la Ferme de Bousval à Genappe, la Ferme de Grambais à Nivelles et la Ferme de Dion-Valmont à Chaumont-Gistoux relèvent de ce modèle, chacune avec son jardin ou son verger pour la cérémonie laïque et la séance couple.',
          'Le Château-ferme de Moriensart, à Céroux-Mousty, ajoute un donjon médiéval à la cour : la sortie de cérémonie sous la tour est l’image signature du lieu.',
          'En photo, les fermes donnent des intérieurs chauds (brique, bois, bougies) et des extérieurs de campagne ; la lumière de la cour en fin d’après-midi est souvent la meilleure de la journée. Le drone y est généralement possible, ce qui n’est pas le cas en ville.',
        ],
      },
      {
        title: 'Les domaines au bord du lac',
        paragraphs: [
          'Le lac de Genval réunit deux lieux : le Domaine du Lac, pour une réception les pieds dans l’eau, et le Château du Lac, hôtel à la façade néo-normande dont les salons ouvrent sur le lac. Le coucher de soleil sur l’eau est le moment à réserver pour la séance couple, vers 20 h en juin ; les pontons et les barques servent de décor.',
        ],
      },
      {
        title: 'Le civil : les maisons communales du Brabant wallon',
        paragraphs: [
          'Le mariage civil se célèbre dans la commune où l’un des deux est domicilié. Les maisons communales les plus photogéniques de la province sont celles de Nivelles (sur la Grand-Place, à côté de la collégiale), de Wavre (hôtel de ville dans l’ancien couvent des Carmes), de Waterloo et de La Hulpe. À Louvain-la-Neuve, la cérémonie se tient à la maison communale d’Ottignies ou dans les locaux de Louvain-la-Neuve selon le calendrier. Toutes acceptent un photographe dans la salle ; la place et le flash sont fixés par l’officier.',
          'Si vous n’êtes pas domiciliés dans la province, le civil se fait chez vous (Bruxelles, souvent) le matin ou la veille, et la journée au lieu de réception commence par une cérémonie laïque. C’est le schéma le plus courant pour les couples bruxellois qui se marient en Brabant wallon.',
        ],
      },
      {
        title: 'Les spots de séance couple',
        paragraphs: ['Trente à soixante minutes à deux, entre le vin d’honneur et le dîner, ou le lendemain matin.'],
        list: [
          'Le parc du Château de La Hulpe : les terrasses, les étangs, les allées de rhododendrons (mai–juin).',
          'Les ruines de Villers-la-Ville : les arches et le cloître, en contre-jour.',
          'Le lac de Genval : les pontons au coucher du soleil.',
          'La Butte du Lion et la plaine de Waterloo : le ciel, les escaliers, l’herbe haute en été.',
          'Le bois de Lauzelle et les champs de Louvain-la-Neuve : pour un rendu nature, à dix minutes des salles.',
          'Le cœur de Nivelles : la collégiale, la Grand-Place, les ruelles.',
        ],
      },
      {
        title: 'Calendrier, budget et déplacement',
        paragraphs: [
          'Les lieux les plus demandés (La Hulpe, Villers, Genval) sont réservés 12 à 18 mois à l’avance pour un samedi de mai à septembre ; un vendredi, un dimanche ou un mois d’avril ou d’octobre se trouvent à 6 à 9 mois. Les prestataires suivent le même calendrier : photographe et vidéaste se réservent juste après le lieu.',
          `Côté image, tout le Brabant wallon est dans la zone incluse de Heaven Motion : aucun frais de déplacement. Journée complète : ${price('photo')} TTC en photo, ${price('video')} TTC en vidéo, ${price('combo')} TTC pour les deux par la même personne, avec le repérage du lieu inclus.`,
        ],
      },
    ],
    faq: [
      { question: 'Quel est le plus beau lieu de mariage du Brabant wallon ?', answer: 'Le Château de La Hulpe pour le parc et la façade, l’Abbaye de Villers-la-Ville pour un décor unique, le lac de Genval pour le coucher de soleil. Le plus beau est celui qui correspond à votre nombre d’invités et à votre saison.' },
      { question: 'Peut-on se marier civilement au Château de La Hulpe ?', answer: 'Non : en Belgique, le civil se tient à la maison communale. Au château, on célèbre une cérémonie laïque, après le civil.' },
      { question: 'Combien de temps à l’avance réserver un lieu en Brabant wallon ?', answer: '12 à 18 mois pour un samedi de haute saison dans les lieux les plus demandés ; 6 à 9 mois pour un vendredi, un dimanche ou un mois de printemps ou d’automne.' },
      { question: 'Faut-il une autorisation pour les photos dans le parc de La Hulpe ?', answer: 'Le parc est public et une séance couple y est possible sans formalité ; le domaine fixe des règles pour les prises de vue professionnelles autour du château, à confirmer avec lui lors du repérage.' },
      { question: 'Le drone est-il autorisé dans ces lieux ?', answer: 'Dans les fermes et domaines de campagne, généralement oui, avec l’accord du lieu ; près de l’aérodrome de Baisy-Thy ou dans les zones protégées, non. L’option est reportée ou remboursée si le vol est impossible.' },
    ],
    ctaTitle: 'Votre lieu, votre date, un devis sous 48 h',
    ctaBody: 'Dites-nous le lieu et la date : vous recevez un devis avec la formule, sans frais de déplacement en Brabant wallon, et le repérage du lieu inclus.',
    related: [
      { label: 'Photographe & vidéaste en Brabant wallon', path: '/zones/belgique/brabant-wallon' },
      { label: 'Photographe & vidéaste de mariage', path: '/prestations/mariage' },
      { label: 'Combien coûte un photographe-vidéaste de mariage en Belgique', path: '/guides/prix-photographe-videaste-mariage-belgique-2026' },
    ],
  },
];
