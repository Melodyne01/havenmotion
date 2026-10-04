import type { Guide } from '../guide-content';
import { formatPrice, pricingFor } from '../packs';

const m = pricingFor('mariage');
const price = (type: 'photo' | 'video' | 'combo') => formatPrice(m.packs.find((p) => p.type === type)!.price!);

/**
 * Guide « rassurer » : faire venir un photographe belge pour un mariage en
 * France. En français seulement. Les règles de TVA citées sont celles du
 * régime intracommunautaire des prestations de services (B2C : TVA du pays
 * du prestataire ; B2B : autoliquidation) ; la musique sous licence évite
 * toute déclaration SACEM pour un usage privé et réseaux.
 */
export const GUIDES_FRANCE: readonly Guide[] = [
  {
    slug: 'photographe-belge-mariage-en-france-deplacement-tva-musique',
    locale: 'fr',
    group: 'photographe-belge-france',
    category: 'mariage',
    title: 'Un photographe belge pour votre mariage en France : déplacement, TVA, musique, ce qui change et ce qui ne change pas',
    metaTitle: 'Photographe belge pour un mariage en France (2026) : déplacement, TVA, musique',
    metaDescription: 'Ce que signifie faire venir un photographe-vidéaste belge dans le Nord, en Picardie, en Champagne ou en Île-de-France : forfaits de déplacement, nuit d’hôtel, facture et TVA, musique et SACEM, mairie, assurance, et le prix comparé au marché français.',
    eyebrow: 'Guide pratique',
    published: '2026-10-05',
    readingMinutes: 8,
    answer: `Faire venir un photographe-vidéaste belge pour un mariage en France ne demande aucune formalité de votre côté : la prestation est un service intracommunautaire, facturé en Belgique avec la TVA belge pour un particulier (le prix affiché est TTC), et sans TVA, en autoliquidation, pour une entreprise française. Les films sont montés sur de la musique sous licence, qui ne relève pas de la SACEM pour un usage privé et sur les réseaux. Le déplacement est un forfait fixe : 90 € pour Lille et le Nord, 190 € pour la Côte d’Opale, la Picardie et la Champagne, 290 € pour Paris et l’Île-de-France, plus une nuit d’hôtel de 150 € quand la soirée finit tard. Le prix de la prestation, lui, est celui de la grille belge, ${price('combo')} TTC pour la photo et la vidéo par la même personne, sous la médiane française.`,
    sections: [
      {
        title: 'Le déplacement : un forfait, pas un compteur',
        paragraphs: [
          'Les photographes français facturent souvent le déplacement au kilomètre (0,50 à 0,70 € le kilomètre aller-retour) ou « sur devis ». Chez Heaven Motion, il est forfaitaire par zone de distance depuis Bruxelles, connu avant le devis, et il comprend le trajet, le carburant, les péages et le temps de route.',
        ],
        table: {
          columns: ['Zone', 'Distance depuis Bruxelles', 'Villes', 'Forfait'],
          rows: [
            ['Zone 2', '60 à 150 km', 'Lille, Roubaix, Tourcoing, Valenciennes, Douai, Arras, Lens', '90 €'],
            ['Zone 3', '150 à 250 km', 'Le Touquet, Boulogne, Calais, Saint-Omer, Amiens, Chantilly, Compiègne, Reims, Épernay', '190 €'],
            ['Zone 4', '250 à 350 km', 'Paris, Versailles, toute l’Île-de-France', '290 €'],
            ['Au-delà', 'Plus de 350 km', 'Normandie, Bourgogne, Loire, et le reste de la France', 'Sur devis, frais réels'],
          ],
          note: 'La nuit d’hôtel (150 €) s’ajoute quand la soirée se termine tard à plus de deux heures de Bruxelles : à partir de la zone 3, presque toujours ; en métropole lilloise, rarement.',
        },
      },
      {
        title: 'La facture et la TVA',
        paragraphs: [
          'Pour un particulier, une prestation de photographie ou de vidéo réalisée par un prestataire belge est soumise à la TVA belge (21 %), quel que soit le lieu du mariage : la facture est belge, le prix affiché est TTC, et vous n’avez rien à déclarer en France. C’est la règle générale des services entre entreprises et particuliers dans l’Union européenne.',
          'Pour une entreprise française assujettie (un mariage n’en est pas un, mais un événement d’entreprise à Lille ou à Paris, oui), la facture est émise sans TVA avec la mention d’autoliquidation, et l’entreprise déclare la TVA française elle-même. Il lui faut un numéro de TVA intracommunautaire valide.',
          'Le paiement se fait par virement SEPA, sans frais entre la France et la Belgique. L’acompte de 30 % réserve la date ; le solde est dû à la livraison.',
        ],
      },
      {
        title: 'La musique et la SACEM',
        paragraphs: [
          'La question revient à chaque mariage en France : faut-il déclarer le film à la SACEM ? Non, si la musique du film est sous licence d’une banque musicale (Artlist, Musicbed, Epidemic Sound et équivalents), ce qui est le cas de tous les films de Heaven Motion. Ces licences couvrent l’usage privé, la publication sur les réseaux sociaux et sur YouTube ; elles ne passent pas par la SACEM et ne déclenchent pas de redevance.',
          'Ce que la licence ne couvre pas : une chanson du commerce (votre musique d’ouverture de bal) synchronisée sur le film. Elle peut apparaître dans le son d’ambiance capté pendant la soirée, pas être montée comme bande-son ; c’est la règle en Belgique comme en France.',
          'La SACEM concerne en revanche la diffusion de musique pendant la fête elle-même (DJ, orchestre), qui relève du lieu ou de l’organisateur, pas du photographe.',
        ],
      },
      {
        title: 'La mairie, l’église, le lieu',
        paragraphs: [
          'En France comme en Belgique, le photographe est admis dans la salle des mariages de la mairie ; l’officier d’état civil fixe sa place et interdit parfois le flash. Les mairies d’arrondissement à Paris et les hôtels de ville classés (Calais, Arras, Lille) ont leurs usages, à demander lors de la réservation du créneau.',
          'Dans les églises, le curé ou l’équipe liturgique fixe les règles ; la plupart tolèrent un photographe discret sans flash. Les monuments et parcs nationaux (Chantilly, Versailles, Fontainebleau, Pierrefonds) demandent une autorisation de prise de vue, parfois payante, à prévoir dans le budget.',
          'Le repérage du lieu se fait la veille, lors de l’arrivée, ou en visioconférence avec le lieu quelques semaines avant ; les lieux français ont l’habitude des prestataires qui viennent de loin.',
        ],
      },
      {
        title: 'L’assurance, le contrat, la langue',
        paragraphs: [
          'La responsabilité civile professionnelle de Heaven Motion couvre les prestations dans l’Union européenne, France comprise ; le lieu peut en demander l’attestation, elle est fournie sur demande.',
          'Le contrat est en français, de droit belge, avec les mêmes garanties qu’en Belgique : date bloquée par l’acompte, remplaçant en cas de maladie, deux allers-retours de montage, livraison sous 2 à 4 semaines, sauvegarde des fichiers.',
          'Le reportage se mène en français ; en anglais ou en néerlandais si la famille est mixte, ce qui est fréquent dans le Nord et à Paris.',
        ],
      },
      {
        title: 'Le prix, comparé au marché français',
        paragraphs: [
          `Les sites français de référence situent la photo de mariage entre 1 500 et 3 000 € pour une journée (médiane autour de 1 800 à 2 200 €), la vidéo entre 1 500 et 3 500 €, et un duo au-delà de 3 500 €, souvent « à partir de 1 900 € » pour un seul des deux dans le Nord. Chez Heaven Motion, la photo est à ${price('photo')} TTC, la vidéo à ${price('video')}, et les deux par la même personne à ${price('combo')}, plus le forfait de déplacement et, le cas échéant, la nuit d’hôtel.`,
          'Exemple : mariage à Chantilly, photo et vidéo, soirée jusqu’à une heure du matin. ' + price('combo') + ' + 190 € + 150 € = ' + formatPrice(m.packs.find((p) => p.type === 'combo')!.price! + 340) + ' TTC, tout compris, pour une journée complète, environ 400 photos, un film de 5 à 8 minutes et un teaser.',
        ],
      },
    ],
    faq: [
      { question: 'Y a-t-il des formalités pour engager un photographe belge en France ?', answer: 'Aucune de votre côté. La prestation est un service intracommunautaire : facture belge avec TVA belge pour un particulier, autoliquidation pour une entreprise.' },
      { question: 'Dois-je payer la TVA française ?', answer: 'Non. Pour un particulier, la TVA belge est incluse dans le prix affiché ; vous ne déclarez rien en France.' },
      { question: 'Le film doit-il être déclaré à la SACEM ?', answer: 'Non : la musique est sous licence d’une banque musicale, qui couvre l’usage privé et les réseaux sociaux sans passer par la SACEM.' },
      { question: 'Combien coûte le déplacement ?', answer: '90 € pour Lille et le Nord, 190 € pour la Côte d’Opale, la Picardie et la Champagne, 290 € pour Paris et l’Île-de-France ; au-delà, sur devis. Plus 150 € de nuit d’hôtel quand la soirée finit tard.' },
      { question: 'Que se passe-t-il si le photographe est malade le jour J ?', answer: 'Un remplaçant du réseau est envoyé, briefé avec le planning et le repérage ; c’est dans le contrat, comme pour un mariage en Belgique.' },
      { question: 'Venez-vous ailleurs qu’au nord de la France ?', answer: 'Oui, sur devis au-delà de 350 km : Normandie, Loire, Bourgogne, Provence, avec les frais réels (trajet, nuits) détaillés ligne par ligne.' },
    ],
    ctaTitle: 'Votre mariage en France, un devis sous 48 h',
    ctaBody: 'Dites-nous la ville, le lieu et la date : vous recevez un devis TTC avec la formule, le forfait de déplacement et, si la soirée le demande, la nuit d’hôtel.',
    related: [
      { label: 'Photographe & vidéaste en France : les régions couvertes', path: '/zones/france' },
      { label: 'Photographe & vidéaste à Lille et dans le Nord', path: '/zones/france/lille-nord' },
      { label: 'Photographe & vidéaste de mariage', path: '/prestations/mariage' },
    ],
  },
];
