import { SiteLocale } from './locale';
import { formatPrice, startingPrice } from './packs';

export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

const mariage = formatPrice(startingPrice('mariage'));
const corporate = formatPrice(startingPrice('corporate'));
const lifestyle = formatPrice(startingPrice('lifestyle'));

/**
 * Questions transactionnelles (tarif, délai, zone, droits) répondues
 * directement en 1-2 phrases, format pensé pour être repris tel quel par
 * un moteur de recherche ou une IA conversationnelle. Source unique
 * partagée entre la page `/faq` dédiée et le bloc FAQ de la home — un
 * seul endroit à modifier si une réponse change. Les prix cités sont
 * calculés depuis `PRICING` : impossible qu'ils divergent de la grille.
 */
export const FAQ_CONTENT: Record<SiteLocale, readonly FaqEntry[]> = {
  fr: [
    {
      question: 'Combien coûte un photographe et vidéaste en Belgique ?',
      answer: `Les prix sont affichés : à partir de ${lifestyle} TTC pour une séance lifestyle, ${mariage} TTC pour un mariage en photo, ${corporate} HTVA pour un reportage d’entreprise. Chaque prestation existe en photo, en vidéo ou en photo + vidéo par la même personne, le combo coûtant moins cher que les deux séparés. Devis chiffré sous 48 h.`,
    },
    {
      question: 'Une seule personne peut-elle faire la photo et la vidéo d’un mariage ?',
      answer:
        'Oui, c’est le principe du pack photo + vidéo : un seul style, un seul interlocuteur, moins de monde autour des mariés. Au-delà de 120 invités ou pour une cérémonie religieuse longue, un second opérateur est proposé en option pour couvrir les moments simultanés.',
    },
    {
      question: 'Quel est le délai de livraison ?',
      answer:
        'Un aperçu photo sous 7 jours, la galerie complète et le film sous 2 à 4 semaines selon la période. Le devis précise toujours une date ferme ; une option express divise le délai par deux.',
    },
    {
      question: 'Vous déplacez-vous en France, au Luxembourg ou aux Pays-Bas ?',
      answer:
        'Oui. Le déplacement est inclus jusqu’à 60 km de Bruxelles, puis facturé au forfait : 90 € (Liège, Lille, Maastricht…), 190 € (Luxembourg, Amsterdam, Reims…), 290 € (Paris). Au-delà de 350 km et à l’étranger, sur devis.',
    },
    {
      question: 'Les prix sont-ils TTC ou hors TVA ?',
      answer:
        'TTC pour les particuliers (mariage, événementiel, lifestyle), hors TVA pour les professionnels (corporate, sport, clip). La mention figure à côté de chaque prix.',
    },
    {
      question: 'Comment se déroule une prestation, de la demande à la livraison ?',
      answer:
        'Trois étapes : un échange pour cadrer l’intention, le budget et la date ; le tournage, avec repérage si besoin ; puis le montage et l’étalonnage, livrés en ligne après deux allers-retours.',
    },
    {
      question: 'Qui détient les droits sur les images finales ?',
      answer:
        'Le client reçoit un usage complet des photos et du film livrés pour ses propres besoins (site, réseaux, diffusion interne). La musique utilisée est systématiquement sous licence pour éviter tout retrait sur les plateformes.',
    },
  ],
  nl: [
    {
      question: 'Hoeveel kost een fotograaf en videograaf in België?',
      answer: `De prijzen staan online: vanaf ${lifestyle} incl. btw voor een lifestyle-sessie, ${mariage} incl. btw voor een huwelijk in foto, ${corporate} excl. btw voor een bedrijfsreportage. Elke dienst bestaat in foto, video of foto + video door dezelfde persoon, en de combinatie kost minder dan de twee apart. Concrete offerte binnen 48 u.`,
    },
    {
      question: 'Kan één persoon zowel de foto als de video van een huwelijk maken?',
      answer:
        'Ja, dat is het principe van het pakket foto + video: één stijl, één aanspreekpunt, minder volk rond het bruidspaar. Vanaf 120 gasten of bij een lange religieuze ceremonie wordt een tweede operator als optie voorgesteld voor gelijktijdige momenten.',
    },
    {
      question: 'Wat is de levertijd?',
      answer:
        'Een voorproefje van de foto’s binnen 7 dagen, de volledige galerij en de film binnen 2 tot 4 weken naargelang het seizoen. De offerte vermeldt altijd een vaste datum; een expresoptie halveert de termijn.',
    },
    {
      question: 'Komt u ook naar Frankrijk, Luxemburg of Nederland?',
      answer:
        'Ja. De verplaatsing is inbegrepen tot 60 km van Brussel, daarna een vast tarief: € 90 (Luik, Rijsel, Maastricht…), € 190 (Luxemburg, Amsterdam, Reims…), € 290 (Parijs). Verder dan 350 km en in het buitenland: op offerte.',
    },
    {
      question: 'Zijn de prijzen incl. of excl. btw?',
      answer:
        'Incl. btw voor particulieren (huwelijk, evenementen, lifestyle), excl. btw voor professionals (zakelijk, sport, clip). De vermelding staat naast elke prijs.',
    },
    {
      question: 'Hoe verloopt een opdracht, van aanvraag tot levering?',
      answer:
        'Drie stappen: een gesprek om de intentie, het budget en de datum af te bakenen; de opname, met verkenning indien nodig; en tot slot de montage en kleurcorrectie, geleverd online na twee rondes feedback.',
    },
    {
      question: 'Wie heeft de rechten op de eindbeelden?',
      answer:
        'De klant krijgt volledig gebruiksrecht op de geleverde foto’s en film voor eigen doeleinden (website, sociale media, interne verspreiding). Gebruikte muziek is steeds in licentie, zodat platforms de video nooit kunnen blokkeren.',
    },
  ],
  en: [
    {
      question: 'How much does a photographer and videographer cost in Belgium?',
      answer: `Prices are published: from ${lifestyle} incl. VAT for a lifestyle session, ${mariage} incl. VAT for wedding photography, ${corporate} excl. VAT for a corporate shoot. Every service comes as photo, video or photo + video by the same person, and the combo costs less than the two separately. Itemised quote within 48 h.`,
    },
    {
      question: 'Can one person really shoot both the photos and the video of a wedding?',
      answer:
        'Yes, that is the point of the photo + video package: one style, one point of contact, fewer people around the couple. Above 120 guests or for a long religious ceremony, a second operator is offered as an option to cover simultaneous moments.',
    },
    {
      question: 'How long does delivery take?',
      answer:
        'A photo sneak peek within 7 days, the full gallery and the film within 2 to 4 weeks depending on the season. The quote always states a firm date; an express option halves the wait.',
    },
    {
      question: 'Do you travel to France, Luxembourg or the Netherlands?',
      answer:
        'Yes. Travel is included up to 60 km from Brussels, then charged as a flat fee: €90 (Liège, Lille, Maastricht…), €190 (Luxembourg, Amsterdam, Reims…), €290 (Paris). Beyond 350 km and abroad, on quote.',
    },
    {
      question: 'Are prices inclusive or exclusive of VAT?',
      answer:
        'Inclusive of VAT for private clients (wedding, events, lifestyle), exclusive of VAT for businesses (corporate, sport, music video). The mention sits next to every price.',
    },
    {
      question: 'How does a project run, from request to delivery?',
      answer:
        'Three steps: a conversation to frame the intent, the budget and the date; the shoot, with scouting if needed; then the edit and colour grading, delivered online after two rounds of feedback.',
    },
    {
      question: 'Who owns the rights to the final images?',
      answer:
        'The client receives full usage of the delivered photos and film for their own needs (website, social media, internal use). Music is always licensed, so nothing gets taken down on the platforms.',
    },
  ],
};
