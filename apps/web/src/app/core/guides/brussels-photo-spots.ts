import type { Guide } from '../guide-content';
import { formatPrice, pricingFor } from '../packs';

const l = pricingFor('lifestyle');
const price = (type: 'photo' | 'video' | 'combo') => formatPrice(l.packs.find((p) => p.type === type)!.price!);

/**
 * Guide « préparer une séance » : douze spots de shooting à Bruxelles, en
 * français et en anglais (le public expat cherche « photoshoot locations
 * Brussels »). Les lieux sont publics ; les règles d'accès (parcs fermés la
 * nuit, intérieurs soumis à autorisation) sont données telles que connues
 * en 2026, à vérifier le jour même.
 */
export const GUIDES_BRUSSELS_SPOTS: readonly Guide[] = [
  {
    slug: 'spots-shooting-photo-bruxelles',
    locale: 'fr',
    group: 'spots-bruxelles',
    category: 'lifestyle',
    title: 'Où faire un shooting photo à Bruxelles : 12 spots pour une séance couple, famille ou portrait',
    metaTitle: 'Shooting photo à Bruxelles : 12 spots pour une séance couple, famille ou portrait',
    metaDescription: 'Douze lieux de séance photo à Bruxelles, classés par ambiance (monumental, nature, urbain, Art nouveau), avec la meilleure heure, la lumière, l’accès et ce qu’ils donnent en image. Et ce que coûte une séance.',
    eyebrow: 'Guide séance',
    published: '2026-10-05',
    readingMinutes: 8,
    answer: `Les douze spots qui marchent à Bruxelles tiennent en quatre ambiances : monumental (Grand-Place à l’aube, Mont des Arts, Cinquantenaire, Galeries Royales), nature (bois de la Cambre, étangs d’Ixelles et abbaye de la Cambre, parc de Woluwe, Rouge-Cloître), urbain (canal et Tour & Taxis, place Flagey, Atomium) et Art nouveau (les rues d’Ixelles et de Saint-Gilles autour du musée Horta). La bonne heure est presque toujours l’heure dorée, une heure avant le coucher du soleil, ou huit heures du matin pour les lieux touristiques. Une séance d’une heure trente coûte ${price('photo')} TTC, ${price('combo')} avec un court film ; aucun spot de cette liste ne demande d’autorisation pour une séance à deux ou en famille.`,
    sections: [
      {
        title: 'Les douze spots, en un tableau',
        paragraphs: ['Tous sont accessibles gratuitement et sans autorisation pour une séance non commerciale. Les parcs ferment à la tombée du jour.'],
        table: {
          columns: ['Spot', 'Ambiance', 'Meilleure heure', 'Ce qu’il donne'],
          rows: [
            ['Grand-Place', 'Monumental', '7 h – 9 h', 'Les façades dorées, le pavé vide ; après 10 h, la foule'],
            ['Mont des Arts', 'Monumental', 'Heure dorée', 'La vue sur la ville, le jardin, les escaliers'],
            ['Cinquantenaire', 'Monumental', 'Heure dorée', 'Les arcades, les pelouses, l’axe vers l’Europe'],
            ['Galeries Royales Saint-Hubert', 'Monumental, couvert', 'Matin, ou pluie', 'La verrière, la lumière diffuse ; le plan B pluie de la ville'],
            ['Bois de la Cambre', 'Nature', 'Heure dorée, automne', 'Les allées, le lac, les couleurs d’octobre'],
            ['Étangs d’Ixelles et abbaye de la Cambre', 'Nature', 'Fin d’après-midi', 'L’eau, les saules, le cloître et les jardins en terrasses'],
            ['Parc de Woluwe', 'Nature', 'Heure dorée', 'Les grandes pelouses, les étangs, les ponts'],
            ['Rouge-Cloître (Auderghem)', 'Nature', 'Matin', 'Le prieuré, les étangs, la forêt de Soignes à côté'],
            ['Canal et Tour & Taxis', 'Urbain', 'Heure dorée', 'Les briques, les quais, les graffitis ; rendu éditorial'],
            ['Place Flagey', 'Urbain', 'Fin d’après-midi', 'Le bâtiment paquebot, les terrasses, les étangs à côté'],
            ['Atomium et parc de Laeken', 'Urbain, iconique', 'Heure dorée', 'Les sphères, les pelouses ; à cinq minutes du studio'],
            ['Rues Art nouveau de Saint-Gilles et d’Ixelles', 'Architecture', 'Matin ou fin d’après-midi', 'Les façades Horta et Hankar, les portes, les sgraffites'],
          ],
          note: 'Une séance couvre deux ou trois spots proches les uns des autres, pas douze.',
        },
      },
      {
        title: 'Comment choisir : trois questions',
        paragraphs: ['Le bon spot dépend moins de sa beauté que de vous.'],
        list: [
          'Quelle ambiance vous ressemble ? Un couple qui aime la ville n’a rien à faire au bois ; une famille avec un enfant de trois ans a besoin de pelouse et de canards, pas de pavés.',
          'Quelle heure est possible ? Si la séance doit avoir lieu à 14 h un samedi, oubliez la Grand-Place : choisissez un parc avec de l’ombre ou les Galeries.',
          'Quelle saison ? Octobre au bois de la Cambre, mai aux étangs d’Ixelles, l’hiver au Mont des Arts avec les lumières, la pluie sous la verrière des Galeries.',
        ],
      },
      {
        title: 'La lumière, par ambiance',
        paragraphs: [
          'Les lieux monumentaux (Grand-Place, Cinquantenaire, Mont des Arts) se photographient à l’heure dorée ou tôt le matin : la pierre prend la lumière rasante et les ombres dessinent les façades. À midi, tout est plat et il y a du monde.',
          'Les parcs tolèrent mieux la journée, à condition de chercher l’ombre des arbres : la lumière y est douce et les visages n’ont pas d’ombres dures. L’heure dorée y reste la meilleure.',
          'Le canal et les rues Art nouveau sont des lieux d’ombre et de contre-jour : ils marchent presque à toute heure, et donnent le rendu le plus « magazine ».',
        ],
      },
      {
        title: 'Ce qui est autorisé, et ce qui ne l’est pas',
        paragraphs: [
          'Une séance couple, famille, grossesse ou portrait dans l’espace public bruxellois ne demande aucune autorisation. Les parcs régionaux (Cinquantenaire, Woluwe, Laeken) sont ouverts du matin à la tombée du jour. Les intérieurs (Galeries, gares, musées) relèvent de leur gestionnaire : une séance discrète y est tolérée, un shooting avec éclairage et assistant ne l’est pas sans accord.',
          'Le drone est interdit sur l’essentiel de Bruxelles. Les séances commerciales (marque, mode, publicité) sur la voie publique demandent une autorisation communale, et parfois une redevance.',
        ],
      },
      {
        title: 'Ce que coûte une séance',
        paragraphs: [
          `Chez Heaven Motion, la séance lifestyle d’une heure trente coûte ${price('photo')} TTC avec 25 photos retouchées livrées en galerie, ${price('video')} pour deux reels vidéo, et ${price('combo')} pour les photos et un court film par la même personne. Tous les spots de cette liste sont dans la zone incluse : aucun déplacement facturé. Sur le marché bruxellois, une séance couple ou famille d’une heure se situe entre 150 et 350 € selon le nombre de photos livrées.`,
        ],
      },
    ],
    faq: [
      { question: 'Quel est le plus beau spot photo de Bruxelles ?', answer: 'Pour un couple, la Grand-Place à l’aube ou le Mont des Arts à l’heure dorée ; pour une famille, le bois de la Cambre ou le parc de Woluwe ; pour un rendu éditorial, le canal et les rues Art nouveau.' },
      { question: 'Faut-il une autorisation pour un shooting à Bruxelles ?', answer: 'Non pour une séance privée dans l’espace public. Oui pour un shooting commercial sur la voie publique et pour l’usage d’éclairage dans un lieu couvert.' },
      { question: 'Que faire s’il pleut ?', answer: 'Les Galeries Royales Saint-Hubert, le Rouge-Cloître sous les arbres, ou le report de la séance : il est inclus, sans frais, une fois.' },
      { question: 'Quelle heure pour une séance en famille avec de jeunes enfants ?', answer: 'Le matin, après le petit-déjeuner et avant la sieste, dans un parc : la lumière est bonne et les enfants aussi.' },
      { question: 'Combien de spots dans une séance ?', answer: 'Deux ou trois, proches les uns des autres : Mont des Arts et Grand-Place, étangs d’Ixelles et abbaye de la Cambre, Cinquantenaire et parc Léopold.' },
    ],
    ctaTitle: 'Réservez votre séance',
    ctaBody: 'Dites-nous l’ambiance, la saison et qui sera là : on choisit les spots et l’heure ensemble, et vous recevez la confirmation sous 48 h.',
    related: [
      { label: 'Séances couple, famille, grossesse : la formule lifestyle', path: '/prestations/lifestyle' },
      { label: 'Photographe & vidéaste à Bruxelles', path: '/zones/belgique/bruxelles' },
      { label: 'La grille complète et les options', path: '/tarifs' },
    ],
  },
  {
    slug: 'photoshoot-locations-brussels',
    locale: 'en',
    group: 'spots-bruxelles',
    category: 'lifestyle',
    title: 'Photoshoot locations in Brussels: 12 spots for a couple, family or portrait session',
    metaTitle: 'Photoshoot locations in Brussels: 12 spots for couple, family and portrait sessions',
    metaDescription: 'Twelve photoshoot locations in Brussels, grouped by mood (monumental, nature, urban, Art Nouveau), with the best hour, the light, access rules and what each gives in pictures. And what a session costs.',
    eyebrow: 'Session guide',
    published: '2026-10-05',
    readingMinutes: 8,
    answer: `The twelve spots that work in Brussels fall into four moods: monumental (the Grand-Place at dawn, Mont des Arts, the Cinquantenaire, the Galeries Royales), nature (Bois de la Cambre, the Ixelles ponds and La Cambre Abbey, Woluwe park, Rouge-Cloître), urban (the canal and Tour & Taxis, Place Flagey, the Atomium) and Art Nouveau (the streets of Ixelles and Saint-Gilles around the Horta Museum). The right hour is almost always golden hour, one hour before sunset, or eight in the morning for the tourist landmarks. A ninety-minute session costs ${price('photo')} incl. VAT, ${price('combo')} with a short film; none of these spots needs a permit for a couple or family session.`,
    sections: [
      {
        title: 'The twelve spots at a glance',
        paragraphs: ['All are free and need no permit for a non-commercial session. Parks close at dusk.'],
        table: {
          columns: ['Spot', 'Mood', 'Best hour', 'What it gives'],
          rows: [
            ['Grand-Place', 'Monumental', '7 – 9 am', 'Gilded façades, empty cobbles; after 10 am, the crowds'],
            ['Mont des Arts', 'Monumental', 'Golden hour', 'The view over the city, the garden, the stairs'],
            ['Cinquantenaire', 'Monumental', 'Golden hour', 'The arcades, the lawns, the axis towards the EU quarter'],
            ['Galeries Royales Saint-Hubert', 'Monumental, covered', 'Morning, or rain', 'The glass roof, diffused light; the city’s rain plan'],
            ['Bois de la Cambre', 'Nature', 'Golden hour, autumn', 'The avenues, the lake, October colours'],
            ['Ixelles ponds and La Cambre Abbey', 'Nature', 'Late afternoon', 'Water, willows, the cloister and terraced gardens'],
            ['Woluwe park', 'Nature', 'Golden hour', 'Wide lawns, ponds, bridges'],
            ['Rouge-Cloître (Auderghem)', 'Nature', 'Morning', 'The priory, the ponds, the Sonian Forest next door'],
            ['Canal and Tour & Taxis', 'Urban', 'Golden hour', 'Brick, quays, street art; an editorial look'],
            ['Place Flagey', 'Urban', 'Late afternoon', 'The ocean-liner building, the terraces, the ponds nearby'],
            ['Atomium and Laeken park', 'Urban, iconic', 'Golden hour', 'The spheres, the lawns; unmistakably Brussels'],
            ['Art Nouveau streets of Saint-Gilles and Ixelles', 'Architecture', 'Morning or late afternoon', 'Horta and Hankar façades, doors, sgraffiti'],
          ],
          note: 'A session covers two or three spots close to each other, not twelve.',
        },
      },
      {
        title: 'How to choose: three questions',
        paragraphs: ['The right spot depends less on its beauty than on you.'],
        list: [
          'Which mood is yours? A couple who loves the city has no business in the woods; a family with a three-year-old needs grass and ducks, not cobbles.',
          'Which hour is possible? If the session has to be at 2 pm on a Saturday, forget the Grand-Place: pick a park with shade, or the Galeries.',
          'Which season? October in the Bois de la Cambre, May at the Ixelles ponds, winter at Mont des Arts with the lights, rain under the glass roof of the Galeries.',
        ],
      },
      {
        title: 'The light, by mood',
        paragraphs: [
          'Monumental spots (Grand-Place, Cinquantenaire, Mont des Arts) are shot at golden hour or early morning: the stone catches the low light and shadows draw the façades. At noon everything is flat and crowded.',
          'Parks tolerate daytime better, as long as you look for the shade of trees: the light is soft there and faces have no hard shadows. Golden hour remains best.',
          'The canal and the Art Nouveau streets are places of shade and backlight: they work almost any hour and give the most “magazine” look.',
        ],
      },
      {
        title: 'What is allowed, and what is not',
        paragraphs: [
          'A couple, family, maternity or portrait session in Brussels public space needs no permit. Regional parks (Cinquantenaire, Woluwe, Laeken) are open from morning to dusk. Interiors (the Galeries, stations, museums) belong to their managers: a discreet session is tolerated, a shoot with lights and an assistant is not without agreement.',
          'Drones are forbidden over most of Brussels. Commercial shoots (brand, fashion, advertising) on the public road require a municipal permit, sometimes with a fee.',
        ],
      },
      {
        title: 'What a session costs',
        paragraphs: [
          `At Heaven Motion, the ninety-minute lifestyle session costs ${price('photo')} incl. VAT with 25 edited photos delivered in an online gallery, ${price('video')} for two video reels, and ${price('combo')} for photos and a short film by the same person. Every spot on this list is inside the included zone: no travel fee. On the Brussels market, a one-hour couple or family session runs between €150 and €350 depending on the number of photos delivered.`,
        ],
      },
    ],
    faq: [
      { question: 'What is the best photo spot in Brussels?', answer: 'For a couple, the Grand-Place at dawn or Mont des Arts at golden hour; for a family, the Bois de la Cambre or Woluwe park; for an editorial look, the canal and the Art Nouveau streets.' },
      { question: 'Do I need a permit for a photoshoot in Brussels?', answer: 'Not for a private session in public space. Yes for a commercial shoot on the public road, and for using lights in a covered venue.' },
      { question: 'What if it rains?', answer: 'The Galeries Royales Saint-Hubert, Rouge-Cloître under the trees, or rescheduling: one reschedule is included at no cost.' },
      { question: 'What hour for a family session with young children?', answer: 'Morning, after breakfast and before the nap, in a park: the light is good and so are the children.' },
      { question: 'How many spots in one session?', answer: 'Two or three, close to each other: Mont des Arts and Grand-Place, the Ixelles ponds and La Cambre Abbey, the Cinquantenaire and Parc Léopold.' },
    ],
    ctaTitle: 'Book your session',
    ctaBody: 'Tell us the mood, the season and who will be there: we pick the spots and the hour together, and you get a confirmation within 48 h.',
    related: [
      { label: 'Couple, family and maternity sessions: the lifestyle package', path: '/en/services/lifestyle' },
      { label: 'Photographer & videographer in Brussels', path: '/en/areas/belgium/brussels' },
      { label: 'Full pricing and options', path: '/en/pricing' },
    ],
  },
];
