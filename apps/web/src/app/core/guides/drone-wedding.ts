import type { Guide } from '../guide-content';
import { formatPrice } from '../packs';

const drone = formatPrice(190);

/**
 * Guide « vérifier » : le drone à un mariage en Belgique. FR et NL. Les
 * règles citées sont celles du règlement européen 2019/947 (catégorie
 * ouverte A1/A2/A3, 120 m, enregistrement de l'exploitant) et des géozones
 * belges publiées sur Drone Guide (skeyes / DGTA) en 2026. Elles évoluent :
 * le guide renvoie à la carte officielle pour le jour J.
 */
export const GUIDES_DRONE: readonly Guide[] = [
  {
    slug: 'drone-mariage-belgique-ce-qui-est-autorise',
    locale: 'fr',
    group: 'drone-mariage',
    category: 'mariage',
    title: 'Drone à un mariage en Belgique : ce qui est autorisé, ce qui ne l’est pas, et ce que ça coûte',
    metaTitle: 'Drone à un mariage en Belgique (2026) : règles, zones interdites, prix',
    metaDescription: 'Les règles européennes et belges pour filmer un mariage au drone : catégories, enregistrement, hauteur, survol des invités, géozones (Bruxelles, aéroports, zones militaires), vie privée, assurance, et ce que l’option coûte et donne.',
    eyebrow: 'Guide pratique',
    published: '2026-10-05',
    readingMinutes: 7,
    answer: `Oui, un drone peut filmer votre mariage en Belgique, à trois conditions : le pilote est un exploitant enregistré avec un drone de catégorie ouverte, le lieu n’est pas dans une géozone interdite (Bruxelles presque entièrement, les abords des aéroports, les zones militaires, les réserves naturelles), et le drone ne survole pas les invités. Il vole à 120 mètres au plus, de jour, en vue directe, et le lieu doit être d’accord. Chez Heaven Motion, l’option coûte ${drone} : quelques plans aériens du lieu, de l’arrivée des invités et de la séance couple, intégrés au film et livrés en photo ; elle est reportée ou remboursée si le vol est impossible le jour J. Le détail des règles, des zones et des cas pratiques ci-dessous.`,
    sections: [
      {
        title: 'Les règles européennes en bref',
        paragraphs: [
          'Depuis 2021, les drones relèvent du règlement européen 2019/947, le même en Belgique, en France, au Luxembourg et aux Pays-Bas. Un mariage se filme en « catégorie ouverte », sans autorisation préalable, à condition de respecter ses limites : 120 mètres de hauteur maximum, vol à vue, de jour, drone de moins de 25 kg, et pas de survol de rassemblements de personnes.',
          'À l’intérieur de la catégorie ouverte, la sous-catégorie dépend du poids et de la distance aux personnes : un drone de moins de 250 g (classe C0) peut survoler des personnes isolées ; un drone de 250 g à 4 kg (A2) doit rester à 30 mètres des personnes non impliquées, 5 mètres en mode lent, et son pilote détient un certificat A2 ; au-delà, 150 mètres des zones habitées. Un mariage avec ses invités est un groupe de personnes : les plans se font au-dessus du lieu, du parc, des champs, pas au-dessus de la foule.',
          'L’exploitant est enregistré auprès de la DGTA (le numéro figure sur le drone), le pilote a passé l’examen en ligne, et une assurance responsabilité civile couvre le drone.',
        ],
      },
      {
        title: 'Les géozones belges : où le drone ne vole pas',
        paragraphs: ['La carte officielle est publiée sur Drone Guide (skeyes et DGTA) ; elle est consultée avant chaque mariage, car elle change.'],
        table: {
          columns: ['Zone', 'Statut', 'Ce que ça change pour un mariage'],
          rows: [
            ['Bruxelles-Capitale', 'Zone contrôlée de l’aéroport et zones de sécurité (institutions, Palais royal)', 'Pas de drone sur l’essentiel des 19 communes ; quelques poches au sud et à l’est, à vérifier'],
            ['Abords des aéroports (Zaventem, Charleroi, Liège, Anvers-Deurne, Ostende, Courtrai-Wevelgem)', 'Zones contrôlées, rayon de plusieurs kilomètres', 'Interdit ou soumis à autorisation ; de nombreux lieux de réception du Brabant flamand et du Hainaut sont concernés'],
            ['Zones militaires (Beauvechain, Florennes, Kleine-Brogel, Elsenborn, Leopoldsburg, Chièvres)', 'Interdit', 'Aucun vol, même pour un plan rapide'],
            ['Réserves naturelles (Hautes Fagnes, Zwin, forêt de Soignes en partie)', 'Interdit ou restreint', 'Pas de plans aériens sur les séances en réserve'],
            ['Ports (Anvers, Zeebrugge, Gand)', 'Restreint', 'Interdit sans autorisation'],
            ['Le reste du pays', 'Libre en catégorie ouverte', 'Campagne, Ardennes, domaines et châteaux hors des zones ci-dessus : les plans aériens sont possibles'],
          ],
          note: 'Une géozone peut être temporairement activée (événement, exercice militaire) : la vérification se fait la veille et le matin du mariage.',
        },
      },
      {
        title: 'Le lieu, les invités, la vie privée',
        paragraphs: [
          'Le lieu doit être d’accord : un château ou un domaine privé peut interdire le drone, par principe ou pour ses voisins. La question est posée au repérage et la réponse figure au devis.',
          'Les invités ne sont pas survolés. Les plans se prennent en périphérie, en hauteur, ou pendant la séance couple quand seuls les mariés sont dans le champ. Les voisins non plus : filmer la propriété d’à côté n’est pas permis, et le RGPD s’applique aux images aériennes comme aux autres.',
          'Le bruit : un drone s’entend. Il ne vole pas pendant la cérémonie, les discours ou les vœux ; il vole avant l’arrivée des invités, pendant le vin d’honneur en retrait, et pendant la séance couple.',
        ],
      },
      {
        title: 'Ce que le drone apporte, et ce qu’il n’apporte pas',
        paragraphs: [
          'Il apporte trois choses : le lieu vu d’en haut, qui situe le film en deux secondes ; le plan d’ouverture ou de fin du film, souvent le plus mémorable ; et la séance couple vue du ciel, dans un champ, sur une plage ou devant un château. Il donne aussi quelques photos aériennes du domaine, appréciées des lieux eux-mêmes.',
          'Il n’apporte pas de couverture du reportage : le drone n’est pas une caméra de plus pendant la cérémonie, et il ne remplace pas un second opérateur. Il occupe le pilote pendant cinq à dix minutes à chaque vol ; avec une seule personne pour la photo et la vidéo, ces créneaux sont choisis pour ne rien manquer au sol.',
        ],
      },
      {
        title: 'Ce que ça coûte',
        paragraphs: [
          `Chez Heaven Motion, l’option drone coûte ${drone}, pour deux à quatre vols dans la journée, les plans intégrés au film et au teaser, et cinq à dix photos aériennes livrées dans la galerie. Si le vol est impossible le jour J (géozone activée, lieu qui refuse, pluie ou vent), l’option est reportée à une séance ultérieure ou remboursée. Sur le marché belge, l’option drone se situe entre 150 et 400 € chez les vidéastes qui la proposent ; un pilote de drone dédié, en plus du photographe, coûte 400 à 800 € la journée.`,
        ],
      },
      {
        title: 'Cas pratiques',
        paragraphs: ['Six situations fréquentes, et la réponse.'],
        list: [
          'Mariage civil à Bruxelles-Ville et réception à Uccle : pas de drone à la Grand-Place ; à Uccle, à vérifier sur la carte, souvent non. La réponse est donnée au devis.',
          'Château en Brabant wallon : généralement possible, hors du rayon de Beauvechain ; avec l’accord du lieu.',
          'Domaine en Ardennes : le meilleur cas, hors Fagnes et camp d’Elsenborn.',
          'Plage de la côte belge : possible hors du Zwin et des abords d’Ostende, en respectant les promeneurs.',
          'Mariage à Lille ou à Paris : mêmes règles européennes, géozones françaises (Géoportail drones) ; Paris intra-muros est interdit.',
          'Mariage en Flandre près de Zaventem (Grimbergen, Vilvorde, Zaventem, Tervuren) : zone contrôlée, pas de vol sans autorisation, souvent impossible le samedi.',
        ],
      },
    ],
    faq: [
      { question: 'Le drone est-il autorisé à un mariage en Belgique ?', answer: 'Oui, en catégorie ouverte, avec un exploitant enregistré, hors des géozones interdites, sans survol des invités, et avec l’accord du lieu.' },
      { question: 'Peut-on faire voler un drone à Bruxelles ?', answer: 'Presque jamais : la Région est couverte par la zone contrôlée de l’aéroport et des zones de sécurité. Les plans aériens se font hors de la ville.' },
      { question: 'Le drone peut-il survoler les invités ?', answer: 'Non. Un rassemblement de personnes ne se survole pas en catégorie ouverte ; les plans se prennent en périphérie, en hauteur ou pendant la séance couple.' },
      { question: 'Faut-il une autorisation du lieu ?', answer: 'Oui, dans les faits : un domaine privé peut interdire le drone. La question est posée au repérage.' },
      { question: 'Combien coûte l’option drone ?', answer: drone + ' chez Heaven Motion, reportée ou remboursée si le vol est impossible ; entre 150 et 400 € sur le marché belge, et 400 à 800 € pour un pilote dédié à la journée.' },
      { question: 'Et s’il pleut ou s’il y a du vent ?', answer: 'Le drone ne vole ni sous la pluie ni au-delà d’un vent modéré. L’option est reportée à une séance ultérieure ou remboursée.' },
    ],
    ctaTitle: 'Votre lieu, et la réponse drone au devis',
    ctaBody: 'Dites-nous le lieu de la cérémonie et de la réception : le devis indique si le drone y est possible, et l’option n’est facturée que si le vol a lieu.',
    related: [
      { label: 'Les options : drone, second opérateur, heure supplémentaire', path: '/tarifs' },
      { label: 'Photographe & vidéaste de mariage', path: '/prestations/mariage' },
      { label: 'Photographe & vidéaste dans les Ardennes', path: '/zones/belgique/ardennes' },
    ],
  },
  {
    slug: 'drone-op-een-huwelijk-in-belgie-wat-mag',
    locale: 'nl',
    group: 'drone-mariage',
    category: 'mariage',
    title: 'Drone op een huwelijk in België: wat mag, wat niet, en wat het kost',
    metaTitle: 'Drone op een huwelijk in België (2026): regels, no-flyzones, prijs',
    metaDescription: 'De Europese en Belgische regels om een huwelijk met een drone te filmen: categorieën, registratie, hoogte, vliegen boven gasten, geozones (Brussel, luchthavens, militaire zones), privacy, verzekering, en wat de optie kost en oplevert.',
    eyebrow: 'Praktische gids',
    published: '2026-10-05',
    readingMinutes: 7,
    answer: `Ja, een drone mag uw huwelijk filmen in België, op drie voorwaarden: de piloot is een geregistreerde exploitant met een drone in de open categorie, de locatie ligt niet in een verboden geozone (bijna heel Brussel, de omgeving van luchthavens, militaire zones, natuurreservaten), en de drone vliegt niet boven de gasten. Hij vliegt maximaal 120 meter hoog, overdag, in het zicht, en de locatie moet akkoord gaan. Bij Heaven Motion kost de optie ${drone}: enkele luchtbeelden van de locatie, de aankomst van de gasten en de koppelshoot, verwerkt in de film en geleverd als foto; ze wordt verplaatst of terugbetaald als vliegen onmogelijk is op de dag zelf. De regels, de zones en de praktijkgevallen hieronder.`,
    sections: [
      {
        title: 'De Europese regels in het kort',
        paragraphs: [
          'Sinds 2021 vallen drones onder de Europese verordening 2019/947, dezelfde in België, Frankrijk, Luxemburg en Nederland. Een huwelijk wordt gefilmd in de « open categorie », zonder voorafgaande toelating, mits de limieten gerespecteerd worden: maximaal 120 meter hoog, op zicht, overdag, drone onder 25 kg, en niet boven mensenmenigten.',
          'Binnen de open categorie hangt de subcategorie af van gewicht en afstand tot personen: een drone onder 250 g (klasse C0) mag boven afzonderlijke personen vliegen; een drone van 250 g tot 4 kg (A2) blijft 30 meter van niet-betrokken personen, 5 meter in trage modus, en de piloot heeft een A2-certificaat; daarboven 150 meter van bewoond gebied. Een huwelijk met zijn gasten is een groep mensen: de beelden worden boven de locatie, het park, de velden gemaakt, niet boven de menigte.',
          'De exploitant is geregistreerd bij het DGLV (het nummer staat op de drone), de piloot heeft het online examen afgelegd, en een verzekering burgerlijke aansprakelijkheid dekt de drone.',
        ],
      },
      {
        title: 'De Belgische geozones: waar de drone niet vliegt',
        paragraphs: ['De officiële kaart staat op Drone Guide (skeyes en DGLV); ze wordt vóór elk huwelijk geraadpleegd, want ze verandert.'],
        table: {
          columns: ['Zone', 'Status', 'Wat het betekent voor een huwelijk'],
          rows: [
            ['Brussels Hoofdstedelijk Gewest', 'Gecontroleerde zone van de luchthaven en veiligheidszones (instellingen, Koninklijk Paleis)', 'Geen drone in het grootste deel van de 19 gemeenten; enkele stukken in het zuiden en oosten, na te kijken'],
            ['Omgeving van luchthavens (Zaventem, Charleroi, Luik, Antwerpen-Deurne, Oostende, Kortrijk-Wevelgem)', 'Gecontroleerde zones, straal van meerdere kilometers', 'Verboden of onderworpen aan toelating; veel feestlocaties in Vlaams-Brabant en rond Antwerpen liggen erin'],
            ['Militaire zones (Bevekom, Florennes, Kleine-Brogel, Elsenborn, Leopoldsburg, Chièvres)', 'Verboden', 'Geen vlucht, ook niet voor één snel shot'],
            ['Natuurreservaten (Hoge Venen, Zwin, delen van het Zoniënwoud)', 'Verboden of beperkt', 'Geen luchtbeelden bij shoots in een reservaat'],
            ['Havens (Antwerpen, Zeebrugge, Gent)', 'Beperkt', 'Verboden zonder toelating'],
            ['De rest van het land', 'Vrij in open categorie', 'Platteland, Ardennen, domeinen en kastelen buiten de zones hierboven: luchtbeelden zijn mogelijk'],
          ],
          note: 'Een geozone kan tijdelijk geactiveerd worden (event, militaire oefening): de controle gebeurt de dag voordien en de ochtend van het huwelijk.',
        },
      },
      {
        title: 'De locatie, de gasten, de privacy',
        paragraphs: [
          'De locatie moet akkoord gaan: een kasteel of privédomein kan de drone verbieden, uit principe of voor de buren. De vraag wordt gesteld bij de verkenning en het antwoord staat op de offerte.',
          'Er wordt niet boven de gasten gevlogen. De beelden worden aan de rand, in de hoogte, of tijdens de koppelshoot gemaakt, als alleen het koppel in beeld is. Ook niet boven de buren: het eigendom ernaast filmen mag niet, en de GDPR geldt voor luchtbeelden zoals voor alle andere.',
          'Het geluid: een drone hoort u. Hij vliegt niet tijdens de ceremonie, de speeches of de geloften; wel vóór de gasten aankomen, tijdens de receptie op afstand, en tijdens de koppelshoot.',
        ],
      },
      {
        title: 'Wat de drone oplevert, en wat niet',
        paragraphs: [
          'Hij levert drie dingen: de locatie van bovenaf, die de film in twee seconden situeert; het openings- of slotshot van de film, vaak het meest memorabele; en de koppelshoot vanuit de lucht, in een veld, op een strand of voor een kasteel. Hij geeft ook enkele luchtfoto’s van het domein, waar de locaties zelf blij mee zijn.',
          'Hij levert geen dekking van de reportage: de drone is geen extra camera tijdens de ceremonie, en hij vervangt geen tweede operator. Hij houdt de piloot vijf tot tien minuten bezig per vlucht; met één persoon voor foto en video worden die momenten zo gekozen dat er op de grond niets gemist wordt.',
        ],
      },
      {
        title: 'Wat het kost',
        paragraphs: [
          `Bij Heaven Motion kost de drone-optie ${drone}, voor twee tot vier vluchten op de dag, de beelden verwerkt in film en teaser, en vijf tot tien luchtfoto’s in de galerij. Is vliegen onmogelijk op de dag zelf (geactiveerde geozone, locatie die weigert, regen of wind), dan wordt de optie verplaatst naar een latere shoot of terugbetaald. Op de Belgische markt kost de drone-optie 150 tot 400 € bij videografen die ze aanbieden; een aparte dronepiloot naast de fotograaf kost 400 tot 800 € per dag.`,
        ],
      },
      {
        title: 'Praktijkgevallen',
        paragraphs: ['Zes veelvoorkomende situaties, en het antwoord.'],
        list: [
          'Burgerlijk huwelijk in Brussel-Stad en receptie in Ukkel: geen drone op de Grote Markt; in Ukkel na te kijken op de kaart, meestal niet. Het antwoord staat op de offerte.',
          'Kasteel in Vlaams-Brabant bij Leuven of Tervuren: vaak in de gecontroleerde zone van Zaventem, zelden mogelijk op zaterdag; verder weg (Hageland, Pajottenland) meestal wel.',
          'Domein in de Ardennen: het beste geval, buiten de Venen en het kamp van Elsenborn.',
          'Strand aan de kust: mogelijk buiten het Zwin en de omgeving van Oostende, met respect voor de wandelaars.',
          'Antwerpen: de haven en Deurne leggen een grote no-flyzone op; de Kempen en de domeinen ten zuiden zijn meestal mogelijk.',
          'Huwelijk in Nederland: dezelfde Europese regels, Nederlandse geozones (GoDrone); rond Schiphol, Eindhoven en Maastricht Aachen Airport verboden.',
        ],
      },
    ],
    faq: [
      { question: 'Mag een drone op een huwelijk in België?', answer: 'Ja, in open categorie, met een geregistreerde exploitant, buiten de verboden geozones, zonder boven de gasten te vliegen, en met akkoord van de locatie.' },
      { question: 'Mag een drone vliegen in Brussel?', answer: 'Bijna nooit: het Gewest ligt in de gecontroleerde zone van de luchthaven en in veiligheidszones. Luchtbeelden worden buiten de stad gemaakt.' },
      { question: 'Mag de drone boven de gasten vliegen?', answer: 'Nee. Boven een groep mensen wordt in open categorie niet gevlogen; de beelden worden aan de rand, in de hoogte of tijdens de koppelshoot gemaakt.' },
      { question: 'Is toelating van de locatie nodig?', answer: 'In de praktijk ja: een privédomein kan de drone verbieden. De vraag wordt gesteld bij de verkenning.' },
      { question: 'Wat kost de drone-optie?', answer: drone + ' bij Heaven Motion, verplaatst of terugbetaald als vliegen onmogelijk is; 150 tot 400 € op de Belgische markt, en 400 tot 800 € voor een aparte piloot per dag.' },
      { question: 'En bij regen of wind?', answer: 'De drone vliegt niet in de regen en niet bij meer dan matige wind. De optie wordt verplaatst naar een latere shoot of terugbetaald.' },
    ],
    ctaTitle: 'Uw locatie, en het drone-antwoord op de offerte',
    ctaBody: 'Zeg ons de locatie van ceremonie en receptie: de offerte vermeldt of de drone er mogelijk is, en de optie wordt alleen aangerekend als de vlucht doorgaat.',
    related: [
      { label: 'De opties: drone, tweede operator, extra uur', path: '/nl/tarieven' },
      { label: 'Huwelijksfotograaf & videograaf', path: '/nl/diensten/huwelijk' },
      { label: 'Trouwfotograaf & videograaf in de Ardennen', path: '/nl/zones/belgie/ardennen' },
    ],
  },
];
