import type { SiteLocale } from './locale';
import type { RegionContent } from './region-content';

/**
 * Phase 3 du chantier 5 : Champagne, Paris – Île-de-France, et la Randstad
 * (Zélande, Hollande-Méridionale, Utrecht, Hollande-Septentrionale). Marchés
 * saturés : ces pages ne visent jamais « photographe mariage Paris » ou
 * « bruidsfotograaf Amsterdam », mais la longue traîne (châteaux des
 * Yvelines, mairies d'arrondissement, landgoederen, un prestataire belge qui
 * vient avec un forfait fixe) et les couples ou entreprises qui cherchent
 * précisément un prestataire basé à Bruxelles.
 */
export const REGION_CONTENT_PHASE_3: Readonly<Record<string, Partial<Record<SiteLocale, RegionContent>>>> = {
  champagne: {
    fr: {
      intro:
        'Photographe et vidéaste en Champagne, depuis Bruxelles avec un forfait de déplacement fixe de 190 € : Reims est à deux heures et demie de route par l’A26, Épernay, Châlons-en-Champagne, Hautvillers et la Montagne de Reims un peu au-delà. Mariages dans les maisons de champagne et les châteaux des coteaux, séances dans les vignes de Verzenay ou sur l’avenue de Champagne, films d’entreprise pour les maisons, les coopératives et les vignerons : une seule personne pour la photo et la vidéo, aux prix de la grille belge, avec une facture intracommunautaire sans formalité pour vous.',
      citiesTitle: 'Dans la région',
      cities: [
        { name: 'Reims', fact: 'la cathédrale du sacre et l’hôtel de ville pour le civil, les caves de Pommery, Taittinger ou Ruinart pour les réceptions, la Villa Demoiselle et Les Crayères pour les mariages de prestige.' },
        { name: 'Épernay', fact: 'l’avenue de Champagne et ses maisons, le Château Perrier, les coteaux de Hautvillers : la sortie de mairie la plus champenoise qui soit.' },
        { name: 'Hautvillers et la Montagne de Reims', fact: 'le village de Dom Pérignon, les vignes de Verzenay et son phare, les lodges des coteaux pour les mariages de week-end.' },
        { name: 'Châlons-en-Champagne', fact: 'l’hôtel de ville, le Jard et les canaux pour les photos de couple ; la préfecture et ses institutions pour le corporate.' },
        { name: 'Troyes', fact: 'les maisons à pans de bois du bouchon de champagne et la cathédrale, à trois heures de Bruxelles, confirmée sur devis.' },
        { name: 'Vallée de la Marne', fact: 'Château-Thierry, les domaines des Essômes et de la Marjolaine, au bord de la zone 3.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Domaine Les Crayères (Reims)', 'Villa Demoiselle (Reims)', 'Château de Sacy', 'Château de Rilly (Rilly-la-Montagne)', 'Royal Champagne (Champillon)', 'Château de Boursault', 'Château de Pierry', 'Château de Juvigny', 'Domaine du Chalet (Chigny-les-Roses)', 'Château de la Marjolaine (Essômes-sur-Marne)', 'Phare de Verzenay', 'Cathédrale et place Royale de Reims'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 190 € (zone 3) pour Reims, Épernay, Châlons et la Montagne de Reims ; Troyes et la vallée de la Marne sont confirmés sur devis.',
        'Mariage : nuit d’hôtel (150 €) ajoutée systématiquement, la soirée finissant tard à deux heures et demie de Bruxelles ; une séance couple dans les vignes le lendemain matin est possible en heure supplémentaire.',
        'Maisons de champagne : les caves et les domaines ont leurs règles de prise de vue (flash, zones), fixées avec le lieu au repérage.',
        'Facturation : facture belge avec TVA pour un particulier, autoliquidation pour une maison ou une coopérative assujettie ; musique sous licence, sans déclaration SACEM.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage à Reims ou à Épernay ?', answer: 'Le prix belge plus 190 € de déplacement et 150 € de nuit d’hôtel : 2 690 € pour la photo et la vidéo par la même personne, journée complète, soit environ 3 030 € tout compris, là où la photo seule dépasse souvent 2 000 € en Champagne.' },
        { question: 'Faites-vous des films pour les maisons de champagne et les vignerons ?', answer: 'Oui, en formule corporate : une demi-journée au domaine, 990 € HTVA pour un film d’une à deux minutes avec formats réseaux, 1 390 € avec les portraits et les photos du domaine ; vendanges et pressurage sur devis.' },
        { question: 'Peut-on faire une séance couple dans les vignes ?', answer: 'Oui, les coteaux de Verzenay, Hautvillers ou Aÿ se prêtent très bien à une séance au coucher du soleil, en formule lifestyle ou en heure supplémentaire le lendemain du mariage.' },
      ],
    },
  },

  'paris-ile-de-france': {
    fr: {
      intro:
        'Photographe et vidéaste à Paris et en Île-de-France, depuis Bruxelles avec un forfait de déplacement fixe de 290 € : trois heures de route, ou une heure et demie de train pour une séance. Pas de page « photographe mariage Paris » de plus : ce qui est proposé ici, c’est un mariage à la mairie d’arrondissement puis dans un château des Yvelines ou de Seine-et-Marne, une séance couple au Trocadéro à six heures du matin, un tournage corporate à La Défense ou un reportage pour une entreprise belge en déplacement, le tout par une seule personne, aux prix de la grille belge, sous la médiane parisienne.',
      citiesTitle: 'À Paris et autour',
      cities: [
        { name: 'Paris, les mairies d’arrondissement', fact: 'le civil se tient à la mairie de l’arrondissement de résidence ; la sortie se photographie sur le parvis puis dans le quartier : Montmartre, le Palais-Royal, les quais, le pont Alexandre-III, Bir-Hakeim.' },
        { name: 'Versailles et Saint-Germain-en-Laye', fact: 'l’hôtel de ville de Versailles et les jardins du château pour les photos de couple, la terrasse de Saint-Germain, les domaines des Yvelines pour la réception.' },
        { name: 'Yvelines et vallée de Chevreuse', fact: 'Château de Neuville, Villiers-le-Mahieu, Breteuil, l’abbaye des Vaux-de-Cernay : les lieux de mariage à une heure de Paris, sans le prix parisien.' },
        { name: 'Seine-et-Marne', fact: 'Vaux-le-Vicomte et le château de Ferrières, Fontainebleau et sa forêt, les fermes de la Brie pour les mariages champêtres.' },
        { name: 'La Défense, Saint-Denis, Boulogne', fact: 'sièges, tours et studios pour les portraits d’équipe et les films d’entreprise ; le Stade de France et Paris La Défense Arena pour le sport et les événements.' },
        { name: 'Val-d’Oise et Oise voisine', fact: 'Champlâtreux, Méry-sur-Oise, Royaumont, et Chantilly à trente minutes, couverts par la page Picardie – Oise au forfait de 190 €.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Château de Vaux-le-Vicomte (Maincy)', 'Château de Ferrières', 'Château de Neuville (Gambais)', 'Château de Villiers-le-Mahieu', 'Château de Breteuil', 'Abbaye des Vaux-de-Cernay', 'Château de Champlâtreux', 'Château de Santeny', 'Château de Méry-sur-Oise', 'Pavillon Dauphine et Pré Catelan (bois de Boulogne)', 'Salons Hoche et Palais Brongniart', 'Mairies d’arrondissement, Trocadéro, Palais-Royal'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 290 € (zone 4) pour Paris et toute l’Île-de-France ; aucune majoration « Paris » sur la prestation elle-même.',
        'Mariage : nuit d’hôtel (150 €) ajoutée, la soirée finissant tard à trois heures de Bruxelles ; une séance couple au lever du soleil le lendemain au Trocadéro ou au Louvre est possible en heure supplémentaire.',
        'Autorisations : les monuments nationaux et les parcs (Versailles, Vaux-le-Vicomte, Fontainebleau) demandent une autorisation de prise de vue, parfois payante ; le drone est interdit sur Paris intra-muros et strictement encadré en petite couronne.',
        'Facturation : facture belge avec TVA pour un particulier, autoliquidation pour une entreprise française assujettie ; musique sous licence, sans SACEM.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage venu de Bruxelles pour un mariage en Île-de-France ?', answer: 'Le prix belge plus 290 € de déplacement et 150 € de nuit d’hôtel : 2 690 € pour la photo et la vidéo par la même personne, journée complète, soit environ 3 130 € tout compris, là où la photo seule démarre souvent à 2 500 € à Paris.' },
        { question: 'Faites-vous les séances couple à Paris sans mariage ?', answer: 'Oui, en formule lifestyle, idéalement tôt le matin au Trocadéro, au Palais-Royal ou sur les quais : 250 € pour une heure trente de photos, 640 € avec un court film, plus le déplacement ; se combine bien avec une demande en mariage.' },
        { question: 'Couvrez-vous un événement d’entreprise belge organisé à Paris ?', answer: 'Oui, c’est un cas fréquent : reportage et aftermovie d’un salon, d’une conférence ou d’un dîner, facturés en Belgique, sans formalité française. Prix hors TVA sur la page tarifs.' },
      ],
    },
    en: {
      intro:
        'Photographer and videographer for weddings, elopements and corporate shoots in Paris and the Île-de-France, based in Brussels, with a flat travel fee of €290: three hours by road, or ninety minutes by train for a session. This is not another “Paris wedding photographer” page: what is offered here is an elopement or symbolic ceremony followed by a session at the Trocadéro at six in the morning, a wedding in a château of the Yvelines or Seine-et-Marne, or a corporate shoot at La Défense, all by one person at Belgian prices, well below the Paris median, in English.',
      citiesTitle: 'In Paris and around',
      cities: [
        { name: 'Paris', fact: 'a legal wedding requires residence in the arrondissement, so most international couples hold a symbolic ceremony; photos at Montmartre, the Palais-Royal, the quays, Pont Alexandre-III and Bir-Hakeim, early morning before the crowds.' },
        { name: 'Versailles and Saint-Germain-en-Laye', fact: 'the gardens of the palace for couple photos, the terrace of Saint-Germain, the estates of the Yvelines for the reception.' },
        { name: 'Yvelines and the Chevreuse valley', fact: 'Château de Neuville, Villiers-le-Mahieu, Breteuil, the abbey of Vaux-de-Cernay: wedding venues an hour from Paris without Paris prices.' },
        { name: 'Seine-et-Marne', fact: 'Vaux-le-Vicomte and Château de Ferrières, Fontainebleau and its forest, the farms of the Brie for country weddings.' },
        { name: 'La Défense, Saint-Denis, Boulogne', fact: 'headquarters, towers and studios for team headshots and corporate films; the Stade de France and Paris La Défense Arena for sport and events.' },
        { name: 'Val-d’Oise and the Oise', fact: 'Champlâtreux, Méry-sur-Oise, Royaumont, and Chantilly thirty minutes away, covered by the Picardy – Oise page at €190.' },
      ],
      venuesTitle: 'Reception and shooting venues',
      venues: ['Château de Vaux-le-Vicomte (Maincy)', 'Château de Ferrières', 'Château de Neuville (Gambais)', 'Château de Villiers-le-Mahieu', 'Château de Breteuil', 'Abbaye des Vaux-de-Cernay', 'Château de Champlâtreux', 'Château de Santeny', 'Château de Méry-sur-Oise', 'Pavillon Dauphine and Pré Catelan (Bois de Boulogne)', 'Salons Hoche and Palais Brongniart', 'Trocadéro, Palais-Royal, the quays'],
      practicalTitle: 'Practical',
      practical: [
        'Travel: flat fee of €290 (zone 4) for Paris and the whole Île-de-France; no “Paris” mark-up on the service itself.',
        'Wedding: a hotel night (€150) is added, as the party ends late three hours from Brussels; a sunrise couple session the next morning at the Trocadéro or the Louvre is possible as an extra hour.',
        'Permits: national monuments and parks (Versailles, Vaux-le-Vicomte, Fontainebleau) require a photography permit, sometimes paid; drones are forbidden over Paris and tightly restricted in the inner suburbs.',
        'Invoicing: Belgian invoice with VAT for private clients, reverse charge for a VAT-registered company; licensed music, shareable on social media.',
      ],
      faq: [
        { question: 'How much does a Brussels-based photographer and videographer cost for a wedding in Paris?', answer: 'The Belgian price plus €290 of travel and a €150 hotel night: €2,690 for photo and video by the same person, full day, about €3,130 all in, where photography alone often starts at €2,500 in Paris.' },
        { question: 'Do you shoot elopements and proposals in Paris?', answer: 'Yes. A proposal or couple session is a lifestyle booking, ideally at dawn at the Trocadéro or the Palais-Royal: €250 for ninety minutes of photos, €640 with a short film, plus travel. An elopement with a symbolic ceremony is quoted as a half-day wedding.' },
        { question: 'Can we legally marry in Paris as foreigners?', answer: 'A civil wedding in France requires one partner to have lived in the arrondissement for at least a month; most international couples marry legally at home and hold a symbolic ceremony in Paris. I cover it the same way as a wedding.' },
      ],
    },
  },

  zelande: {
    nl: {
      intro:
        'Bruidsfotograaf en videograaf in Zeeland, vanuit Brussel met vaste reiskosten van 90 €: Terneuzen en Hulst liggen op een uur, Middelburg, Vlissingen, Goes en Veere op anderhalf uur, Zierikzee en Renesse iets verder. Een bruiloft in Kasteel Westhove of Slot Moermond, een strandshoot in Domburg of Cadzand, trouwen in de Abdij van Middelburg, een bedrijfsfilm in de haven van Vlissingen: één persoon voor foto en video, 2.690 € voor beide op één dag inclusief btw, met een vast bedrag aan reiskosten in plaats van kilometervergoeding.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Middelburg', fact: 'het stadhuis op de Markt en de Abdij voor de ceremonie, de Lange Jan en de grachten voor de bruidsfoto’s, Kasteel Ter Hooge voor de receptie.' },
        { name: 'Veere en Domburg', fact: 'de Grote Kerk en de Campveerse Toren aan het Veerse Meer, het strand en de duinen van Domburg bij zonsondergang.' },
        { name: 'Vlissingen', fact: 'de boulevard en het Arsenaal voor shoots, de haven en de scheepswerven voor bedrijfsfilms.' },
        { name: 'Goes en de Bevelanden', fact: 'de Grote Markt en de stadshaven voor de ceremonie, de boomgaarden en dijken voor de shoot.' },
        { name: 'Zierikzee en Schouwen-Duiveland', fact: 'de havens en de Dikke Toren, Slot Moermond in Renesse en Slot Haamstede voor het feest, de stranden van Renesse voor de shoot.' },
        { name: 'Zeeuws-Vlaanderen', fact: 'Terneuzen, Hulst en Cadzand-Bad op een uur van Brussel: de dichtstbijzijnde Nederlandse stranden, met Belgische prijzen.' },
      ],
      venuesTitle: 'Trouw- en opnamelocaties',
      venues: ['Abdij van Middelburg', 'Kasteel Westhove (Oostkapelle)', 'Slot Moermond (Renesse)', 'Slot Haamstede', 'Kasteel Ter Hooge (Middelburg)', 'Grote Kerk Veere', 'De Campveerse Toren (Veere)', 'Badhotel Domburg', 'Strand Cadzand-Bad', 'Oosterscheldekering en Deltawerken', 'Lange Jan (Middelburg)', 'Boulevard van Vlissingen'],
      practicalTitle: 'Praktisch',
      practical: [
        'Reiskosten: vast bedrag van 90 € (zone 2) voor heel Zeeland; Zeeuws-Vlaanderen ligt op een uur van Brussel.',
        'Bruiloft: hotelnacht (150 €) als het feest laat eindigt op Walcheren of Schouwen; vanuit Zeeuws-Vlaanderen rijd ik dezelfde avond terug.',
        'Betaling: aanbetaling van 30 % bij reservering, saldo bij levering; prijzen inclusief Belgische btw, btw verlegd voor Nederlandse bedrijven.',
        'Drone: toegelaten op de stranden en dijken buiten Natura 2000 en de broedseizoenen; de Oosterschelde en het Veerse Meer hebben beschermde zones. Wind is de enige echte beperking.',
      ],
      faq: [
        { question: 'Wat kost een bruidsfotograaf en videograaf in Zeeland?', answer: 'De Belgische prijs plus 90 € reiskosten: 1.290 € foto, 1.590 € video, 2.690 € foto én video door dezelfde persoon, hele dag, inclusief btw.' },
        { question: 'Doet u strandbruiloften in Domburg of Cadzand?', answer: 'Ja. Strand, wind en tegenlicht vragen een eigen aanpak: de shoot plannen we rond zonsondergang en de ceremonie met de rug naar de zon. Een strandpaviljoen als uitwijk is altijd afgesproken.' },
        { question: 'Hoe snel is de levering?', answer: 'Preview binnen 7 dagen, volledige online galerij en film binnen 2 tot 4 weken, twee correctierondes op de montage inbegrepen.' },
      ],
    },
  },

  'hollande-meridionale': {
    nl: {
      intro:
        'Bruidsfotograaf en videograaf in Rotterdam, Den Haag, Delft en Leiden, vanuit Brussel met vaste reiskosten van 190 €: Rotterdam ligt op anderhalf uur, Den Haag en Leiden op twee uur. Geen zoveelste « bruidsfotograaf Rotterdam »-pagina: wel een Belgische fotograaf én videograaf in één persoon, voor koppels die trouwen in Kasteel de Wittenburg, op de Kop van Zuid of in het Prinsenhof van Delft, en voor Belgische bedrijven met een event in Rotterdam of Den Haag — 2.690 € voor foto en video op één bruiloft, inclusief btw.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Rotterdam', fact: 'het stadhuis aan de Coolsingel voor de ceremonie, de Erasmusbrug, de Markthal en Hotel New York voor de bruidsfoto’s, de Van Nelle Fabriek en SS Rotterdam voor het feest, De Kuip voor sport.' },
        { name: 'Den Haag en Scheveningen', fact: 'het Vredespaleis en het Binnenhof voor de foto’s, het Kurhaus en het strand voor de receptie, de ministeries en internationale instellingen voor corporate.' },
        { name: 'Delft', fact: 'het stadhuis op de Markt en de Oude Kerk, de grachten en het Prinsenhof: een stad op maat van een bruiloft te voet.' },
        { name: 'Leiden', fact: 'de Burcht, de Hooglandse Kerk en de grachten voor de shoot, de universiteit en het Bio Science Park voor bedrijfsfilms.' },
        { name: 'Wassenaar en Voorschoten', fact: 'Kasteel de Wittenburg en Kasteel Duivenvoorde, de landgoederen tussen Den Haag en Leiden.' },
        { name: 'Gouda en Dordrecht', fact: 'het gotische stadhuis van Gouda en de Waag, de Grote Kerk en de havens van Dordrecht voor ceremonie en shoot.' },
      ],
      venuesTitle: 'Trouw- en opnamelocaties',
      venues: ['Kasteel de Wittenburg (Wassenaar)', 'Kasteel Duivenvoorde (Voorschoten)', 'Landgoed Te Werve (Rijswijk)', 'Kasteel Keukenhof (Lisse)', 'Grand Hotel Amrâth Kurhaus (Scheveningen)', 'Hotel New York (Rotterdam)', 'Van Nelle Fabriek (Rotterdam)', 'SS Rotterdam', 'Museum Prinsenhof (Delft)', 'Hooglandse Kerk (Leiden)', 'Stadhuis Gouda', 'Euromast en Erasmusbrug'],
      practicalTitle: 'Praktisch',
      practical: [
        'Reiskosten: vast bedrag van 190 € (zone 3) voor Rotterdam, Den Haag, Delft, Leiden, Gouda en Dordrecht.',
        'Bruiloft: hotelnacht (150 €) als het feest laat eindigt; vanuit Rotterdam of Dordrecht is terugrijden dezelfde avond mogelijk.',
        'Betaling: aanbetaling van 30 % bij reservering, saldo bij levering; prijzen inclusief Belgische btw, btw verlegd voor Nederlandse bedrijven.',
        'Drone: verboden boven Rotterdam-centrum, de haven en rond Rotterdam The Hague Airport; mogelijk op landgoederen en aan de kust buiten Natura 2000.',
      ],
      faq: [
        { question: 'Wat kost een bruidsfotograaf en videograaf in Rotterdam of Den Haag?', answer: 'De Belgische prijs plus 190 € reiskosten: 2.690 € voor foto én video door dezelfde persoon, hele dag, inclusief btw. Een Nederlands duo foto + video begint vaak boven de 4.000 €.' },
        { question: 'Waarom een fotograaf uit Brussel voor een bruiloft in de Randstad?', answer: 'Eén persoon voor foto en video, een vaste prijs met reiskosten in plaats van kilometervergoeding, en een stijl die u vooraf kunt zien in de projecten. Voor Belgisch-Nederlandse koppels ook: dezelfde fotograaf voor de familie aan beide kanten van de grens.' },
        { question: 'Werkt u voor Belgische bedrijven met een event in Rotterdam of Den Haag?', answer: 'Ja, dat is een frequent geval: reportage en aftermovie van een beurs, congres of diner, Belgisch gefactureerd zonder Nederlandse formaliteiten. Prijzen exclusief btw op de tarievenpagina.' },
      ],
    },
  },

  utrecht: {
    nl: {
      intro:
        'Bruidsfotograaf en videograaf in Utrecht en op de Heuvelrug, vanuit Brussel met vaste reiskosten van 190 €: Utrecht ligt op twee uur rijden, Amersfoort, Zeist en Doorn een kwartier verder. Een bruiloft in Kasteel de Haar of Slot Zeist, een shoot op de werven van de Oudegracht of in de bossen van de Heuvelrug, een bedrijfsfilm op het Utrecht Science Park: één persoon voor foto en video, 2.690 € voor beide op één dag inclusief btw, met een vast bedrag aan reiskosten.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Utrecht', fact: 'het stadhuis en de Domkerk voor de ceremonie, de werven van de Oudegracht en de Domtoren voor de bruidsfoto’s, de Winkel van Sinkel en TivoliVredenburg voor het feest.' },
        { name: 'Haarzuilens en Vleuten', fact: 'Kasteel de Haar, het grootste kasteel van Nederland, met zijn park en zijn trouwzalen.' },
        { name: 'Zeist en Driebergen', fact: 'Slot Zeist voor de ceremonie, Landgoed de Horst en de bossen van de Heuvelrug voor de shoot.' },
        { name: 'Amersfoort', fact: 'de Koppelpoort, de Muurhuizen en de Onze-Lieve-Vrouwetoren: een middeleeuws centrum op maat van een bruiloft te voet.' },
        { name: 'Baarn en Soest', fact: 'Paleis Soestdijk en Kasteel Groeneveld voor recepties en events, de Lage Vuursche voor bosshoots.' },
        { name: 'Amerongen en Doorn', fact: 'Kasteel Amerongen en Huis Doorn, de uiterwaarden van de Nederrijn voor shoots bij valavond.' },
      ],
      venuesTitle: 'Trouw- en opnamelocaties',
      venues: ['Kasteel de Haar (Haarzuilens)', 'Slot Zeist', 'Kasteel Heemstede (Houten)', 'Landgoed de Horst (Driebergen)', 'Paleis Soestdijk (Baarn)', 'Kasteel Groeneveld (Baarn)', 'Kasteel Amerongen', 'Huis Doorn', 'Fort bij Vechten (Bunnik)', 'Winkel van Sinkel (Utrecht)', 'TivoliVredenburg', 'Koppelpoort (Amersfoort)'],
      practicalTitle: 'Praktisch',
      practical: [
        'Reiskosten: vast bedrag van 190 € (zone 3) voor de hele provincie Utrecht.',
        'Bruiloft: hotelnacht (150 €) als het feest laat eindigt, wat ook een shoot in de ochtendnevel op de Heuvelrug mogelijk maakt.',
        'Betaling: aanbetaling van 30 % bij reservering, saldo bij levering; prijzen inclusief Belgische btw, btw verlegd voor Nederlandse bedrijven.',
        'Drone: mogelijk op de landgoederen en de Heuvelrug buiten Natura 2000; de vliegbasis Soesterberg en de stad Utrecht leggen beperkingen op.',
      ],
      faq: [
        { question: 'Wat kost een bruidsfotograaf en videograaf in Utrecht?', answer: 'De Belgische prijs plus 190 € reiskosten: 2.690 € voor foto én video door dezelfde persoon, hele dag, inclusief btw.' },
        { question: 'Werkt u in Kasteel de Haar?', answer: 'Kasteel de Haar ontvangt ceremonies en recepties en laat fotografen toe volgens zijn huisregels; de verkenning gebeurt met de locatie enkele weken vooraf.' },
        { question: 'Hoe verloopt de levering?', answer: 'Preview binnen 7 dagen, volledige online galerij en film binnen 2 tot 4 weken, twee correctierondes op de montage inbegrepen.' },
      ],
    },
  },

  'hollande-septentrionale': {
    nl: {
      intro:
        'Bruidsfotograaf en videograaf in Amsterdam, Haarlem en Noord-Holland, vanuit Brussel met vaste reiskosten van 190 €: Haarlem en Amsterdam liggen op twee uur rijden, Alkmaar en het Gooi iets verder. Geen zoveelste « bruidsfotograaf Amsterdam »-pagina: wel een Belgische fotograaf én videograaf in één persoon, voor koppels die trouwen op de grachten, in Huize Frankendael of in het Muiderslot, voor internationale koppels en voor Belgische bedrijven met een event op de Zuidas of in de RAI — 2.690 € voor foto en video op één bruiloft, inclusief btw.',
      citiesTitle: 'In de provincie',
      cities: [
        { name: 'Amsterdam', fact: 'het stadhuis en de trouwlocaties van de gemeente voor de ceremonie, de grachtengordel, de Jordaan en het Vondelpark voor de bruidsfoto’s, de Zuidas en de RAI voor corporate, de Johan Cruijff ArenA voor sport.' },
        { name: 'Haarlem', fact: 'het stadhuis op de Grote Markt en de Sint-Bavo voor de ceremonie, de hofjes en het Spaarne voor de shoot, de Philharmonie voor het feest.' },
        { name: 'Bloemendaal en Zandvoort', fact: 'de strandpaviljoens en de duinen voor strandbruiloften en shoots bij zonsondergang, Duin & Kruidberg voor de receptie.' },
        { name: 'Het Gooi', fact: 'Naarden-Vesting en zijn Grote Kerk, Laren en Hilversum, de heide en de villa’s voor bruiloften in het groen.' },
        { name: 'Muiden en de Zaanstreek', fact: 'het Muiderslot voor een kasteelbruiloft, de Zaanse Schans voor een shoot tussen de molens.' },
        { name: 'Alkmaar, Hoorn, Enkhuizen', fact: 'de kaasmarkt en de Waag, de havens van het IJsselmeer en de historische centra voor shoots en ceremonies.' },
      ],
      venuesTitle: 'Trouw- en opnamelocaties',
      venues: ['Huize Frankendael (Amsterdam)', 'Muiderslot', 'Landgoed Duin & Kruidberg (Santpoort)', 'Posthoornkerk (Amsterdam)', 'Beurs van Berlage', 'Het Scheepvaartmuseum', 'Rijksmuseum (events)', 'Amstel Hotel', 'Grote Kerk Naarden', 'Philharmonie Haarlem', 'Zaanse Schans', 'Strandpaviljoens van Bloemendaal'],
      practicalTitle: 'Praktisch',
      practical: [
        'Reiskosten: vast bedrag van 190 € (zone 3) voor Amsterdam, Haarlem, het Gooi en de kust; Alkmaar, Hoorn en Enkhuizen worden op de offerte bevestigd.',
        'Bruiloft: hotelnacht (150 €) als het feest laat eindigt; vanuit Haarlem of Amsterdam is terugrijden dezelfde avond mogelijk na een middagfeest.',
        'Betaling: aanbetaling van 30 % bij reservering, saldo bij levering; prijzen inclusief Belgische btw, btw verlegd voor Nederlandse bedrijven.',
        'Drone: verboden boven Amsterdam en rond Schiphol; mogelijk op de landgoederen, in het Gooi en aan de kust buiten Natura 2000.',
      ],
      faq: [
        { question: 'Wat kost een bruidsfotograaf en videograaf in Amsterdam of Haarlem?', answer: 'De Belgische prijs plus 190 € reiskosten: 2.690 € voor foto én video door dezelfde persoon, hele dag, inclusief btw. Een Amsterdams duo foto + video begint vaak boven de 4.000 €.' },
        { question: 'Werkt u voor Belgische bedrijven met een event in Amsterdam?', answer: 'Ja, dat is een frequent geval: reportage en aftermovie van een beurs in de RAI, een congres of een diner, Belgisch gefactureerd zonder Nederlandse formaliteiten.' },
        { question: 'Maakt u ook grachtenshoots zonder bruiloft?', answer: 'Ja, als lifestyle-shoot, vroeg in de ochtend op de grachten of in de Jordaan: 250 € voor anderhalf uur foto, 640 € met een korte film, plus reiskosten.' },
      ],
    },
    en: {
      intro:
        'Photographer and videographer for weddings, elopements and corporate shoots in Amsterdam and North Holland, based in Brussels, with a flat travel fee of €190: Amsterdam and Haarlem are two hours away by road. This is not another “Amsterdam wedding photographer” page: what is offered is one person for both photo and video, for international couples marrying on the canals, at Huize Frankendael or at the Muiderslot, for elopements and canal sessions at dawn, and for Belgian or international companies with an event on the Zuidas or at the RAI — €2,690 for photo and video on one wedding day, VAT included, in English.',
      citiesTitle: 'Across the province',
      cities: [
        { name: 'Amsterdam', fact: 'the city hall and the municipal wedding venues for the ceremony, the canal ring, the Jordaan and the Vondelpark for couple photos, the Zuidas and the RAI for corporate, the Johan Cruijff ArenA for sport.' },
        { name: 'Haarlem', fact: 'the town hall on the Grote Markt and the Sint-Bavo for the ceremony, the courtyards and the Spaarne for the session, the Philharmonie for the party.' },
        { name: 'Bloemendaal and Zandvoort', fact: 'the beach pavilions and dunes for seaside weddings and sunset sessions, Duin & Kruidberg for the reception.' },
        { name: 'Het Gooi', fact: 'Naarden-Vesting and its Grote Kerk, Laren and Hilversum, heathland and villas for weddings in the green.' },
        { name: 'Muiden and the Zaan', fact: 'the Muiderslot for a castle wedding, the Zaanse Schans for a session among the windmills.' },
        { name: 'Alkmaar, Hoorn, Enkhuizen', fact: 'the cheese market and the Waag, the IJsselmeer harbours and historic centres for sessions and ceremonies.' },
      ],
      venuesTitle: 'Wedding and shooting venues',
      venues: ['Huize Frankendael (Amsterdam)', 'Muiderslot', 'Landgoed Duin & Kruidberg (Santpoort)', 'Posthoornkerk (Amsterdam)', 'Beurs van Berlage', 'Het Scheepvaartmuseum', 'Rijksmuseum (events)', 'Amstel Hotel', 'Grote Kerk Naarden', 'Philharmonie Haarlem', 'Zaanse Schans', 'Bloemendaal beach pavilions'],
      practicalTitle: 'Practical',
      practical: [
        'Travel: flat fee of €190 (zone 3) for Amsterdam, Haarlem, the Gooi and the coast; Alkmaar, Hoorn and Enkhuizen are confirmed on the quote.',
        'Wedding: a hotel night (€150) is added when the party ends late; after an afternoon celebration, driving back the same evening is possible.',
        'Payment: 30% deposit on booking, balance on delivery; prices include Belgian VAT at 21%, with reverse charge for a Dutch VAT-registered company.',
        'Drone: forbidden over Amsterdam and around Schiphol; possible on the estates, in the Gooi and on the coast outside Natura 2000 areas.',
      ],
      faq: [
        { question: 'How much does a wedding photographer and videographer cost in Amsterdam?', answer: 'The Belgian price plus €190 of travel: €2,690 for photo and video by the same person, full day, VAT included. An Amsterdam photo + video duo often starts above €4,000.' },
        { question: 'Can we legally marry in Amsterdam as foreigners?', answer: 'A civil wedding in the Netherlands requires at least one partner to be a Dutch resident or national; most international couples marry legally at home and celebrate in Amsterdam. I cover the celebration the same way, from getting ready to the party.' },
        { question: 'Do you shoot canal sessions and proposals without a wedding?', answer: 'Yes, as a lifestyle booking, early morning on the canals or in the Jordaan: €250 for ninety minutes of photos, €640 with a short film, plus travel.' },
      ],
    },
  },
};
