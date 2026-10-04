import type { Guide } from '../guide-content';
import { formatPrice, pricingFor } from '../packs';

const e = pricingFor('evenementiel');
const l = pricingFor('lifestyle');
const event = (type: 'photo' | 'video' | 'combo') => formatPrice(e.packs.find((p) => p.type === type)!.price!);
const session = formatPrice(l.packs.find((p) => p.type === 'photo')!.price!);

/**
 * Guide organisation : photos de communion, profession de foi, lentefeest et
 * feest vrijzinnige jeugd. Deux versions parce que les fêtes elles-mêmes
 * diffèrent : en Flandre, le lentefeest laïque à 6 ans et le feest
 * vrijzinnige jeugd à 12 ans existent à côté de la communion et du vormsel ;
 * en Wallonie et à Bruxelles francophone, la première communion et la
 * profession de foi dominent. Renvoie vers la catégorie événementiel.
 */
export const GUIDES_COMMUNION: readonly Guide[] = [
  {
    slug: 'photos-communion-profession-de-foi-quand-ou-combien',
    locale: 'fr',
    group: 'communion-lentefeest',
    category: 'evenementiel',
    title: 'Photos de communion et de profession de foi : quand, où, combien',
    metaTitle: 'Photographe communion et profession de foi (2026) : quand, où, combien',
    metaDescription: 'Séance portrait ou reportage de la fête, les dates (avril à juin), ce qui est permis dans l’église, les lieux de séance, ce que coûte un photographe de communion en Belgique, et ce que livre Heaven Motion.',
    eyebrow: 'Guide famille',
    published: '2026-10-05',
    readingMinutes: 7,
    answer: `Pour une communion ou une profession de foi, il y a deux façons de faire des photos, et elles se cumulent : une séance portrait de l’enfant (seul, avec les parents, avec les parrain et marraine), une semaine avant ou le matin même, et un reportage de la fête, de la cérémonie au gâteau. En Belgique, une séance portrait d’une heure coûte entre 120 et 300 €, un reportage de trois à quatre heures entre 350 et 700 €. Chez Heaven Motion, la séance d’une heure trente est à ${session} TTC et le reportage de trois heures à ${event('photo')} TTC en photo, ${event('combo')} avec un film de deux à trois minutes. Les dates se concentrent d’avril à juin, le dimanche, autour de l’Ascension et de la Pentecôte : réservez en janvier.`,
    sections: [
      {
        title: 'Les deux formules, et laquelle choisir',
        paragraphs: [
          'La séance portrait répond à une question : avoir de belles images de l’enfant dans sa tenue, posées et nettes, pour le faire-part, le cadre et les grands-parents. Elle se fait dans un parc, dans le jardin ou à la maison, une semaine avant (l’enfant n’est pas fatigué, la tenue est intacte) ou le matin de la fête.',
          'Le reportage répond à une autre : garder la journée telle qu’elle a eu lieu, l’entrée dans l’église, la famille réunie, les cadeaux, le gâteau, les cousins qui courent. Il dure trois à quatre heures et donne entre 100 et 200 photos.',
          'Les familles qui hésitent prennent la séance : c’est l’image qu’on garde. Celles qui reçoivent trente personnes prennent le reportage, et une séance de vingt minutes avant l’arrivée des invités.',
        ],
      },
      {
        title: 'Les dates : le calendrier belge',
        paragraphs: [
          'Les premières communions se célèbrent en deuxième primaire, vers 7 ou 8 ans, et les professions de foi en sixième primaire, vers 12 ans. Les paroisses les concentrent entre fin avril et mi-juin, le dimanche matin, avec des pics le week-end de l’Ascension et celui de la Pentecôte. Dans une même famille, il n’est pas rare d’avoir une communion et une profession de foi la même année.',
          'Conséquence : les photographes sont pris les mêmes six dimanches. Réservez en janvier ou février pour une date de mai, dès que la paroisse a confirmé la date.',
        ],
      },
      {
        title: 'Où : l’église, la séance, la fête',
        paragraphs: [
          'Dans l’église, la plupart des paroisses tolèrent un photographe discret, sans flash, placé sur le côté ou au fond ; certaines désignent un photographe pour toute la célébration et demandent aux familles de ne pas en amener. Demandez à la paroisse : la réponse décide du programme.',
          'Pour la séance, un parc près de chez vous (à Bruxelles : bois de la Cambre, parc de Woluwe, Cinquantenaire ; en Brabant wallon : parc de La Hulpe, lac de Genval), le jardin, ou la maison si la lumière y est bonne. L’enfant est plus à l’aise sur un terrain connu.',
          'Pour la fête, le reportage suit la famille : la sortie de l’église, la table, les cadeaux, le gâteau, les jeux. Trois heures couvrent la cérémonie et le début du repas ; quatre heures vont jusqu’au gâteau.',
        ],
      },
      {
        title: 'Ce que ça coûte, sur le marché et chez nous',
        paragraphs: ['Prix TTC, Belgique, relevés sur les sites de photographes familiaux en septembre 2026.'],
        table: {
          columns: ['Formule', 'Marché belge', 'Heaven Motion (TTC)'],
          rows: [
            ['Séance portrait, 1 h, 15 à 25 photos', '120 – 300 €', `${session} (1 h 30, 25 photos)`],
            ['Reportage de la fête, 3 à 4 h, 100 à 200 photos', '350 – 700 €', `${event('photo')} (3 h, ~150 photos)`],
            ['Reportage + film court', '700 – 1 200 €', `${event('combo')} (3 h, photos + film 2–3 min)`],
            ['Heure supplémentaire', '80 – 150 €', '150 €'],
          ],
          note: 'Déplacement inclus jusqu’à 60 km de Bruxelles. Séance et reportage le même jour : sur devis, la séance s’ajoute pour moins que son prix seul.',
        },
      },
      {
        title: 'Ce qui aide le photographe, et donc les photos',
        paragraphs: ['Cinq choses à prévoir.'],
        list: [
          'Le programme et les horaires exacts : heure de la messe, du repas, du gâteau.',
          'La réponse de la paroisse sur la photo dans l’église.',
          'La liste des groupes voulus : enfant seul, avec les parents, avec les parrain et marraine, avec les grands-parents, avec les cousins. Dix minutes avant le repas suffisent si la liste est prête.',
          'La tenue de rechange pour la séance, si elle a lieu avant la fête.',
          'Un adulte référent pour appeler les gens pour les groupes : le photographe ne connaît pas les prénoms.',
        ],
      },
    ],
    faq: [
      { question: 'Quand faire les photos de communion ?', answer: 'La séance portrait une semaine avant ou le matin même ; le reportage le jour de la fête. Réservez en janvier pour une date de mai.' },
      { question: 'Le photographe peut-il entrer dans l’église ?', answer: 'Dans la plupart des paroisses, oui, discrètement et sans flash ; certaines imposent leur propre photographe. Demandez à la paroisse avant de réserver.' },
      { question: 'Combien coûte un photographe de communion en Belgique ?', answer: 'Entre 120 et 300 € pour une séance portrait, entre 350 et 700 € pour un reportage de trois à quatre heures. Chez Heaven Motion : ' + session + ' la séance, ' + event('photo') + ' le reportage de trois heures, TTC.' },
      { question: 'Faites-vous aussi une vidéo ?', answer: 'Oui : ' + event('combo') + ' TTC pour trois heures de photos et un film de deux à trois minutes, par la même personne.' },
      { question: 'Combien de photos recevons-nous, et quand ?', answer: '25 photos retouchées pour la séance, environ 150 pour le reportage, en galerie en ligne, sous deux à quatre semaines ; un aperçu sous sept jours.' },
    ],
    ctaTitle: 'Réservez votre date de communion',
    ctaBody: 'Dites-nous la date, la paroisse et le lieu de la fête : vous recevez sous 48 h un devis avec la séance, le reportage ou les deux.',
    related: [
      { label: 'Photographe & vidéaste événementiel : communions, baptêmes, anniversaires', path: '/prestations/evenementiel' },
      { label: 'Séances famille : la formule lifestyle', path: '/prestations/lifestyle' },
      { label: 'La grille complète et les options', path: '/tarifs' },
    ],
  },
  {
    slug: 'fotoshoot-lentefeest-communie-wanneer-waar-prijs',
    locale: 'nl',
    group: 'communion-lentefeest',
    category: 'evenementiel',
    title: 'Fotoshoot voor lentefeest, communie en vormsel: wanneer, waar en wat kost het',
    metaTitle: 'Fotograaf lentefeest, eerste communie en vormsel (2026): wanneer, waar, prijs',
    metaDescription: 'Portretshoot of reportage van het feest, de data (april tot juni), wat mag in de kerk, de plekken voor de shoot, wat een fotograaf voor een lentefeest of communie kost in België, en wat Heaven Motion levert.',
    eyebrow: 'Gezinsgids',
    published: '2026-10-05',
    readingMinutes: 7,
    answer: `Voor een lentefeest, een eerste communie, een vormsel of een feest vrijzinnige jeugd zijn er twee manieren om foto’s te maken, en ze zijn te combineren: een portretshoot van het kind (alleen, met de ouders, met meter en peter), een week vooraf of de ochtend zelf, en een reportage van het feest, van de viering tot de taart. In België kost een portretshoot van een uur 120 tot 300 €, een reportage van drie tot vier uur 350 tot 700 €. Bij Heaven Motion kost de shoot van anderhalf uur ${session} incl. btw en de reportage van drie uur ${event('photo')} incl. btw voor foto, ${event('combo')} met een film van twee tot drie minuten. De data vallen van april tot juni, op zondag, rond Hemelvaart en Pinksteren: boek in januari.`,
    sections: [
      {
        title: 'De twee formules, en welke kiezen',
        paragraphs: [
          'De portretshoot beantwoordt één vraag: mooie beelden van het kind in zijn kleren, geposeerd en scherp, voor de kaartjes, het kader en de grootouders. Ze gebeurt in een park, in de tuin of thuis, een week vooraf (het kind is niet moe, de kleren zijn nog proper) of de ochtend van het feest.',
          'De reportage beantwoordt een andere: de dag bewaren zoals hij was, het binnenkomen in de kerk of de zaal, de familie samen, de cadeaus, de taart, de neefjes die rondlopen. Ze duurt drie tot vier uur en geeft 100 tot 200 foto’s.',
          'Gezinnen die twijfelen nemen de shoot: dat is het beeld dat blijft. Gezinnen die dertig mensen ontvangen nemen de reportage, en een shoot van twintig minuten vóór de gasten aankomen.',
        ],
      },
      {
        title: 'De data: de Vlaamse kalender',
        paragraphs: [
          'Het lentefeest en de eerste communie vallen in het eerste leerjaar, rond 6 of 7 jaar; het vormsel en het feest vrijzinnige jeugd in het zesde leerjaar, rond 12 jaar. Scholen, parochies en de vrijzinnige gemeenschap plannen ze tussen eind april en midden juni, op zondag, met pieken rond Hemelvaart en Pinksteren.',
          'Gevolg: de fotografen zijn dezelfde zes zondagen bezet. Boek in januari of februari voor een datum in mei, zodra de school of de parochie de datum bevestigd heeft.',
        ],
      },
      {
        title: 'Waar: de viering, de shoot, het feest',
        paragraphs: [
          'In de kerk tolereren de meeste parochies een discrete fotograaf zonder flits, opzij of achteraan; sommige wijzen één fotograaf aan voor de hele viering. Bij een lentefeest op school gelden de regels van de school: vraag het vooraf, het antwoord bepaalt het programma.',
          'Voor de shoot: een park in de buurt (in Brussel: Ter Kamerenbos, Woluwepark, Jubelpark; in Vlaams-Brabant: het park van Tervuren, de abdij van Grimbergen), de tuin, of thuis als het licht goed is. Het kind is meer op zijn gemak op bekend terrein.',
          'Voor het feest volgt de reportage de familie: het buitenkomen, de tafel, de cadeaus, de taart, de spelletjes. Drie uur dekt de viering en het begin van de maaltijd; vier uur gaat tot de taart.',
        ],
      },
      {
        title: 'Wat het kost, op de markt en bij ons',
        paragraphs: ['Prijzen incl. btw, België, opgetekend op de sites van gezinsfotografen in september 2026.'],
        table: {
          columns: ['Formule', 'Belgische markt', 'Heaven Motion (incl. btw)'],
          rows: [
            ['Portretshoot, 1 u, 15 tot 25 foto’s', '120 – 300 €', `${session} (1 u 30, 25 foto’s)`],
            ['Reportage van het feest, 3 tot 4 u, 100 tot 200 foto’s', '350 – 700 €', `${event('photo')} (3 u, ~150 foto’s)`],
            ['Reportage + korte film', '700 – 1.200 €', `${event('combo')} (3 u, foto’s + film 2–3 min)`],
            ['Extra uur', '80 – 150 €', '150 €'],
          ],
          note: 'Verplaatsing inbegrepen tot 60 km van Brussel. Shoot en reportage op dezelfde dag: op offerte, de shoot komt erbij voor minder dan haar prijs alleen.',
        },
      },
      {
        title: 'Wat de fotograaf helpt, en dus de foto’s',
        paragraphs: ['Vijf dingen om te voorzien.'],
        list: [
          'Het programma en de exacte uren: viering, maaltijd, taart.',
          'Het antwoord van de parochie of de school over foto’s tijdens de viering.',
          'De lijst van gewenste groepen: kind alleen, met de ouders, met meter en peter, met de grootouders, met de neven en nichten. Tien minuten vóór de maaltijd volstaan als de lijst klaar is.',
          'Reservekleren voor de shoot, als die vóór het feest plaatsvindt.',
          'Eén volwassene die de mensen roept voor de groepen: de fotograaf kent de voornamen niet.',
        ],
      },
    ],
    faq: [
      { question: 'Wanneer de foto’s van het lentefeest of de communie maken?', answer: 'De portretshoot een week vooraf of de ochtend zelf; de reportage op de dag van het feest. Boek in januari voor een datum in mei.' },
      { question: 'Mag de fotograaf in de kerk of op school?', answer: 'In de meeste parochies ja, discreet en zonder flits; sommige leggen hun eigen fotograaf op. Op school gelden de regels van de school. Vraag het vooraf.' },
      { question: 'Wat kost een fotograaf voor een lentefeest of communie in België?', answer: 'Tussen 120 en 300 € voor een portretshoot, tussen 350 en 700 € voor een reportage van drie tot vier uur. Bij Heaven Motion: ' + session + ' de shoot, ' + event('photo') + ' de reportage van drie uur, incl. btw.' },
      { question: 'Maakt u ook een film?', answer: 'Ja: ' + event('combo') + ' incl. btw voor drie uur foto’s en een film van twee tot drie minuten, door dezelfde persoon.' },
      { question: 'Hoeveel foto’s krijgen we, en wanneer?', answer: '25 bewerkte foto’s voor de shoot, ongeveer 150 voor de reportage, in een online galerij, binnen twee tot vier weken; een preview binnen zeven dagen.' },
    ],
    ctaTitle: 'Boek uw datum',
    ctaBody: 'Zeg ons de datum, de school of parochie en de feestlocatie: u krijgt binnen 48 u een offerte met de shoot, de reportage of beide.',
    related: [
      { label: 'Fotograaf & videograaf voor evenementen: lentefeesten, communies, verjaardagen', path: '/nl/diensten/evenementen' },
      { label: 'Gezinsshoots: de lifestyle-formule', path: '/nl/diensten/lifestyle' },
      { label: 'De volledige tarieven en opties', path: '/nl/tarieven' },
    ],
  },
];
