import { SiteLocale } from './locale';

/**
 * Photos réelles d'une catégorie, servies par le site lui-même depuis
 * `public/photos/<catégorie>/<slug>-800.webp` (mobile) et `-1600.webp`
 * (écran large). L'ordre ci-dessous est celui de la page : de la
 * préparation à la soirée. `width` et `height` sont ceux du fichier -1600,
 * pour réserver la place avant le chargement.
 */
export interface CategoryPhoto {
  readonly slug: string;
  readonly width: number;
  readonly height: number;
  readonly alt: Readonly<Record<SiteLocale, string>>;
}

export interface CategoryGalleryText {
  readonly eyebrow: string;
  readonly title: string;
}

/** Clé neutre de la catégorie (slug FR) → photos. Une catégorie absente n'affiche aucune galerie. */
export const CATEGORY_PHOTOS: Readonly<Record<string, readonly CategoryPhoto[]>> = {
  mariage: [
    {
      slug: 'preparatifs-coiffure-maquillage',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Coiffure et maquillage de la mariée pendant les préparatifs',
        nl: 'Kapsel en make-up van de bruid tijdens de voorbereidingen',
        en: 'The bride’s hair and make-up during the preparations',
      },
    },
    {
      slug: 'preparatifs-demoiselles-honneur',
      width: 1600,
      height: 1066,
      alt: {
        fr: 'La mariée et ses demoiselles d’honneur qui rient pendant les préparatifs',
        nl: 'De bruid en haar bruidsmeisjes lachen tijdens de voorbereidingen',
        en: 'The bride and her bridesmaids laughing during the preparations',
      },
    },
    {
      slug: 'toast-demoiselles-honneur',
      width: 1600,
      height: 1066,
      alt: {
        fr: 'Toast entre la mariée et ses demoiselles d’honneur, en peignoir',
        nl: 'Toost tussen de bruid en haar bruidsmeisjes, in kamerjas',
        en: 'A toast between the bride and her bridesmaids, in robes',
      },
    },
    {
      slug: 'mariee-enfants-noir-blanc',
      width: 1600,
      height: 1066,
      alt: {
        fr: 'La mariée avec deux petites filles d’honneur devant la porte, en noir et blanc',
        nl: 'De bruid met twee bloemenmeisjes voor de deur, in zwart-wit',
        en: 'The bride with two flower girls at the door, in black and white',
      },
    },
    {
      slug: 'parvis-vue-aerienne',
      width: 1600,
      height: 1066,
      alt: {
        fr: 'Vue d’en haut : la mariée sur le parvis, entourée de ses invités et de musiciens',
        nl: 'Van boven: de bruid op het voorplein, omringd door gasten en muzikanten',
        en: 'From above: the bride on the forecourt, surrounded by guests and musicians',
      },
    },
    {
      slug: 'mariee-voile-invites',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'La mariée de dos, son long voile déployé au milieu des invités',
        nl: 'De bruid van achteren, haar lange sluier uitgespreid tussen de gasten',
        en: 'The bride from behind, her long veil spread out among the guests',
      },
    },
    {
      slug: 'entree-ceremonie-allee',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'La mariée remonte l’allée sous la tente, au bras d’un proche',
        nl: 'De bruid loopt het middenpad onder de tent op, aan de arm van een naaste',
        en: 'The bride walks up the aisle under the marquee, on a loved one’s arm',
      },
    },
    {
      slug: 'maries-sortie-allee',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Les mariés sortent main dans la main, tout sourire',
        nl: 'Het bruidspaar loopt hand in hand naar buiten, stralend',
        en: 'The couple walk out hand in hand, beaming',
      },
    },
    {
      slug: 'marie-sourire-allee',
      width: 1600,
      height: 1442,
      alt: {
        fr: 'Le marié, lunettes de soleil sur le nez, sourit en avançant dans l’allée',
        nl: 'De bruidegom, met zonnebril, lacht terwijl hij door het middenpad loopt',
        en: 'The groom, in sunglasses, smiles as he walks down the aisle',
      },
    },
    {
      slug: 'invite-ceremonie',
      width: 1600,
      height: 1522,
      alt: {
        fr: 'Un invité en costume kaki, assis pendant la cérémonie',
        nl: 'Een gast in kakipak, gezeten tijdens de ceremonie',
        en: 'A guest in a khaki suit, seated during the ceremony',
      },
    },
    {
      slug: 'echange-alliances',
      width: 1600,
      height: 1952,
      alt: {
        fr: 'Gros plan sur l’échange des alliances',
        nl: 'Close-up van de uitwisseling van de trouwringen',
        en: 'Close-up of the exchange of rings',
      },
    },
    {
      slug: 'discours-marie',
      width: 1600,
      height: 1293,
      alt: {
        fr: 'Le marié au micro pendant son discours',
        nl: 'De bruidegom aan de microfoon tijdens zijn speech',
        en: 'The groom at the microphone during his speech',
      },
    },
    {
      slug: 'mariee-pont-voile',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'La mariée sur un pont, son voile brodé étalé derrière elle, à la lumière du soir',
        nl: 'De bruid op een brug, haar geborduurde sluier achter haar uitgespreid, in het avondlicht',
        en: 'The bride on a bridge, her embroidered veil trailing behind her, in the evening light',
      },
    },
    {
      slug: 'portrait-mariee-bouquet',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Portrait de la mariée avec son bouquet de roses blanches',
        nl: 'Portret van de bruid met haar boeket witte rozen',
        en: 'Portrait of the bride with her bouquet of white roses',
      },
    },
    {
      slug: 'mariee-bouquet-soiree',
      width: 1600,
      height: 1066,
      alt: {
        fr: 'La mariée lève son bouquet en soirée, devant ses invités qui filment et applaudissent',
        nl: 'De bruid steekt haar boeket omhoog op het feest, voor gasten die filmen en applaudisseren',
        en: 'The bride raises her bouquet at the party, in front of guests filming and applauding',
      },
    },
  ],
  evenementiel: [
    {
      slug: 'cryo-jet-scene-ballons',
      width: 1598,
      height: 2576,
      alt: {
        fr: 'Un animateur projette un jet de fumée froide au-dessus du DJ, entouré de ballons dorés',
        nl: 'Een animator spuit een straal koude rook boven de dj, omringd door gouden ballonnen',
        en: 'An entertainer fires a jet of cold smoke above the DJ booth, surrounded by gold balloons',
      },
    },
    {
      slug: 'artiste-micro-contre-plongee',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Un artiste au micro, vu en contre-plongée dans la lumière rouge de la scène',
        nl: 'Een artiest aan de microfoon, van onderaf gezien in het rode podiumlicht',
        en: 'An artist at the microphone, seen from below in the red stage light',
      },
    },
    {
      slug: 'artiste-scene-sourire',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Un artiste en turban et lunettes de soleil, hilare, micro à la main sur scène',
        nl: 'Een artiest met tulband en zonnebril lacht uitbundig op het podium, microfoon in de hand',
        en: 'An artist in a head wrap and sunglasses laughing on stage, microphone in hand',
      },
    },
    {
      slug: 'dj-sourire-platines',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Un DJ souriant derrière ses platines, lunettes de soleil à la main',
        nl: 'Een lachende dj achter zijn draaitafels, zonnebril in de hand',
        en: 'A smiling DJ behind the decks, sunglasses in hand',
      },
    },
    {
      slug: 'costume-robot-lumineux',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Un artiste en costume de robot recouvert de LED, éclairé en rouge',
        nl: 'Een artiest in een robotkostuum vol led-verlichting, rood belicht',
        en: 'A performer in a LED-covered robot costume, lit in red',
      },
    },
    {
      slug: 'trois-amies-soiree',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Trois amies prennent la pose en soirée, sous une enseigne néon rouge',
        nl: 'Drie vriendinnen poseren op het feest, onder een rode neonreclame',
        en: 'Three friends strike a pose at the party, under a red neon sign',
      },
    },
    {
      slug: 'invitee-robe-strass-profil',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Une invitée en robe à strass pose de profil, lunettes de soleil sur le nez',
        nl: 'Een gaste in een jurk met strass poseert in profiel, met zonnebril',
        en: 'A guest in a rhinestone dress poses in profile, wearing sunglasses',
      },
    },
    {
      slug: 'invitee-robe-strass-regard',
      width: 1600,
      height: 2387,
      alt: {
        fr: 'Une invitée en robe à strass tourne la tête par-dessus l’épaule',
        nl: 'Een gaste in een jurk met strass kijkt over haar schouder',
        en: 'A guest in a rhinestone dress looks over her shoulder',
      },
    },
    {
      slug: 'invitee-robe-strass-bras-leve',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Une invitée en robe à strass, le bras relevé dans les cheveux, adossée à la banquette',
        nl: 'Een gaste in een jurk met strass, een arm in het haar, leunend tegen de bank',
        en: 'A guest in a rhinestone dress, one arm raised into her hair, leaning on the banquette',
      },
    },
  ],
  sport: [
    {
      slug: 'bmx-saut-maillot-rouge',
      width: 1600,
      height: 1066,
      alt: {
        fr: 'Un rider BMX en maillot rouge, en plein saut, vu d’en dessous sur fond de ciel bleu',
        nl: 'Een bmx-rijder in rood shirt midden in een sprong, van onderaf gezien tegen een blauwe lucht',
        en: 'A BMX rider in a red jersey mid-air, seen from below against a blue sky',
      },
    },
    {
      slug: 'bmx-saut-rampe-ciel',
      width: 1600,
      height: 1066,
      alt: {
        fr: 'Un rider BMX en plein saut au-dessus d’une rampe, devant de gros nuages',
        nl: 'Een bmx-rijder midden in een sprong boven een helling, voor grote wolken',
        en: 'A BMX rider mid-air above a ramp, in front of big clouds',
      },
    },
    {
      slug: 'bmx-saut-contre-jour',
      width: 1600,
      height: 1066,
      alt: {
        fr: 'Un rider BMX en suspension dans le ciel, en contre-jour',
        nl: 'Een bmx-rijder zweeft in de lucht, tegen het licht in',
        en: 'A BMX rider suspended in the sky, backlit',
      },
    },
    {
      slug: 'fauteuil-freestyle-skatepark',
      width: 1600,
      height: 1066,
      alt: {
        fr: 'Un athlète en fauteuil roulant en équilibre sur une roue dans un skatepark, sous l’objectif de photographes',
        nl: 'Een atleet in een rolstoel op één wiel in een skatepark, onder de lens van fotografen',
        en: 'An athlete in a wheelchair balancing on one wheel in a skatepark, in front of photographers',
      },
    },
    {
      slug: 'flyboard-port',
      width: 1600,
      height: 2400,
      alt: {
        fr: 'Un pilote de flyboard en t-shirt orange, debout sur deux jets d’eau devant des conteneurs de port',
        nl: 'Een flyboardpiloot in oranje shirt, staand op twee waterstralen voor havencontainers',
        en: 'A flyboard rider in an orange shirt standing on two water jets in front of harbour containers',
      },
    },
  ],
};

export const CATEGORY_GALLERY_TEXT: Readonly<Record<SiteLocale, Readonly<Record<string, CategoryGalleryText>>>> = {
  fr: {
    mariage: { eyebrow: 'Galerie', title: 'Photos de mariage' },
    evenementiel: { eyebrow: 'Galerie', title: 'Photos d’événements' },
    sport: { eyebrow: 'Galerie', title: 'Photos de sport' },
  },
  nl: {
    mariage: { eyebrow: 'Galerij', title: 'Huwelijksfoto’s' },
    evenementiel: { eyebrow: 'Galerij', title: 'Evenementfoto’s' },
    sport: { eyebrow: 'Galerij', title: 'Sportfoto’s' },
  },
  en: {
    mariage: { eyebrow: 'Gallery', title: 'Wedding photos' },
    evenementiel: { eyebrow: 'Gallery', title: 'Event photos' },
    sport: { eyebrow: 'Gallery', title: 'Sports photos' },
  },
};

export function photoUrl(category: string, slug: string, width: 800 | 1600): string {
  return `/photos/${category}/${slug}-${width}.webp`;
}
