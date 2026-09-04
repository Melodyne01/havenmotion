import { SiteLocale } from './locale';

export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

/**
 * Questions transactionnelles (tarif, délai, zone, droits) répondues
 * directement en 1-2 phrases, format pensé pour être repris tel quel par
 * un moteur de recherche ou une IA conversationnelle. Source unique
 * partagée entre la page `/faq` dédiée et le bloc FAQ de la home — un
 * seul endroit à modifier si une réponse change.
 */
export const FAQ_CONTENT: Record<SiteLocale, readonly FaqEntry[]> = {
  fr: [
    {
      question: 'Combien coûte un vidéaste à Bruxelles ?',
      answer:
        "Le tarif dépend du projet : comptez entre 900 € et 1 800 € selon la catégorie (mariage, corporate, sport, clip), la durée de tournage et le nombre de livrables. Un devis chiffré est envoyé sous 48 h après un premier échange.",
    },
    {
      question: 'Quel est le délai de livraison d’une vidéo ?',
      answer:
        "En moyenne 2 à 4 semaines après le tournage, selon la complexité du montage et la période de l'année. Le devis précise toujours une date de livraison ferme.",
    },
    {
      question: 'Quelle zone géographique est couverte ?',
      answer:
        'Bruxelles et les communes environnantes. Un déplacement plus loin en Belgique reste possible, à discuter selon le projet.',
    },
    {
      question: 'Comment se déroule une prestation, de la demande à la livraison ?',
      answer:
        'Trois étapes : un échange pour cadrer l’intention, le budget et la date ; le tournage, avec repérage si besoin ; puis le montage et l’étalonnage, livrés en ligne après un à deux allers-retours.',
    },
    {
      question: 'Qui détient les droits sur la vidéo finale ?',
      answer:
        'Le client reçoit un usage complet du film livré pour ses propres besoins (site, réseaux, diffusion interne). La musique utilisée est systématiquement sous licence pour éviter tout retrait sur les plateformes.',
    },
    {
      question: 'Le tournage se fait-il seul ou en équipe ?',
      answer:
        "Selon le projet : seul pour rester discret sur un mariage ou un tournage de marque léger, en équipe réduite dès que la prestation demande plusieurs angles de caméra (sport, événements avec plusieurs temps forts).",
    },
  ],
  nl: [
    {
      question: 'Hoeveel kost een videograaf in Brussel?',
      answer:
        'De prijs hangt af van het project: reken tussen € 900 en € 1 800 naargelang de categorie (huwelijk, zakelijk, sport, clip), de opnameduur en het aantal eindproducten. Een concrete offerte volgt binnen 48 u na een eerste gesprek.',
    },
    {
      question: 'Wat is de levertijd van een video?',
      answer:
        'Gemiddeld 2 tot 4 weken na de opname, afhankelijk van de complexiteit van de montage en het seizoen. De offerte vermeldt altijd een vaste leverdatum.',
    },
    {
      question: 'Welk gebied wordt gedekt?',
      answer: 'Brussel en de omliggende gemeenten. Verplaatsing verder in België is bespreekbaar per project.',
    },
    {
      question: 'Hoe verloopt een opdracht, van aanvraag tot levering?',
      answer:
        'Drie stappen: een gesprek om de intentie, het budget en de datum af te bakenen; de opname, met verkenning indien nodig; en tot slot de montage en kleurcorrectie, geleverd online na één à twee rondes feedback.',
    },
    {
      question: 'Wie heeft de rechten op de eindvideo?',
      answer:
        'De klant krijgt volledig gebruiksrecht op de geleverde film voor eigen doeleinden (website, sociale media, interne verspreiding). Gebruikte muziek is steeds in licentie, zodat platforms de video nooit kunnen blokkeren.',
    },
    {
      question: 'Wordt er alleen of met een team gefilmd?',
      answer:
        'Naargelang het project: alleen om discreet te blijven bij een huwelijk of een lichte merkopname, met een klein team zodra meerdere camerahoeken nodig zijn (sport, evenementen met meerdere hoogtepunten).',
    },
  ],
};
