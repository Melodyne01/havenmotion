import type { Guide } from '../guide-content';
import { formatPrice, pricingFor } from '../packs';

const m = pricingFor('mariage');
const price = (type: 'photo' | 'video' | 'combo') => formatPrice(m.packs.find((p) => p.type === type)!.price!);

/**
 * Deux guides « choisir un lieu » dans les Ardennes, chacun pour son marché :
 * les couples flamands et néerlandais cherchent « trouwen in de Ardennen »,
 * les couples francophones « mariage Durbuy ». Les lieux sont réels ; le
 * détail des cérémonies civiles (salle, jours) relève de chaque commune et
 * est donné avec l'invitation à vérifier.
 */
export const GUIDES_ARDENNES: readonly Guide[] = [
  {
    slug: 'trouwen-in-de-ardennen-locaties-en-tips',
    locale: 'nl',
    group: 'trouwen-ardennen',
    category: 'mariage',
    title: 'Trouwen in de Ardennen: locaties, praktische tips en wat het kost',
    metaTitle: 'Trouwen in de Ardennen (2026): locaties, burgerlijk huwelijk, tips en prijzen',
    metaDescription: 'De mooiste trouwlocaties van de Ardennen (Durbuy, La Roche, Marche, Stavelot, Bouillon), hoe het burgerlijk huwelijk werkt als u niet in Wallonië woont, de logistiek voor gasten, het weer, de drone, en de prijs van een fotograaf en videograaf.',
    eyebrow: 'Locatiegids',
    published: '2026-10-05',
    readingMinutes: 10,
    answer: `Trouwen in de Ardennen is een weekendhuwelijk: de gasten komen vrijdag, het feest is zaterdag, de brunch zondag. De mooiste locaties liggen rond Durbuy (Le Sanglier des Ardennes, het kleinste stadje ter wereld als decor), in de Famenne (Château d’Hassonville, Château de Deulin, Château de Jemeppe), rond Stavelot (de abdij) en langs de Semois (Bouillon). Het burgerlijk huwelijk gebeurt in uw eigen gemeente, tenzij één van u in de Ardennen gedomicilieerd is; op de locatie volgt een ceremonie door een ceremoniespreker. Reken op 12 tot 18 maanden vooraf voor een zaterdag van mei tot september. Een fotograaf én videograaf in één persoon vanuit Brussel kost ${price('combo')} incl. btw, plus 90 € verplaatsing en meestal een hotelnacht van 150 €.`,
    sections: [
      {
        title: 'De locaties, per streek',
        paragraphs: ['Capaciteit, huurprijs en beschikbaarheid vraagt u aan de locatie; wat hieronder staat is het karakter van elke plek en wat ze in beeld geeft.'],
        table: {
          columns: ['Locatie', 'Streek', 'Type', 'In beeld'],
          rows: [
            ['Le Sanglier des Ardennes', 'Durbuy', 'Hotel en zalen', 'De Ourthe, de kasseistraatjes, het kasteel als achtergrond, alles te voet'],
            ['Château d’Hassonville', 'Marche-en-Famenne', 'Kasteelhotel', 'Het park, de vijver, de gevel bij valavond; gasten slapen ter plaatse'],
            ['Château de Deulin', 'Hotton', 'Kasteel', 'De binnenkoer, de boomgaard, de Famenne rondom'],
            ['Château de Jemeppe', 'Hargimont (Marche)', 'Kasteel', 'De slotgracht, de tuinen, een middeleeuwse donjon'],
            ['Château de Harzé', 'Aywaille', 'Kasteel', 'De arcadengalerij, het park; op de rand van de Ardennen, dicht bij Luik'],
            ['Abdij van Stavelot', 'Stavelot', 'Abdij', 'De kloostergangen, de binnenplaats; de Venen op tien minuten'],
            ['Domaine de Palogne', 'Vieuxville (Ferrières)', 'Domein aan de Ourthe', 'De rivier, de ruïne van Logne, een feest in volle natuur'],
            ['Château de Mirwart', 'Mirwart (Saint-Hubert)', 'Kasteel', 'De bossen van Saint-Hubert, een kasteel op een rots'],
            ['Burcht van Bouillon en de Semois', 'Bouillon', 'Burcht en vallei', 'Het Tombeau du Géant, de meanders, de ochtendmist'],
            ['La Roche-en-Ardenne', 'La Roche', 'Stad en burchtruïne', 'De Ourthe, de ruïne, hotels in het centrum voor de gasten'],
          ],
          note: 'Niet-exhaustief. Geen van deze locaties wordt als referentie van Heaven Motion voorgesteld zolang het project niet gepubliceerd is.',
        },
      },
      {
        title: 'Het burgerlijk huwelijk: waar en hoe',
        paragraphs: [
          'In België trouwt u burgerlijk in de gemeente waar één van beiden gedomicilieerd is. Woont u in Antwerpen of Eindhoven, dan gebeurt het « ja » in uw eigen gemeentehuis, de vrijdag of een week vooraf, en volgt op de locatie in de Ardennen een ceremonie door een ceremoniespreker, een vriend of een familielid. Dat is het schema van negen op tien Vlaamse en Nederlandse koppels die in de Ardennen trouwen.',
          'Is één van u wel in de Ardennen gedomicilieerd, dan trouwt u in het gemeentehuis van Durbuy (in Barvaux-sur-Ourthe), Marche-en-Famenne, Stavelot of Bouillon. De ceremonie is in het Frans; een tolk is toegelaten. Vraag vooraf welke zaal en welke dagen de gemeente aanbiedt, want dat verschilt.',
          'Voor Nederlandse koppels: het Belgische huwelijk wordt in Nederland erkend na inschrijving bij uw gemeente, met een internationaal uittreksel. Vraag het uittreksel meteen na de ceremonie.',
        ],
      },
      {
        title: 'De dag en het weekend plannen',
        paragraphs: [
          'Een Ardens huwelijk duurt langer en ligt verder dan een huwelijk thuis. Dat vraagt drie beslissingen: waar slapen de gasten (de locatie zelf, of hotels op minder dan tien minuten), hoe geraken ze er (eigen wagen; een bus vanuit Vlaanderen of Nederland kost 600 tot 1.200 € en lost de terugrit op), en wat doet u zondag (brunch, wandeling, kajak op de Ourthe).',
          'Het licht: in de valleien verdwijnt de zon vroeg achter de heuvels. De koppelshoot plant u tussen 16 en 18 uur in de zomer, of de zondagochtend in de mist, wat de mooiste beelden van de Ardennen geeft. Een verkenning met de fotograaf, enkele weken vooraf, legt de plekken vast.',
          'Het weer: de Ardennen zijn natter en koeler dan Vlaanderen. Een plan B binnen voor de ceremonie is geen optie maar een voorwaarde, en een paar laarzen voor de shoot in het bos ook.',
        ],
      },
      {
        title: 'De drone en de natuur',
        paragraphs: [
          'De Ardennen zijn het beste dronegebied van België: open valleien, bossen, kastelen op een rots. Verboden zijn de natuurreservaten (de Hoge Venen), het militaire kamp van Elsenborn en de omgeving van de luchthaven van Luik. De locatie moet akkoord gaan, en er wordt niet boven de gasten gevlogen. De optie kost 190 € en wordt verplaatst of terugbetaald als vliegen onmogelijk is.',
        ],
      },
      {
        title: 'Wat het kost: fotograaf, videograaf en de rest',
        paragraphs: [
          `Een fotograaf én videograaf in één persoon vanuit Brussel: ${price('combo')} incl. btw voor de volledige dag, ${price('photo')} voor foto alleen, ${price('video')} voor video alleen. Daarbovenop 90 € verplaatsing (zone 2: Durbuy, Marche, La Roche, Stavelot; 190 € voor Bouillon en Bastogne) en, omdat Ardense feesten laat eindigen, een hotelnacht van 150 €, die meteen een shoot op zondagochtend mogelijk maakt. Een Vlaamse fotograaf rekent voor dezelfde verplaatsing vaak 0,50 tot 0,75 € per kilometer, heen en terug.`,
          'Locatie en catering: de Ardense locaties zijn goedkoper dan de Vlaamse kastelen voor hetzelfde kader; reken op 90 tot 180 € per gast all-in volgens de locatie en de formule, te bevestigen bij elke locatie.',
        ],
      },
    ],
    faq: [
      { question: 'Kunnen we burgerlijk trouwen in Durbuy als we er niet wonen?', answer: 'Nee. In België trouwt u in de gemeente waar één van beiden gedomicilieerd is. U trouwt thuis en houdt in de Ardennen een ceremonie door een ceremoniespreker.' },
      { question: 'Welke locatie is het mooist voor foto’s?', answer: 'Durbuy voor een stadje dat helemaal te voet gaat, Hassonville en Jemeppe voor een kasteel met park, de Semois bij Bouillon voor natuur en mist. De keuze hangt af van het aantal gasten en of u ze ter plaatse wilt laten slapen.' },
      { question: 'Spreekt de fotograaf Nederlands?', answer: 'Ja. De reportage verloopt in het Nederlands, de locatie wordt in het Frans aangesproken, en contract, offerte en levering zijn in het Nederlands.' },
      { question: 'Hoe lang vooraf boeken?', answer: '12 tot 18 maanden voor een zaterdag van mei tot september in de gevraagde locaties; 6 tot 9 maanden voor een vrijdag, een zondag of een maand in de lente of de herfst.' },
      { question: 'Is een huwelijk over twee dagen mogelijk?', answer: 'Ja: de volledige dag op zaterdag en een koppelshoot of brunch op zondagochtend als extra uur (150 €, of 220 € voor foto en video).' },
    ],
    ctaTitle: 'Uw locatie, uw datum, een offerte binnen 48 u',
    ctaBody: 'Zeg ons de locatie en de datum: u krijgt een offerte met de formule, de verplaatsing, de hotelnacht en de verkenning inbegrepen.',
    related: [
      { label: 'Trouwfotograaf & videograaf in de Ardennen', path: '/nl/zones/belgie/ardennen' },
      { label: 'Huwelijksfotograaf & videograaf', path: '/nl/diensten/huwelijk' },
      { label: 'Wat kost een huwelijksfotograaf én videograaf in België', path: '/nl/gidsen/wat-kost-een-huwelijksfotograaf-en-videograaf-belgie-2026' },
    ],
  },
  {
    slug: 'se-marier-a-durbuy-lieux-mairie-photos',
    locale: 'fr',
    group: 'mariage-durbuy',
    category: 'mariage',
    title: 'Se marier à Durbuy : lieux de réception, mairie, photos et budget',
    metaTitle: 'Se marier à Durbuy (2026) : lieux, mairie, séance photo, budget',
    metaDescription: 'Les lieux de réception de Durbuy et de ses environs, comment se passe le civil (la maison communale est à Barvaux), les spots photo dans la plus petite ville du monde, le weekend type, et le prix d’un photographe-vidéaste.',
    eyebrow: 'Guide lieux',
    published: '2026-10-05',
    readingMinutes: 9,
    answer: `Durbuy est le lieu de mariage de weekend le plus demandé des Ardennes : une vieille ville piétonne de quelques rues, l’Ourthe, le château en toile de fond, des hôtels et des salles à cinq minutes à pied les uns des autres. Les réceptions se font au Sanglier des Ardennes, dans les domaines de Septon et de la Famenne, ou dans un château à dix minutes (Deulin, Hassonville, Jemeppe). Le civil, lui, se célèbre à la maison communale de Durbuy, qui est à Barvaux-sur-Ourthe, et seulement si l’un de vous y est domicilié ; sinon, civil chez vous et cérémonie laïque sur place. Photographe et vidéaste en une seule personne depuis Bruxelles : ${price('combo')} TTC, plus 90 € de déplacement et une nuit d’hôtel.`,
    sections: [
      {
        title: 'Les lieux de réception à Durbuy et autour',
        paragraphs: ['Les capacités et les tarifs sont ceux des lieux, à leur demander ; voici le caractère de chacun et ce qu’il donne en image.'],
        table: {
          columns: ['Lieu', 'Où', 'Type', 'En image'],
          rows: [
            ['Le Sanglier des Ardennes', 'Durbuy, vieille ville', 'Hôtel, restaurant, salles', 'L’Ourthe, les ruelles, le château en toile de fond ; tout à pied'],
            ['Le Vieux Durbuy', 'Durbuy, vieille ville', 'Hôtel', 'Les chambres pour les préparatifs, à cent mètres de la place'],
            ['Domaine du Château de Petite Somme', 'Septon (Durbuy)', 'Château et parc', 'Le château néo-gothique, le parc, les jardins'],
            ['La Ferme au Chêne', 'Durbuy', 'Brasserie et ferme', 'La cour, la grange, une réception brasserie au bord de l’Ourthe'],
            ['Château de Deulin', 'Hotton', 'Château', 'La cour, le verger, la Famenne'],
            ['Château d’Hassonville', 'Marche-en-Famenne', 'Château-hôtel', 'Le parc, l’étang, les chambres sur place'],
            ['Château de Jemeppe', 'Hargimont', 'Château', 'Les douves, le donjon, les jardins'],
            ['Domaine de Palogne', 'Vieuxville', 'Domaine au bord de l’Ourthe', 'La rivière, la ruine de Logne, la nature'],
            ['Adventure Valley', 'Durbuy', 'Parc d’activités', 'Pour le lendemain : kayak, accrobranche avec les invités'],
          ],
          note: 'Liste non exhaustive. Le château de Durbuy lui-même est une propriété privée : il se photographie, il ne se loue pas.',
        },
      },
      {
        title: 'Le civil à Durbuy : ce qu’il faut savoir',
        paragraphs: [
          'La commune de Durbuy regroupe une quarantaine de villages ; sa maison communale et son service état civil sont à Barvaux-sur-Ourthe, à cinq kilomètres de la vieille ville. C’est là que se célèbrent les mariages civils de la commune, aux jours et heures qu’elle fixe ; renseignez-vous auprès du service état civil pour la salle et les créneaux du samedi.',
          'Comme partout en Belgique, le civil se tient dans la commune où l’un des deux est domicilié. Pour la grande majorité des couples qui se marient à Durbuy, bruxellois, flamands ou néerlandais, le civil se fait donc chez eux la veille ou la semaine d’avant, et la journée à Durbuy s’ouvre par une cérémonie laïque dans le jardin ou la salle du lieu.',
        ],
      },
      {
        title: 'Les photos : les spots de la vieille ville et des environs',
        paragraphs: ['Durbuy se photographie à pied, en trente à soixante minutes, entre le vin d’honneur et le dîner ou le dimanche matin.'],
        list: [
          'La place aux Foires et les ruelles pavées, en fin d’après-midi quand les visiteurs partent.',
          'Les berges de l’Ourthe et le pont, avec le château en arrière-plan.',
          'Le parc des Topiaires, pour un décor de jardin taillé ; entrée payante, horaires à vérifier.',
          'Le belvédère du rocher d’Omalius, au-dessus de la ville, pour la vue d’ensemble.',
          'Le dimanche matin, la brume sur l’Ourthe : les plus belles images des Ardennes, si vous dormez sur place.',
          'Un peu plus loin : les ruines de Logne à Vieuxville, les méandres de l’Ourthe à Hotton.',
        ],
      },
      {
        title: 'Le weekend type',
        paragraphs: [
          'Vendredi : arrivée des invités, dîner informel, préparation de la salle. Samedi : préparatifs à l’hôtel le matin, cérémonie laïque en début d’après-midi, vin d’honneur, séance couple vers 17 h, dîner, soirée. Dimanche : brunch, promenade, kayak ou accrobranche pour ceux qui restent.',
          'Le couvreur image suit le même rythme : journée complète le samedi, et une heure supplémentaire le dimanche matin (150 €, ou 220 € photo et vidéo) pour la séance dans la brume ou le brunch. La nuit d’hôtel du prestataire (150 €) est presque toujours ajoutée, les soirées finissant tard.',
        ],
      },
      {
        title: 'Budget',
        paragraphs: [
          `Photographe et vidéaste en une seule personne depuis Bruxelles : ${price('combo')} TTC pour la journée complète, ${price('photo')} en photo seule, ${price('video')} en vidéo seule, plus 90 € de déplacement (zone 2) et 150 € de nuit d’hôtel. Un photographe local demande entre 1 200 et 2 200 € pour la photo seule ; un duo photo + vidéo venu de Bruxelles ou de Liège entre 3 000 et 4 500 €.`,
          'Le drone (190 €) est possible sur la plupart des domaines autour de Durbuy, avec l’accord du lieu et sans survol des invités ; il est reporté ou remboursé si le vol est impossible.',
        ],
      },
    ],
    faq: [
      { question: 'Peut-on se marier civilement à Durbuy sans y habiter ?', answer: 'Non : le civil se tient dans la commune de domicile de l’un des deux. On se marie chez soi et on célèbre une cérémonie laïque à Durbuy.' },
      { question: 'Où est la mairie de Durbuy ?', answer: 'La maison communale de Durbuy est à Barvaux-sur-Ourthe, à cinq kilomètres de la vieille ville. Le service état civil y fixe les jours et les salles des mariages.' },
      { question: 'Quel est le meilleur moment pour les photos à Durbuy ?', answer: 'La fin d’après-midi, quand les visiteurs quittent la vieille ville, et le dimanche matin dans la brume sur l’Ourthe.' },
      { question: 'Combien de temps à l’avance réserver ?', answer: '12 à 18 mois pour un samedi de mai à septembre dans les lieux les plus demandés ; 6 à 9 mois pour un vendredi, un dimanche ou une date de printemps ou d’automne.' },
      { question: 'Combien coûte un photographe-vidéaste pour un mariage à Durbuy ?', answer: price('combo') + ' TTC pour la photo et la vidéo par la même personne, plus 90 € de déplacement et 150 € de nuit d’hôtel, soit environ 2 930 € tout compris.' },
    ],
    ctaTitle: 'Votre date à Durbuy, un devis sous 48 h',
    ctaBody: 'Dites-nous le lieu et la date : vous recevez un devis avec la formule, le déplacement, la nuit d’hôtel et le repérage inclus.',
    related: [
      { label: 'Photographe & vidéaste dans les Ardennes', path: '/zones/belgique/ardennes' },
      { label: 'Photographe & vidéaste de mariage', path: '/prestations/mariage' },
      { label: 'Combien coûte un photographe-vidéaste de mariage en Belgique', path: '/guides/prix-photographe-videaste-mariage-belgique-2026' },
    ],
  },
];
