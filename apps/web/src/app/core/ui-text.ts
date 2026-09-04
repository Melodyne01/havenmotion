import { SiteLocale } from './locale';

export interface UiText {
  readonly skipLink: string;
  readonly breadcrumbAriaLabel: string;
  readonly home: string;
  readonly hero: { readonly cta: string };
  readonly categories: { readonly eyebrow: string; readonly title: string };
  readonly keyFigures: {
    readonly eyebrow: string;
    readonly title: string;
    readonly communes: string;
    readonly categoriesLabel: string;
    readonly quoteDelayValue: string;
    readonly quoteDelayLabel: string;
    readonly revisionsValue: string;
    readonly revisionsLabel: string;
  };
  readonly categoryBand: {
    readonly viewCategory: string;
    readonly filmSingular: string;
    readonly filmPlural: string;
    readonly openCategorySuffix: string;
    readonly excerptPrefix: string;
  };
  readonly services: {
    readonly eyebrow: string;
    readonly title: string;
    readonly duration: string;
    readonly included: string;
    readonly deliverables: string;
    readonly cta: string;
  };
  readonly process: { readonly eyebrow: string; readonly title: string };
  readonly about: { readonly eyebrow: string; readonly title: string };
  readonly testimonials: { readonly eyebrow: string; readonly title: string; readonly clientsAriaLabel: string };
  readonly contact: {
    readonly eyebrow: string;
    readonly title: string;
    readonly lead: string;
    readonly nameLabel: string;
    readonly nameError: string;
    readonly emailLabel: string;
    readonly emailError: string;
    readonly projectTypeLabel: string;
    readonly dateLabel: string;
    readonly budgetLabel: string;
    readonly messageLabel: string;
    readonly honeypotLabel: string;
    readonly submitIdle: string;
    readonly submitPending: string;
    readonly successMessage: string;
    readonly genericError: string;
    readonly projectTypes: readonly string[];
    readonly budgetRanges: readonly string[];
  };
}

/**
 * Texte d'interface fixe (libellés de section, formulaire de contact,
 * skip-link, fil d'Ariane…) partagé par toutes les pages publiques. Manquait
 * à l'appel jusqu'ici : ces sections (hero, catégories, prestations, process,
 * à propos, témoignages, contact) étaient codées en dur en français et
 * s'affichaient telles quelles sur /nl, la langue n'ayant jamais été
 * injectée à ce niveau. Même principe que `site-content.ts` : un
 * dictionnaire statique, pas un aller-retour API pour du texte fixe.
 */
export const UI_TEXT: Record<SiteLocale, UiText> = {
  fr: {
    skipLink: 'Aller au contenu',
    breadcrumbAriaLabel: "Fil d'Ariane",
    home: 'Accueil',
    hero: { cta: 'Demander un devis' },
    categories: { eyebrow: 'Réalisations', title: 'Cinq territoires' },
    keyFigures: {
      eyebrow: 'En chiffres',
      title: 'Le studio en quelques chiffres',
      communes: 'communes couvertes',
      categoriesLabel: 'catégories de films',
      quoteDelayValue: '48 h',
      quoteDelayLabel: 'pour recevoir un devis chiffré',
      revisionsValue: '2',
      revisionsLabel: 'allers-retours de retouche inclus',
    },
    categoryBand: {
      viewCategory: 'Voir la catégorie',
      filmSingular: 'film',
      filmPlural: 'films',
      openCategorySuffix: 'Ouvrir la catégorie.',
      excerptPrefix: 'Extrait',
    },
    services: {
      eyebrow: 'Prestations',
      title: 'Ce que je livre',
      duration: 'Durée',
      included: 'Inclus',
      deliverables: 'Livrables',
      cta: 'Demander un devis',
    },
    process: { eyebrow: 'Process', title: 'Trois étapes' },
    about: { eyebrow: 'Le studio', title: 'Derrière la caméra' },
    testimonials: {
      eyebrow: 'Ils ont tourné avec le studio',
      title: 'Retours',
      clientsAriaLabel: 'Clients',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Parlons du projet',
      lead: 'Réponse sous 48 h avec un devis chiffré. Aucun engagement.',
      nameLabel: 'Nom',
      nameError: 'Indiquez votre nom.',
      emailLabel: 'E-mail',
      emailError: 'Adresse e-mail invalide.',
      projectTypeLabel: 'Type de projet',
      dateLabel: 'Date',
      budgetLabel: 'Budget',
      messageLabel: 'Message (optionnel)',
      honeypotLabel: 'Ne pas remplir',
      submitIdle: 'Envoyer la demande',
      submitPending: 'Envoi…',
      successMessage: 'Demande envoyée. Un accusé de réception vient de partir vers votre boîte mail.',
      genericError: "L'envoi a échoué. Réessayez ou écrivez-nous directement par e-mail.",
      projectTypes: ['Mariage', 'Corporate', 'Sport & event', 'Clip', 'Lifestyle', 'Autre'],
      budgetRanges: [
        'moins de 1 000 €',
        '1 000 – 2 000 €',
        '2 000 – 5 000 €',
        'plus de 5 000 €',
        'à définir',
      ],
    },
  },
  nl: {
    skipLink: 'Ga naar de inhoud',
    breadcrumbAriaLabel: 'Kruimelpad',
    home: 'Home',
    hero: { cta: 'Offerte aanvragen' },
    categories: { eyebrow: 'Realisaties', title: 'Vijf domeinen' },
    keyFigures: {
      eyebrow: 'In cijfers',
      title: 'De studio in enkele cijfers',
      communes: 'bediende gemeenten',
      categoriesLabel: 'filmcategorieën',
      quoteDelayValue: '48 u',
      quoteDelayLabel: 'om een concrete offerte te ontvangen',
      revisionsValue: '2',
      revisionsLabel: 'rondes feedback inbegrepen',
    },
    categoryBand: {
      viewCategory: 'Bekijk de categorie',
      filmSingular: 'film',
      filmPlural: "films",
      openCategorySuffix: 'Open de categorie.',
      excerptPrefix: 'Fragment',
    },
    services: {
      eyebrow: 'Diensten',
      title: 'Wat ik lever',
      duration: 'Duur',
      included: 'Inbegrepen',
      deliverables: 'Op te leveren',
      cta: 'Offerte aanvragen',
    },
    process: { eyebrow: 'Werkwijze', title: 'Drie stappen' },
    about: { eyebrow: 'De studio', title: 'Achter de camera' },
    testimonials: {
      eyebrow: 'Zij filmden met de studio',
      title: 'Reacties',
      clientsAriaLabel: 'Klanten',
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Laten we over het project praten',
      lead: 'Antwoord binnen 48 u met een concrete offerte. Geen verplichtingen.',
      nameLabel: 'Naam',
      nameError: 'Vul uw naam in.',
      emailLabel: 'E-mail',
      emailError: 'Ongeldig e-mailadres.',
      projectTypeLabel: 'Soort project',
      dateLabel: 'Datum',
      budgetLabel: 'Budget',
      messageLabel: 'Bericht (optioneel)',
      honeypotLabel: 'Niet invullen',
      submitIdle: 'Aanvraag versturen',
      submitPending: 'Verzenden…',
      successMessage: 'Aanvraag verzonden. Een bevestiging is net naar uw mailbox gestuurd.',
      genericError: 'Het versturen is mislukt. Probeer opnieuw of schrijf ons rechtstreeks via e-mail.',
      projectTypes: ['Huwelijk', 'Zakelijk', 'Sport & event', 'Clip', 'Lifestyle', 'Ander'],
      budgetRanges: [
        'minder dan € 1 000',
        '€ 1 000 – 2 000',
        '€ 2 000 – 5 000',
        'meer dan € 5 000',
        'nog te bepalen',
      ],
    },
  },
};
