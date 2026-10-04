import type { Guide } from '../guide-content';
import { formatPrice, pricingFor } from '../packs';

const m = pricingFor('mariage');
const price = (type: 'photo' | 'video' | 'combo') => formatPrice(m.packs.find((p) => p.type === type)!.price!);
const separate = formatPrice(m.packs.find((p) => p.type === 'photo')!.price! + m.packs.find((p) => p.type === 'video')!.price!);
const second = formatPrice(490);

/**
 * Guide de décision : photographe, vidéaste, ou les deux. Trois versions
 * écrites pour leur marché (la question se pose partout, mais pas avec les
 * mêmes repères de prix ni les mêmes habitudes : la vidéo de mariage est
 * plus répandue en Flandre et aux Pays-Bas qu'en Wallonie). Renvoie vers la
 * page « une seule personne ».
 */
export const GUIDES_CHOOSE: readonly Guide[] = [
  {
    slug: 'photographe-ou-videaste-mariage-lequel-choisir',
    locale: 'fr',
    group: 'photo-ou-video',
    category: 'mariage',
    title: 'Photographe ou vidéaste pour votre mariage : lequel choisir, ou les deux ?',
    metaTitle: 'Photographe ou vidéaste de mariage : lequel choisir (ou les deux)',
    metaDescription: `Ce que la photo donne que la vidéo ne donne pas, et l’inverse ; les quatre options comparées avec leurs prix ; quand une seule personne suffit et quand il faut deux opérateurs.`,
    eyebrow: 'Guide décision',
    published: '2026-10-05',
    readingMinutes: 8,
    answer: `Si vous ne devez en garder qu’un, prenez le photographe : les photos s’impriment, s’encadrent, s’envoient et se regardent cent fois ; c’est le souvenir le plus durable et le moins cher (${price('photo')} TTC pour une journée). Prenez le vidéaste en plus si vous tenez aux voix — les vœux, les discours, les rires — car c’est ce qu’aucune photo ne rend. Et si vous voulez les deux, la question devient : deux prestataires, ou une seule personne qui fait les deux ? La seconde option coûte ${price('combo')} TTC au lieu de ${separate}, avec un seul style et un seul interlocuteur, et une limite honnête : pas deux angles à la même seconde.`,
    sections: [
      {
        title: 'Ce que la photo donne, et que la vidéo ne donne pas',
        paragraphs: [
          'Une photo s’arrête. Elle fixe un regard, une main, une larme, dans une composition choisie. Elle s’imprime, s’encadre au mur, se glisse dans un album que vos enfants ouvriront. Elle se partage en un message. Et elle ne demande aucun effort pour être regardée : on tombe dessus, on la regarde, c’est fait.',
          'Un reportage photo de mariage livre entre 300 et 600 images, soit une image par minute en moyenne : la journée entière, des préparatifs à la piste de danse, avec les détails (la robe, les alliances, la table, les fleurs) que la vidéo survole.',
        ],
      },
      {
        title: 'Ce que la vidéo donne, et que la photo ne donne pas',
        paragraphs: [
          'Le son. La voix de votre père pendant son discours, les mots exacts de vos vœux, le fou rire pendant la cérémonie, la musique de l’ouverture de bal. Dix ans plus tard, ce sont ces voix-là qu’on veut réentendre, et aucune photo ne les contient.',
          'Le mouvement, aussi : l’entrée dans la salle, la sortie sous les pétales, la piste à minuit. Un film de mariage dure 4 à 8 minutes, un teaser 1 minute ; certains couples ajoutent les discours et la cérémonie en version longue.',
          'Et une contrainte : un film se regarde. Il faut un écran, quelques minutes, un moment. Il est vu moins souvent que les photos, mais chaque fois plus intensément.',
        ],
      },
      {
        title: 'Les quatre options comparées',
        paragraphs: ['Les prix du marché sont ceux relevés sur les sites belges cités dans notre guide prix ; les nôtres sont ceux de la grille.'],
        table: {
          columns: ['Option', 'Marché belge', 'Heaven Motion', 'Personnes sur place', 'Style', 'Angles simultanés'],
          rows: [
            ['Photographe seul', '1 400 – 3 500 €', `${price('photo')} TTC`, '1', 'Un', 'Non'],
            ['Vidéaste seul', '1 500 – 3 000 €', `${price('video')} TTC`, '1', 'Un', 'Non'],
            ['Deux prestataires', '3 000 – 5 500 €', '—', '2 (parfois 3 ou 4)', 'Deux, à accorder', 'Oui'],
            ['Une seule personne, photo + vidéo', '2 500 – 4 000 €', `${price('combo')} TTC`, '1', 'Un', 'Non (second opérateur en option)'],
          ],
          note: 'Journée complète, TVA comprise. Les duos « photo + vidéo » du marché sont presque toujours deux personnes, parfois un couple ou un studio.',
        },
      },
      {
        title: 'Deux prestataires : les avantages, et ce que ça coûte vraiment',
        paragraphs: [
          'Deux professionnels, chacun concentré sur son métier, deux angles à chaque instant, et une couverture complète même quand tout se passe en même temps. C’est l’option la plus sûre pour un très grand mariage ou une journée éclatée sur plusieurs lieux.',
          'Le prix n’est pas le seul coût. Deux styles à accorder (une photo chaude et un film froid, ça se voit), deux contrats, deux acomptes, deux plannings à coordonner, deux personnes qui se gênent à la cérémonie, et deux livraisons à des dates différentes. Les bons duos règlent ça en travaillant souvent ensemble ; demandez-leur s’ils l’ont déjà fait.',
        ],
      },
      {
        title: 'Une seule personne pour les deux : comment ça marche, et où ça s’arrête',
        paragraphs: [
          'La méthode tient en trois choses. Un repérage pour connaître les lieux et la lumière. Une liste des moments clés (préparatifs, cérémonie, sortie, séance couple, discours, ouverture de bal) avec, pour chacun, la priorité décidée avec vous : la photo ou la vidéo en premier. Et du matériel qui bascule en une seconde, deux boîtiers prêts, le son enregistré en continu pendant les discours.',
          'La limite est simple : quand la mariée entre dans l’église, il y a une photo et un plan vidéo, pas deux angles. Pour la plupart des mariages de 40 à 120 invités sur un ou deux lieux, personne ne le remarque dans la livraison. Au-delà, ou si la cérémonie et le cocktail se chevauchent, un second opérateur (' + second + ') s’ajoute et la limite disparaît.',
        ],
        list: [
          'Un seul style, une seule colorimétrie entre les photos et le film.',
          'Un seul interlocuteur, un seul contrat, un seul acompte, une seule date de livraison.',
          'Moins de monde autour de vous à la cérémonie et à la séance couple.',
          `${price('combo')} TTC au lieu de ${separate} pour les deux formules séparées.`,
        ],
      },
      {
        title: 'Comment décider en cinq questions',
        paragraphs: ['Répondez dans l’ordre ; la réponse vient d’elle-même.'],
        list: [
          'Quel budget total pour l’image, TVA comprise ? Sous 1 500 € : la photo seule. Entre 1 500 et 2 500 € : la photo, et la vidéo de la cérémonie et des discours en version courte. Au-dessus de 2 500 € : les deux.',
          'Y a-t-il des discours, des vœux écrits, une cérémonie laïque ? Si oui, la vidéo vaut le coût : c’est là que le son compte.',
          'Combien d’invités, combien de lieux ? Jusqu’à 120 invités sur un ou deux lieux : une seule personne suffit. Au-delà : deux opérateurs.',
          'Voulez-vous un album imprimé ? Alors la photo est prioritaire, et le film peut rester court.',
          'Supportez-vous d’être filmés ? Certains couples sont plus à l’aise avec un appareil photo qu’avec une caméra. Si c’est votre cas, un film discret, sans interviews ni mise en scène, règle la question.',
        ],
      },
      {
        title: 'Les questions à poser avant de signer',
        paragraphs: ['À un photographe, à un vidéaste, ou à quelqu’un qui fait les deux.'],
        list: [
          'Montrez-moi un mariage complet, pas les dix meilleures images : la galerie entière et le film.',
          'Combien de photos livrées, en combien de temps, et retouchées comment ?',
          'Quelle durée de film, avec ou sans les discours, sur quelle musique (licence) ?',
          'Que se passe-t-il si vous êtes malade le jour J ?',
          'Pour une seule personne : quelle est votre méthode aux moments clés, et à partir de combien d’invités ajoutez-vous un second opérateur ?',
          'Pour un duo : avez-vous déjà travaillé ensemble, et comment accordez-vous vos styles ?',
        ],
      },
    ],
    faq: [
      { question: 'Vaut-il mieux un photographe ou un vidéaste ?', answer: 'Si vous n’en prenez qu’un, le photographe : les photos durent, s’impriment et se regardent sans effort. Ajoutez le vidéaste si les voix (vœux, discours) comptent pour vous.' },
      { question: 'Une seule personne peut-elle vraiment faire les deux ?', answer: 'Oui, avec une méthode (repérage, moments clés, priorité décidée avec vous, matériel qui bascule) et une limite : pas deux angles simultanés. Jusqu’à 120 invités, c’est la solution la plus simple et la moins chère ; au-delà, un second opérateur s’ajoute.' },
      { question: 'Combien coûte un duo photo + vidéo en Belgique ?', answer: 'Entre 3 000 et 5 500 € TTC pour deux prestataires sur une journée complète. Une seule personne pour les deux coûte entre 2 500 et 4 000 € sur le marché, ' + price('combo') + ' TTC chez Heaven Motion.' },
      { question: 'Peut-on prendre la vidéo seulement pour la cérémonie ?', answer: 'Oui. Une couverture courte (cérémonie, discours, 2 à 3 heures) existe chez la plupart des vidéastes, entre 600 et 1 200 € ; chez Heaven Motion, c’est la formule événementiel vidéo à 590 € TTC pour 3 heures.' },
      { question: 'Faut-il que le photographe et le vidéaste se connaissent ?', answer: 'C’est mieux. Deux professionnels qui n’ont jamais travaillé ensemble se gênent à la cérémonie et livrent deux styles. Demandez un mariage qu’ils ont couvert à deux, ou prenez une seule personne pour les deux.' },
    ],
    ctaTitle: 'Dites-nous votre journée, on vous dit quelle formule',
    ctaBody: 'Date, lieu, nombre d’invités, et ce qui compte pour vous (les voix, l’album, la piste) : vous recevez sous 48 h un devis avec la formule qui a du sens, et le second opérateur seulement si la journée le demande.',
    related: [
      { label: 'Photo et vidéo par une seule personne : la méthode', path: '/photo-et-video-une-seule-personne' },
      { label: 'Combien coûte un photographe-vidéaste de mariage en Belgique', path: '/guides/prix-photographe-videaste-mariage-belgique-2026' },
      { label: 'Photographe & vidéaste de mariage', path: '/prestations/mariage' },
    ],
  },
  {
    slug: 'trouwfotograaf-of-videograaf-wat-kiezen',
    locale: 'nl',
    group: 'photo-ou-video',
    category: 'mariage',
    title: 'Trouwfotograaf of videograaf: wat kiezen, of allebei?',
    metaTitle: 'Trouwfotograaf of trouwvideograaf: wat kiezen (of allebei)',
    metaDescription: 'Wat foto geeft en video niet, en omgekeerd; de vier opties vergeleken met hun prijzen; wanneer één persoon volstaat en wanneer u twee operatoren nodig hebt.',
    eyebrow: 'Beslisgids',
    published: '2026-10-05',
    readingMinutes: 8,
    answer: `Moet u er één kiezen, neem dan de fotograaf: foto’s worden gedrukt, ingekaderd, doorgestuurd en honderd keer bekeken; het is de duurzaamste en goedkoopste herinnering (${price('photo')} incl. btw voor een hele dag). Neem er een videograaf bij als de stemmen tellen — de geloften, de speeches, de lach — want dat geeft geen enkele foto. En wilt u beide, dan wordt de vraag: twee leveranciers, of één persoon die beide doet? Die tweede optie kost ${price('combo')} incl. btw in plaats van ${separate}, met één stijl en één aanspreekpunt, en een eerlijke grens: geen twee hoeken op dezelfde seconde.`,
    sections: [
      {
        title: 'Wat foto geeft, en video niet',
        paragraphs: [
          'Een foto staat stil. Ze legt een blik, een hand, een traan vast in een gekozen compositie. Ze wordt gedrukt, hangt aan de muur, zit in een album dat uw kinderen ooit openen. Ze wordt in één bericht gedeeld. En ze vraagt geen enkele inspanning: u komt ze tegen, u kijkt, klaar.',
          'Een trouwreportage levert 300 tot 600 beelden, gemiddeld één per minuut: de hele dag, van de voorbereidingen tot de dansvloer, met de details (de jurk, de ringen, de tafel, de bloemen) waar video overheen glijdt.',
        ],
      },
      {
        title: 'Wat video geeft, en foto niet',
        paragraphs: [
          'Het geluid. De stem van uw vader tijdens zijn speech, de exacte woorden van uw geloften, de slappe lach tijdens de ceremonie, de muziek van de openingsdans. Tien jaar later zijn het die stemmen die u wilt terughoren, en geen enkele foto bevat ze.',
          'De beweging ook: het binnenkomen in de zaal, het buitenkomen onder de bloemblaadjes, de dansvloer om middernacht. Een trouwfilm duurt 4 tot 8 minuten, een teaser 1 minuut; sommige koppels laten de speeches en de ceremonie in lange versie toevoegen.',
          'En een beperking: een film moet bekeken worden. Een scherm, enkele minuten, een moment. Hij wordt minder vaak bekeken dan de foto’s, maar telkens intenser.',
        ],
      },
      {
        title: 'De vier opties vergeleken',
        paragraphs: ['De marktprijzen zijn die van de Belgische sites in onze prijsgids; de onze komen uit de tarievenlijst.'],
        table: {
          columns: ['Optie', 'Belgische markt', 'Heaven Motion', 'Mensen ter plaatse', 'Stijl', 'Gelijktijdige hoeken'],
          rows: [
            ['Alleen fotograaf', '1.400 – 3.500 €', `${price('photo')} incl. btw`, '1', 'Eén', 'Nee'],
            ['Alleen videograaf', '1.500 – 3.000 €', `${price('video')} incl. btw`, '1', 'Eén', 'Nee'],
            ['Twee leveranciers', '3.000 – 5.500 €', '—', '2 (soms 3 of 4)', 'Twee, af te stemmen', 'Ja'],
            ['Eén persoon, foto + video', '2.500 – 4.000 €', `${price('combo')} incl. btw`, '1', 'Eén', 'Nee (tweede operator als optie)'],
          ],
          note: 'Volledige dag, btw inbegrepen. De « foto + video »-duo’s op de markt zijn bijna altijd twee personen, soms een koppel of een studio.',
        },
      },
      {
        title: 'Twee leveranciers: de voordelen, en wat het echt kost',
        paragraphs: [
          'Twee vakmensen, elk op zijn vak, twee hoeken op elk moment, en volledige dekking zelfs als alles tegelijk gebeurt. Het is de veiligste optie voor een heel groot huwelijk of een dag verspreid over meerdere locaties.',
          'De prijs is niet de enige kost. Twee stijlen om af te stemmen (warme foto’s en een koude film, dat ziet u), twee contracten, twee voorschotten, twee planningen, twee mensen die elkaar in de weg lopen bij de ceremonie, en twee leveringen op verschillende data. Goede duo’s lossen dat op door vaak samen te werken; vraag hen of ze dat al deden.',
        ],
      },
      {
        title: 'Eén persoon voor beide: hoe het werkt, en waar het stopt',
        paragraphs: [
          'De methode bestaat uit drie dingen. Een verkenning om locaties en licht te kennen. Een lijst van sleutelmomenten (voorbereidingen, ceremonie, buitenkomen, koppelshoot, speeches, openingsdans) met voor elk de prioriteit die we samen beslissen: foto of video eerst. En materiaal dat in één seconde omschakelt, twee camera’s klaar, geluid dat doorlopend opneemt tijdens de speeches.',
          'De grens is eenvoudig: als de bruid de kerk binnenkomt, is er één foto en één videoshot, geen twee hoeken. Voor de meeste huwelijken van 40 tot 120 gasten op één of twee locaties merkt niemand dat in de levering. Daarboven, of als ceremonie en receptie overlappen, komt een tweede operator (' + second + ') erbij en verdwijnt de grens.',
        ],
        list: [
          'Eén stijl, één kleurbewerking voor foto’s en film.',
          'Eén aanspreekpunt, één contract, één voorschot, één leverdatum.',
          'Minder volk rond u bij de ceremonie en de koppelshoot.',
          `${price('combo')} incl. btw in plaats van ${separate} voor beide formules apart.`,
        ],
      },
      {
        title: 'Beslissen in vijf vragen',
        paragraphs: ['Beantwoord ze in volgorde; het antwoord komt vanzelf.'],
        list: [
          'Welk totaalbudget voor beeld, btw inbegrepen? Onder 1.500 €: alleen foto. Tussen 1.500 en 2.500 €: foto, plus een korte video van ceremonie en speeches. Boven 2.500 €: beide.',
          'Zijn er speeches, geschreven geloften, een ceremonie door een ceremoniespreker? Dan is video de kost waard: daar telt het geluid.',
          'Hoeveel gasten, hoeveel locaties? Tot 120 gasten op één of twee locaties: één persoon volstaat. Daarboven: twee operatoren.',
          'Wilt u een gedrukt album? Dan is foto prioritair en mag de film kort blijven.',
          'Verdraagt u gefilmd te worden? Sommige koppels zijn meer op hun gemak met een fototoestel dan met een camera. Een discrete film, zonder interviews of regie, lost dat op.',
        ],
      },
      {
        title: 'De vragen om te stellen vóór u tekent',
        paragraphs: ['Aan een fotograaf, een videograaf, of iemand die beide doet.'],
        list: [
          'Toon me een volledig huwelijk, niet de tien beste beelden: de hele galerij en de film.',
          'Hoeveel foto’s geleverd, binnen welke termijn, en hoe bewerkt?',
          'Hoe lang is de film, met of zonder de speeches, op welke muziek (licentie)?',
          'Wat gebeurt er als u ziek bent op de dag zelf?',
          'Voor één persoon: wat is uw methode op de sleutelmomenten, en vanaf hoeveel gasten voegt u een tweede operator toe?',
          'Voor een duo: hebt u al samengewerkt, en hoe stemt u uw stijlen af?',
        ],
      },
    ],
    faq: [
      { question: 'Is een trouwfotograaf of een videograaf beter?', answer: 'Neemt u er maar één, dan de fotograaf: foto’s blijven, worden gedrukt en bekeken zonder moeite. Voeg de videograaf toe als de stemmen (geloften, speeches) voor u tellen.' },
      { question: 'Kan één persoon echt beide doen?', answer: 'Ja, met een methode (verkenning, sleutelmomenten, prioriteit samen beslist, materiaal dat omschakelt) en een grens: geen twee gelijktijdige hoeken. Tot 120 gasten is het de eenvoudigste en goedkoopste oplossing; daarboven komt een tweede operator erbij.' },
      { question: 'Wat kost een duo foto + video in België?', answer: 'Tussen 3.000 en 5.500 € incl. btw voor twee leveranciers op een volledige dag. Eén persoon voor beide kost op de markt 2.500 tot 4.000 €, ' + price('combo') + ' incl. btw bij Heaven Motion.' },
      { question: 'Kan ik video alleen voor de ceremonie nemen?', answer: 'Ja. Een korte dekking (ceremonie, speeches, 2 tot 3 uur) bestaat bij de meeste videografen, tussen 600 en 1.200 €; bij Heaven Motion is dat de evenementenformule video aan 590 € incl. btw voor 3 uur.' },
    ],
    ctaTitle: 'Vertel ons uw dag, wij zeggen welke formule',
    ctaBody: 'Datum, locatie, aantal gasten, en wat voor u telt (de stemmen, het album, de dansvloer): u krijgt binnen 48 u een offerte met de formule die zin heeft, en de tweede operator alleen als de dag erom vraagt.',
    related: [
      { label: 'Foto en video door één persoon: de methode', path: '/nl/foto-en-video-door-een-persoon' },
      { label: 'Wat kost een huwelijksfotograaf én videograaf in België', path: '/nl/gidsen/wat-kost-een-huwelijksfotograaf-en-videograaf-belgie-2026' },
      { label: 'Huwelijksfotograaf & videograaf', path: '/nl/diensten/huwelijk' },
    ],
  },
  {
    slug: 'wedding-photographer-or-videographer-which-to-choose',
    locale: 'en',
    group: 'photo-ou-video',
    category: 'mariage',
    title: 'Wedding photographer or videographer: which to choose, or both?',
    metaTitle: 'Wedding photographer or videographer: which to choose (or both)',
    metaDescription: 'What photos give that video does not, and vice versa; the four options compared with prices; when one person is enough and when you need two operators.',
    eyebrow: 'Decision guide',
    published: '2026-10-05',
    readingMinutes: 8,
    answer: `If you can only keep one, take the photographer: photos get printed, framed, sent and looked at a hundred times; they are the most durable and the cheapest memory (${price('photo')} incl. VAT for a full day). Add the videographer if the voices matter to you — the vows, the speeches, the laughter — because no photo holds them. And if you want both, the question becomes: two suppliers, or one person doing both? The second option costs ${price('combo')} incl. VAT instead of ${separate}, with one style and one point of contact, and one honest limit: no two angles at the same second.`,
    sections: [
      {
        title: 'What photos give that video does not',
        paragraphs: [
          'A photo stops. It fixes a look, a hand, a tear, in a chosen composition. It gets printed, framed on a wall, slipped into an album your children will open. It is shared in one message. And it asks nothing of the viewer: you come across it, you look, done.',
          'A wedding photo report delivers 300 to 600 images, about one per minute: the whole day, from getting ready to the dance floor, with the details (the dress, the rings, the table, the flowers) that video skims over.',
        ],
      },
      {
        title: 'What video gives that photos do not',
        paragraphs: [
          'Sound. Your father’s voice during his speech, the exact words of your vows, the giggle during the ceremony, the music of the first dance. Ten years on, those are the voices you want to hear again, and no photo contains them.',
          'Movement too: the entrance into the room, the exit under the petals, the dance floor at midnight. A wedding film runs 4 to 8 minutes, a teaser 1 minute; some couples add the speeches and the ceremony in a long version.',
          'And one constraint: a film has to be watched. A screen, a few minutes, a moment. It is seen less often than the photos, but more intensely each time.',
        ],
      },
      {
        title: 'The four options compared',
        paragraphs: ['Market prices are those recorded on the Belgian sites cited in our price guide; ours are from the grid.'],
        table: {
          columns: ['Option', 'Belgian market', 'Heaven Motion', 'People on site', 'Style', 'Simultaneous angles'],
          rows: [
            ['Photographer only', '€1,400 – 3,500', `${price('photo')} incl. VAT`, '1', 'One', 'No'],
            ['Videographer only', '€1,500 – 3,000', `${price('video')} incl. VAT`, '1', 'One', 'No'],
            ['Two suppliers', '€3,000 – 5,500', '—', '2 (sometimes 3 or 4)', 'Two, to be matched', 'Yes'],
            ['One person, photo + video', '€2,500 – 4,000', `${price('combo')} incl. VAT`, '1', 'One', 'No (second operator optional)'],
          ],
          note: 'Full day, VAT included. The “photo + video” duos on the market are almost always two people, sometimes a couple or a studio.',
        },
      },
      {
        title: 'Two suppliers: the advantages, and what it really costs',
        paragraphs: [
          'Two professionals, each focused on their craft, two angles at every moment, and full coverage even when everything happens at once. It is the safest option for a very large wedding or a day spread over several venues.',
          'Price is not the only cost. Two styles to match (warm photos and a cold film show), two contracts, two deposits, two schedules to coordinate, two people in each other’s way at the ceremony, and two deliveries on different dates. Good duos solve this by working together often; ask whether they have.',
        ],
      },
      {
        title: 'One person for both: how it works, and where it stops',
        paragraphs: [
          'The method comes down to three things. A location visit to know the venues and the light. A list of key moments (getting ready, ceremony, exit, couple session, speeches, first dance) with, for each, the priority decided with you: photo or video first. And gear that switches in a second, two bodies ready, sound recorded continuously during the speeches.',
          'The limit is simple: when the bride walks in, there is one photo and one video shot, not two angles. For most weddings of 40 to 120 guests on one or two venues, nobody notices in the delivery. Beyond that, or if the ceremony and the drinks overlap, a second operator (' + second + ') is added and the limit disappears.',
        ],
        list: [
          'One style, one colour grade across photos and film.',
          'One point of contact, one contract, one deposit, one delivery date.',
          'Fewer people around you at the ceremony and the couple session.',
          `${price('combo')} incl. VAT instead of ${separate} for the two packages separately.`,
        ],
      },
      {
        title: 'How to decide in five questions',
        paragraphs: ['Answer in order; the answer comes by itself.'],
        list: [
          'What total budget for imagery, VAT included? Under €1,500: photo only. Between €1,500 and €2,500: photo, plus a short video of the ceremony and speeches. Above €2,500: both.',
          'Are there speeches, written vows, a celebrant-led ceremony? If so, video is worth it: that is where sound counts.',
          'How many guests, how many venues? Up to 120 guests on one or two venues: one person is enough. Beyond: two operators.',
          'Do you want a printed album? Then photo comes first, and the film can stay short.',
          'Can you stand being filmed? Some couples are more at ease with a camera than a video camera. A discreet film, without interviews or staging, settles it.',
        ],
      },
      {
        title: 'Questions to ask before signing',
        paragraphs: ['To a photographer, a videographer, or someone who does both.'],
        list: [
          'Show me a complete wedding, not the ten best images: the whole gallery and the film.',
          'How many photos delivered, in how long, and edited how?',
          'How long is the film, with or without the speeches, on what music (licensed)?',
          'What happens if you are ill on the day?',
          'For one person: what is your method at the key moments, and from how many guests do you add a second operator?',
          'For a duo: have you worked together before, and how do you match your styles?',
        ],
      },
    ],
    faq: [
      { question: 'Is a wedding photographer or a videographer better?', answer: 'If you only take one, the photographer: photos last, get printed and are looked at effortlessly. Add the videographer if the voices (vows, speeches) matter to you.' },
      { question: 'Can one person really do both?', answer: 'Yes, with a method (location visit, key moments, priority decided with you, gear that switches) and one limit: no two simultaneous angles. Up to 120 guests it is the simplest and cheapest solution; beyond that a second operator is added.' },
      { question: 'How much does a photo + video duo cost in Belgium?', answer: 'Between €3,000 and €5,500 incl. VAT for two suppliers on a full day. One person for both costs €2,500 to €4,000 on the market, ' + price('combo') + ' incl. VAT at Heaven Motion.' },
      { question: 'Can I book video for the ceremony only?', answer: 'Yes. Short coverage (ceremony, speeches, 2 to 3 hours) exists with most videographers, between €600 and €1,200; at Heaven Motion it is the events video package at €590 incl. VAT for 3 hours.' },
    ],
    ctaTitle: 'Tell us about your day, we tell you which package',
    ctaBody: 'Date, venue, guest count, and what matters to you (the voices, the album, the dance floor): you receive within 48 h a quote with the package that makes sense, and the second operator only if the day calls for it.',
    related: [
      { label: 'Photo and video by one person: the method', path: '/en/one-photographer-videographer' },
      { label: 'How much does a wedding photographer cost in Belgium', path: '/en/guides/wedding-photographer-cost-belgium-2026' },
      { label: 'Wedding photographer & videographer', path: '/en/services/wedding' },
    ],
  },
];
