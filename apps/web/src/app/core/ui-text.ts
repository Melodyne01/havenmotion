import { SiteLocale } from './locale';

export interface UiText {
  readonly skipLink: string;
  readonly breadcrumbAriaLabel: string;
  readonly home: string;
  readonly quoteCta: string;
  readonly quoteDelay: string;
  readonly header: {
    readonly brandAriaLabel: string;
    readonly closeMenu: string;
    readonly openMenu: string;
    readonly links: readonly { readonly fragment: string; readonly label: string }[];
    readonly pricing: string;
  };
  readonly footer: {
    readonly navAriaLabel: string;
    readonly about: string;
    readonly pricing: string;
    readonly zones: string;
    readonly legal: string;
    readonly privacy: string;
  };
  readonly hero: { readonly cta: string; readonly role: string; readonly tagline: string; readonly subtitle: string };
  readonly categories: { readonly eyebrow: string; readonly title: string };
  readonly intro: {
    readonly eyebrow: string;
    readonly title: string;
    readonly zonesLinkLabel: string;
    readonly prestationsLinkLabel: string;
  };
  readonly keyFigures: {
    readonly eyebrow: string;
    readonly titleSuffix: string;
    readonly worldwideValue: string;
    readonly worldwideLabel: string;
    readonly categoriesLabel: string;
    readonly quoteDelayValue: string;
    readonly quoteDelayLabel: string;
    readonly revisionsValue: string;
    readonly revisionsLabel: string;
    readonly note: string;
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
    readonly lead: string;
    readonly duration: string;
    readonly included: string;
    readonly deliverables: string;
    readonly from: string;
    readonly cta: string;
    readonly allPricing: string;
  };
  readonly packs: {
    readonly title: string;
    readonly lead: string;
    readonly duration: string;
    readonly deliverables: string;
    readonly included: string;
    readonly from: string;
    readonly onQuote: string;
    readonly saving: string;
    readonly choose: string;
    readonly optionsTitle: string;
    readonly travelNote: string;
    readonly allPricing: string;
  };
  readonly categoryPage: {
    readonly roleLabel: string;
    readonly cta: string;
    readonly faqTitle: string;
  };
  readonly process: { readonly eyebrow: string; readonly title: string };
  readonly homeFaq: { readonly eyebrow: string; readonly title: string; readonly seeMoreLabel: string };
  readonly faqPage: { readonly title: string; readonly description: string };
  readonly about: { readonly eyebrow: string; readonly title: string; readonly pageTitle: string };
  readonly testimonials: { readonly eyebrow: string; readonly title: string; readonly clientsAriaLabel: string };
  readonly zones: {
    readonly eyebrow: string;
    readonly title: string;
    readonly brusselsGroup: string;
    readonly peripheryGroup: string;
  };
  readonly notFound: { readonly title: string; readonly text: string; readonly cta: string };
  readonly captions: string;
  readonly contact: {
    readonly eyebrow: string;
    readonly title: string;
    readonly lead: string;
    readonly nameLabel: string;
    readonly nameError: string;
    readonly emailLabel: string;
    readonly emailError: string;
    readonly projectTypeLabel: string;
    readonly packLabel: string;
    readonly packUndecided: string;
    readonly regionLabel: string;
    readonly regionUndecided: string;
    readonly travelLabel: string;
    readonly travelIncluded: string;
    readonly travelOnQuote: string;
    readonly dateLabel: string;
    readonly budgetLabel: string;
    readonly messageLabel: string;
    readonly honeypotLabel: string;
    readonly submitIdle: string;
    readonly submitPending: string;
    readonly successMessage: string;
    readonly genericError: string;
    readonly otherProjectType: string;
    readonly budgetRanges: readonly string[];
  };
}

/**
 * Texte d'interface fixe (libellés de section, formulaire de contact,
 * skip-link, fil d'Ariane…) partagé par toutes les pages publiques, dans
 * les trois langues. Même principe que `site-content.ts` : un dictionnaire
 * statique, pas un aller-retour API pour du texte fixe. Les libellés qui
 * étaient codés en ternaire `locale === 'nl'` dans les composants ont été
 * rapatriés ici à l'ajout de l'anglais : le type force à fournir les trois
 * langues, plus de texte FR servi sur /en par oubli.
 */
export const UI_TEXT: Record<SiteLocale, UiText> = {
  fr: {
    skipLink: 'Aller au contenu',
    breadcrumbAriaLabel: "Fil d'Ariane",
    home: 'Accueil',
    quoteCta: 'Demander un devis',
    quoteDelay: 'Devis sous 48 h.',
    header: {
      brandAriaLabel: 'Heaven Motion — accueil',
      closeMenu: 'Fermer',
      openMenu: 'Menu',
      links: [
        { fragment: 'realisations', label: 'Prestations' },
        { fragment: 'prestations', label: 'Tarifs' },
        { fragment: 'process', label: 'Process' },
        { fragment: 'studio', label: 'Studio' },
        { fragment: 'contact', label: 'Contact' },
        { fragment: 'faq', label: 'FAQ' },
      ],
      pricing: 'Tarifs',
    },
    footer: {
      navAriaLabel: 'Navigation du pied de page',
      about: 'À propos',
      pricing: 'Tarifs',
      zones: "Zone d'intervention",
      legal: 'Mentions légales',
      privacy: 'Confidentialité',
    },
    hero: {
      cta: 'Demander un devis',
      role: 'Photographe / Vidéaste',
      tagline: 'Capturer l’instant. Raconter l’histoire.',
      subtitle: 'Photographe & vidéaste — Belgique, France, Luxembourg, Pays-Bas',
    },
    categories: { eyebrow: 'Prestations', title: 'Nos prestations' },
    intro: {
      eyebrow: 'Présentation',
      title: 'Chaque histoire mérite d’être vécue. Chaque moment mérite d’être gardé.',
      zonesLinkLabel: "Voir toute la zone d'intervention",
      prestationsLinkLabel: 'le détail des prestations et des tarifs',
    },
    keyFigures: {
      eyebrow: 'En chiffres',
      titleSuffix: 'en quelques chiffres',
      worldwideValue: '4 pays',
      worldwideLabel: 'Belgique, France, Luxembourg, Pays-Bas — et au-delà sur demande',
      categoriesLabel: 'catégories de prestations',
      quoteDelayValue: '48 h',
      quoteDelayLabel: 'pour recevoir un devis chiffré',
      revisionsValue: '2',
      revisionsLabel: 'allers-retours de retouche inclus',
      note: '* Basé à Bruxelles, déplacement au forfait par zone — voir les tarifs.',
    },
    categoryBand: {
      viewCategory: 'Voir la prestation',
      filmSingular: 'film',
      filmPlural: 'films',
      openCategorySuffix: 'Ouvrir la prestation.',
      excerptPrefix: 'Extrait',
    },
    services: {
      eyebrow: 'Tarifs',
      title: 'Des prix affichés',
      lead: 'Trois formules par prestation — photo, vidéo, ou les deux par la même personne — plus le sur mesure. Prix TTC pour les particuliers, HTVA pour les entreprises.',
      duration: 'Durée',
      included: 'Inclus',
      deliverables: 'Livrables',
      from: 'à partir de',
      cta: 'Voir les formules',
      allPricing: 'Voir tous les tarifs',
    },
    packs: {
      title: 'Formules et tarifs',
      lead: 'Photo, vidéo, ou les deux par la même personne. Le combo coûte moins cher que les deux formules séparées.',
      duration: 'Durée',
      deliverables: 'Vous recevez',
      included: 'Inclus',
      from: 'à partir de',
      onQuote: 'Sur devis',
      saving: 'd’économie par rapport aux deux formules séparées',
      choose: 'Choisir cette formule',
      optionsTitle: 'Options à la carte',
      travelNote: 'Déplacement inclus jusqu’à 60 km de Bruxelles, puis forfait par zone.',
      allPricing: 'Tous les tarifs, options et zones de déplacement',
    },
    categoryPage: {
      roleLabel: 'Photographe & Vidéaste',
      cta: 'Un projet comme ça ? Devis',
      faqTitle: 'Questions fréquentes sur',
    },
    process: { eyebrow: 'Process', title: 'Trois étapes' },
    homeFaq: {
      eyebrow: 'FAQ',
      title: 'Questions fréquentes',
      seeMoreLabel: 'Voir toutes les questions',
    },
    faqPage: {
      title: 'Questions fréquentes',
      description: 'Tarifs, délais, zone d’intervention, droits d’usage : les réponses aux questions les plus fréquentes.',
    },
    about: { eyebrow: 'Le studio', title: 'Derrière la caméra', pageTitle: 'À propos' },
    testimonials: {
      eyebrow: 'Ils ont tourné avec le studio',
      title: 'Retours',
      clientsAriaLabel: 'Clients',
    },
    zones: {
      eyebrow: "Zone d'intervention",
      title: 'Où nous tournons',
      brusselsGroup: 'Région de Bruxelles-Capitale',
      peripheryGroup: 'Périphérie flamande (autour de Wemmel)',
    },
    notFound: {
      title: 'Page introuvable',
      text: "Cette page n'existe pas ou a été déplacée.",
      cta: "Retour à l'accueil",
    },
    captions: 'Français',
    contact: {
      eyebrow: 'Contact',
      title: 'Parlons du projet',
      lead: 'Réponse sous 48 h avec un devis chiffré. Aucun engagement.',
      nameLabel: 'Nom',
      nameError: 'Indiquez votre nom.',
      emailLabel: 'E-mail',
      emailError: 'Adresse e-mail invalide.',
      projectTypeLabel: 'Type de projet',
      packLabel: 'Formule',
      packUndecided: 'Je ne sais pas encore',
      regionLabel: 'Région du tournage',
      regionUndecided: 'À préciser',
      travelLabel: 'Déplacement',
      travelIncluded: 'inclus',
      travelOnQuote: 'sur devis',
      dateLabel: 'Date',
      budgetLabel: 'Budget',
      messageLabel: 'Message (optionnel)',
      honeypotLabel: 'Ne pas remplir',
      submitIdle: 'Envoyer la demande',
      submitPending: 'Envoi…',
      successMessage: 'Demande envoyée. Un accusé de réception vient de partir vers votre boîte mail.',
      genericError: "L'envoi a échoué. Réessayez ou écrivez-nous directement par e-mail.",
      otherProjectType: 'Autre',
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
    quoteCta: 'Offerte aanvragen',
    quoteDelay: 'Offerte binnen 48 u.',
    header: {
      brandAriaLabel: 'Heaven Motion — home',
      closeMenu: 'Sluiten',
      openMenu: 'Menu',
      links: [
        { fragment: 'realisations', label: 'Diensten' },
        { fragment: 'prestations', label: 'Tarieven' },
        { fragment: 'process', label: 'Werkwijze' },
        { fragment: 'studio', label: 'Studio' },
        { fragment: 'contact', label: 'Contact' },
        { fragment: 'faq', label: 'FAQ' },
      ],
      pricing: 'Tarieven',
    },
    footer: {
      navAriaLabel: 'Navigatie in de voettekst',
      about: 'Over ons',
      pricing: 'Tarieven',
      zones: 'Werkgebied',
      legal: 'Wettelijke vermeldingen',
      privacy: 'Privacybeleid',
    },
    hero: {
      cta: 'Offerte aanvragen',
      role: 'Fotograaf / Videograaf',
      tagline: 'Het moment vastleggen. Het verhaal vertellen.',
      subtitle: 'Fotograaf & videograaf — België, Frankrijk, Luxemburg, Nederland',
    },
    categories: { eyebrow: 'Diensten', title: 'Onze diensten' },
    intro: {
      eyebrow: 'Voorstelling',
      title: 'Elk verhaal verdient het beleefd te worden. Elk moment verdient het bewaard te blijven.',
      zonesLinkLabel: 'Bekijk het volledige werkgebied',
      prestationsLinkLabel: 'de diensten en tarieven hieronder',
    },
    keyFigures: {
      eyebrow: 'In cijfers',
      titleSuffix: 'in enkele cijfers',
      worldwideValue: '4 landen',
      worldwideLabel: 'België, Frankrijk, Luxemburg, Nederland — en verder op aanvraag',
      categoriesLabel: 'soorten diensten',
      quoteDelayValue: '48 u',
      quoteDelayLabel: 'om een concrete offerte te ontvangen',
      revisionsValue: '2',
      revisionsLabel: 'rondes feedback inbegrepen',
      note: '* Gevestigd in Brussel, verplaatsing per zone aan een vast tarief — zie tarieven.',
    },
    categoryBand: {
      viewCategory: 'Bekijk de dienst',
      filmSingular: 'film',
      filmPlural: 'films',
      openCategorySuffix: 'Open de dienst.',
      excerptPrefix: 'Fragment',
    },
    services: {
      eyebrow: 'Tarieven',
      title: 'Transparante prijzen',
      lead: 'Drie formules per dienst — foto, video, of beide door dezelfde persoon — plus op maat. Prijzen incl. btw voor particulieren, excl. btw voor bedrijven.',
      duration: 'Duur',
      included: 'Inbegrepen',
      deliverables: 'Op te leveren',
      from: 'vanaf',
      cta: 'Bekijk de formules',
      allPricing: 'Alle tarieven bekijken',
    },
    packs: {
      title: 'Formules en tarieven',
      lead: 'Foto, video, of beide door dezelfde persoon. De combinatie kost minder dan de twee formules apart.',
      duration: 'Duur',
      deliverables: 'U ontvangt',
      included: 'Inbegrepen',
      from: 'vanaf',
      onQuote: 'Op offerte',
      saving: 'voordeliger dan de twee formules apart',
      choose: 'Deze formule kiezen',
      optionsTitle: 'Opties à la carte',
      travelNote: 'Verplaatsing inbegrepen tot 60 km van Brussel, daarna een vast tarief per zone.',
      allPricing: 'Alle tarieven, opties en verplaatsingszones',
    },
    categoryPage: {
      roleLabel: 'Fotograaf & Videograaf',
      cta: 'Zo’n project? Offerte aanvragen',
      faqTitle: 'Veelgestelde vragen over',
    },
    process: { eyebrow: 'Werkwijze', title: 'Drie stappen' },
    homeFaq: {
      eyebrow: 'FAQ',
      title: 'Veelgestelde vragen',
      seeMoreLabel: 'Bekijk alle vragen',
    },
    faqPage: {
      title: 'Veelgestelde vragen',
      description: 'Tarieven, levertijden, werkgebied, gebruiksrechten: de antwoorden op de meest gestelde vragen.',
    },
    about: { eyebrow: 'De studio', title: 'Achter de camera', pageTitle: 'Over ons' },
    testimonials: {
      eyebrow: 'Zij filmden met de studio',
      title: 'Reacties',
      clientsAriaLabel: 'Klanten',
    },
    zones: {
      eyebrow: 'Werkgebied',
      title: 'Waar we filmen',
      brusselsGroup: 'Brussels Hoofdstedelijk Gewest',
      peripheryGroup: 'Vlaamse rand (rond Wemmel)',
    },
    notFound: {
      title: 'Pagina niet gevonden',
      text: 'Deze pagina bestaat niet of is verplaatst.',
      cta: 'Terug naar home',
    },
    captions: 'Nederlands',
    contact: {
      eyebrow: 'Contact',
      title: 'Laten we over het project praten',
      lead: 'Antwoord binnen 48 u met een concrete offerte. Geen verplichtingen.',
      nameLabel: 'Naam',
      nameError: 'Vul uw naam in.',
      emailLabel: 'E-mail',
      emailError: 'Ongeldig e-mailadres.',
      projectTypeLabel: 'Soort project',
      packLabel: 'Formule',
      packUndecided: 'Ik weet het nog niet',
      regionLabel: 'Regio van de opname',
      regionUndecided: 'Nog te bepalen',
      travelLabel: 'Verplaatsing',
      travelIncluded: 'inbegrepen',
      travelOnQuote: 'op offerte',
      dateLabel: 'Datum',
      budgetLabel: 'Budget',
      messageLabel: 'Bericht (optioneel)',
      honeypotLabel: 'Niet invullen',
      submitIdle: 'Aanvraag versturen',
      submitPending: 'Verzenden…',
      successMessage: 'Aanvraag verzonden. Een bevestiging is net naar uw mailbox gestuurd.',
      genericError: 'Het versturen is mislukt. Probeer opnieuw of schrijf ons rechtstreeks via e-mail.',
      otherProjectType: 'Ander',
      budgetRanges: [
        'minder dan € 1 000',
        '€ 1 000 – 2 000',
        '€ 2 000 – 5 000',
        'meer dan € 5 000',
        'nog te bepalen',
      ],
    },
  },
  en: {
    skipLink: 'Skip to content',
    breadcrumbAriaLabel: 'Breadcrumb',
    home: 'Home',
    quoteCta: 'Request a quote',
    quoteDelay: 'Quote within 48 h.',
    header: {
      brandAriaLabel: 'Heaven Motion — home',
      closeMenu: 'Close',
      openMenu: 'Menu',
      links: [
        { fragment: 'realisations', label: 'Services' },
        { fragment: 'prestations', label: 'Pricing' },
        { fragment: 'process', label: 'Process' },
        { fragment: 'studio', label: 'Studio' },
        { fragment: 'contact', label: 'Contact' },
        { fragment: 'faq', label: 'FAQ' },
      ],
      pricing: 'Pricing',
    },
    footer: {
      navAriaLabel: 'Footer navigation',
      about: 'About',
      pricing: 'Pricing',
      zones: 'Areas covered',
      legal: 'Legal notice',
      privacy: 'Privacy',
    },
    hero: {
      cta: 'Request a quote',
      role: 'Photographer / Videographer',
      tagline: 'Capture the moment. Tell the story.',
      subtitle: 'Photographer & videographer — Belgium, France, Luxembourg, Netherlands',
    },
    categories: { eyebrow: 'Services', title: 'What we do' },
    intro: {
      eyebrow: 'About',
      title: 'Every story deserves to be lived. Every moment deserves to be kept.',
      zonesLinkLabel: 'See every area we cover',
      prestationsLinkLabel: 'the services and pricing below',
    },
    keyFigures: {
      eyebrow: 'In numbers',
      titleSuffix: 'in a few numbers',
      worldwideValue: '4 countries',
      worldwideLabel: 'Belgium, France, Luxembourg, Netherlands — and beyond on request',
      categoriesLabel: 'types of services',
      quoteDelayValue: '48 h',
      quoteDelayLabel: 'to receive an itemised quote',
      revisionsValue: '2',
      revisionsLabel: 'rounds of edits included',
      note: '* Based in Brussels, travel charged as a flat fee per zone — see pricing.',
    },
    categoryBand: {
      viewCategory: 'View the service',
      filmSingular: 'film',
      filmPlural: 'films',
      openCategorySuffix: 'Open the service.',
      excerptPrefix: 'Excerpt',
    },
    services: {
      eyebrow: 'Pricing',
      title: 'Prices out in the open',
      lead: 'Three packages per service — photo, video, or both by the same person — plus a custom option. Prices include VAT for private clients and exclude VAT for businesses.',
      duration: 'Duration',
      included: 'Included',
      deliverables: 'Deliverables',
      from: 'from',
      cta: 'See the packages',
      allPricing: 'See all pricing',
    },
    packs: {
      title: 'Packages and pricing',
      lead: 'Photo, video, or both by the same person. The combo costs less than the two packages separately.',
      duration: 'Duration',
      deliverables: 'You receive',
      included: 'Included',
      from: 'from',
      onQuote: 'On quote',
      saving: 'saved compared with the two packages separately',
      choose: 'Choose this package',
      optionsTitle: 'Optional extras',
      travelNote: 'Travel included up to 60 km from Brussels, then a flat fee per zone.',
      allPricing: 'All pricing, extras and travel zones',
    },
    categoryPage: {
      roleLabel: 'Photographer & Videographer',
      cta: 'A project like this? Get a quote',
      faqTitle: 'Frequently asked questions about',
    },
    process: { eyebrow: 'Process', title: 'Three steps' },
    homeFaq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      seeMoreLabel: 'See every question',
    },
    faqPage: {
      title: 'Frequently asked questions',
      description: 'Pricing, delivery times, areas covered, usage rights: answers to the questions we hear most.',
    },
    about: { eyebrow: 'The studio', title: 'Behind the camera', pageTitle: 'About' },
    testimonials: {
      eyebrow: 'They worked with the studio',
      title: 'Feedback',
      clientsAriaLabel: 'Clients',
    },
    zones: {
      eyebrow: 'Areas covered',
      title: 'Where we shoot',
      brusselsGroup: 'Brussels-Capital Region',
      peripheryGroup: 'Flemish periphery (around Wemmel)',
    },
    notFound: {
      title: 'Page not found',
      text: 'This page does not exist or has moved.',
      cta: 'Back to home',
    },
    captions: 'English',
    contact: {
      eyebrow: 'Contact',
      title: 'Let’s talk about your project',
      lead: 'Reply within 48 h with an itemised quote. No commitment.',
      nameLabel: 'Name',
      nameError: 'Please enter your name.',
      emailLabel: 'Email',
      emailError: 'Invalid email address.',
      projectTypeLabel: 'Type of project',
      packLabel: 'Package',
      packUndecided: 'Not sure yet',
      regionLabel: 'Where it takes place',
      regionUndecided: 'To be confirmed',
      travelLabel: 'Travel',
      travelIncluded: 'included',
      travelOnQuote: 'on quote',
      dateLabel: 'Date',
      budgetLabel: 'Budget',
      messageLabel: 'Message (optional)',
      honeypotLabel: 'Leave empty',
      submitIdle: 'Send the request',
      submitPending: 'Sending…',
      successMessage: 'Request sent. A confirmation is on its way to your inbox.',
      genericError: 'Sending failed. Try again or email us directly.',
      otherProjectType: 'Other',
      budgetRanges: [
        'under €1,000',
        '€1,000 – 2,000',
        '€2,000 – 5,000',
        'over €5,000',
        'to be defined',
      ],
    },
  },
};
