import type { SiteLocale } from './locale';
import type { RegionContent } from './region-content';

/**
 * Phase 2 du chantier 5, hors Belgique : Côte d'Opale, Picardie – Oise,
 * Limbourg néerlandais, Brabant-Septentrional, et la page « à l'étranger ».
 * Aux Pays-Bas, le vocabulaire est celui du marché local (« bruiloft »,
 * « bruidsfotograaf », « reiskosten », « aanbetaling »). La page étranger ne
 * cite comme déjà tourné que les pays confirmés par le client (Grèce, en
 * plus des quatre pays couverts) ; les autres destinations sont « possibles ».
 */
export const REGION_CONTENT_PHASE_2_ABROAD: Readonly<Record<string, Partial<Record<SiteLocale, RegionContent>>>> = {
  'pas-de-calais-cote-d-opale': {
    fr: {
      intro:
        'Photographe et vidéaste sur la Côte d’Opale et dans le Pas-de-Calais, depuis Bruxelles avec un forfait de déplacement fixe de 190 € : Le Touquet, Boulogne-sur-Mer, Calais, Wimereux, Montreuil-sur-Mer, Saint-Omer, Arras, Béthune et Lens sont à deux heures ou deux heures et demie de route. Mariages dans les villas du Touquet et les châteaux de l’Audomarois, séances au cap Blanc-Nez ou dans la baie d’Authie, portraits d’équipe à Arras et à Lens : une seule personne pour la photo et la vidéo, aux prix de la grille belge, sous la médiane du marché français.',
      citiesTitle: 'Sur la côte et dans le département',
      cities: [
        { name: 'Le Touquet-Paris-Plage', fact: 'l’hôtel de ville anglo-normand pour le civil, la plage et le phare pour les photos de couple, les villas de la forêt et l’hôtel Westminster pour les réceptions.' },
        { name: 'Boulogne-sur-Mer et Wimereux', fact: 'la ville fortifiée et la basilique pour le civil, la digue de Wimereux et les falaises pour les séances en bord de mer.' },
        { name: 'Calais', fact: 'l’hôtel de ville flamboyant et son beffroi classé à l’UNESCO, Les Bourgeois de Rodin sur le parvis : la sortie de mairie la plus photogénique de la côte.' },
        { name: 'Montreuil-sur-Mer et la baie d’Authie', fact: 'les remparts et la citadelle, les ruelles pavées, puis les dunes de Berck et la baie pour les séances.' },
        { name: 'Saint-Omer et l’Audomarois', fact: 'la cathédrale, le marais et ses barques, le château de Tilques et le château de Cocove pour les mariages.' },
        { name: 'Arras, Béthune, Lens', fact: 'les places baroques d’Arras et son beffroi pour le civil, le Louvre-Lens et le stade Bollaert pour les événements ; Arras est en zone 2, à 90 €.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Hôtel Westminster (Le Touquet)', 'Château de Tilques (Saint-Omer)', 'Château de Cocove (Recques-sur-Hem)', 'Château de Beaulieu (Busnes)', 'Domaine de la Chartreuse (Gosnay)', 'Manoir de la Peylouse (Saint-Venant)', 'Château de Grand-Rullecourt', 'Château d’Hardelot (Condette)', 'Nausicaá (Boulogne-sur-Mer)', 'Louvre-Lens', 'Cap Blanc-Nez et cap Gris-Nez', 'Citadelle de Montreuil-sur-Mer'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 190 € (zone 3) pour la côte, Saint-Omer et Béthune ; Arras et Lens sont en zone 2, à 90 €.',
        'Mariage : nuit d’hôtel (150 €) ajoutée pour la côte, la soirée finissant tard à plus de deux heures de Bruxelles ; cela permet une séance couple sur la plage le lendemain à l’aube.',
        'Musique et droits : films montés sur de la musique sous licence, publiables sur les réseaux sans déclaration SACEM.',
        'Facturation : prestation intracommunautaire, facture belge avec TVA pour un particulier, autoliquidation pour une entreprise française assujettie.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage au Touquet ?', answer: 'Le prix belge plus 190 € de déplacement et 150 € de nuit d’hôtel : 2 690 € pour la photo et la vidéo par la même personne, journée complète, soit environ 3 000 € tout compris, là où la photo seule se négocie souvent entre 1 800 et 2 500 € sur la côte.' },
        { question: 'Venez-vous à Arras ou à Lens au même tarif ?', answer: 'Non, moins cher : Arras et Lens sont à moins de 150 km de Bruxelles, en zone 2, soit 90 € de déplacement et un retour le soir même.' },
        { question: 'Peut-on faire une séance couple au cap Blanc-Nez ?', answer: 'Oui, c’est l’un des plus beaux sites de la côte pour une séance couple ou une demande en mariage, en formule lifestyle (250 € pour une heure trente, plus le déplacement). Le vent est le seul paramètre à surveiller.' },
      ],
    },
  },

  'picardie-oise': {
    fr: {
      intro:
        'Photographe et vidéaste en Picardie et dans l’Oise, depuis Bruxelles avec un forfait de déplacement fixe de 190 € : Amiens, Chantilly, Compiègne, Senlis, Beauvais, Saint-Quentin et la baie de Somme sont à deux heures ou deux heures et demie de route. Mariages dans les châteaux de l’Oise et les abbayes, séances dans les hortillonnages d’Amiens ou devant les Grandes Écuries de Chantilly, portraits d’équipe dans les entreprises de Beauvais et de Compiègne : une seule personne pour la photo et la vidéo, aux prix de la grille belge, sous la médiane du marché picard et francilien.',
      citiesTitle: 'Dans la région',
      cities: [
        { name: 'Amiens', fact: 'la cathédrale, la plus vaste de France, le quartier Saint-Leu et les hortillonnages en barque pour les photos de couple ; l’hôtel de ville pour le civil.' },
        { name: 'Chantilly', fact: 'le château, les Grandes Écuries et l’hippodrome ; les prises de vue dans le parc du château se font avec une autorisation payante demandée à l’avance.' },
        { name: 'Compiègne et Pierrefonds', fact: 'le palais impérial et la forêt pour les séances, le château de Pierrefonds pour un décor de conte ; l’hôtel de ville gothique pour le civil.' },
        { name: 'Senlis', fact: 'la cité médiévale, ses remparts et sa cathédrale, à trente minutes de Paris : le décor de nombreux tournages, et de mariages à l’échelle d’un village.' },
        { name: 'Beauvais et Saint-Quentin', fact: 'la cathédrale de Beauvais et l’hôtel de ville Art déco de Saint-Quentin pour le civil ; les zones d’activité pour les films d’entreprise.' },
        { name: 'Baie de Somme', fact: 'Saint-Valery-sur-Somme, Le Crotoy et la pointe du Hourdel pour les séances couple et les mariages en bord de baie, à marée basse.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Château de Chantilly et Grandes Écuries', 'Auberge du Jeu de Paume (Chantilly)', 'Château de Montvillargenne (Gouvieux)', 'Château de la Tour (Gouvieux)', 'Château de Raray', 'Château d’Ermenonville', 'Abbaye de Chaalis', 'Abbaye de Royaumont', 'Château de Compiègne', 'Château de Bertangles (Somme)', 'Hortillonnages d’Amiens', 'Baie de Somme (Saint-Valery, Le Crotoy)'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 190 € (zone 3) pour l’Oise, la Somme et l’Aisne ; au-delà, Paris et l’Île-de-France sont en zone 4, à 290 €.',
        'Mariage : nuit d’hôtel (150 €) ajoutée presque systématiquement, la soirée finissant tard à plus de deux heures de Bruxelles.',
        'Autorisations : le domaine de Chantilly et les monuments nationaux (Pierrefonds, Compiègne) demandent une autorisation de prise de vue, parfois payante, à prévoir au devis.',
        'Facturation : prestation intracommunautaire, facture belge avec TVA pour un particulier, autoliquidation pour une entreprise française assujettie ; musique sous licence, sans SACEM.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage à Chantilly ou à Senlis ?', answer: 'Le prix belge plus 190 € de déplacement et 150 € de nuit d’hôtel : 2 690 € pour la photo et la vidéo par la même personne, journée complète, soit environ 3 000 € tout compris.' },
        { question: 'Peut-on faire des photos de couple dans le parc du château de Chantilly ?', answer: 'Oui, avec l’autorisation de prise de vue du domaine, à demander à l’avance et payante ; je m’en charge si vous le souhaitez, le montant est ajouté au devis.' },
        { question: 'Venez-vous aussi à Amiens et en baie de Somme ?', answer: 'Oui, au même forfait de 190 €. La baie se photographie à marée basse ; l’heure de la séance est fixée sur l’horaire des marées.' },
      ],
    },
  },

  'limbourg-neerlandais': {
    nl: {
      intro:
        'Bruidsfotograaf en videograaf in Maastricht en Nederlands Limburg, vanuit Brussel met vaste reiskosten van 90 €: Maastricht, Valkenburg, Heerlen, Sittard-Geleen, Roermond en Venlo liggen op anderhalf tot twee uur rijden. Trouwen op het stadhuis aan de Markt of in Château St. Gerlach, een shoot op het Vrijthof of de Sint-Pietersberg, bedrijfsfilms op de Brightlands-campussen: één persoon voor foto en video, voor 2.690 € voor beide op één bruiloft, waar een Nederlandse duo-combinatie vaak boven de 4.000 € begint.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Maastricht', fact: 'het stadhuis op de Markt voor de ceremonie, het Vrijthof, de Sint Servaasbrug en het Jekerkwartier voor de bruidsfoto’s, het Kruisherenhotel voor een intieme receptie.' },
        { name: 'Valkenburg aan de Geul', fact: 'de kasteelruïne, de mergelgrotten en Château St. Gerlach: de trouwlocatie bij uitstek van Zuid-Limburg.' },
        { name: 'Heerlen en Kerkrade', fact: 'Kasteel Hoensbroek en Kasteel Erenstein voor bruiloften, de Brightlands Smart Services Campus voor bedrijfsfilms.' },
        { name: 'Sittard-Geleen', fact: 'de Markt met de Sint-Petruskerk voor de ceremonie, Kasteel Limbricht voor de receptie, de Brightlands Chemelot Campus voor corporate.' },
        { name: 'Roermond en de Maasplassen', fact: 'de Munsterkerk en het water voor de shoot, Kasteel Daelenbroeck voor het feest.' },
        { name: 'Venlo en Weert', fact: 'de Maasoevers en de landgoederen van Noord-Limburg voor landelijke bruiloften, op de rand van de zone.' },
      ],
      venuesTitle: 'Trouw- en opnamelocaties',
      venues: ['Stadhuis Maastricht (Markt)', 'Château St. Gerlach (Valkenburg)', 'Kasteel Vaalsbroek (Vaals)', 'Kasteel Wittem', 'Kruisherenhotel Maastricht', 'Kasteel Hoensbroek', 'Kasteel Limbricht', 'Winselerhof (Landgraaf)', 'Kasteel Erenstein (Kerkrade)', 'Kasteel Daelenbroeck (Herkenbosch)', 'Kasteel Elsloo', 'MECC Maastricht'],
      practicalTitle: 'Praktisch',
      practical: [
        'Reiskosten: vast bedrag van 90 € (zone 2) voor Zuid- en Midden-Limburg; Venlo en Weert liggen op de rand en worden op de offerte bevestigd. Geen kilometervergoeding.',
        'Bruiloft: hotelnacht (150 €) als het feest laat eindigt; vanuit Maastricht is terugrijden dezelfde avond mogelijk.',
        'Betaling: aanbetaling van 30 % bij reservering, saldo bij levering; prijzen inclusief Belgische btw van 21 %, geen Nederlandse btw-formaliteiten voor particulieren.',
        'Drone: toegelaten op de landgoederen en in het Heuvelland buiten de Natura 2000-gebieden; Maastricht Aachen Airport legt een no-flyzone op in het oosten.',
      ],
      faq: [
        { question: 'Wat kost een bruidsfotograaf en videograaf in Maastricht?', answer: 'De Belgische prijs plus 90 € reiskosten: 1.290 € voor foto, 1.590 € voor video, 2.690 € voor beide door dezelfde persoon, hele dag, inclusief btw.' },
        { question: 'Werkt u ook voor Nederlandse bedrijven?', answer: 'Ja: factuur met btw verlegd voor een Nederlands bedrijf met btw-nummer; teamportretten vanaf 490 € en bedrijfsfilm vanaf 990 €, exclusief btw.' },
        { question: 'Hoe werkt de aanbetaling en de levering?', answer: 'Aanbetaling van 30 % bij reservering, saldo bij levering. Preview binnen 7 dagen, volledige levering binnen 2 tot 4 weken, via een online galerij.' },
        { question: 'Komt u ook naar Roermond of Venlo?', answer: 'Roermond ja, met dezelfde 90 €. Venlo en Weert liggen op de rand van de zone en worden op de offerte bevestigd.' },
      ],
    },
    en: {
      intro:
        'Wedding photographer and videographer in Maastricht and Dutch Limburg, from Brussels with a flat travel fee of €90: Maastricht, Valkenburg, Heerlen, Sittard-Geleen and Roermond are ninety minutes to two hours away by road. Ceremonies at the town hall on the Markt or at Château St. Gerlach, sessions on the Vrijthof or the Sint-Pietersberg, corporate films on the Brightlands campuses — one person for both photo and video, working in English for the international community of Maastricht University and the Euregio, at €2,690 for both on one wedding day.',
      citiesTitle: 'Across the province',
      cities: [
        { name: 'Maastricht', fact: 'the town hall on the Markt for the ceremony, the Vrijthof, the Sint Servaasbrug and the Jeker quarter for couple photos, the Kruisherenhotel for an intimate reception.' },
        { name: 'Valkenburg aan de Geul', fact: 'the castle ruins, the marl caves and Château St. Gerlach: the wedding venue of South Limburg.' },
        { name: 'Heerlen and Kerkrade', fact: 'Hoensbroek Castle and Kasteel Erenstein for weddings, the Brightlands Smart Services Campus for corporate films.' },
        { name: 'Sittard-Geleen', fact: 'the Markt and St Peter’s church for the ceremony, Kasteel Limbricht for the reception, the Brightlands Chemelot Campus for corporate.' },
        { name: 'Roermond and the Maasplassen', fact: 'the Munsterkerk and the lakes for the session, Kasteel Daelenbroeck for the party.' },
        { name: 'Vaals and the Heuvelland', fact: 'Kasteel Vaalsbroek, the Drielandenpunt and the hills for sessions and country weddings.' },
      ],
      venuesTitle: 'Wedding and shooting venues',
      venues: ['Maastricht Town Hall (Markt)', 'Château St. Gerlach (Valkenburg)', 'Kasteel Vaalsbroek (Vaals)', 'Kasteel Wittem', 'Kruisherenhotel Maastricht', 'Hoensbroek Castle', 'Kasteel Limbricht', 'Winselerhof (Landgraaf)', 'Kasteel Erenstein (Kerkrade)', 'Kasteel Daelenbroeck (Herkenbosch)', 'Kasteel Elsloo', 'MECC Maastricht'],
      practicalTitle: 'Practical',
      practical: [
        'Travel: flat fee of €90 (zone 2) for South and Central Limburg; Venlo and Weert sit on the edge of the zone and are confirmed on the quote. No per-kilometre charge.',
        'Wedding: a hotel night (€150) is added when the party ends late; from Maastricht, driving back the same night is possible.',
        'Payment: 30% deposit on booking, balance on delivery; prices include Belgian VAT at 21%, with reverse charge for a Dutch VAT-registered company.',
        'Languages: the day is run in English and Dutch as needed; contract, quote and delivery in English.',
      ],
      faq: [
        { question: 'How much does a wedding photographer and videographer cost in Maastricht?', answer: 'The Belgian price plus €90 of travel: €1,290 for photo, €1,590 for video, €2,690 for both by the same person, full day, VAT included.' },
        { question: 'Do you work for companies and the university in Maastricht?', answer: 'Yes: team headshots from €490 and corporate films from €990 excl. VAT, invoiced with reverse charge to a Dutch VAT-registered entity. Half a day on site, LinkedIn and social formats included.' },
        { question: 'Can you get married in Maastricht as a foreigner?', answer: 'A civil wedding in the Netherlands requires at least one partner to be a Dutch resident or national; many international couples marry legally elsewhere and celebrate here. I cover the celebration the same way.' },
      ],
    },
  },

  'brabant-septentrional': {
    nl: {
      intro:
        'Bruidsfotograaf en videograaf in Noord-Brabant, vanuit Brussel met vaste reiskosten van 90 €: Eindhoven, Breda, Tilburg, ’s-Hertogenbosch, Helmond en Bergen op Zoom liggen op anderhalf tot twee uur rijden. Trouwen in Kasteel Heeze of op het Markiezenhof, een shoot op Strijp-S of in de Binnendieze, bedrijfsfilms op de High Tech Campus: één persoon voor foto en video, 2.690 € voor beide op één bruiloft, inclusief btw, met een vast bedrag aan reiskosten in plaats van kilometervergoeding.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Eindhoven', fact: 'Strijp-S en het Ketelhuis voor industriële bruidsfoto’s en feesten, het Evoluon en de High Tech Campus voor bedrijfsfilms, het Philips Stadion voor sport.' },
        { name: 'Breda', fact: 'de Grote Kerk en de Grote Markt voor de ceremonie, Kasteel Bouvigne en Landgoed Wolfslaar voor de receptie, het Mastbos voor de shoot.' },
        { name: '’s-Hertogenbosch', fact: 'de Sint-Jan en de Binnendieze per boot voor de bruidsfoto’s, Kasteel Maurick in Vught voor het feest.' },
        { name: 'Tilburg', fact: 'de Spoorzone en de LocHal voor stedelijke shoots en events, de landgoederen van Oisterwijk voor bosbruiloften.' },
        { name: 'Helmond en Sint-Oedenrode', fact: 'Kasteel Helmond, waar de gemeente trouwt, en Kasteel Henkenshage voor de receptie.' },
        { name: 'Bergen op Zoom en Roosendaal', fact: 'het Markiezenhof voor ceremonie en receptie, de Brabantse Wal voor de shoot, op een uur van Brussel.' },
      ],
      venuesTitle: 'Trouw- en opnamelocaties',
      venues: ['Kasteel Heeze', 'Kasteel Maurick (Vught)', 'Landgoed Huize Bergen (Vught)', 'Kasteel Helmond', 'Kasteel Henkenshage (Sint-Oedenrode)', 'Kasteel Nemerlaer (Haaren)', 'Kasteel Bouvigne (Breda)', 'Landgoed Wolfslaar (Breda)', 'Markiezenhof (Bergen op Zoom)', 'Ketelhuis Strijp-S (Eindhoven)', 'Evoluon (Eindhoven)', 'LocHal (Tilburg)'],
      practicalTitle: 'Praktisch',
      practical: [
        'Reiskosten: vast bedrag van 90 € (zone 2) voor Breda, Tilburg, Eindhoven, ’s-Hertogenbosch en Bergen op Zoom; Oss, Helmond en Uden liggen op de rand en worden op de offerte bevestigd.',
        'Bruiloft: hotelnacht (150 €) als het feest laat eindigt; vanuit Breda of Bergen op Zoom is terugrijden dezelfde avond mogelijk.',
        'Betaling: aanbetaling van 30 % bij reservering, saldo bij levering; prijzen inclusief Belgische btw, btw verlegd voor Nederlandse bedrijven.',
        'Drone: toegelaten op de landgoederen buiten Natura 2000; Eindhoven Airport en de vliegbases Volkel en Gilze-Rijen leggen no-flyzones op.',
      ],
      faq: [
        { question: 'Wat kost een bruidsfotograaf en videograaf in Eindhoven of Breda?', answer: 'De Belgische prijs plus 90 € reiskosten: 1.290 € foto, 1.590 € video, 2.690 € foto én video door dezelfde persoon, hele dag, inclusief btw. Een Nederlands duo foto + video begint vaak boven de 4.000 €.' },
        { question: 'Waarom één persoon voor foto en video?', answer: 'Eén stijl, één aanspreekpunt, minder volk rond het koppel en een lagere prijs. Boven de 120 gasten raad ik een tweede operator aan (optie, 490 €).' },
        { question: 'Hoe verloopt de levering?', answer: 'Preview binnen 7 dagen, volledige online galerij en film binnen 2 tot 4 weken, twee correctierondes op de montage inbegrepen.' },
      ],
    },
  },

  etranger: {
    fr: {
      intro:
        'Photographe et vidéaste pour les mariages et les tournages à l’étranger, au départ de Bruxelles : la Grèce a déjà été tournée, la Belgique, la France, le Luxembourg et les Pays-Bas sont couverts par forfait, et le reste de l’Europe se fait sur devis avec une fourchette claire. Un mariage à Santorin ou en Toscane, un tournage corporate à Lisbonne, un clip sur la Côte amalfitaine : une seule personne qui voyage avec son matériel en cabine, un devis qui détaille les vols et les nuits, et les mêmes prix de prestation qu’en Belgique.',
      citiesTitle: 'Destinations',
      cities: [
        { name: 'Grèce', fact: 'déjà tournée : Santorin, Athènes et les Cyclades, mariages en terrasse face à la caldeira et séances au cap Sounion ; vols directs depuis Bruxelles en saison.' },
        { name: 'Italie', fact: 'lacs de Côme et de Garde, Toscane, Côte amalfitaine : mariages de destination classiques, deux heures de vol, autorisations de drone strictes près des sites classés.' },
        { name: 'Espagne et Portugal', fact: 'Majorque, Ibiza, Andalousie, Algarve et Lisbonne : lumière longue, saison étendue, vols directs depuis Bruxelles et Charleroi.' },
        { name: 'France hors zones', fact: 'Provence, Côte d’Azur, Bordeaux et la Loire : accessibles en train ou en voiture, devis sur les frais réels plutôt que par zone.' },
        { name: 'Suisse et Autriche', fact: 'mariages en altitude et séminaires d’entreprise ; matériel adapté au froid et aux contre-jours de montagne.' },
        { name: 'Autres destinations', fact: 'Croatie, Maroc, Islande ou plus loin : chaque demande est étudiée, les contraintes de visa, de batteries et de drone sont vérifiées avant de s’engager.' },
      ],
      venuesTitle: 'Décors et lieux déjà tournés ou accessibles',
      venues: ['Santorin (Oia, Imerovigli)', 'Athènes et le cap Sounion', 'Lac de Côme', 'Toscane (Chianti, Val d’Orcia)', 'Côte amalfitaine', 'Provence et Luberon', 'Côte d’Azur', 'Algarve et Lisbonne', 'Majorque et Ibiza', 'Alpes suisses'],
      practicalTitle: 'Comment ça marche',
      practical: [
        'Prix : la prestation est facturée au prix de la grille (par exemple 2 690 € pour un mariage photo et vidéo par la même personne) ; s’y ajoutent les frais réels, détaillés au devis : vols, nuits d’hôtel (150 € par nuit), transferts, et une journée de déplacement forfaitaire par trajet.',
        'Fourchette indicative pour un mariage en Europe : compter entre 800 et 1 500 € de frais en plus de la prestation, selon la destination et la saison. Au-delà de l’Europe, sur devis.',
        'Matériel : boîtiers, optiques, batteries et drone voyagent en cabine ; une sauvegarde est faite chaque soir sur deux supports. Le drone n’est utilisé que là où la réglementation locale et le lieu l’autorisent.',
        'Timing : arrivée la veille au plus tard, repérage sur place, retour le lendemain. Aperçu photo sous 7 jours, livraison complète sous 2 à 4 semaines, comme en Belgique.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste pour un mariage à l’étranger ?', answer: 'Le prix de la grille belge plus les frais réels : pour un mariage en Europe, comptez 2 690 € de prestation photo et vidéo plus 800 à 1 500 € de vols, nuits et déplacement, détaillés ligne par ligne sur le devis.' },
        { question: 'Dans quels pays avez-vous déjà tourné ?', answer: 'Belgique, France, Pays-Bas, Luxembourg et Grèce. Les autres destinations sont possibles ; le devis tient compte des contraintes locales.' },
        { question: 'Pouvez-vous utiliser le drone à l’étranger ?', answer: 'Dans l’Union européenne, l’enregistrement d’opérateur belge est valable partout ; les zones interdites et les règles des sites restent locales, et sont vérifiées avant le départ. L’option est reportée ou remboursée si le vol est impossible.' },
        { question: 'Faut-il réserver plus tôt pour un mariage à l’étranger ?', answer: 'Oui, idéalement six à douze mois avant, pour bloquer les vols à bon prix et la date. L’acompte de 30 % réserve la date ; les frais de voyage sont facturés sur justificatifs.' },
      ],
    },
    nl: {
      intro:
        'Fotograaf en videograaf voor huwelijken en opnames in het buitenland, vanuit Brussel: Griekenland is al gedraaid, België, Frankrijk, Luxemburg en Nederland vallen onder een vaste verplaatsingskost, en de rest van Europa gebeurt op offerte met een duidelijke vork. Een huwelijk op Santorini of in Toscane, een bedrijfsopname in Lissabon, een clip aan de Amalfikust: één persoon die reist met het materiaal als handbagage, een offerte die vluchten en nachten detailleert, en dezelfde prijzen voor de prestatie als in België.',
      citiesTitle: 'Bestemmingen',
      cities: [
        { name: 'Griekenland', fact: 'al gedraaid: Santorini, Athene en de Cycladen, huwelijken op een terras boven de caldera en shoots aan Kaap Sounion; rechtstreekse vluchten vanuit Brussel in het seizoen.' },
        { name: 'Italië', fact: 'Comomeer en Gardameer, Toscane, Amalfikust: klassieke destination weddings, twee uur vliegen, strenge droneregels bij beschermde sites.' },
        { name: 'Spanje en Portugal', fact: 'Mallorca, Ibiza, Andalusië, Algarve en Lissabon: lang licht, lang seizoen, rechtstreekse vluchten vanuit Brussel en Charleroi.' },
        { name: 'Frankrijk buiten de zones', fact: 'Provence, Côte d’Azur, Bordeaux en de Loire: bereikbaar met trein of auto, offerte op werkelijke kosten in plaats van per zone.' },
        { name: 'Zwitserland en Oostenrijk', fact: 'huwelijken in de bergen en bedrijfsseminaries; materiaal aangepast aan kou en tegenlicht.' },
        { name: 'Andere bestemmingen', fact: 'Kroatië, Marokko, IJsland of verder: elke vraag wordt bekeken, visum-, batterij- en dronebeperkingen worden vooraf gecheckt.' },
      ],
      venuesTitle: 'Decors en locaties, al gedraaid of bereikbaar',
      venues: ['Santorini (Oia, Imerovigli)', 'Athene en Kaap Sounion', 'Comomeer', 'Toscane (Chianti, Val d’Orcia)', 'Amalfikust', 'Provence en Luberon', 'Côte d’Azur', 'Algarve en Lissabon', 'Mallorca en Ibiza', 'Zwitserse Alpen'],
      practicalTitle: 'Hoe het werkt',
      practical: [
        'Prijs: de prestatie wordt gefactureerd aan de lijstprijs (bijvoorbeeld 2.690 € voor een huwelijk met foto en video door dezelfde persoon); daarbovenop komen de werkelijke kosten, gedetailleerd op de offerte: vluchten, hotelnachten (150 € per nacht), transfers en een forfaitaire reisdag per traject.',
        'Indicatieve vork voor een huwelijk in Europa: reken op 800 tot 1.500 € kosten boven op de prestatie, afhankelijk van bestemming en seizoen. Buiten Europa op offerte.',
        'Materiaal: camera’s, lenzen, batterijen en drone reizen als handbagage; elke avond een back-up op twee dragers. De drone wordt alleen gebruikt waar de lokale regels en de locatie het toelaten.',
        'Timing: aankomst ten laatste de dag voordien, verkenning ter plaatse, terugkeer de dag erna. Preview binnen 7 dagen, volledige levering binnen 2 tot 4 weken, zoals in België.',
      ],
      faq: [
        { question: 'Wat kost een fotograaf en videograaf voor een huwelijk in het buitenland?', answer: 'De Belgische lijstprijs plus de werkelijke kosten: voor een huwelijk in Europa 2.690 € voor foto en video plus 800 tot 1.500 € vluchten, nachten en reisdagen, lijn per lijn op de offerte.' },
        { question: 'In welke landen hebt u al gedraaid?', answer: 'België, Frankrijk, Nederland, Luxemburg en Griekenland. Andere bestemmingen zijn mogelijk; de offerte houdt rekening met de lokale beperkingen.' },
        { question: 'Mag de drone mee naar het buitenland?', answer: 'In de Europese Unie geldt de Belgische operatorregistratie overal; no-flyzones en regels van de locatie blijven lokaal en worden vóór vertrek gecheckt. De optie wordt verplaatst of terugbetaald als vliegen onmogelijk is.' },
      ],
    },
    en: {
      intro:
        'Destination wedding photographer and videographer based in Brussels: Greece has already been shot, Belgium, France, Luxembourg and the Netherlands are covered by flat travel fees, and the rest of Europe is quoted with a clear range. A wedding in Santorini or Tuscany, a corporate shoot in Lisbon, a music video on the Amalfi Coast — one person who travels with the gear as carry-on, a quote that itemises flights and nights, and the same service prices as in Belgium, with no destination mark-up on the work itself.',
      citiesTitle: 'Destinations',
      cities: [
        { name: 'Greece', fact: 'already shot: Santorini, Athens and the Cyclades, weddings on a terrace above the caldera and sessions at Cape Sounion; direct flights from Brussels in season.' },
        { name: 'Italy', fact: 'Lake Como and Lake Garda, Tuscany, the Amalfi Coast: classic destination weddings, two hours by air, strict drone rules near listed sites.' },
        { name: 'Spain and Portugal', fact: 'Mallorca, Ibiza, Andalusia, the Algarve and Lisbon: long light, long season, direct flights from Brussels and Charleroi.' },
        { name: 'France beyond the zones', fact: 'Provence, the Riviera, Bordeaux and the Loire: reachable by train or car, quoted on actual costs rather than by zone.' },
        { name: 'Switzerland and Austria', fact: 'mountain weddings and corporate retreats; gear suited to cold and alpine backlight.' },
        { name: 'Other destinations', fact: 'Croatia, Morocco, Iceland or further: every request is assessed, and visa, battery and drone constraints are checked before committing.' },
      ],
      venuesTitle: 'Settings already shot or within reach',
      venues: ['Santorini (Oia, Imerovigli)', 'Athens and Cape Sounion', 'Lake Como', 'Tuscany (Chianti, Val d’Orcia)', 'Amalfi Coast', 'Provence and the Luberon', 'French Riviera', 'Algarve and Lisbon', 'Mallorca and Ibiza', 'Swiss Alps'],
      practicalTitle: 'How it works',
      practical: [
        'Price: the service is billed at the grid price (for example €2,690 for a wedding with photo and video by the same person); actual costs are added and itemised on the quote: flights, hotel nights (€150 per night), transfers, and a flat travel day per leg.',
        'Indicative range for a wedding in Europe: expect €800 to €1,500 of costs on top of the service, depending on destination and season. Beyond Europe, on quote.',
        'Gear: bodies, lenses, batteries and drone travel as carry-on; a backup is made every evening on two drives. The drone is only flown where local rules and the venue allow it.',
        'Timing: arrival the day before at the latest, location visit on site, return the following day. Photo preview within 7 days, full delivery within 2 to 4 weeks, as in Belgium.',
      ],
      faq: [
        { question: 'How much does a destination wedding photographer and videographer cost?', answer: 'The Belgian grid price plus actual costs: for a wedding in Europe, €2,690 for photo and video plus €800 to €1,500 of flights, nights and travel days, itemised line by line on the quote.' },
        { question: 'Which countries have you already worked in?', answer: 'Belgium, France, the Netherlands, Luxembourg and Greece. Other destinations are possible; the quote accounts for local constraints.' },
        { question: 'Can you fly the drone abroad?', answer: 'Within the European Union, the Belgian operator registration is valid everywhere; no-fly zones and venue rules remain local and are checked before departure. The option is rescheduled or refunded if flying is impossible.' },
        { question: 'How far ahead should we book a destination wedding?', answer: 'Ideally six to twelve months, to lock the date and book flights at a good price. The 30% deposit secures the date; travel costs are invoiced against receipts.' },
      ],
    },
  },
};
