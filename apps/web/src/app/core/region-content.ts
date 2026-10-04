import { FaqEntry } from './faq-content';
import { SiteLocale } from './locale';
import { CountryCode } from './regions';

/**
 * Contenu rédactionnel d'une page région, dans une langue. Une page région
 * n'existe que dans les langues où elle a un contenu ici : pas de page
 * traduite à la chaîne, pas de contenu creux. Les villes sont citées avec
 * un fait propre à chacune, les lieux de réception et de tournage sont ceux
 * de la région — aucun n'est présenté comme une référence tournée tant que
 * les projets réels (chantier 9) ne sont pas publiés.
 */
export interface RegionContent {
  readonly intro: string;
  readonly citiesTitle: string;
  readonly cities: readonly { readonly name: string; readonly fact: string }[];
  readonly venuesTitle: string;
  readonly venues: readonly string[];
  readonly practicalTitle: string;
  readonly practical: readonly string[];
  readonly faq: readonly FaqEntry[];
}

export interface CountryContent {
  readonly intro: string;
  readonly practical: readonly string[];
}

/** Phase 1 du plan : Bruxelles, Brabant flamand, Brabant wallon, Luxembourg, Lille. */
export const REGION_CONTENT: Readonly<Record<string, Partial<Record<SiteLocale, RegionContent>>>> = {
  bruxelles: {
    fr: {
      intro:
        'Photographe et vidéaste à Bruxelles, basé à Wemmel, à dix minutes de l’Atomium : les 19 communes de la Région de Bruxelles-Capitale sont couvertes sans frais de déplacement, dans les trois langues de la ville. Mariages civils à l’hôtel de ville, fêtes de famille à Uccle ou Schaerbeek, portraits d’équipe dans le quartier européen, tournages de clip le long du canal : la même personne pour la photo et la vidéo, avec une grille de prix affichée.',
      citiesTitle: 'Dans les communes',
      cities: [
        { name: 'Bruxelles-Ville', fact: 'les mariages civils se célèbrent à l’hôtel de ville de la Grand-Place ; les photos de sortie se font sur la place même, en quelques minutes.' },
        { name: 'Ixelles et Uccle', fact: 'les étangs d’Ixelles, le bois de la Cambre et la place Brugmann pour une séance couple ou famille en lumière douce.' },
        { name: 'Etterbeek et le quartier européen', fact: 'le Cinquantenaire pour les séances, les institutions et cabinets pour les portraits LinkedIn et les conférences.' },
        { name: 'Schaerbeek et Laeken', fact: 'le parc Josaphat, l’Atomium et le parc de Laeken, à cinq minutes du studio.' },
        { name: 'Woluwe et Auderghem', fact: 'les parcs de Woluwe et la forêt de Soignes pour les séances, les salles communales pour les fêtes.' },
        { name: 'Anderlecht, Molenbeek, Forest', fact: 'le canal et ses friches pour les clips, le stade Lotto Park et les salles de sport pour les clubs.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Hôtel de ville de Bruxelles', 'Les Jardins d’Hélène (Uccle)', 'Château de Val Duchesse (Auderghem)', 'Abbaye de la Cambre (Ixelles)', 'Maison communale de Schaerbeek', 'Tour & Taxis', 'Le Bouche à Oreille (Etterbeek)', 'Château Sainte-Anne (Auderghem)', 'The Egg (Anderlecht)', 'Atomium et parc de Laeken', 'Grand-Place et Mont des Arts', 'Forêt de Soignes'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement inclus dans les 19 communes et jusqu’à 60 km autour.',
        'Drone : Bruxelles est en zone très restreinte (institutions, aéroport), les plans aériens se font hors ville ou sur autorisation. L’option est reportée ou remboursée si le vol est impossible.',
        'Mariage civil : la plupart des maisons communales acceptent un photographe dans la salle ; la place et la durée sont confirmées au repérage.',
        'Langues : français, néerlandais et anglais, pour les familles et les équipes internationales.',
      ],
      faq: [
        { question: 'Vous déplacez-vous dans toutes les communes de Bruxelles ?', answer: 'Oui, les 19 communes de la Région de Bruxelles-Capitale sont dans la zone incluse : aucun frais de déplacement, quelle que soit la formule.' },
        { question: 'Où faire une séance photo couple à Bruxelles ?', answer: 'Le bois de la Cambre, le Cinquantenaire, les étangs d’Ixelles, le Mont des Arts tôt le matin, le canal pour un rendu plus urbain. Le lieu se choisit ensemble selon la lumière et l’heure.' },
        { question: 'Faites-vous des portraits LinkedIn pour une équipe dans le quartier européen ?', answer: 'Oui : une demi-journée dans vos bureaux, un espace portrait monté en vingt minutes, chaque portrait retouché et livré en format LinkedIn. Prix hors TVA sur la page tarifs.' },
      ],
    },
    nl: {
      intro:
        'Fotograaf en videograaf in Brussel, gevestigd in Wemmel, op tien minuten van het Atomium: de 19 gemeenten van het Brussels Hoofdstedelijk Gewest zonder verplaatsingskosten, in de drie talen van de stad. Burgerlijke huwelijken op het stadhuis, familiefeesten in Ukkel of Schaarbeek, teamportretten in de Europese wijk, clipopnames langs het kanaal: dezelfde persoon voor foto en video, met prijzen online.',
      citiesTitle: 'In de gemeenten',
      cities: [
        { name: 'Stad Brussel', fact: 'burgerlijke huwelijken worden gevierd in het stadhuis op de Grote Markt; de foto’s bij het buitenkomen gebeuren op het plein zelf, in enkele minuten.' },
        { name: 'Elsene en Ukkel', fact: 'de Vijvers van Elsene, het Ter Kamerenbos en het Brugmannplein voor een koppel- of gezinsshoot in zacht licht.' },
        { name: 'Etterbeek en de Europese wijk', fact: 'het Jubelpark voor de sessies, de instellingen en kantoren voor LinkedIn-portretten en conferenties.' },
        { name: 'Schaarbeek en Laken', fact: 'het Josaphatpark, het Atomium en het park van Laken, op vijf minuten van de studio.' },
        { name: 'Woluwe en Oudergem', fact: 'de Woluweparken en het Zoniënwoud voor de sessies, de gemeentezalen voor de feesten.' },
        { name: 'Anderlecht, Molenbeek, Vorst', fact: 'het kanaal en zijn braakliggende terreinen voor clips, het Lotto Park en de sporthallen voor de clubs.' },
      ],
      venuesTitle: 'Feest- en opnamelocaties',
      venues: ['Stadhuis van Brussel', 'Les Jardins d’Hélène (Ukkel)', 'Kasteel van Hertoginnedal (Oudergem)', 'Abdij Ter Kameren (Elsene)', 'Gemeentehuis van Schaarbeek', 'Tour & Taxis', 'Le Bouche à Oreille (Etterbeek)', 'Kasteel Sint-Anna (Oudergem)', 'The Egg (Anderlecht)', 'Atomium en park van Laken', 'Grote Markt en Kunstberg', 'Zoniënwoud'],
      practicalTitle: 'Praktisch',
      practical: [
        'Verplaatsing inbegrepen in de 19 gemeenten en tot 60 km rondom.',
        'Drone: Brussel is een sterk beperkte zone (instellingen, luchthaven), luchtbeelden gebeuren buiten de stad of met toelating. De optie wordt verplaatst of terugbetaald als vliegen onmogelijk is.',
        'Burgerlijk huwelijk: de meeste gemeentehuizen laten een fotograaf toe in de zaal; plaats en duur worden bevestigd bij de verkenning.',
        'Talen: Nederlands, Frans en Engels, voor internationale families en teams.',
      ],
      faq: [
        { question: 'Komt u naar alle Brusselse gemeenten?', answer: 'Ja, de 19 gemeenten van het Brussels Hoofdstedelijk Gewest zitten in de inbegrepen zone: geen verplaatsingskosten, welke formule u ook kiest.' },
        { question: 'Waar een koppelshoot doen in Brussel?', answer: 'Het Ter Kamerenbos, het Jubelpark, de Vijvers van Elsene, de Kunstberg vroeg in de ochtend, het kanaal voor een stedelijker resultaat. De locatie kiezen we samen volgens het licht en het uur.' },
        { question: 'Maakt u LinkedIn-portretten voor een team in de Europese wijk?', answer: 'Ja: een halve dag in uw kantoren, een portretruimte opgesteld in twintig minuten, elk portret bewerkt en geleverd in LinkedIn-formaat. Prijzen excl. btw op de tarievenpagina.' },
      ],
    },
    en: {
      intro:
        'Photographer and videographer in Brussels, based in Wemmel, ten minutes from the Atomium: the 19 municipalities of the Brussels-Capital Region are covered with no travel fee, in the city’s three languages. Civil weddings at the town hall, family celebrations in Uccle or Schaerbeek, team headshots in the European quarter, music video shoots along the canal: the same person for photo and video, with published prices. For expats getting married in Brussels, the civil ceremony takes place in the municipality where one of you is registered — I know the town halls and their rules.',
      citiesTitle: 'Across the municipalities',
      cities: [
        { name: 'Brussels city centre', fact: 'civil weddings are celebrated at the town hall on the Grand-Place; the exit photos happen on the square itself, in a few minutes.' },
        { name: 'Ixelles and Uccle', fact: 'the Ixelles ponds, the Bois de la Cambre and Place Brugmann for a couple or family session in soft light.' },
        { name: 'Etterbeek and the European quarter', fact: 'the Cinquantenaire for sessions, the institutions and firms for LinkedIn headshots and conferences.' },
        { name: 'Schaerbeek and Laeken', fact: 'Josaphat park, the Atomium and Laeken park, five minutes from the studio.' },
        { name: 'Woluwe and Auderghem', fact: 'the Woluwe parks and the Sonian Forest for sessions, the municipal halls for parties.' },
        { name: 'Anderlecht, Molenbeek, Forest', fact: 'the canal and its wastelands for music videos, the Lotto Park stadium and sports halls for clubs.' },
      ],
      venuesTitle: 'Reception and shooting venues',
      venues: ['Brussels Town Hall', 'Les Jardins d’Hélène (Uccle)', 'Château de Val Duchesse (Auderghem)', 'La Cambre Abbey (Ixelles)', 'Schaerbeek Town Hall', 'Tour & Taxis', 'Le Bouche à Oreille (Etterbeek)', 'Château Sainte-Anne (Auderghem)', 'The Egg (Anderlecht)', 'Atomium and Laeken park', 'Grand-Place and Mont des Arts', 'Sonian Forest'],
      practicalTitle: 'Practical',
      practical: [
        'Travel included across the 19 municipalities and up to 60 km around.',
        'Drone: Brussels is a heavily restricted zone (institutions, airport), aerial shots happen outside the city or with a permit. The option is rescheduled or refunded if flying is impossible.',
        'Civil wedding: most town halls allow a photographer in the room; position and duration are confirmed during scouting.',
        'Languages: English, French and Dutch, for international families and teams.',
      ],
      faq: [
        { question: 'Do you cover every municipality in Brussels?', answer: 'Yes, the 19 municipalities of the Brussels-Capital Region are in the included zone: no travel fee, whichever package you choose.' },
        { question: 'Where to do a couple photo session in Brussels?', answer: 'The Bois de la Cambre, the Cinquantenaire, the Ixelles ponds, the Mont des Arts early in the morning, the canal for a more urban look. The location is chosen together according to the light and the time.' },
        { question: 'Do you shoot LinkedIn headshots for a team in the European quarter?', answer: 'Yes: a half day at your offices, a headshot corner set up in twenty minutes, every portrait retouched and delivered in LinkedIn format. Prices excl. VAT on the pricing page.' },
        { question: 'Can you cover an expat civil wedding and a party on the same day?', answer: 'Yes, that is the typical Brussels wedding: town hall in the morning, drinks and party in the afternoon and evening. The full-day packages cover it, in English, French or Dutch.' },
      ],
    },
  },
  'brabant-flamand': {
    fr: {
      intro:
        'Photographe et vidéaste en Brabant flamand, basé à Wemmel : Grimbergen, Meise, Vilvorde, Dilbeek, Asse, Louvain, Hal et toute la périphérie bruxelloise sont dans la zone incluse, sans frais de déplacement. Mariages à l’abbaye ou dans une ferme restaurée, communions et lentefeesten, fêtes d’entreprise à Zaventem ou à Louvain : la même personne pour la photo et la vidéo, en néerlandais comme en français.',
      citiesTitle: 'Dans la province',
      cities: [
        { name: 'Wemmel', fact: 'la commune du studio ; mariages civils à la maison communale de la place du Marché, fêtes dans les salles alentour.' },
        { name: 'Grimbergen et Meise', fact: 'la basilique de Grimbergen pour les cérémonies, le Jardin botanique de Meise pour les séances couple et famille.' },
        { name: 'Vilvorde et Zaventem', fact: 'les sièges d’entreprise et hôtels de séminaire de l’axe aéroport pour les portraits d’équipe et les événements corporate.' },
        { name: 'Louvain', fact: 'le Grand Béguinage, l’hôtel de ville et les abbayes pour les mariages ; une ville étudiante pour les clips.' },
        { name: 'Dilbeek, Asse et le Pajottenland', fact: 'fermes carrées, vergers et paysages ouverts pour les mariages champêtres et les séances.' },
        { name: 'Hal et Beersel', fact: 'le château de Beersel et la basilique de Hal au sud de Bruxelles.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Abbaye de Grimbergen', 'Jardin botanique de Meise', 'Château de Groenenberg (Gaasbeek)', 'Château de Gaasbeek', 'Grand Béguinage de Louvain', 'Abbaye de Parc (Heverlee)', 'Hof ter Musschen (Sint-Pieters-Leeuw)', 'Salons de Romree (Grimbergen)', 'Château de Beersel', 'Kasteel van Nieuwland (Aarschot)', 'Domaine de Huizingen', 'Brabanthal (Louvain)'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement inclus dans toute la province, à moins de 60 km de Wemmel.',
        'Drone : possible sur la plupart des domaines hors de la zone de l’aéroport de Zaventem, sur autorisation du lieu.',
        'Communion et lentefeest : printemps chargé, réservez dès janvier pour une date d’avril ou de mai.',
        'Langues : néerlandais et français, pour les familles des deux côtés de la frontière linguistique.',
      ],
      faq: [
        { question: 'Y a-t-il des frais de déplacement pour un mariage à Louvain ou à Hal ?', answer: 'Non : tout le Brabant flamand est à moins de 60 km de Wemmel, dans la zone incluse.' },
        { question: 'Faites-vous les photos de communion et de lentefeest ?', answer: 'Oui, le jour même (3 heures, environ 150 photos, aftermovie en option) ou lors d’une séance quelques semaines avant pour les faire-part (pack lifestyle, 1 h 30).' },
        { question: 'Travaillez-vous en néerlandais ?', answer: 'Oui, le site, le devis et le jour J existent en néerlandais ; les familles mixtes sont la norme ici, pas l’exception.' },
      ],
    },
    nl: {
      intro:
        'Fotograaf en videograaf in Vlaams-Brabant, gevestigd in Wemmel: Grimbergen, Meise, Vilvoorde, Dilbeek, Asse, Leuven, Halle en de hele Brusselse rand zitten in de inbegrepen zone, zonder verplaatsingskosten. Huwelijken in een abdij of een gerestaureerde hoeve, communies en lentefeesten, bedrijfsfeesten in Zaventem of Leuven: dezelfde persoon voor foto en video, in het Nederlands én het Frans.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Wemmel', fact: 'de gemeente van de studio; burgerlijke huwelijken in het gemeentehuis op het Marktplein, feesten in de zalen in de buurt.' },
        { name: 'Grimbergen en Meise', fact: 'de basiliek van Grimbergen voor de ceremonies, de Plantentuin Meise voor koppel- en gezinsshoots.' },
        { name: 'Vilvoorde en Zaventem', fact: 'de hoofdzetels en seminariehotels van de luchthavenas voor teamportretten en bedrijfsevenementen.' },
        { name: 'Leuven', fact: 'het Groot Begijnhof, het stadhuis en de abdijen voor huwelijken; een studentenstad voor clips.' },
        { name: 'Dilbeek, Asse en het Pajottenland', fact: 'vierkantshoeves, boomgaarden en open landschappen voor landelijke huwelijken en sessies.' },
        { name: 'Halle en Beersel', fact: 'het kasteel van Beersel en de basiliek van Halle ten zuiden van Brussel.' },
      ],
      venuesTitle: 'Feest- en opnamelocaties',
      venues: ['Abdij van Grimbergen', 'Plantentuin Meise', 'Kasteel Groenenberg (Gaasbeek)', 'Kasteel van Gaasbeek', 'Groot Begijnhof Leuven', 'Abdij van Park (Heverlee)', 'Hof ter Musschen (Sint-Pieters-Leeuw)', 'Salons de Romree (Grimbergen)', 'Kasteel van Beersel', 'Kasteel van Nieuwland (Aarschot)', 'Domein Huizingen', 'Brabanthal (Leuven)'],
      practicalTitle: 'Praktisch',
      practical: [
        'Verplaatsing inbegrepen in de hele provincie, op minder dan 60 km van Wemmel.',
        'Drone: mogelijk op de meeste domeinen buiten de zone van de luchthaven van Zaventem, met toelating van de locatie.',
        'Communie en lentefeest: drukke lente, boek vanaf januari voor een datum in april of mei.',
        'Talen: Nederlands en Frans, voor families aan beide kanten van de taalgrens.',
      ],
      faq: [
        { question: 'Zijn er verplaatsingskosten voor een huwelijk in Leuven of Halle?', answer: 'Nee: heel Vlaams-Brabant ligt op minder dan 60 km van Wemmel, in de inbegrepen zone.' },
        { question: 'Maakt u de foto’s van een communie of lentefeest?', answer: 'Ja, op de dag zelf (3 uur, ongeveer 150 foto’s, aftermovie als optie) of tijdens een sessie enkele weken vooraf voor de uitnodigingen (lifestyle-pakket, 1 u 30).' },
        { question: 'Werkt u in het Nederlands?', answer: 'Ja, de website, de offerte en de dag zelf zijn in het Nederlands; gemengde families zijn hier de regel, niet de uitzondering.' },
      ],
    },
  },
  'brabant-wallon': {
    fr: {
      intro:
        'Photographe et vidéaste en Brabant wallon : Wavre, Waterloo, La Hulpe, Louvain-la-Neuve, Nivelles, Jodoigne et Genappe sont à moins de 60 km de Bruxelles, donc sans frais de déplacement. C’est la province des châteaux et des fermes de réception — le terrain naturel d’un mariage sur une journée complète, en photo et en vidéo par la même personne. Corporate dans les parcs d’activité de Louvain-la-Neuve et de Nivelles, sport sur les hippodromes et les terrains du Brabant.',
      citiesTitle: 'Dans la province',
      cities: [
        { name: 'Wavre', fact: 'chef-lieu, maison communale au centre, et le domaine de La Hulpe à dix minutes pour les photos de couple.' },
        { name: 'Waterloo et Braine-l’Alleud', fact: 'la Butte du Lion et ses champs pour les séances, de nombreuses salles de réception entre les deux communes.' },
        { name: 'La Hulpe et Rixensart', fact: 'le château de La Hulpe et son parc, le lac de Genval : les décors de mariage les plus demandés de la province.' },
        { name: 'Louvain-la-Neuve et Ottignies', fact: 'le parc scientifique pour les tournages d’entreprise, le lac et les bois pour les séances.' },
        { name: 'Nivelles', fact: 'la collégiale Sainte-Gertrude et les fermes brabançonnes des environs pour les mariages.' },
        { name: 'Jodoigne, Genappe, Villers-la-Ville', fact: 'l’abbaye de Villers-la-Ville, l’un des lieux de mariage les plus photographiés de Belgique.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Château de La Hulpe', 'Ferme de La Hulpe', 'Abbaye de Villers-la-Ville', 'Château de Limelette', 'Ferme de Bousval', 'Château-ferme de Moriensart (Céroux)', 'Domaine du Lac de Genval', 'Ferme de Grambais (Nivelles)', 'Château du Lac (Genval)', 'Butte du Lion (Waterloo)', 'Ferme de Dion-Valmont', 'Collégiale de Nivelles'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement inclus dans toute la province.',
        'Drone : autorisé sur la plupart des domaines privés hors de la zone de l’aéroport de Charleroi, sur accord du lieu ; les plans aériens du château de La Hulpe demandent l’autorisation du domaine.',
        'Mariage : les samedis de mai à septembre partent 10 à 14 mois à l’avance dans les fermes de réception les plus demandées.',
        'Langue : français, avec le néerlandais et l’anglais pour les familles mixtes.',
      ],
      faq: [
        { question: 'Combien coûte un photographe et vidéaste de mariage en Brabant wallon ?', answer: 'Le prix belge, sans frais de déplacement : 1 290 € TTC en photo, 1 590 € en vidéo, 2 690 € pour les deux par la même personne, journée complète.' },
        { question: 'Pouvez-vous couvrir un mariage à l’abbaye de Villers-la-Ville ou au château de La Hulpe ?', answer: 'Oui : ce sont des lieux à règles (horaires, zones, drone) que l’on cale au repérage avec le domaine, comme pour n’importe quel lieu classé.' },
        { question: 'Travaillez-vous avec les entreprises de Louvain-la-Neuve ?', answer: 'Oui : portraits d’équipe, vidéo de présentation ou de recrutement, événement d’entreprise — prix hors TVA, cession des droits incluse.' },
      ],
    },
    nl: {
      intro:
        'Fotograaf en videograaf in Waals-Brabant: Waver, Waterloo, Terhulpen, Louvain-la-Neuve, Nijvel, Geldenaken en Genappe liggen op minder dan 60 km van Brussel, dus zonder verplaatsingskosten. Het is de provincie van de kastelen en feesthoeves — het natuurlijke terrein van een huwelijk over een volledige dag, in foto en video door dezelfde persoon. Zakelijk in de bedrijvenparken van Louvain-la-Neuve en Nijvel, sport op de hippodromen en terreinen van Brabant.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Waver', fact: 'hoofdplaats, gemeentehuis in het centrum, en het domein van Terhulpen op tien minuten voor de koppelfoto’s.' },
        { name: 'Waterloo en Eigenbrakel', fact: 'de Leeuw van Waterloo en de velden errond voor de sessies, talrijke feestzalen tussen beide gemeenten.' },
        { name: 'Terhulpen en Rixensart', fact: 'het kasteel van Terhulpen en zijn park, het meer van Genval: de meest gevraagde huwelijksdecors van de provincie.' },
        { name: 'Louvain-la-Neuve en Ottignies', fact: 'het wetenschapspark voor bedrijfsopnames, het meer en de bossen voor de sessies.' },
        { name: 'Nijvel', fact: 'de collegiale Sint-Gertrudis en de Brabantse hoeves in de omgeving voor huwelijken.' },
        { name: 'Geldenaken, Genappe, Villers-la-Ville', fact: 'de abdij van Villers-la-Ville, een van de meest gefotografeerde huwelijkslocaties van België.' },
      ],
      venuesTitle: 'Feest- en opnamelocaties',
      venues: ['Kasteel van Terhulpen', 'Ferme de La Hulpe', 'Abdij van Villers-la-Ville', 'Kasteel van Limelette', 'Ferme de Bousval', 'Château-ferme de Moriensart (Céroux)', 'Domaine du Lac de Genval', 'Ferme de Grambais (Nijvel)', 'Château du Lac (Genval)', 'Leeuw van Waterloo', 'Ferme de Dion-Valmont', 'Collegiale van Nijvel'],
      practicalTitle: 'Praktisch',
      practical: [
        'Verplaatsing inbegrepen in de hele provincie.',
        'Drone: toegelaten op de meeste privédomeinen buiten de zone van de luchthaven van Charleroi, met akkoord van de locatie; luchtbeelden van het kasteel van Terhulpen vereisen de toelating van het domein.',
        'Huwelijk: de zaterdagen van mei tot september zijn 10 tot 14 maanden vooraf geboekt in de meest gevraagde feesthoeves.',
        'Taal: Frans, met Nederlands en Engels voor gemengde families.',
      ],
      faq: [
        { question: 'Hoeveel kost een trouwfotograaf en -videograaf in Waals-Brabant?', answer: 'De Belgische prijs, zonder verplaatsingskosten: € 1 290 incl. btw in foto, € 1 590 in video, € 2 690 voor beide door dezelfde persoon, volledige dag.' },
        { question: 'Kunt u een huwelijk in de abdij van Villers-la-Ville of het kasteel van Terhulpen dekken?', answer: 'Ja: het zijn locaties met regels (uren, zones, drone) die we bij de verkenning met het domein afstemmen, zoals voor elke beschermde locatie.' },
        { question: 'Werkt u met bedrijven in Louvain-la-Neuve?', answer: 'Ja: teamportretten, bedrijfs- of rekruteringsvideo, bedrijfsevenement — prijzen excl. btw, overdracht van rechten inbegrepen.' },
      ],
    },
  },
  luxembourg: {
    fr: {
      intro:
        'Photographe et vidéaste au Luxembourg, depuis Bruxelles : Luxembourg-Ville, le Kirchberg, Esch-sur-Alzette, Mondorf, Vianden et le Mullerthal, à deux heures de route, avec un forfait de déplacement fixe de 190 € — pas de supplément caché. Les prix sont ceux de la grille belge, 15 à 30 % sous le marché luxembourgeois pour une prestation équivalente. Mariages à Vianden ou dans les domaines de la Moselle, événements d’entreprise et portraits d’équipe au Kirchberg, en français, en anglais et en néerlandais.',
      citiesTitle: 'Dans le pays',
      cities: [
        { name: 'Luxembourg-Ville', fact: 'mariages civils à l’hôtel de ville de la place Guillaume II, photos sur la Corniche et au pont Adolphe, à cinq minutes à pied.' },
        { name: 'Kirchberg', fact: 'le quartier des banques, des fonds et des institutions européennes : portraits LinkedIn, conférences, vidéos de recrutement.' },
        { name: 'Esch-sur-Alzette et Belval', fact: 'les hauts-fourneaux de Belval pour les clips et les tournages corporate, les salles de la ville pour les fêtes.' },
        { name: 'Vianden et le Mullerthal', fact: 'le château de Vianden et les rochers du Mullerthal pour les mariages et les séances couple.' },
        { name: 'Mondorf-les-Bains et la Moselle', fact: 'les domaines viticoles de Remich à Grevenmacher pour les réceptions.' },
        { name: 'Clervaux et les Ardennes luxembourgeoises', fact: 'le château de Clervaux, les forêts et les vallées pour les mariages de destination.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Château de Vianden', 'Château de Clervaux', 'Hôtel de ville de Luxembourg', 'Abbaye de Neumünster', 'Château de Septfontaines', 'Domaine thermal de Mondorf', 'Château de Bourglinster', 'Rockhal et Belval (Esch)', 'Philharmonie et Mudam (Kirchberg)', 'Château d’Urspelt', 'Domaines viticoles de la Moselle', 'Corniche et pont Adolphe'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 190 € (zone 3) pour tout le pays, plus une nuit d’hôtel (150 €) pour un mariage, la soirée finissant tard.',
        'TVA : 17 % au Luxembourg contre 21 % en Belgique ; pour une entreprise luxembourgeoise assujettie, la facture est établie en autoliquidation, sans TVA belge.',
        'Drone : réglementation luxembourgeoise, autorisation du lieu et déclaration préalable ; possible hors de la zone de l’aéroport de Findel.',
        'Langues : français, anglais et néerlandais ; le luxembourgeois et l’allemand ne sont pas parlés — les cérémonies en luxembourgeois sont filmées sans difficulté, les interviews corporate se font en français ou en anglais.',
      ],
      faq: [
        { question: 'Combien coûte un photographe et vidéaste de mariage au Luxembourg ?', answer: 'Le prix belge plus 190 € de déplacement et une nuit d’hôtel : 1 290 € en photo, 1 590 € en vidéo, 2 690 € pour les deux par la même personne, journée complète — soit nettement sous les 1 750 à 3 200 € relevés sur le marché luxembourgeois pour la photo seule.' },
        { question: 'Venez-vous pour une demi-journée de portraits d’équipe au Kirchberg ?', answer: 'Oui : 490 € HTVA pour les portraits plus 190 € de déplacement, facture en autoliquidation pour une société luxembourgeoise assujettie.' },
        { question: 'Un mariage à Vianden ou dans la Moselle, c’est possible ?', answer: 'Oui, c’est exactement le type de mariage que le forfait zone 3 couvre : repérage sur plans et photos, arrivée la veille, nuit sur place incluse dans le devis.' },
      ],
    },
    nl: {
      intro:
        'Fotograaf en videograaf in Luxemburg, vanuit Brussel: Luxemburg-Stad, Kirchberg, Esch-sur-Alzette, Mondorf, Vianden en het Mullerthal, op twee uur rijden, met een vast verplaatsingstarief van € 190 — geen verborgen toeslag. De prijzen zijn die van de Belgische grille, 15 tot 30 % onder de Luxemburgse markt voor een gelijkwaardige dienst. Huwelijken in Vianden of in de wijndomeinen van de Moezel, bedrijfsevenementen en teamportretten in Kirchberg, in het Nederlands, Frans en Engels.',
      citiesTitle: 'In het land',
      cities: [
        { name: 'Luxemburg-Stad', fact: 'burgerlijke huwelijken in het stadhuis op de Place Guillaume II, foto’s op de Corniche en de Adolfbrug, op vijf minuten wandelen.' },
        { name: 'Kirchberg', fact: 'de wijk van de banken, fondsen en Europese instellingen: LinkedIn-portretten, conferenties, rekruteringsvideo’s.' },
        { name: 'Esch-sur-Alzette en Belval', fact: 'de hoogovens van Belval voor clips en bedrijfsopnames, de zalen van de stad voor feesten.' },
        { name: 'Vianden en het Mullerthal', fact: 'het kasteel van Vianden en de rotsen van het Mullerthal voor huwelijken en koppelshoots.' },
        { name: 'Mondorf-les-Bains en de Moezel', fact: 'de wijndomeinen van Remich tot Grevenmacher voor recepties.' },
        { name: 'Clervaux en de Luxemburgse Ardennen', fact: 'het kasteel van Clervaux, de bossen en valleien voor bestemmingshuwelijken.' },
      ],
      venuesTitle: 'Feest- en opnamelocaties',
      venues: ['Kasteel van Vianden', 'Kasteel van Clervaux', 'Stadhuis van Luxemburg', 'Abdij Neumünster', 'Kasteel van Septfontaines', 'Domaine thermal de Mondorf', 'Kasteel van Bourglinster', 'Rockhal en Belval (Esch)', 'Philharmonie en Mudam (Kirchberg)', 'Kasteel van Urspelt', 'Wijndomeinen van de Moezel', 'Corniche en Adolfbrug'],
      practicalTitle: 'Praktisch',
      practical: [
        'Verplaatsing: vast tarief van € 190 (zone 3) voor het hele land, plus een hotelovernachting (€ 150) voor een huwelijk, omdat het feest laat eindigt.',
        'Btw: 17 % in Luxemburg tegenover 21 % in België; voor een btw-plichtig Luxemburgs bedrijf wordt de factuur met verlegde btw opgemaakt, zonder Belgische btw.',
        'Drone: Luxemburgse regelgeving, toelating van de locatie en voorafgaande aangifte; mogelijk buiten de zone van de luchthaven Findel.',
        'Talen: Nederlands, Frans en Engels; Luxemburgs en Duits worden niet gesproken — ceremonies in het Luxemburgs worden zonder probleem gefilmd, zakelijke interviews gebeuren in het Frans of Engels.',
      ],
      faq: [
        { question: 'Hoeveel kost een trouwfotograaf en -videograaf in Luxemburg?', answer: 'De Belgische prijs plus € 190 verplaatsing en een hotelovernachting: € 1 290 in foto, € 1 590 in video, € 2 690 voor beide door dezelfde persoon, volledige dag — ruim onder de € 1 750 tot 3 200 die op de Luxemburgse markt voor foto alleen gevraagd worden.' },
        { question: 'Komt u voor een halve dag teamportretten in Kirchberg?', answer: 'Ja: € 490 excl. btw voor de portretten plus € 190 verplaatsing, factuur met verlegde btw voor een btw-plichtig Luxemburgs bedrijf.' },
        { question: 'Een huwelijk in Vianden of aan de Moezel, kan dat?', answer: 'Ja, dat is precies het soort huwelijk dat het tarief van zone 3 dekt: verkenning op plannen en foto’s, aankomst de dag ervoor, overnachting ter plaatse in de offerte.' },
      ],
    },
    en: {
      intro:
        'Photographer and videographer in Luxembourg, from Brussels: Luxembourg City, Kirchberg, Esch-sur-Alzette, Mondorf, Vianden and the Mullerthal, two hours away by road, with a flat travel fee of €190 — no hidden extra. Prices are those of the Belgian grid, 15 to 30% below the Luxembourg market for an equivalent service. Weddings in Vianden or at the Moselle wine estates, corporate events and team headshots in Kirchberg, in English, French and Dutch — the languages of Luxembourg’s international workforce.',
      citiesTitle: 'Across the country',
      cities: [
        { name: 'Luxembourg City', fact: 'civil weddings at the town hall on Place Guillaume II, photos on the Corniche and the Adolphe Bridge, five minutes’ walk away.' },
        { name: 'Kirchberg', fact: 'the district of banks, funds and European institutions: LinkedIn headshots, conferences, recruitment videos.' },
        { name: 'Esch-sur-Alzette and Belval', fact: 'the Belval blast furnaces for music videos and corporate shoots, the city’s halls for parties.' },
        { name: 'Vianden and the Mullerthal', fact: 'Vianden Castle and the Mullerthal rocks for weddings and couple sessions.' },
        { name: 'Mondorf-les-Bains and the Moselle', fact: 'the wine estates from Remich to Grevenmacher for receptions.' },
        { name: 'Clervaux and the Luxembourg Ardennes', fact: 'Clervaux Castle, the forests and valleys for destination weddings.' },
      ],
      venuesTitle: 'Reception and shooting venues',
      venues: ['Vianden Castle', 'Clervaux Castle', 'Luxembourg City Hall', 'Neumünster Abbey', 'Septfontaines Castle', 'Domaine thermal de Mondorf', 'Bourglinster Castle', 'Rockhal and Belval (Esch)', 'Philharmonie and Mudam (Kirchberg)', 'Château d’Urspelt', 'Moselle wine estates', 'Corniche and Adolphe Bridge'],
      practicalTitle: 'Practical',
      practical: [
        'Travel: flat fee of €190 (zone 3) for the whole country, plus a hotel night (€150) for a wedding, since the party ends late.',
        'VAT: 17% in Luxembourg against 21% in Belgium; for a VAT-registered Luxembourg company, the invoice is issued under the reverse-charge mechanism, with no Belgian VAT.',
        'Drone: Luxembourg rules, venue permission and prior declaration; possible outside the Findel airport zone.',
        'Languages: English, French and Dutch; Luxembourgish and German are not spoken — ceremonies in Luxembourgish are filmed without any issue, corporate interviews are done in English or French.',
      ],
      faq: [
        { question: 'How much does a wedding photographer and videographer cost in Luxembourg?', answer: 'The Belgian price plus €190 of travel and a hotel night: €1,290 for photo, €1,590 for video, €2,690 for both by the same person, full day — well below the €1,750 to €3,200 seen on the Luxembourg market for photography alone.' },
        { question: 'Do you come for a half day of team headshots in Kirchberg?', answer: 'Yes: €490 excl. VAT for the headshots plus €190 of travel, reverse-charge invoice for a VAT-registered Luxembourg company.' },
        { question: 'Is a wedding in Vianden or on the Moselle possible?', answer: 'Yes, that is exactly the kind of wedding the zone 3 fee covers: scouting from plans and photos, arrival the day before, overnight stay included in the quote.' },
        { question: 'Do you work with expat couples getting married in Luxembourg?', answer: 'Yes, in English throughout — quote, planning and the day itself. Civil ceremonies at the town hall are often bilingual; the film keeps the words in whichever language they are said.' },
      ],
    },
  },
  'lille-nord': {
    fr: {
      intro:
        'Photographe et vidéaste à Lille et dans le Nord, depuis Bruxelles : Lille, Roubaix, Tourcoing, Villeneuve-d’Ascq, Valenciennes, Douai, Dunkerque, à une heure de route, avec un forfait de déplacement fixe de 90 € — pas de 0,60 € du kilomètre, pas de « nous consulter ». Les prix sont ceux de la grille belge, sous la médiane du marché lillois. Mariages dans les châteaux et fermes de la métropole et des Flandres, portraits d’équipe et vidéos d’entreprise à Euratechnologies, séances dans le Vieux-Lille.',
      citiesTitle: 'Dans la métropole et le département',
      cities: [
        { name: 'Lille', fact: 'mairies de quartier et hôtel de ville pour le civil, le Vieux-Lille, la Grand-Place et la Citadelle pour les photos de couple.' },
        { name: 'Roubaix et Tourcoing', fact: 'la Piscine de Roubaix et les anciennes filatures pour les séances et les clips, les mairies de style flamand pour le civil.' },
        { name: 'Villeneuve-d’Ascq et Euratechnologies', fact: 'les sièges, start-ups et centres de recherche pour les portraits LinkedIn et les films de recrutement.' },
        { name: 'Valenciennes et Douai', fact: 'les domaines de réception du Hainaut français, à moins de 100 km de Bruxelles.' },
        { name: 'Dunkerque et la côte', fact: 'les plages de Malo-les-Bains et les dunes pour les séances et les mariages en bord de mer.' },
        { name: 'Armentières, Bailleul, les Flandres', fact: 'fermes flamandes et monts des Flandres pour les mariages champêtres.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Château du Biez (Pecq)', 'Les Templiers de Wavrin', 'Château de la Rocq (Arquennes)', 'Domaine des Cèdres (Lambersart)', 'Château de Bourgogne (Estaimbourg)', 'Ferme du Mont Noir', 'Château de Beaulieu (Busnes)', 'Domaine de la Chartreuse (Gosnay)', 'La Piscine (Roubaix)', 'Vieux-Lille et Grand-Place', 'Citadelle de Lille', 'Euratechnologies'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 90 € (zone 2) pour Lille et la métropole, Valenciennes, Douai, Arras ; 190 € (zone 3) pour la Côte d’Opale, Amiens et Reims.',
        'Mariage : nuit d’hôtel (150 €) ajoutée quand la soirée finit tard loin de Bruxelles ; en métropole lilloise, le retour le soir même est possible.',
        'Musique : les films sont montés sur de la musique sous licence, publiable sur les réseaux sans problème de SACEM.',
        'TVA : prix TTC avec TVA belge pour les particuliers ; pour une entreprise française assujettie, facture en autoliquidation.',
      ],
      faq: [
        { question: 'Combien coûte un photographe et vidéaste de mariage à Lille ?', answer: 'Le prix belge plus 90 € de déplacement : 1 290 € en photo, 1 590 € en vidéo, 2 690 € pour les deux par la même personne, journée complète — sous la médiane de 1 800 à 2 200 € relevée pour la photo seule en France.' },
        { question: 'Un photographe belge peut-il travailler en France sans formalité ?', answer: 'Oui : prestation de service intracommunautaire, facture belge avec TVA pour un particulier, autoliquidation pour une entreprise. Rien à faire de votre côté.' },
        { question: 'Venez-vous aussi sur la Côte d’Opale, à Arras ou à Amiens ?', answer: 'Oui, avec le forfait de la zone : 90 € pour Arras, 190 € pour Le Touquet, Boulogne, Amiens ou Reims. Paris et l’Île-de-France sont en zone 4, à 290 €.' },
      ],
    },
    en: {
      intro:
        'Photographer and videographer in Lille and northern France, from Brussels: Lille, Roubaix, Tourcoing, Villeneuve-d’Ascq, Valenciennes, Douai and Dunkirk, one hour away by road, with a flat travel fee of €90. Prices are those of the Belgian grid, below the median of the Lille market. Weddings in the châteaux and farms of the metropolitan area and Flanders, team headshots and corporate films at Euratechnologies, sessions in Vieux-Lille — in English for international couples and companies.',
      citiesTitle: 'Across the metropolitan area and the département',
      cities: [
        { name: 'Lille', fact: 'district town halls and the city hall for civil ceremonies, Vieux-Lille, the Grand-Place and the Citadel for couple photos.' },
        { name: 'Roubaix and Tourcoing', fact: 'La Piscine museum and the former mills for sessions and music videos, Flemish-style town halls for civil weddings.' },
        { name: 'Villeneuve-d’Ascq and Euratechnologies', fact: 'headquarters, start-ups and research centres for LinkedIn headshots and recruitment films.' },
        { name: 'Valenciennes and Douai', fact: 'the reception estates of French Hainaut, less than 100 km from Brussels.' },
        { name: 'Dunkirk and the coast', fact: 'the beaches of Malo-les-Bains and the dunes for sessions and seaside weddings.' },
        { name: 'Armentières, Bailleul, French Flanders', fact: 'Flemish farms and the Flanders hills for country weddings.' },
      ],
      venuesTitle: 'Reception and shooting venues',
      venues: ['Château du Biez (Pecq)', 'Les Templiers de Wavrin', 'Château de la Rocq (Arquennes)', 'Domaine des Cèdres (Lambersart)', 'Château de Bourgogne (Estaimbourg)', 'Ferme du Mont Noir', 'Château de Beaulieu (Busnes)', 'Domaine de la Chartreuse (Gosnay)', 'La Piscine (Roubaix)', 'Vieux-Lille and Grand-Place', 'Lille Citadel', 'Euratechnologies'],
      practicalTitle: 'Practical',
      practical: [
        'Travel: flat fee of €90 (zone 2) for Lille and its metropolitan area, Valenciennes, Douai, Arras; €190 (zone 3) for the Opal Coast, Amiens and Reims.',
        'Wedding: a hotel night (€150) is added when the party ends late far from Brussels; around Lille, driving back the same night is possible.',
        'Music: films are edited on licensed music, shareable on social media without any rights issue.',
        'VAT: prices incl. Belgian VAT for private clients; for a VAT-registered French company, reverse-charge invoicing.',
      ],
      faq: [
        { question: 'How much does a wedding photographer and videographer cost in Lille?', answer: 'The Belgian price plus €90 of travel: €1,290 for photo, €1,590 for video, €2,690 for both by the same person, full day — below the €1,800 to €2,200 median seen for photography alone in France.' },
        { question: 'Can a Belgian photographer work in France without formalities?', answer: 'Yes: intra-EU service, Belgian invoice with VAT for a private client, reverse charge for a company. Nothing to do on your side.' },
        { question: 'Do you also cover the Opal Coast, Arras or Amiens?', answer: 'Yes, with the zone fee: €90 for Arras, €190 for Le Touquet, Boulogne, Amiens or Reims. Paris and the Île-de-France are in zone 4, at €290.' },
      ],
    },
  },
};

/** Texte des pages pays (`/zones/belgique`…), dans les trois langues. */
export const COUNTRY_CONTENT: Readonly<Record<CountryCode, Readonly<Record<SiteLocale, CountryContent>>>> = {
  BE: {
    fr: {
      intro: 'Photographe et vidéaste en Belgique, basé à Wemmel aux portes de Bruxelles. Les deux Brabants, Bruxelles, Anvers, Gand et Alost sont à moins de 60 km : déplacement inclus. Liège, Namur, Mons, Bruges, le Limbourg et les Ardennes sont en zone 2, à 90 €. Mariages, communions, entreprises, clubs, artistes et familles, en français, en néerlandais et en anglais.',
      practical: ['Déplacement inclus jusqu’à 60 km de Bruxelles, 90 € au-delà jusqu’à 150 km.', 'Prix TTC (TVA 21 %) pour les particuliers, HTVA pour les entreprises.', 'Devis chiffré sous 48 h, acompte de 30 % à la réservation.'],
    },
    nl: {
      intro: 'Fotograaf en videograaf in België, gevestigd in Wemmel aan de rand van Brussel. De twee Brabanten, Brussel, Antwerpen, Gent en Aalst liggen op minder dan 60 km: verplaatsing inbegrepen. Luik, Namen, Bergen, Brugge, Limburg en de Ardennen zitten in zone 2, aan € 90. Huwelijken, communies, bedrijven, clubs, artiesten en gezinnen, in het Nederlands, Frans en Engels.',
      practical: ['Verplaatsing inbegrepen tot 60 km van Brussel, € 90 daarbuiten tot 150 km.', 'Prijzen incl. btw (21 %) voor particulieren, excl. btw voor bedrijven.', 'Concrete offerte binnen 48 u, voorschot van 30 % bij reservatie.'],
    },
    en: {
      intro: 'Photographer and videographer in Belgium, based in Wemmel on the edge of Brussels. Both Brabants, Brussels, Antwerp, Ghent and Aalst are within 60 km: travel included. Liège, Namur, Mons, Bruges, Limburg and the Ardennes are in zone 2, at €90. Weddings, communions, companies, clubs, artists and families, in English, French and Dutch.',
      practical: ['Travel included up to 60 km from Brussels, €90 beyond up to 150 km.', 'Prices incl. VAT (21%) for private clients, excl. VAT for businesses.', 'Itemised quote within 48 h, 30% deposit on booking.'],
    },
  },
  FR: {
    fr: {
      intro: 'Photographe et vidéaste belge dans le nord de la France, de Lille à Paris : la métropole lilloise, Valenciennes et Arras en zone 2 (90 €), la Côte d’Opale, Amiens, Chantilly et Reims en zone 3 (190 €), Paris et l’Île-de-France en zone 4 (290 €). Même grille de prix qu’en Belgique, musique sous licence, facture intracommunautaire sans formalité pour vous.',
      practical: ['Forfait de déplacement fixe par zone : 90 €, 190 € ou 290 €.', 'Nuit d’hôtel (150 €) pour un mariage en zone 3 ou 4.', 'Facture belge avec TVA pour un particulier, autoliquidation pour une entreprise française assujettie.'],
    },
    nl: {
      intro: 'Belgische fotograaf en videograaf in Noord-Frankrijk, van Rijsel tot Parijs: de metropool Rijsel, Valenciennes en Arras in zone 2 (€ 90), de Opaalkust, Amiens, Chantilly en Reims in zone 3 (€ 190), Parijs en Île-de-France in zone 4 (€ 290). Dezelfde prijzen als in België, muziek in licentie, intracommunautaire factuur zonder formaliteiten voor u.',
      practical: ['Vast verplaatsingstarief per zone: € 90, € 190 of € 290.', 'Hotelovernachting (€ 150) voor een huwelijk in zone 3 of 4.', 'Belgische factuur met btw voor een particulier, verlegde btw voor een btw-plichtig Frans bedrijf.'],
    },
    en: {
      intro: 'Belgian photographer and videographer in northern France, from Lille to Paris: the Lille metropolitan area, Valenciennes and Arras in zone 2 (€90), the Opal Coast, Amiens, Chantilly and Reims in zone 3 (€190), Paris and the Île-de-France in zone 4 (€290). Same price grid as in Belgium, licensed music, intra-EU invoice with no formalities on your side.',
      practical: ['Flat travel fee per zone: €90, €190 or €290.', 'Hotel night (€150) for a wedding in zone 3 or 4.', 'Belgian invoice with VAT for a private client, reverse charge for a VAT-registered French company.'],
    },
  },
  LU: {
    fr: {
      intro: 'Photographe et vidéaste au Luxembourg depuis Bruxelles : tout le Grand-Duché en zone 3, avec un forfait de déplacement fixe de 190 €. La grille belge, 15 à 30 % sous le marché luxembourgeois ; TVA en autoliquidation pour les entreprises assujetties ; français, anglais et néerlandais.',
      practical: ['Forfait de déplacement de 190 € pour tout le pays.', 'Nuit d’hôtel (150 €) pour un mariage.', 'Autoliquidation de TVA pour une société luxembourgeoise assujettie.'],
    },
    nl: {
      intro: 'Fotograaf en videograaf in Luxemburg vanuit Brussel: het hele Groothertogdom in zone 3, met een vast verplaatsingstarief van € 190. De Belgische grille, 15 tot 30 % onder de Luxemburgse markt; verlegde btw voor btw-plichtige bedrijven; Nederlands, Frans en Engels.',
      practical: ['Verplaatsingstarief van € 190 voor het hele land.', 'Hotelovernachting (€ 150) voor een huwelijk.', 'Verlegde btw voor een btw-plichtig Luxemburgs bedrijf.'],
    },
    en: {
      intro: 'Photographer and videographer in Luxembourg from Brussels: the whole Grand Duchy in zone 3, with a flat travel fee of €190. The Belgian grid, 15 to 30% below the Luxembourg market; reverse-charge VAT for registered companies; English, French and Dutch.',
      practical: ['Travel fee of €190 for the whole country.', 'Hotel night (€150) for a wedding.', 'Reverse-charge VAT for a VAT-registered Luxembourg company.'],
    },
  },
  NL: {
    fr: {
      intro: 'Photographe et vidéaste aux Pays-Bas depuis Bruxelles : Maastricht, Eindhoven, Breda et la Zélande en zone 2 (90 €), Rotterdam, La Haye, Utrecht et Amsterdam en zone 3 (190 €). Prix belges, bien sous les 3 100 à 4 700 € demandés aux Pays-Bas pour un duo photo + vidéo ; néerlandais et anglais parlés.',
      practical: ['Forfait de déplacement : 90 € pour le sud, 190 € pour le Randstad.', 'Nuit d’hôtel (150 €) pour un mariage en zone 3.', 'Autoliquidation de TVA pour une entreprise néerlandaise assujettie.'],
    },
    nl: {
      intro: 'Fotograaf en videograaf in Nederland vanuit Brussel: Maastricht, Eindhoven, Breda en Zeeland in zone 2 (€ 90), Rotterdam, Den Haag, Utrecht en Amsterdam in zone 3 (€ 190). Belgische prijzen, ruim onder de € 3 100 tot 4 700 die in Nederland gevraagd worden voor een duo foto + video; Nederlands en Engels.',
      practical: ['Verplaatsingstarief: € 90 voor het zuiden, € 190 voor de Randstad.', 'Hotelovernachting (€ 150) voor een bruiloft in zone 3.', 'Verlegde btw voor een btw-plichtig Nederlands bedrijf.'],
    },
    en: {
      intro: 'Photographer and videographer in the Netherlands from Brussels: Maastricht, Eindhoven, Breda and Zeeland in zone 2 (€90), Rotterdam, The Hague, Utrecht and Amsterdam in zone 3 (€190). Belgian prices, well below the €3,100 to €4,700 asked in the Netherlands for a photo + video duo; English and Dutch spoken.',
      practical: ['Travel fee: €90 for the south, €190 for the Randstad.', 'Hotel night (€150) for a wedding in zone 3.', 'Reverse-charge VAT for a VAT-registered Dutch company.'],
    },
  },
  INT: {
    fr: {
      intro: 'Mariages et tournages à l’étranger, sur devis : plus de 100 projets réalisés en Belgique, en France, aux Pays-Bas, au Luxembourg et jusqu’en Grèce. La logistique (vols, matériel, autorisations, hébergement) est chiffrée d’avance, la grille des prestations reste la même.',
      practical: ['Devis sous 48 h, logistique incluse.', 'Repérage sur plans et photos, arrivée la veille.', 'Musique sous licence, livraison en ligne où que vous soyez.'],
    },
    nl: {
      intro: 'Huwelijken en opnames in het buitenland, op offerte: meer dan 100 projecten in België, Frankrijk, Nederland, Luxemburg en tot in Griekenland. De logistiek (vluchten, materiaal, toelatingen, verblijf) wordt vooraf geprijsd, de grille van de diensten blijft dezelfde.',
      practical: ['Offerte binnen 48 u, logistiek inbegrepen.', 'Verkenning op plannen en foto’s, aankomst de dag ervoor.', 'Muziek in licentie, levering online waar u ook bent.'],
    },
    en: {
      intro: 'Destination weddings and shoots abroad, on quote: more than 100 projects across Belgium, France, the Netherlands, Luxembourg and as far as Greece. Logistics (flights, equipment, permits, accommodation) are priced upfront, the service grid stays the same.',
      practical: ['Quote within 48 h, logistics included.', 'Scouting from plans and photos, arrival the day before.', 'Licensed music, online delivery wherever you are.'],
    },
  },
};

/** Régions qui ont un contenu dans la langue donnée : les seules à avoir une page. */
export function regionsWithContent(locale: SiteLocale): string[] {
  return Object.entries(REGION_CONTENT)
    .filter(([, byLocale]) => byLocale[locale])
    .map(([id]) => id);
}
