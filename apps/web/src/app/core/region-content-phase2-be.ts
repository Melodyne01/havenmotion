import type { SiteLocale } from './locale';
import type { RegionContent } from './region-content';

/**
 * Phase 2 du chantier 5, Belgique : Anvers, Flandre orientale, Flandre
 * occidentale, Limbourg, Hainaut, Namur, Liège, Ardennes. Même règle qu'en
 * phase 1 : une page n'existe que dans les langues où elle a un vrai texte,
 * les villes ont chacune un fait propre, les lieux sont ceux de la région et
 * aucun n'est présenté comme déjà tourné tant que le projet n'est pas publié.
 * En Flandre, les deux vocabulaires (« trouwfotograaf » et
 * « huwelijksfotograaf ») sont employés, car les recherches se partagent.
 */
export const REGION_CONTENT_PHASE_2_BE: Readonly<Record<string, Partial<Record<SiteLocale, RegionContent>>>> = {
  anvers: {
    fr: {
      intro:
        'Photographe et vidéaste à Anvers et dans sa province, à quarante minutes de Bruxelles par l’E19 : Anvers, Malines, Lierre, Turnhout, Brasschaat et la Campine sont en zone incluse, sans frais de déplacement. Mariages à l’hôtel de ville de la Grand-Place ou dans les châteaux de la périphérie sud, portraits d’équipe dans le quartier du port et à Berchem, clips sur les quais de l’Escaut, matchs au Bosuil ou au Sportpaleis : la même personne pour la photo et la vidéo, en néerlandais, en français ou en anglais, avec une grille de prix affichée.',
      citiesTitle: 'Dans la province',
      cities: [
        { name: 'Anvers', fact: 'l’hôtel de ville rénové de la Grand-Place pour le civil ; la cathédrale, le Steen, le MAS et le Havenhuis pour les photos de couple ; Sint-Anneke sur la rive gauche pour une séance face au skyline.' },
        { name: 'Malines', fact: 'à vingt minutes de Wemmel, l’hôtel de ville sur la Grote Markt, les Salons Van Dijck et le béguinage pour les mariages ; le site Lamot pour les événements d’entreprise.' },
        { name: 'Lierre', fact: 'le béguinage classé et la Zimmertoren, une petite ville à l’échelle d’une séance couple ou d’un reportage de mariage à pied.' },
        { name: 'Brasschaat, Schoten, Kapellen', fact: 'le parc et le château de Brasschaat, les villas du nord d’Anvers : mariages de jardin et fêtes de famille.' },
        { name: 'Turnhout et la Campine', fact: 'le béguinage, le château des ducs de Brabant, l’abbaye de Tongerlo et les fermes de la Campine pour les mariages champêtres.' },
        { name: 'Mortsel, Edegem, Kontich', fact: 'Hof ter Linden et les domaines du sud d’Anvers, à quinze minutes du ring.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Hôtel de ville d’Anvers (Grand-Place)', 'Felix Pakhuis (Eilandje)', 'Kasteel Den Brandt (Anvers)', 'Kasteel van Brasschaat', 'Hof ter Linden (Edegem)', 'Kasteel Cleydael (Aartselaar)', 'Salons Van Dijck (Malines)', 'Kasteel de Merode (Westerlo)', 'Hof van Reyen (Boechout)', 'Koningin Elisabethzaal et Zoo d’Anvers', 'Parc Middelheim et Rivierenhof', 'Sportpaleis et Bosuilstadion'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement inclus (zone 1) pour Anvers, Malines, Lierre, Brasschaat, Boom ; Turnhout, Mol et Geel sont au bord de la zone, vérifiés sur devis.',
        'Drone : le port et l’aéroport de Deurne imposent une zone d’exclusion sur une bonne partie de la ville ; les plans aériens se font en Campine ou dans les domaines du sud.',
        'Mariage civil : l’hôtel de ville d’Anvers autorise un photographe dans la salle des mariages ; la sortie sur la Grand-Place se fait en cinq minutes, avant la foule des terrasses.',
        'Langues : reportage mené en néerlandais, livraison et contrat en français ou en anglais si la famille est mixte.',
      ],
      faq: [
        { question: 'Venez-vous à Anvers sans frais de déplacement ?', answer: 'Oui : Anvers et sa première couronne sont à moins de 60 km de Wemmel, donc en zone incluse. Même chose pour Malines, Lierre et Boom.' },
        { question: 'Combien coûte un photographe-vidéaste de mariage à Anvers ?', answer: '1 290 € en photo, 1 590 € en vidéo, 2 690 € pour les deux par la même personne, journée complète, TVA comprise, sans déplacement. La grille complète est sur la page tarifs.' },
        { question: 'Parlez-vous néerlandais pendant le reportage ?', answer: 'Oui, le reportage se mène dans la langue des invités. Le contrat, le devis et la livraison peuvent être en français, en néerlandais ou en anglais.' },
        { question: 'Faites-vous des portraits d’équipe dans le quartier du port ou à Berchem ?', answer: 'Oui : une demi-journée sur place, 490 € HTVA en photo, 1 390 € HTVA avec un film d’entreprise, formats LinkedIn et réseaux inclus.' },
      ],
    },
    nl: {
      intro:
        'Trouwfotograaf en videograaf in Antwerpen en de provincie, op veertig minuten van Brussel via de E19: Antwerpen, Mechelen, Lier, Turnhout, Brasschaat en de Kempen liggen in de inbegrepen zone, zonder verplaatsingskosten. Huwelijken op het stadhuis aan de Grote Markt of in de kastelen ten zuiden van de stad, teamportretten op het Eilandje en in Berchem, clips op de Scheldekaaien, wedstrijden op de Bosuil of in het Sportpaleis: één persoon voor foto en video, in het Nederlands, Frans of Engels, met prijzen online.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Antwerpen', fact: 'het gerestaureerde stadhuis op de Grote Markt voor het burgerlijk huwelijk; de kathedraal, het Steen, het MAS en het Havenhuis voor de koppelfoto’s; Sint-Anneke op Linkeroever voor een shoot met de skyline.' },
        { name: 'Mechelen', fact: 'op twintig minuten van Wemmel: het stadhuis op de Grote Markt, de Salons Van Dijck en het Groot Begijnhof voor huwelijken; de Lamot-site voor bedrijfsevents.' },
        { name: 'Lier', fact: 'het beschermde begijnhof en de Zimmertoren, een stad op maat van een koppelshoot of een trouwreportage te voet.' },
        { name: 'Brasschaat, Schoten, Kapellen', fact: 'het park en het kasteel van Brasschaat, de villa’s ten noorden van Antwerpen: tuinhuwelijken en familiefeesten.' },
        { name: 'Turnhout en de Kempen', fact: 'het begijnhof, het kasteel van de hertogen van Brabant, de abdij van Tongerlo en de Kempense hoeves voor landelijke huwelijken.' },
        { name: 'Mortsel, Edegem, Kontich', fact: 'Hof ter Linden en de domeinen ten zuiden van Antwerpen, op een kwartier van de ring.' },
      ],
      venuesTitle: 'Feest- en opnamelocaties',
      venues: ['Stadhuis van Antwerpen (Grote Markt)', 'Felix Pakhuis (Eilandje)', 'Kasteel Den Brandt (Antwerpen)', 'Kasteel van Brasschaat', 'Hof ter Linden (Edegem)', 'Kasteel Cleydael (Aartselaar)', 'Salons Van Dijck (Mechelen)', 'Kasteel de Merode (Westerlo)', 'Hof van Reyen (Boechout)', 'Koningin Elisabethzaal en Zoo Antwerpen', 'Middelheimpark en Rivierenhof', 'Sportpaleis en Bosuilstadion'],
      practicalTitle: 'Praktisch',
      practical: [
        'Verplaatsing inbegrepen (zone 1) voor Antwerpen, Mechelen, Lier, Brasschaat, Boom; Turnhout, Mol en Geel liggen op de rand van de zone en worden op de offerte bevestigd.',
        'Drone: de haven en de luchthaven van Deurne leggen een no-flyzone op over een groot deel van de stad; luchtbeelden gebeuren in de Kempen of in de domeinen ten zuiden.',
        'Burgerlijk huwelijk: het stadhuis van Antwerpen laat een fotograaf toe in de trouwzaal; de foto’s op de Grote Markt nemen vijf minuten, vóór de terrassen vollopen.',
        'Talen: de reportage verloopt in het Nederlands, contract en levering in het Frans of Engels als de familie gemengd is.',
      ],
      faq: [
        { question: 'Komt u naar Antwerpen zonder verplaatsingskosten?', answer: 'Ja: Antwerpen en de eerste gordel liggen op minder dan 60 km van Wemmel, dus in de inbegrepen zone. Dat geldt ook voor Mechelen, Lier en Boom.' },
        { question: 'Wat kost een huwelijksfotograaf en videograaf in Antwerpen?', answer: '1.290 € voor foto, 1.590 € voor video, 2.690 € voor beide door dezelfde persoon, volledige dag, btw inbegrepen, zonder verplaatsingskosten. De volledige lijst staat op de tarievenpagina.' },
        { question: 'Wat is het verschil met een trouwfotograaf en een aparte videograaf?', answer: 'Eén stijl, één aanspreekpunt en één prijs die lager ligt dan twee aparte leveranciers. Boven de 120 gasten raden we een tweede operator aan (optie, 490 €).' },
        { question: 'Maakt u teamportretten op het Eilandje of in Berchem?', answer: 'Ja: een halve dag ter plaatse, 490 € excl. btw voor foto, 1.390 € excl. btw met een bedrijfsfilm, LinkedIn- en socialemediaformaten inbegrepen.' },
      ],
    },
    en: {
      intro:
        'Wedding photographer and videographer in Antwerp and its province, forty minutes from Brussels on the E19: Antwerp, Mechelen, Lier, Turnhout, Brasschaat and the Kempen are inside the included zone, with no travel fee. Civil weddings at the town hall on the Grote Markt, receptions in the châteaux south of the city, team headshots on the Eilandje and in Berchem, music videos on the Scheldt quays, matches at the Bosuil or the Sportpaleis — one person for both photo and video, working in English, Dutch or French, with published prices for international couples and companies in the diamond, port and fashion sectors.',
      citiesTitle: 'Across the province',
      cities: [
        { name: 'Antwerp', fact: 'the restored town hall on the Grote Markt for civil ceremonies; the cathedral, the Steen, the MAS and the Port House for couple photos; Sint-Anneke on the left bank for a session facing the skyline.' },
        { name: 'Mechelen', fact: 'twenty minutes from Wemmel: the town hall on the Grote Markt, the Salons Van Dijck and the beguinage for weddings; the Lamot site for corporate events.' },
        { name: 'Lier', fact: 'the listed beguinage and the Zimmer tower, a town scaled for a couple session or a wedding told on foot.' },
        { name: 'Brasschaat, Schoten, Kapellen', fact: 'the park and castle of Brasschaat and the villas north of Antwerp: garden weddings and family celebrations.' },
        { name: 'Turnhout and the Kempen', fact: 'the beguinage, the castle of the Dukes of Brabant, Tongerlo Abbey and the Kempen farms for country weddings.' },
        { name: 'Mortsel, Edegem, Kontich', fact: 'Hof ter Linden and the estates south of Antwerp, fifteen minutes from the ring road.' },
      ],
      venuesTitle: 'Reception and shooting venues',
      venues: ['Antwerp City Hall (Grote Markt)', 'Felix Pakhuis (Eilandje)', 'Kasteel Den Brandt (Antwerp)', 'Kasteel van Brasschaat', 'Hof ter Linden (Edegem)', 'Kasteel Cleydael (Aartselaar)', 'Salons Van Dijck (Mechelen)', 'Kasteel de Merode (Westerlo)', 'Hof van Reyen (Boechout)', 'Queen Elisabeth Hall and Antwerp Zoo', 'Middelheim park and Rivierenhof', 'Sportpaleis and Bosuil stadium'],
      practicalTitle: 'Practical',
      practical: [
        'Travel included (zone 1) for Antwerp, Mechelen, Lier, Brasschaat and Boom; Turnhout, Mol and Geel sit on the edge of the zone and are confirmed on the quote.',
        'Drone: the port and Deurne airport impose a no-fly zone over much of the city; aerial shots are done in the Kempen or in the estates to the south.',
        'Civil wedding: Antwerp City Hall allows a photographer in the ceremony room; the exit photos on the Grote Markt take five minutes, before the terraces fill up.',
        'Languages: the day is run in English or Dutch as the guests require; contract, quote and delivery in English.',
      ],
      faq: [
        { question: 'Do you come to Antwerp without a travel fee?', answer: 'Yes: Antwerp and its first ring are less than 60 km from Wemmel, so inside the included zone. The same applies to Mechelen, Lier and Boom.' },
        { question: 'How much does a wedding photographer and videographer cost in Antwerp?', answer: '€1,290 for photo, €1,590 for video, €2,690 for both by the same person, full day, VAT included, no travel fee. The full grid is on the pricing page.' },
        { question: 'Can you get married in Antwerp as a non-resident?', answer: 'A civil wedding in Belgium normally requires one partner to be registered in the municipality; most international couples hold the legal ceremony at home or at their town hall and celebrate in Antwerp. I cover the celebration the same way, from getting ready to the party.' },
        { question: 'Do you shoot headshots and corporate films in the port or the diamond district?', answer: 'Yes: half a day on site, €490 excl. VAT for photo, €1,390 excl. VAT with a corporate film, LinkedIn and social formats included. Site passes for the port are arranged by your team in advance.' },
      ],
    },
  },

  'flandre-orientale': {
    fr: {
      intro:
        'Photographe et vidéaste à Gand et en Flandre orientale, à quarante-cinq minutes de Bruxelles : Gand, Alost, Saint-Nicolas, Termonde, Audenarde et Deinze sont en zone incluse, sans frais de déplacement. Mariages civils à l’hôtel de ville de Gand ou dans les châteaux de la Lys, photos de couple sur le Graslei à l’aube, portraits d’équipe dans les bureaux du Zuid et de la Zebrastraat, matchs à la Ghelamco Arena : une seule personne pour la photo et la vidéo, en néerlandais ou en français, prix affichés.',
      citiesTitle: 'Dans la province',
      cities: [
        { name: 'Gand', fact: 'l’hôtel de ville pour le civil, le Graslei, le Gravensteen et l’abbaye Saint-Pierre pour les photos de couple ; le quartier du Zuid et la Zebrastraat pour les événements d’entreprise.' },
        { name: 'Alost', fact: 'à vingt-cinq minutes de Wemmel : l’hôtel de ville et le beffroi sur la Grand-Place pour le civil, les salles de la Dendre pour les fêtes.' },
        { name: 'Saint-Nicolas', fact: 'la plus grande Grand-Place de Belgique pour la sortie de mairie, les domaines du pays de Waas pour la réception.' },
        { name: 'Termonde et Lokeren', fact: 'le béguinage et la Grand-Place de Termonde, les fermes de la Durme pour les mariages champêtres.' },
        { name: 'Audenarde et les Ardennes flamandes', fact: 'l’hôtel de ville gothique, les Salons Mantovani, les collines du Tour des Flandres pour les séances en extérieur.' },
        { name: 'Deinze et la Lys', fact: 'le château d’Ooidonk, les rives de la Lys à Sint-Martens-Latem, la lumière des peintres pour les séances couple.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Hôtel de ville de Gand', 'Abbaye Saint-Pierre (Gand)', 'Zebrastraat (Gand)', 'Château de Laarne', 'Château d’Ooidonk (Deinze)', 'Château de Poeke (Aalter)', 'Château de Wissekerke (Kruibeke)', 'Château de Beervelde (Lochristi)', 'Salons Mantovani (Audenarde)', 'Domaine de Puyenbroeck (Wachtebeke)', 'Château Borgwal (Vurste)', 'Ghelamco Arena'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement inclus (zone 1) pour Gand, Alost, Saint-Nicolas, Termonde, Audenarde, Deinze, Wetteren et Zottegem.',
        'Gand : le centre est piéton, le repérage fixe les points de dépose et le parking ; les photos de couple sur le Graslei se font tôt le matin ou à la tombée du jour.',
        'Drone : autorisé dans les domaines et sur les collines des Ardennes flamandes ; interdit au-dessus du centre de Gand sans autorisation.',
        'Langues : reportage en néerlandais, livraison en français ou en néerlandais selon la famille.',
      ],
      faq: [
        { question: 'Venez-vous à Gand sans frais de déplacement ?', answer: 'Oui : Gand est à 55 km de Wemmel, en zone incluse, comme Alost, Saint-Nicolas, Termonde et Audenarde.' },
        { question: 'Combien coûte un photographe-vidéaste de mariage à Gand ?', answer: '1 290 € en photo, 1 590 € en vidéo, 2 690 € pour les deux par la même personne, journée complète, TVA comprise, sans frais de déplacement.' },
        { question: 'Où faire les photos de couple à Gand ?', answer: 'Le Graslei et le Korenlei, le pont Saint-Michel, le Gravensteen, l’abbaye Saint-Pierre et ses jardins, le Patershol. Le lieu se choisit selon l’heure et la foule du jour.' },
      ],
    },
    nl: {
      intro:
        'Trouwfotograaf en videograaf in Gent en Oost-Vlaanderen, op drie kwartier van Brussel: Gent, Aalst, Sint-Niklaas, Dendermonde, Oudenaarde en Deinze liggen in de inbegrepen zone, zonder verplaatsingskosten. Burgerlijk huwelijk op het stadhuis van Gent of in een kasteel aan de Leie, koppelfoto’s op de Graslei bij zonsopgang, teamportretten in de kantoren aan het Zuid en in de Zebrastraat, wedstrijden in de Ghelamco Arena: één persoon voor foto en video, met prijzen online.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Gent', fact: 'het stadhuis voor het burgerlijk huwelijk, de Graslei, het Gravensteen en de Sint-Pietersabdij voor de koppelfoto’s; het Zuid en de Zebrastraat voor bedrijfsevents.' },
        { name: 'Aalst', fact: 'op vijfentwintig minuten van Wemmel: het stadhuis en het belfort op de Grote Markt voor het huwelijk, de zalen langs de Dender voor het feest.' },
        { name: 'Sint-Niklaas', fact: 'de grootste Grote Markt van België voor de foto’s na het stadhuis, de domeinen van het Waasland voor de receptie.' },
        { name: 'Dendermonde en Lokeren', fact: 'het begijnhof en de Grote Markt van Dendermonde, de hoeves langs de Durme voor landelijke huwelijken.' },
        { name: 'Oudenaarde en de Vlaamse Ardennen', fact: 'het gotische stadhuis, de Salons Mantovani, de hellingen van de Ronde voor buitenshoots.' },
        { name: 'Deinze en de Leiestreek', fact: 'het kasteel van Ooidonk, de Leieoevers in Sint-Martens-Latem, het licht van de Latemse schilders voor koppelshoots.' },
      ],
      venuesTitle: 'Feest- en opnamelocaties',
      venues: ['Stadhuis van Gent', 'Sint-Pietersabdij (Gent)', 'Zebrastraat (Gent)', 'Kasteel van Laarne', 'Kasteel van Ooidonk (Deinze)', 'Kasteel van Poeke (Aalter)', 'Kasteel Wissekerke (Kruibeke)', 'Kasteel van Beervelde (Lochristi)', 'Salons Mantovani (Oudenaarde)', 'Domein Puyenbroeck (Wachtebeke)', 'Kasteel Borgwal (Vurste)', 'Ghelamco Arena'],
      practicalTitle: 'Praktisch',
      practical: [
        'Verplaatsing inbegrepen (zone 1) voor Gent, Aalst, Sint-Niklaas, Dendermonde, Oudenaarde, Deinze, Wetteren en Zottegem.',
        'Gent: het centrum is autovrij, bij de verkenning leggen we de afzetpunten en de parking vast; koppelfoto’s op de Graslei gebeuren vroeg in de ochtend of bij valavond.',
        'Drone: toegelaten in de domeinen en op de hellingen van de Vlaamse Ardennen; verboden boven het centrum van Gent zonder toelating.',
        'Talen: reportage in het Nederlands, levering in het Nederlands of Frans naargelang de familie.',
      ],
      faq: [
        { question: 'Komt u naar Gent zonder verplaatsingskosten?', answer: 'Ja: Gent ligt op 55 km van Wemmel, in de inbegrepen zone, net als Aalst, Sint-Niklaas, Dendermonde en Oudenaarde.' },
        { question: 'Wat kost een huwelijksfotograaf en videograaf in Gent?', answer: '1.290 € voor foto, 1.590 € voor video, 2.690 € voor beide door dezelfde persoon, volledige dag, btw inbegrepen, zonder verplaatsingskosten.' },
        { question: 'Waar maken we de koppelfoto’s in Gent?', answer: 'De Graslei en Korenlei, de Sint-Michielsbrug, het Gravensteen, de tuinen van de Sint-Pietersabdij, het Patershol. De plek kiezen we samen volgens het uur en de drukte.' },
        { question: 'Fotografeert u ook lentefeesten en communies in Oost-Vlaanderen?', answer: 'Ja, als evenement: 390 € voor drie uur foto, 890 € met een aftermovie, btw inbegrepen. Zie de pagina Evenementen.' },
      ],
    },
    en: {
      intro:
        'Wedding photographer and videographer in Ghent and East Flanders, forty-five minutes from Brussels: Ghent, Aalst, Sint-Niklaas, Dendermonde, Oudenaarde and Deinze are inside the included zone, with no travel fee. Civil weddings at Ghent City Hall or in a château on the river Leie, couple photos on the Graslei at dawn, team headshots in the offices of the Zuid district, matches at the Ghelamco Arena — one person for both photo and video, working in English for the international couples and companies of a city where a quarter of the population is under 25.',
      citiesTitle: 'Across the province',
      cities: [
        { name: 'Ghent', fact: 'the city hall for civil ceremonies, the Graslei, the Gravensteen and St Peter’s Abbey for couple photos; the Zuid district and the Zebrastraat for corporate events.' },
        { name: 'Aalst', fact: 'twenty-five minutes from Wemmel: the town hall and belfry on the Grote Markt for the ceremony, the halls along the Dender for the party.' },
        { name: 'Sint-Niklaas', fact: 'the largest market square in Belgium for the photos after the town hall, the estates of the Waasland for the reception.' },
        { name: 'Dendermonde and Lokeren', fact: 'the beguinage and Grote Markt of Dendermonde, the farms along the Durme for country weddings.' },
        { name: 'Oudenaarde and the Flemish Ardennes', fact: 'the Gothic town hall, the Salons Mantovani, the climbs of the Tour of Flanders for outdoor sessions.' },
        { name: 'Deinze and the Leie', fact: 'Ooidonk Castle, the banks of the Leie at Sint-Martens-Latem, the painters’ light for couple sessions.' },
      ],
      venuesTitle: 'Reception and shooting venues',
      venues: ['Ghent City Hall', 'St Peter’s Abbey (Ghent)', 'Zebrastraat (Ghent)', 'Laarne Castle', 'Ooidonk Castle (Deinze)', 'Poeke Castle (Aalter)', 'Wissekerke Castle (Kruibeke)', 'Beervelde Castle (Lochristi)', 'Salons Mantovani (Oudenaarde)', 'Puyenbroeck estate (Wachtebeke)', 'Borgwal Castle (Vurste)', 'Ghelamco Arena'],
      practicalTitle: 'Practical',
      practical: [
        'Travel included (zone 1) for Ghent, Aalst, Sint-Niklaas, Dendermonde, Oudenaarde, Deinze, Wetteren and Zottegem.',
        'Ghent: the centre is car-free; the location visit fixes drop-off points and parking. Couple photos on the Graslei are shot early morning or at dusk.',
        'Drone: allowed on the estates and the hills of the Flemish Ardennes; forbidden above the centre of Ghent without a permit.',
        'Languages: the day is run in English and Dutch as needed; contract, quote and delivery in English.',
      ],
      faq: [
        { question: 'Do you come to Ghent without a travel fee?', answer: 'Yes: Ghent is 55 km from Wemmel, inside the included zone, as are Aalst, Sint-Niklaas, Dendermonde and Oudenaarde.' },
        { question: 'How much does a wedding photographer and videographer cost in Ghent?', answer: '€1,290 for photo, €1,590 for video, €2,690 for both by the same person, full day, VAT included, no travel fee.' },
        { question: 'Where do we shoot couple photos in Ghent?', answer: 'The Graslei and Korenlei, St Michael’s Bridge, the Gravensteen, the gardens of St Peter’s Abbey, the Patershol. We pick the spot together according to the hour and the crowds.' },
      ],
    },
  },

  'flandre-occidentale': {
    fr: {
      intro:
        'Photographe et vidéaste à Bruges, Ostende, Courtrai et sur la côte belge, depuis Bruxelles avec un forfait de déplacement fixe de 90 € : Bruges, Ostende, Knokke, Courtrai, Roulers, Ypres et Furnes sont à une heure et quart de route. Mariages civils dans la salle gothique de l’hôtel de ville de Bruges, demandes en mariage sur le Rozenhoedkaai, séances sur la plage du Coq ou de Knokke, portraits d’équipe dans les entreprises de Courtrai et de Roulers : une seule personne pour la photo et la vidéo, en néerlandais, en français ou en anglais, prix affichés.',
      citiesTitle: 'Dans la province',
      cities: [
        { name: 'Bruges', fact: 'la salle gothique de l’hôtel de ville pour le civil, le Rozenhoedkaai, le Minnewater et le béguinage pour les photos de couple, à l’aube avant les visiteurs.' },
        { name: 'Ostende', fact: 'l’hôtel de ville, le Kursaal, le Fort Napoléon et la digue pour les mariages et les événements en bord de mer.' },
        { name: 'Knokke-Heist et Le Coq', fact: 'les villas, les plages et le Zwin pour les séances couple et famille ; les hôtels de la digue pour les réceptions.' },
        { name: 'Courtrai', fact: 'le béguinage, les tours du Broel et la Grand-Place pour le civil ; le pôle textile et design pour les films d’entreprise.' },
        { name: 'Roulers et Torhout', fact: 'le château de Rumbeke, le château d’Aertrycke et les salons de la région pour les réceptions.' },
        { name: 'Ypres et le Westhoek', fact: 'la Halle aux draps et la Porte de Menin, les fermes et les monts des Flandres pour les mariages champêtres.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Hôtel de ville de Bruges (salle gothique)', 'Château Tudor (Sint-Andries)', 'Château Ten Berghe (Bruges)', 'Château de Loppem', 'Château d’Aertrycke (Torhout)', 'Salons Denotter (Zedelgem)', 'Château de Rumbeke (Roulers)', 'Kursaal d’Ostende', 'Fort Napoléon (Ostende)', 'Salons Saint Germain (Dixmude)', 'Béguinage et Minnewater (Bruges)', 'Halle aux draps d’Ypres'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 90 € (zone 2) pour toute la province, de Courtrai à Knokke.',
        'Bruges : le centre est classé et très fréquenté ; les photos de couple se font tôt le matin, le repérage fixe les accès et le stationnement.',
        'Mariage : nuit d’hôtel (150 €) ajoutée si la soirée finit tard sur la côte ; retour le soir même possible depuis Courtrai ou Roulers.',
        'Drone : interdit au-dessus du centre de Bruges ; les plages et les polders sont possibles hors zones protégées, le Zwin est exclu.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage à Bruges ?', answer: 'Le prix de la grille plus 90 € de déplacement : 1 290 € en photo, 1 590 € en vidéo, 2 690 € pour les deux par la même personne, journée complète, TVA comprise.' },
        { question: 'Couvrez-vous les mariages civils à l’hôtel de ville de Bruges ?', answer: 'Oui. La salle gothique accepte un photographe ; la sortie se fait sur le Burg puis vers le Rozenhoedkaai, à cinq minutes à pied.' },
        { question: 'Faites-vous des demandes en mariage ou des séances couple à Bruges ?', answer: 'Oui, en formule lifestyle : 250 € pour une heure trente de photos, 640 € avec un court film, TVA comprise, plus les 90 € de déplacement.' },
      ],
    },
    nl: {
      intro:
        'Trouwfotograaf en videograaf in Brugge, Oostende, Kortrijk en aan de kust, vanuit Brussel met een vaste verplaatsingskost van 90 €: Brugge, Oostende, Knokke, Kortrijk, Roeselare, Ieper en Veurne liggen op vijf kwartier rijden. Burgerlijk huwelijk in de Gotische zaal van het stadhuis van Brugge, aanzoek op de Rozenhoedkaai, shoot op het strand van De Haan of Knokke, teamportretten bij de bedrijven van Kortrijk en Roeselare: één persoon voor foto en video, met prijzen online.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Brugge', fact: 'de Gotische zaal van het stadhuis voor het burgerlijk huwelijk, de Rozenhoedkaai, het Minnewater en het begijnhof voor de koppelfoto’s, bij zonsopgang vóór de bezoekers.' },
        { name: 'Oostende', fact: 'het stadhuis, het Kursaal, Fort Napoleon en de dijk voor huwelijken en events aan zee.' },
        { name: 'Knokke-Heist en De Haan', fact: 'de villa’s, de stranden en het Zwin voor koppel- en gezinsshoots; de hotels op de dijk voor recepties.' },
        { name: 'Kortrijk', fact: 'het begijnhof, de Broeltorens en de Grote Markt voor het huwelijk; de textiel- en designbedrijven voor bedrijfsfilms.' },
        { name: 'Roeselare en Torhout', fact: 'het kasteel van Rumbeke, kasteel d’Aertrycke en de salons van de streek voor recepties.' },
        { name: 'Ieper en de Westhoek', fact: 'de Lakenhallen en de Menenpoort, de hoeves en de heuvels voor landelijke huwelijken.' },
      ],
      venuesTitle: 'Feest- en opnamelocaties',
      venues: ['Stadhuis van Brugge (Gotische zaal)', 'Kasteel Tudor (Sint-Andries)', 'Kasteel Ten Berghe (Brugge)', 'Kasteel van Loppem', 'Kasteel d’Aertrycke (Torhout)', 'Salons Denotter (Zedelgem)', 'Kasteel van Rumbeke (Roeselare)', 'Kursaal Oostende', 'Fort Napoleon (Oostende)', 'Salons Saint Germain (Diksmuide)', 'Begijnhof en Minnewater (Brugge)', 'Lakenhallen van Ieper'],
      practicalTitle: 'Praktisch',
      practical: [
        'Verplaatsing: vaste kost van 90 € (zone 2) voor de hele provincie, van Kortrijk tot Knokke.',
        'Brugge: het centrum is beschermd en druk; koppelfoto’s gebeuren vroeg in de ochtend, bij de verkenning leggen we toegang en parking vast.',
        'Huwelijk: hotelnacht (150 €) als het feest laat eindigt aan de kust; vanuit Kortrijk of Roeselare is terugrijden dezelfde avond mogelijk.',
        'Drone: verboden boven het centrum van Brugge; stranden en polders kunnen buiten de beschermde zones, het Zwin is uitgesloten.',
      ],
      faq: [
        { question: 'Wat kost een huwelijksfotograaf en videograaf in Brugge?', answer: 'De prijs van de lijst plus 90 € verplaatsing: 1.290 € voor foto, 1.590 € voor video, 2.690 € voor beide door dezelfde persoon, volledige dag, btw inbegrepen.' },
        { question: 'Fotografeert u het burgerlijk huwelijk in het stadhuis van Brugge?', answer: 'Ja. De Gotische zaal laat een fotograaf toe; de foto’s gebeuren op de Burg en daarna aan de Rozenhoedkaai, op vijf minuten wandelen.' },
        { question: 'Komt u ook naar Kortrijk, Roeselare of Ieper?', answer: 'Ja, met dezelfde vaste kost van 90 €. Kortrijk ligt op een uur van Wemmel.' },
        { question: 'Maakt u ook foto’s van een aanzoek aan de kust of in Brugge?', answer: 'Ja, als lifestyle-shoot: 250 € voor anderhalf uur foto, 640 € met een korte film, btw inbegrepen, plus 90 € verplaatsing.' },
      ],
    },
    en: {
      intro:
        'Wedding, elopement and proposal photographer and videographer in Bruges and on the Belgian coast, from Brussels with a flat travel fee of €90: Bruges, Ostend, Knokke, Kortrijk, Roeselare and Ypres are seventy-five minutes away by road. Civil weddings in the Gothic Hall of Bruges City Hall, proposals on the Rozenhoedkaai at dawn, sessions on the beach at De Haan or Knokke, team headshots for the companies of Kortrijk — one person for both photo and video, working in English, with published prices rather than a marketplace quote.',
      citiesTitle: 'Across the province',
      cities: [
        { name: 'Bruges', fact: 'the Gothic Hall of the city hall for civil ceremonies, the Rozenhoedkaai, the Minnewater and the beguinage for couple photos, at dawn before the visitors arrive.' },
        { name: 'Ostend', fact: 'the town hall, the Kursaal, Fort Napoleon and the promenade for seaside weddings and events.' },
        { name: 'Knokke-Heist and De Haan', fact: 'the villas, beaches and the Zwin for couple and family sessions; the seafront hotels for receptions.' },
        { name: 'Kortrijk', fact: 'the beguinage, the Broel towers and the Grote Markt for the ceremony; textile and design companies for corporate films.' },
        { name: 'Roeselare and Torhout', fact: 'Rumbeke Castle, Aertrycke Castle and the reception halls of the area.' },
        { name: 'Ypres and the Westhoek', fact: 'the Cloth Hall and the Menin Gate, the farms and hills of Flanders for country weddings.' },
      ],
      venuesTitle: 'Reception and shooting venues',
      venues: ['Bruges City Hall (Gothic Hall)', 'Kasteel Tudor (Sint-Andries)', 'Kasteel Ten Berghe (Bruges)', 'Loppem Castle', 'Kasteel d’Aertrycke (Torhout)', 'Salons Denotter (Zedelgem)', 'Rumbeke Castle (Roeselare)', 'Kursaal Ostend', 'Fort Napoleon (Ostend)', 'Salons Saint Germain (Diksmuide)', 'Beguinage and Minnewater (Bruges)', 'Cloth Hall of Ypres'],
      practicalTitle: 'Practical',
      practical: [
        'Travel: flat fee of €90 (zone 2) for the whole province, from Kortrijk to Knokke.',
        'Bruges: the centre is listed and crowded; couple photos are shot early morning, and the location visit fixes access and parking.',
        'Elopement: a legal ceremony in Bruges requires residence in Belgium; most couples marry legally at home and hold a symbolic ceremony here. I cover both the ceremony and a two-hour session through the old town.',
        'Drone: forbidden above the centre of Bruges; beaches and polders are possible outside protected areas, the Zwin is excluded.',
      ],
      faq: [
        { question: 'How much does a wedding photographer and videographer cost in Bruges?', answer: 'The grid price plus €90 of travel: €1,290 for photo, €1,590 for video, €2,690 for both by the same person, full day, VAT included.' },
        { question: 'Do you shoot elopements and proposals in Bruges?', answer: 'Yes. A proposal or couple session is a lifestyle booking: €250 for ninety minutes of photos, €640 with a short film, VAT included, plus €90 travel. An elopement with a ceremony is quoted as a half-day wedding.' },
        { question: 'Do you also cover Ostend, Knokke or Kortrijk?', answer: 'Yes, with the same flat €90 fee. Kortrijk is one hour from Wemmel, Knokke ninety minutes.' },
      ],
    },
  },

  limbourg: {
    fr: {
      intro:
        'Photographe et vidéaste au Limbourg belge, depuis Bruxelles avec un forfait de déplacement fixe de 90 € : Hasselt, Genk, Tongres, Saint-Trond, Maaseik et Lommel sont à une heure et quart de route. Mariages à Alden Biesen ou à Bokrijk, séances dans les vergers en fleurs de la Hesbaye au printemps, portraits d’équipe sur le Thor Park ou à C-mine, clips dans les anciens charbonnages : une seule personne pour la photo et la vidéo, en néerlandais ou en français, prix affichés.',
      citiesTitle: 'Dans la province',
      cities: [
        { name: 'Hasselt', fact: 'l’hôtel de ville et le béguinage pour le civil, le jardin japonais et l’abbaye d’Herkenrode pour les photos de couple, le Kiewit pour les séances famille.' },
        { name: 'Genk', fact: 'C-mine et le Thor Park, anciens charbonnages reconvertis, pour les tournages d’entreprise et les clips ; le domaine de Bokrijk pour les mariages.' },
        { name: 'Tongres', fact: 'la plus ancienne ville de Belgique : la basilique, le Gallo-Romeins Museum et le béguinage pour les photos de couple.' },
        { name: 'Saint-Trond et la Hesbaye', fact: 'les vergers en fleurs d’avril, le château d’Ordingen et l’abbaye pour les mariages de printemps.' },
        { name: 'Maaseik et la vallée de la Meuse', fact: 'la Grand-Place, le château de Wurfeld et les lacs de la Maasvallei pour les séances.' },
        { name: 'Lommel, Beringen, Heusden-Zolder', fact: 'be-MINE, le château de Terlaemen et le circuit de Zolder pour les événements et le sport.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Château d’Alden Biesen (Bilzen)', 'Domaine de Bokrijk et Hangar 58', 'C-mine (Genk)', 'Abbaye d’Herkenrode (Hasselt)', 'Château d’Ordingen (Saint-Trond)', 'Château de Wurfeld (Maaseik)', 'Château de Terlaemen (Zolder)', 'Thor Park (Genk)', 'be-MINE (Beringen)', 'Jardin japonais de Hasselt', 'Gallo-Romeins Museum (Tongres)', 'Circuit de Zolder'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 90 € (zone 2) pour toute la province ; Maaseik et Lommel sont au bord de la zone, confirmés sur devis.',
        'Mariage : nuit d’hôtel (150 €) ajoutée si la soirée finit tard dans l’est de la province ; depuis Hasselt ou Saint-Trond, retour le soir même.',
        'Drone : possible sur les domaines et dans la Hesbaye ; la zone militaire de Leopoldsburg et l’aérodrome de Zwartberg imposent des exclusions.',
        'Langues : reportage en néerlandais, documents et livraison en français si la famille le souhaite.',
      ],
      faq: [
        { question: 'Venez-vous au Limbourg et à quel prix ?', answer: 'Oui, avec un forfait de 90 € pour toute la province. Les prix sont ceux de la grille belge : 2 690 € photo et vidéo mariage par la même personne, journée complète.' },
        { question: 'Faites-vous des séances dans les vergers en fleurs ?', answer: 'Oui, en avril, pendant deux à trois semaines : séance couple ou famille en formule lifestyle, 250 € pour une heure trente, plus 90 € de déplacement.' },
        { question: 'Travaillez-vous à Alden Biesen et à Bokrijk ?', answer: 'Les deux domaines accueillent des mariages et des événements et acceptent les photographes ; le repérage se fait avec le lieu quelques semaines avant.' },
      ],
    },
    nl: {
      intro:
        'Huwelijksfotograaf en videograaf in Limburg (België), vanuit Brussel met een vaste verplaatsingskost van 90 €: Hasselt, Genk, Tongeren, Sint-Truiden, Maaseik en Lommel liggen op vijf kwartier rijden. Trouwen in Alden Biesen of Bokrijk, shoots in de bloesems van Haspengouw in april, teamportretten op Thor Park of C-mine, clips in de oude mijnsites: één persoon voor foto en video, met prijzen online en een Belgische factuur, geen Nederlandse.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Hasselt', fact: 'het stadhuis en het begijnhof voor het burgerlijk huwelijk, de Japanse Tuin en de abdij van Herkenrode voor de koppelfoto’s, Kiewit voor gezinsshoots.' },
        { name: 'Genk', fact: 'C-mine en Thor Park, herbestemde mijnsites, voor bedrijfsopnames en clips; het domein van Bokrijk voor huwelijken.' },
        { name: 'Tongeren', fact: 'de oudste stad van België: de basiliek, het Gallo-Romeins Museum en het begijnhof voor de koppelfoto’s.' },
        { name: 'Sint-Truiden en Haspengouw', fact: 'de bloesems van april, het kasteel van Ordingen en de abdij voor lentehuwelijken.' },
        { name: 'Maaseik en de Maasvallei', fact: 'de Grote Markt, kasteel Wurfeld en de Maasplassen voor shoots.' },
        { name: 'Lommel, Beringen, Heusden-Zolder', fact: 'be-MINE, kasteel Terlaemen en het circuit van Zolder voor events en sport.' },
      ],
      venuesTitle: 'Feest- en opnamelocaties',
      venues: ['Kasteel Alden Biesen (Bilzen)', 'Domein Bokrijk en Hangar 58', 'C-mine (Genk)', 'Abdij van Herkenrode (Hasselt)', 'Kasteel van Ordingen (Sint-Truiden)', 'Kasteel Wurfeld (Maaseik)', 'Kasteel Terlaemen (Zolder)', 'Thor Park (Genk)', 'be-MINE (Beringen)', 'Japanse Tuin Hasselt', 'Gallo-Romeins Museum (Tongeren)', 'Circuit Zolder'],
      practicalTitle: 'Praktisch',
      practical: [
        'Verplaatsing: vaste kost van 90 € (zone 2) voor de hele provincie; Maaseik en Lommel liggen op de rand en worden op de offerte bevestigd.',
        'Huwelijk: hotelnacht (150 €) als het feest laat eindigt in het oosten van de provincie; vanuit Hasselt of Sint-Truiden rijd ik dezelfde avond terug.',
        'Drone: mogelijk op de domeinen en in Haspengouw; het militair domein van Leopoldsburg en het vliegveld van Zwartberg leggen no-flyzones op.',
        'Btw: Belgische btw van 21 % voor particulieren; voor een Limburgs bedrijf gewoon een Belgische factuur, geen intracommunautaire formaliteiten.',
      ],
      faq: [
        { question: 'Wat kost een huwelijksfotograaf in Limburg (België)?', answer: 'De prijs van de lijst plus 90 € verplaatsing: 1.290 € foto, 1.590 € video, 2.690 € foto én video door dezelfde persoon, volledige dag, btw inbegrepen.' },
        { question: 'Maakt u bloesemshoots in Haspengouw?', answer: 'Ja, in april, gedurende twee tot drie weken: koppel- of gezinsshoot als lifestyle, 250 € voor anderhalf uur, plus 90 € verplaatsing.' },
        { question: 'Werkt u in Alden Biesen en Bokrijk?', answer: 'Beide domeinen ontvangen huwelijken en events en laten fotografen toe; de verkenning gebeurt met de locatie enkele weken vooraf.' },
        { question: 'Waarom een fotograaf uit Brussel en niet uit Nederlands Limburg?', answer: 'Belgische factuur en btw, Belgische huwelijkstradities (stadhuis, kerk, receptie, diner, feest in één dag), en een vaste verplaatsingskost in plaats van kilometerkosten.' },
      ],
    },
  },

  hainaut: {
    fr: {
      intro:
        'Photographe et vidéaste dans le Hainaut, depuis Bruxelles avec un forfait de déplacement fixe de 90 € : Mons, Charleroi, Tournai, La Louvière, Binche, Ath, Soignies et Enghien sont à moins d’une heure de route. Mariages à l’hôtel de ville de Mons ou dans les châteaux de Seneffe, Beloeil et Attre, séances au Grand-Hornu, portraits d’équipe dans les entreprises de l’aéropôle de Gosselies, matchs au Pays de Charleroi : la même personne pour la photo et la vidéo, avec une grille de prix affichée.',
      citiesTitle: 'Dans la province',
      cities: [
        { name: 'Mons', fact: 'l’hôtel de ville gothique de la Grand-Place pour le civil, le beffroi et son jardin pour les photos de couple, le Mundaneum et le Grand-Hornu pour les événements.' },
        { name: 'Charleroi', fact: 'l’hôtel de ville Art déco pour le civil, Rockerill et les friches industrielles pour les clips, l’aéropôle de Gosselies pour les films d’entreprise.' },
        { name: 'Tournai', fact: 'la cathédrale et le beffroi, la Grand-Place et les quais de l’Escaut pour les photos de couple ; le Pont des Trous à l’heure dorée.' },
        { name: 'La Louvière et Binche', fact: 'le site minier de Bois-du-Luc, les ascenseurs du canal du Centre, les remparts de Binche pour les séances.' },
        { name: 'Ath, Enghien, Soignies', fact: 'le parc d’Enghien et son château, les carrières de Soignies, les fermes du pays d’Ath pour les mariages champêtres.' },
        { name: 'Thuin, Chimay, la Botte', fact: 'l’abbaye d’Aulne, le château de Chimay et les lacs de l’Eau d’Heure pour les mariages et les séances en extérieur.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Hôtel de ville de Mons', 'Château de Seneffe', 'Château de Beloeil', 'Château d’Attre', 'Château et parc d’Enghien', 'Château de Trazegnies', 'Abbaye d’Aulne (Thuin)', 'Grand-Hornu', 'Domaine du Chant d’Éole (Quévy)', 'Château de Chimay', 'Pairi Daiza (Brugelette)', 'Stade du Pays de Charleroi'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 90 € (zone 2) pour Mons, Charleroi, Tournai, La Louvière et Ath ; Enghien, Soignies, Braine-le-Comte et Nivelles sont en zone incluse.',
        'Mariage : retour le soir même depuis tout le Hainaut ; la nuit d’hôtel (150 €) n’est proposée que pour la Botte du Hainaut.',
        'Drone : possible sur la plupart des domaines ; exclusions autour de l’aéroport de Charleroi et de la base de Chièvres.',
        'Entreprises : prix hors TVA sur la page tarifs, facture belge classique.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage à Mons ou à Charleroi ?', answer: 'Le prix de la grille plus 90 € de déplacement : 1 290 € en photo, 1 590 € en vidéo, 2 690 € pour les deux par la même personne, journée complète, TVA comprise.' },
        { question: 'Enghien et Soignies sont-ils en zone incluse ?', answer: 'Oui : Enghien, Soignies, Braine-le-Comte et Nivelles sont à moins de 60 km de Wemmel. Mons, Charleroi et Tournai sont en zone 2, à 90 €.' },
        { question: 'Travaillez-vous au château de Seneffe ou à Beloeil ?', answer: 'Les deux domaines accueillent des mariages et des événements privés et acceptent un photographe ; les conditions de prise de vue sont confirmées avec le lieu au repérage.' },
      ],
    },
  },

  namur: {
    fr: {
      intro:
        'Photographe et vidéaste dans la province de Namur, depuis Bruxelles avec un forfait de déplacement fixe de 90 € : Namur, Dinant, Gembloux, Andenne, Ciney et Rochefort sont à une heure de route. Mariages à la citadelle ou dans les châteaux de la Meuse, séances sur les rochers de Freÿr ou dans les jardins d’Annevoie, portraits d’équipe à Gembloux Agro-Bio Tech, clips dans les vallées de la Lesse et de la Molignée : une seule personne pour la photo et la vidéo, prix affichés.',
      citiesTitle: 'Dans la province',
      cities: [
        { name: 'Namur', fact: 'l’hôtel de ville pour le civil, la citadelle et le confluent pour les photos de couple, le Grognon et les quais de la Sambre au coucher du soleil.' },
        { name: 'Dinant', fact: 'la collégiale et le rocher Bayard, les bords de Meuse et le château de Freÿr pour les séances et les mariages.' },
        { name: 'Gembloux', fact: 'l’abbaye et la faculté Agro-Bio Tech pour les films institutionnels, les fermes de la Hesbaye namuroise pour les mariages.' },
        { name: 'Andenne et Ciney', fact: 'le Condroz, ses fermes-châteaux et le château de Faulx-les-Tombes pour les réceptions.' },
        { name: 'Rochefort et la Lesse', fact: 'l’abbaye, les grottes de Han et la vallée de la Lesse pour les séances et les mariages en plein air.' },
        { name: 'Maredsous et la Molignée', fact: 'l’abbaye, le château de Bioul et ses vignes, les jardins d’Annevoie pour les photos de couple.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Citadelle de Namur et Château de Namur', 'Abbaye de Floreffe', 'Château de Freÿr (Hastière)', 'Château de Vêves (Celles)', 'Domaine de Ronchinne (Maillen)', 'Château de Bioul', 'Château de Faulx-les-Tombes', 'Jardins d’Annevoie', 'Abbaye de Maredsous', 'Château de Fernelmont', 'Lacs de l’Eau d’Heure', 'Grottes de Han'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 90 € (zone 2) pour toute la province ; Gembloux est en zone incluse.',
        'Mariage : retour le soir même depuis Namur ; la nuit d’hôtel (150 €) est ajoutée pour Dinant, Rochefort et le sud de la province quand la soirée finit tard.',
        'Drone : la vallée de la Meuse et le Condroz se prêtent aux plans aériens ; la citadelle et la base de Florennes imposent des exclusions.',
        'Lumière : les vallées sont à l’ombre tôt ; l’heure des photos de couple est fixée au repérage.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage à Namur ?', answer: 'Le prix de la grille plus 90 € de déplacement : 1 290 € en photo, 1 590 € en vidéo, 2 690 € pour les deux par la même personne, journée complète, TVA comprise.' },
        { question: 'Venez-vous à Dinant et à Rochefort ?', answer: 'Oui, avec le même forfait de 90 €. Si la soirée se termine après minuit, une nuit d’hôtel de 150 € est ajoutée au devis.' },
        { question: 'Faites-vous les photos de couple à la citadelle ?', answer: 'Oui : la citadelle, le téléphérique et le confluent sont à dix minutes de l’hôtel de ville. Pour un mariage à Dinant, les rochers de Freÿr ou les bords de Meuse.' },
      ],
    },
  },

  liege: {
    fr: {
      intro:
        'Photographe et vidéaste à Liège et dans sa province, depuis Bruxelles avec un forfait de déplacement fixe de 90 € : Liège, Verviers, Huy, Waremme, Spa et Eupen sont à une heure et quart de route. Mariages à l’hôtel de ville de Liège ou dans les châteaux de Jehay, Modave et Colonster, séances sur la Montagne de Bueren ou dans le parc de la Boverie, portraits d’équipe au Liège Science Park, matchs à Sclessin : une seule personne pour la photo et la vidéo, en français, en néerlandais ou en anglais, prix affichés.',
      citiesTitle: 'Dans la province',
      cities: [
        { name: 'Liège', fact: 'l’hôtel de ville de la place du Marché pour le civil, la Montagne de Bueren, le palais des Princes-Évêques et la gare des Guillemins pour les photos de couple, la Boverie pour les événements.' },
        { name: 'Huy et la Hesbaye', fact: 'la collégiale et le fort, les châteaux de Jehay et de Modave, les fermes de Waremme pour les mariages.' },
        { name: 'Verviers', fact: 'les anciennes filatures et l’hôtel de ville pour le civil, le barrage de la Gileppe pour les séances.' },
        { name: 'Spa', fact: 'le casino, les thermes et le lac de Warfaaz : mariages de week-end et séances couple dans la ville d’eau.' },
        { name: 'Eupen et les Cantons de l’Est', fact: 'les Hautes Fagnes pour les séances en toute saison, les mariages germanophones avec livraison en anglais ou en allemand sur demande.' },
        { name: 'Seraing, Herstal, Ans', fact: 'le château de Waroux, le Country Hall et les sièges industriels pour les films d’entreprise.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Hôtel de ville de Liège', 'Château de Modave', 'Château de Jehay', 'Château de Colonster (ULiège)', 'Château de Waroux (Ans)', 'Château de Harzé (Aywaille)', 'Château des Thermes (Chaudfontaine)', 'Palais des Congrès de Liège', 'La Boverie', 'Casino et Pouhon de Spa', 'Stade Maurice Dufrasne (Sclessin)', 'Hautes Fagnes'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 90 € (zone 2) pour Liège, Huy, Waremme, Verviers et Spa ; Eupen et les Cantons de l’Est sont confirmés sur devis.',
        'Mariage : nuit d’hôtel (150 €) ajoutée quand la soirée finit tard à Spa ou dans l’est ; retour le soir même depuis Liège et Huy.',
        'Drone : la vallée de la Meuse et les Fagnes sont possibles hors réserves naturelles ; exclusions autour de l’aéroport de Bierset.',
        'Langues : français, et anglais ou néerlandais pour les familles et les équipes internationales des universités et des sièges liégeois.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage à Liège ?', answer: 'Le prix de la grille plus 90 € de déplacement : 1 290 € en photo, 1 590 € en vidéo, 2 690 € pour les deux par la même personne, journée complète, TVA comprise.' },
        { question: 'Venez-vous à Spa et dans les Cantons de l’Est ?', answer: 'Oui. Spa est en zone 2 (90 €) ; Eupen, Malmedy et Saint-Vith sont au bord de la zone 3 et confirmés au devis, avec une nuit d’hôtel si la soirée finit tard.' },
        { question: 'Où faire les photos de couple à Liège ?', answer: 'La Montagne de Bueren tôt le matin, la cour du palais des Princes-Évêques, la passerelle de la Boverie, la gare des Guillemins pour un rendu architectural.' },
      ],
    },
  },

  ardennes: {
    fr: {
      intro:
        'Photographe et vidéaste dans les Ardennes, depuis Bruxelles avec un forfait de déplacement fixe de 90 € : Durbuy, La Roche-en-Ardenne, Marche-en-Famenne, Bastogne, Stavelot et Malmedy sont à moins de deux heures de route. Mariages dans les châteaux et les abbayes, séances dans les Hautes Fagnes ou sur les hauteurs de Durbuy, tournages au circuit de Spa-Francorchamps, clips dans les forêts et les vallées de l’Ourthe et de la Semois : une seule personne pour la photo et la vidéo, en français, en néerlandais ou en anglais, prix affichés.',
      citiesTitle: 'Dans la région',
      cities: [
        { name: 'Durbuy', fact: 'la plus petite ville du monde : ruelles pavées, parc des topiaires et rives de l’Ourthe pour un mariage de week-end entièrement à pied.' },
        { name: 'La Roche-en-Ardenne', fact: 'le château féodal et les méandres de l’Ourthe pour les séances couple ; les hôtels du centre pour les réceptions.' },
        { name: 'Marche-en-Famenne et Hotton', fact: 'le château d’Hassonville, le château de Deulin et les grottes de Hotton pour les mariages et les séances.' },
        { name: 'Bastogne et Arlon', fact: 'le Mardasson et les forêts du Sud pour les séances ; Arlon, capitale provinciale, pour le civil et les événements d’entreprise.' },
        { name: 'Stavelot, Malmedy, Spa-Francorchamps', fact: 'l’abbaye de Stavelot pour les réceptions, le circuit pour les événements sportifs et corporate, les Fagnes pour les photos.' },
        { name: 'Bouillon et la Semois', fact: 'le château fort, le tombeau du Géant et la vallée de la Semois pour les mariages et les séances en pleine nature.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Abbaye de Stavelot', 'Château de Harzé (Aywaille)', 'Château d’Hassonville (Marche-en-Famenne)', 'Château de Deulin (Hotton)', 'Château de Mirwart', 'Château de Lavaux-Sainte-Anne', 'Le Sanglier des Ardennes (Durbuy)', 'Château de Bouillon', 'Abbaye d’Orval', 'Circuit de Spa-Francorchamps', 'Parc des topiaires (Durbuy)', 'Hautes Fagnes et Signal de Botrange'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 90 € (zone 2) pour Durbuy, Marche, La Roche, Stavelot et Malmedy ; 190 € (zone 3) pour Bastogne, Bouillon et Arlon.',
        'Mariage : les soirées ardennaises finissent tard et loin : la nuit d’hôtel (150 €) est presque toujours ajoutée, ce qui permet aussi une séance couple le lendemain matin dans la brume.',
        'Drone : les forêts et les vallées se prêtent aux plans aériens ; les réserves naturelles des Fagnes et le camp d’Elsenborn sont exclus.',
        'Langues : français, néerlandais pour les nombreux couples flamands et néerlandais qui se marient à Durbuy, anglais pour les mariages internationaux.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage à Durbuy ?', answer: 'Le prix de la grille plus 90 € de déplacement et, le plus souvent, 150 € de nuit d’hôtel : 2 690 € pour la photo et la vidéo par la même personne, journée complète, TVA comprise.' },
        { question: 'Faites-vous les mariages sur deux jours dans les Ardennes ?', answer: 'Oui : la journée complète le samedi, puis une séance couple ou un brunch le dimanche matin en heure supplémentaire (150 €, ou 220 € photo et vidéo).' },
        { question: 'Couvrez-vous les événements au circuit de Spa-Francorchamps ?', answer: 'Oui, en formule corporate ou sport : incentives, journées de roulage et hospitalités, avec accréditation demandée par l’organisateur.' },
        { question: 'Parlez-vous néerlandais pour un mariage à Durbuy ?', answer: 'Oui, le reportage se mène en néerlandais ou en anglais si les invités le sont ; contrat et livraison dans la langue de votre choix.' },
      ],
    },
    nl: {
      intro:
        'Trouwfotograaf en videograaf in de Ardennen, vanuit Brussel met een vaste verplaatsingskost van 90 €: Durbuy, La Roche-en-Ardenne, Marche-en-Famenne, Bastogne, Stavelot en Malmedy liggen op minder dan twee uur rijden. Trouwen in de Ardennen in een kasteel of abdij, shoots in de Hoge Venen of op de hoogten van Durbuy, opnames op het circuit van Spa-Francorchamps, clips in de bossen en valleien van de Ourthe en de Semois: één persoon voor foto en video, in het Nederlands, met prijzen online.',
      citiesTitle: 'In de streek',
      cities: [
        { name: 'Durbuy', fact: 'het kleinste stadje ter wereld: kasseistraatjes, het topiarypark en de oevers van de Ourthe voor een weekendhuwelijk volledig te voet.' },
        { name: 'La Roche-en-Ardenne', fact: 'de burchtruïne en de bochten van de Ourthe voor koppelshoots; de hotels in het centrum voor recepties.' },
        { name: 'Marche-en-Famenne en Hotton', fact: 'het Château d’Hassonville, het Château de Deulin en de grotten van Hotton voor huwelijken en shoots.' },
        { name: 'Bastogne en Aarlen', fact: 'het Mardasson en de zuidelijke bossen voor shoots; Aarlen voor het burgerlijk huwelijk en bedrijfsevents.' },
        { name: 'Stavelot, Malmedy, Spa-Francorchamps', fact: 'de abdij van Stavelot voor recepties, het circuit voor sport- en bedrijfsevents, de Venen voor de foto’s.' },
        { name: 'Bouillon en de Semois', fact: 'de burcht, het Tombeau du Géant en de Semoisvallei voor huwelijken en shoots in volle natuur.' },
      ],
      venuesTitle: 'Feest- en opnamelocaties',
      venues: ['Abdij van Stavelot', 'Château de Harzé (Aywaille)', 'Château d’Hassonville (Marche-en-Famenne)', 'Château de Deulin (Hotton)', 'Château de Mirwart', 'Château de Lavaux-Sainte-Anne', 'Le Sanglier des Ardennes (Durbuy)', 'Burcht van Bouillon', 'Abdij van Orval', 'Circuit van Spa-Francorchamps', 'Topiarypark (Durbuy)', 'Hoge Venen en Signaal van Botrange'],
      practicalTitle: 'Praktisch',
      practical: [
        'Verplaatsing: vaste kost van 90 € (zone 2) voor Durbuy, Marche, La Roche, Stavelot en Malmedy; 190 € (zone 3) voor Bastogne, Bouillon en Aarlen.',
        'Huwelijk: Ardense feesten eindigen laat en ver: de hotelnacht (150 €) wordt bijna altijd toegevoegd, wat ook een koppelshoot in de ochtendmist mogelijk maakt.',
        'Drone: bossen en valleien lenen zich tot luchtbeelden; de natuurreservaten van de Venen en het kamp van Elsenborn zijn uitgesloten.',
        'Talen: Nederlands voor de vele Vlaamse en Nederlandse koppels die in Durbuy trouwen, Frans voor de locaties, Engels voor internationale gasten.',
      ],
      faq: [
        { question: 'Wat kost een huwelijksfotograaf en videograaf in Durbuy?', answer: 'De prijs van de lijst plus 90 € verplaatsing en meestal 150 € hotelnacht: 2.690 € voor foto én video door dezelfde persoon, volledige dag, btw inbegrepen.' },
        { question: 'Doet u huwelijken over twee dagen in de Ardennen?', answer: 'Ja: de volledige dag op zaterdag, en een koppelshoot of brunch op zondagochtend als extra uur (150 €, of 220 € foto en video).' },
        { question: 'Fotografeert u ook events op het circuit van Spa-Francorchamps?', answer: 'Ja, als zakelijk of sport: incentives, trackdays en hospitality, met accreditatie aangevraagd door de organisator.' },
      ],
    },
    en: {
      intro:
        'Wedding photographer and videographer in the Belgian Ardennes, from Brussels with a flat travel fee of €90: Durbuy, La Roche-en-Ardenne, Marche-en-Famenne, Bastogne, Stavelot and Malmedy are under two hours away by road. Weddings in castles and abbeys, sessions in the High Fens or above Durbuy, corporate and track-day shoots at Spa-Francorchamps, music videos in the forests and valleys of the Ourthe and the Semois — one person for both photo and video, working in English for international couples who choose the Ardennes for a weekend wedding.',
      citiesTitle: 'Across the region',
      cities: [
        { name: 'Durbuy', fact: 'the smallest town in the world: cobbled lanes, the topiary park and the banks of the Ourthe for a weekend wedding entirely on foot.' },
        { name: 'La Roche-en-Ardenne', fact: 'the ruined castle and the bends of the Ourthe for couple sessions; the hotels in the centre for receptions.' },
        { name: 'Marche-en-Famenne and Hotton', fact: 'Château d’Hassonville, Château de Deulin and the Hotton caves for weddings and sessions.' },
        { name: 'Bastogne and Arlon', fact: 'the Mardasson memorial and the southern forests for sessions; Arlon for civil ceremonies and corporate events.' },
        { name: 'Stavelot, Malmedy, Spa-Francorchamps', fact: 'Stavelot Abbey for receptions, the circuit for sports and corporate events, the Fens for photos.' },
        { name: 'Bouillon and the Semois', fact: 'the fortress, the Tombeau du Géant and the Semois valley for weddings and sessions in open nature.' },
      ],
      venuesTitle: 'Reception and shooting venues',
      venues: ['Stavelot Abbey', 'Château de Harzé (Aywaille)', 'Château d’Hassonville (Marche-en-Famenne)', 'Château de Deulin (Hotton)', 'Château de Mirwart', 'Château de Lavaux-Sainte-Anne', 'Le Sanglier des Ardennes (Durbuy)', 'Bouillon Castle', 'Orval Abbey', 'Spa-Francorchamps circuit', 'Topiary park (Durbuy)', 'High Fens and Signal de Botrange'],
      practicalTitle: 'Practical',
      practical: [
        'Travel: flat fee of €90 (zone 2) for Durbuy, Marche, La Roche, Stavelot and Malmedy; €190 (zone 3) for Bastogne, Bouillon and Arlon.',
        'Wedding: Ardennes parties end late and far from Brussels, so a hotel night (€150) is almost always added, which also allows a couple session in the morning mist.',
        'Drone: forests and valleys suit aerial shots; the nature reserves of the Fens and the Elsenborn camp are excluded.',
        'Languages: the day is run in English, French or Dutch as the guests require; contract, quote and delivery in English.',
      ],
      faq: [
        { question: 'How much does a wedding photographer and videographer cost in Durbuy?', answer: 'The grid price plus €90 of travel and, usually, a €150 hotel night: €2,690 for photo and video by the same person, full day, VAT included.' },
        { question: 'Do you cover two-day weddings in the Ardennes?', answer: 'Yes: the full day on Saturday, then a couple session or brunch on Sunday morning as an extra hour (€150, or €220 for photo and video).' },
        { question: 'Do you shoot events at the Spa-Francorchamps circuit?', answer: 'Yes, as corporate or sport bookings: incentives, track days and hospitality, with accreditation requested by the organiser.' },
      ],
    },
  },
};
