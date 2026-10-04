import type { Guide } from '../guide-content';
import { formatPrice, pricingFor } from '../packs';

const c = pricingFor('corporate');
const price = (type: 'photo' | 'video' | 'combo') => formatPrice(c.packs.find((p) => p.type === type)!.price!);

/**
 * Guide prix B2B : combien coûte une vidéo d'entreprise. Deux versions, FR
 * et NL (le marché anglophone bruxellois cherche surtout « corporate video
 * production Brussels », une intention agence, pas un guide prix). Les
 * fourchettes viennent des grilles publiées par les plateformes de mise en
 * relation (Sortlist, Malt) et des sites d'agences et de freelances belges
 * relevés en septembre 2026 ; les nôtres de la grille corporate, HTVA.
 */
export const GUIDES_CORPORATE_PRICE: readonly Guide[] = [
  {
    slug: 'prix-video-entreprise-belgique-2026',
    locale: 'fr',
    group: 'prix-video-entreprise',
    category: 'corporate',
    title: 'Combien coûte une vidéo d’entreprise en Belgique en 2026 ?',
    metaTitle: 'Prix d’une vidéo d’entreprise en Belgique (2026) : fourchettes et exemples',
    metaDescription: `Ce que coûtent un film d’entreprise, un aftermovie, une vidéo de recrutement ou des portraits d’équipe en Belgique, ce qui fait varier le devis, les frais cachés, et nos prix HTVA : film 1 à 2 min à ${price('video')}.`,
    eyebrow: 'Guide prix B2B',
    published: '2026-10-05',
    readingMinutes: 9,
    answer: `En Belgique, une vidéo d’entreprise coûte entre 1 000 et 3 000 € HTVA chez un freelance pour un film de 1 à 3 minutes tourné en une journée, entre 3 000 et 10 000 € HTVA en agence avec script, équipe et motion design, et au-delà de 10 000 € pour une campagne publicitaire. Un aftermovie d’événement se situe entre 800 et 2 000 €, une vidéo de recrutement entre 2 500 et 6 000 €, un lot de portraits d’équipe entre 400 et 900 €. Chez Heaven Motion, le film de 1 à 2 minutes avec formats réseaux est à ${price('video')} HTVA, les portraits à ${price('photo')} HTVA, et les deux en une demi-journée à ${price('combo')} HTVA. Le détail ci-dessous.`,
    sections: [
      {
        title: 'Les fourchettes du marché belge, par type de vidéo',
        paragraphs: [
          'Les prix ci-dessous sont ceux affichés ou cités par les plateformes de mise en relation (Sortlist publie des fourchettes par type de projet, Malt des tarifs journaliers de freelances) et par les agences et indépendants belges qui publient leurs prix. Ils sont hors TVA, comme toujours en B2B.',
        ],
        table: {
          columns: ['Type de vidéo', 'Freelance', 'Agence', 'Heaven Motion (HTVA)'],
          rows: [
            ['Film d’entreprise 1 à 3 min, 1 jour de tournage', '1 000 – 3 000 €', '3 000 – 10 000 €', `${price('video')} (demi-journée, 1 à 2 min + formats réseaux)`],
            ['Aftermovie d’événement, 1 à 3 min', '800 – 2 000 €', '2 000 – 5 000 €', `${price('video')} (demi-journée) ; journée sur devis`],
            ['Vidéo de recrutement / marque employeur', '2 000 – 4 000 €', '4 000 – 10 000 €', 'Sur devis, à partir du film + interviews'],
            ['Interview ou témoignage client, 1 à 2 min', '600 – 1 500 €', '1 500 – 4 000 €', `${price('video')} (demi-journée, jusqu’à 2 interviews)`],
            ['Portraits d’équipe / headshots, 10 à 30 personnes', '400 – 900 €', '900 – 2 000 €', `${price('photo')} (demi-journée)`],
            ['Reels et formats courts, lot de 4 à 8', '500 – 1 500 €', '1 500 – 4 000 €', 'Inclus dans le film (3 formats) ; lot sur devis'],
            ['Film + portraits le même jour', '1 500 – 3 500 €', '4 000 – 12 000 €', `${price('combo')} (demi-journée)`],
          ],
          note: 'Prix hors TVA. Les fourchettes agence incluent généralement un chef de projet, un scénario et une équipe de deux à quatre personnes.',
        },
      },
      {
        title: 'Ce qui fait varier le prix, dans l’ordre',
        paragraphs: ['Un devis vidéo se compose presque toujours des mêmes postes. Les voici, du plus lourd au plus léger.'],
        list: [
          'Les jours de tournage : c’est le premier poste. Une demi-journée suffit pour un film court sur un site ; deux ou trois jours pour une vidéo de recrutement sur plusieurs sites.',
          'La taille de l’équipe : une personne (cadreur-monteur), ou un réalisateur, un cadreur, un ingénieur du son et un assistant. Chaque personne ajoute 400 à 800 € par jour.',
          'La pré-production : script, storyboard, repérages, casting. Une agence y passe plusieurs jours ; un freelance la limite à un brief et un repérage.',
          'Le montage et ses allers-retours : un film de 2 minutes demande 1 à 3 jours de montage ; chaque version supplémentaire au-delà de celles incluses se facture.',
          'Les interviews : la prise de son, l’éclairage et le dérushage prennent du temps ; au-delà de deux interviews, le montage s’allonge.',
          'Le drone, le motion design, la voix off, le sous-titrage : des options de 150 à 1 500 € chacune.',
          'Les formats livrés : un seul 16/9, ou aussi les versions 9/16 et 1/1 pour les réseaux et une version courte de 30 secondes.',
          'Les droits d’usage : certains prestataires facturent plus cher une diffusion publicitaire payante qu’une diffusion sur votre site et vos réseaux.',
        ],
      },
      {
        title: 'Ce qui est inclus chez Heaven Motion, et ce qui ne l’est pas',
        paragraphs: [
          `Le film à ${price('video')} HTVA comprend une demi-journée de tournage sur un site, jusqu’à deux interviews, le montage d’un film de 1 à 2 minutes, deux allers-retours de corrections, la musique sous licence, et trois formats (16/9, 9/16, 1/1). Les portraits à ${price('photo')} HTVA comprennent la demi-journée, un espace portrait monté sur place, la retouche de chaque portrait et la livraison en format LinkedIn. Les deux ensemble, le même jour, à ${price('combo')} HTVA.`,
          'Ne sont pas inclus : le drone (190 €), la voix off et le sous-titrage (sur devis), les jours supplémentaires, le motion design au-delà des titres, les déplacements hors zone incluse (forfaits de 90 à 290 €), et une diffusion publicitaire payante, à signaler au devis.',
        ],
      },
      {
        title: 'Les frais cachés à vérifier sur un devis',
        paragraphs: ['Cinq lignes qui manquent souvent et qui font gonfler la facture finale.'],
        list: [
          'La musique : une licence pour une diffusion commerciale coûte de 50 à 500 € selon le catalogue ; vérifiez qu’elle est comprise et couvre vos usages.',
          'Les corrections : combien de versions sont incluses, et à quel prix la suivante.',
          'Les rushes : la livraison des fichiers bruts est rarement incluse ; comptez 150 à 500 € si vous les voulez.',
          'Les formats : un seul fichier livré, ou les déclinaisons pour LinkedIn, Instagram et YouTube.',
          'Les déplacements et les frais : kilomètres, repas, parking, nuit d’hôtel, parfois facturés en sus sans être annoncés.',
        ],
      },
      {
        title: 'Un exemple de budget : film de présentation pour une PME de 25 personnes',
        paragraphs: [
          'Objectif : un film de 90 secondes pour la page d’accueil et LinkedIn, avec deux interviews (le dirigeant et une collaboratrice), des plans des bureaux et de l’atelier, et les portraits de toute l’équipe pour le site.',
          `Chez Heaven Motion : demi-journée film + portraits à ${price('combo')} HTVA, drone pour deux plans de l’atelier 190 €, déplacement inclus à moins de 60 km de Bruxelles. Total : 1 580 € HTVA, livraison sous 2 à 4 semaines. Le même brief en agence se chiffre entre 5 000 et 8 000 € HTVA, avec un script écrit et une équipe de trois personnes.`,
        ],
      },
      {
        title: 'Comment bien briefer, pour payer le juste prix',
        paragraphs: ['Un brief clair évite les versions inutiles et les jours de tournage en trop.'],
        list: [
          'L’objectif et le canal : page d’accueil, LinkedIn, salon, recrutement. Le canal décide de la durée et des formats.',
          'Le message en une phrase, et les deux ou trois preuves qui le soutiennent.',
          'Qui parle : les interviewés, prévenus et disponibles, avec une plage horaire calme.',
          'Les lieux : accès, lumière, bruit, autorisations (site industriel, port, institution).',
          'Les contraintes de marque : logo, couleurs, typographie, musique à éviter.',
          'La date de livraison, et qui valide (une seule personne, idéalement).',
        ],
      },
    ],
    faq: [
      { question: 'Combien coûte une vidéo d’entreprise de 2 minutes ?', answer: 'Entre 1 000 et 3 000 € HTVA chez un freelance belge, entre 3 000 et 10 000 € en agence. Chez Heaven Motion, ' + price('video') + ' HTVA pour une demi-journée, le montage, deux corrections et trois formats.' },
      { question: 'Quel est le tarif journalier d’un vidéaste freelance en Belgique ?', answer: 'Entre 450 et 900 € HTVA la journée de tournage selon Malt et les sites de freelances, montage non compris ; le montage se facture 350 à 700 € par jour.' },
      { question: 'La TVA est-elle récupérable ?', answer: 'Oui, pour une entreprise assujettie : les prix sont affichés hors TVA, la TVA de 21 % est déductible. Pour une entreprise française, néerlandaise ou luxembourgeoise, la facture est en autoliquidation.' },
      { question: 'Combien de temps pour recevoir le film ?', answer: 'Deux à quatre semaines après le tournage chez la plupart des prestataires, avec un premier montage à valider ; une livraison express (190 €) divise le délai par deux.' },
      { question: 'Vaut-il mieux une agence ou un freelance ?', answer: 'Une agence pour une campagne avec script, acteurs et motion design ; un freelance pour un film de présentation, des interviews, un aftermovie ou des portraits, à un tiers du prix. Le résultat dépend du brief plus que de la structure.' },
      { question: 'Peut-on faire les portraits d’équipe et le film le même jour ?', answer: 'Oui, c’est même le cas le plus efficace : l’équipe est réunie une seule fois. Chez Heaven Motion, la demi-journée combinée est à ' + price('combo') + ' HTVA.' },
    ],
    ctaTitle: 'Un devis HTVA sous 48 h',
    ctaBody: 'Décrivez l’objectif, le canal, le nombre d’interviews et le lieu : vous recevez un devis ligne par ligne, avec les formats livrés, les corrections incluses et le délai.',
    related: [
      { label: 'Photographe & vidéaste corporate', path: '/prestations/corporate' },
      { label: 'La grille complète et les options', path: '/tarifs' },
      { label: 'Projets réalisés', path: '/projets' },
    ],
  },
  {
    slug: 'wat-kost-een-bedrijfsvideo-belgie-2026',
    locale: 'nl',
    group: 'prix-video-entreprise',
    category: 'corporate',
    title: 'Wat kost een bedrijfsvideo in België in 2026?',
    metaTitle: 'Prijs van een bedrijfsvideo in België (2026): prijsvorken en voorbeelden',
    metaDescription: `Wat een bedrijfsfilm, aftermovie, wervingsvideo of teamportretten kosten in België, wat de offerte doet schommelen, de verborgen kosten, en onze prijzen excl. btw: film van 1 à 2 min aan ${price('video')}.`,
    eyebrow: 'Prijsgids B2B',
    published: '2026-10-05',
    readingMinutes: 9,
    answer: `In België kost een bedrijfsvideo tussen 1.000 en 3.000 € excl. btw bij een freelancer voor een film van 1 tot 3 minuten op één draaidag, tussen 3.000 en 10.000 € excl. btw bij een bureau met script, crew en motion design, en meer dan 10.000 € voor een reclamecampagne. Een aftermovie van een event zit tussen 800 en 2.000 €, een wervingsvideo tussen 2.500 en 6.000 €, een reeks teamportretten tussen 400 en 900 €. Bij Heaven Motion kost de film van 1 tot 2 minuten met socialemediaformaten ${price('video')} excl. btw, de portretten ${price('photo')} excl. btw, en beide op één halve dag ${price('combo')} excl. btw. Het detail hieronder.`,
    sections: [
      {
        title: 'De prijsvorken van de Belgische markt, per type video',
        paragraphs: [
          'De prijzen hieronder zijn die van de matchingplatformen (Sortlist publiceert vorken per projecttype, Malt dagtarieven van freelancers) en van de Belgische bureaus en zelfstandigen die hun prijzen online zetten. Ze zijn exclusief btw, zoals altijd in B2B.',
        ],
        table: {
          columns: ['Type video', 'Freelancer', 'Bureau', 'Heaven Motion (excl. btw)'],
          rows: [
            ['Bedrijfsfilm 1 tot 3 min, 1 draaidag', '1.000 – 3.000 €', '3.000 – 10.000 €', `${price('video')} (halve dag, 1 tot 2 min + socialemediaformaten)`],
            ['Aftermovie van een event, 1 tot 3 min', '800 – 2.000 €', '2.000 – 5.000 €', `${price('video')} (halve dag); hele dag op offerte`],
            ['Wervingsvideo / employer branding', '2.000 – 4.000 €', '4.000 – 10.000 €', 'Op offerte, vanaf film + interviews'],
            ['Interview of klantgetuigenis, 1 tot 2 min', '600 – 1.500 €', '1.500 – 4.000 €', `${price('video')} (halve dag, tot 2 interviews)`],
            ['Teamportretten / headshots, 10 tot 30 personen', '400 – 900 €', '900 – 2.000 €', `${price('photo')} (halve dag)`],
            ['Reels en korte formaten, reeks van 4 tot 8', '500 – 1.500 €', '1.500 – 4.000 €', 'In de film inbegrepen (3 formaten); reeks op offerte'],
            ['Film + portretten op dezelfde dag', '1.500 – 3.500 €', '4.000 – 12.000 €', `${price('combo')} (halve dag)`],
          ],
          note: 'Prijzen exclusief btw. De bureauvorken omvatten meestal een projectleider, een script en een crew van twee tot vier personen.',
        },
      },
      {
        title: 'Wat de prijs doet schommelen, in volgorde',
        paragraphs: ['Een video-offerte bestaat bijna altijd uit dezelfde posten. Hier zijn ze, van zwaar naar licht.'],
        list: [
          'De draaidagen: de eerste post. Een halve dag volstaat voor een korte film op één site; twee of drie dagen voor een wervingsvideo op meerdere sites.',
          'De grootte van de crew: één persoon (cameraman-editor), of een regisseur, een cameraman, een geluidstechnicus en een assistent. Elke persoon voegt 400 tot 800 € per dag toe.',
          'De preproductie: script, storyboard, verkenning, casting. Een bureau besteedt er meerdere dagen aan; een freelancer beperkt het tot een briefing en een verkenning.',
          'De montage en de correctierondes: een film van 2 minuten vraagt 1 tot 3 dagen montage; elke extra versie boven de inbegrepen rondes wordt aangerekend.',
          'De interviews: geluid, licht en het uitkijken van de beelden kosten tijd; boven twee interviews wordt de montage langer.',
          'Drone, motion design, voice-over, ondertiteling: opties van 150 tot 1.500 € elk.',
          'De geleverde formaten: één 16/9, of ook de 9/16- en 1/1-versies voor sociale media en een korte versie van 30 seconden.',
          'De gebruiksrechten: sommige leveranciers rekenen meer aan voor betaalde advertenties dan voor uw site en uw kanalen.',
        ],
      },
      {
        title: 'Wat bij Heaven Motion inbegrepen is, en wat niet',
        paragraphs: [
          `De film aan ${price('video')} excl. btw omvat een halve dag opnames op één site, tot twee interviews, de montage van een film van 1 tot 2 minuten, twee correctierondes, muziek onder licentie en drie formaten (16/9, 9/16, 1/1). De portretten aan ${price('photo')} excl. btw omvatten de halve dag, een portretset ter plaatse, de bewerking van elk portret en de levering in LinkedIn-formaat. Beide samen, dezelfde dag, aan ${price('combo')} excl. btw.`,
          'Niet inbegrepen: de drone (190 €), voice-over en ondertiteling (op offerte), extra dagen, motion design buiten de titels, verplaatsingen buiten de inbegrepen zone (vaste kosten van 90 tot 290 €), en betaalde advertentiecampagnes, te melden bij de offerte.',
        ],
      },
      {
        title: 'De verborgen kosten om na te kijken op een offerte',
        paragraphs: ['Vijf lijnen die vaak ontbreken en de eindfactuur doen oplopen.'],
        list: [
          'De muziek: een licentie voor commercieel gebruik kost 50 tot 500 € naargelang de catalogus; check dat ze inbegrepen is en uw gebruik dekt.',
          'De correcties: hoeveel versies zijn inbegrepen, en wat kost de volgende.',
          'De ruwe beelden: de levering van de rushes is zelden inbegrepen; reken op 150 tot 500 € als u ze wilt.',
          'De formaten: één bestand, of de versies voor LinkedIn, Instagram en YouTube.',
          'Verplaatsingen en kosten: kilometers, maaltijden, parking, hotelnacht, soms extra aangerekend zonder dat het vooraf gezegd is.',
        ],
      },
      {
        title: 'Een voorbeeldbudget: presentatiefilm voor een kmo van 25 personen',
        paragraphs: [
          'Doel: een film van 90 seconden voor de homepage en LinkedIn, met twee interviews (de zaakvoerder en een medewerkster), beelden van de kantoren en het atelier, en portretten van het hele team voor de website.',
          `Bij Heaven Motion: halve dag film + portretten aan ${price('combo')} excl. btw, drone voor twee shots van het atelier 190 €, verplaatsing inbegrepen binnen 60 km van Brussel. Totaal: 1.580 € excl. btw, levering binnen 2 tot 4 weken. Dezelfde briefing bij een bureau kost 5.000 tot 8.000 € excl. btw, met een geschreven script en een crew van drie.`,
        ],
      },
      {
        title: 'Goed briefen, om de juiste prijs te betalen',
        paragraphs: ['Een duidelijke briefing vermijdt nutteloze versies en overbodige draaidagen.'],
        list: [
          'Het doel en het kanaal: homepage, LinkedIn, beurs, werving. Het kanaal bepaalt duur en formaten.',
          'De boodschap in één zin, en de twee of drie bewijzen die ze dragen.',
          'Wie spreekt: de geïnterviewden, verwittigd en beschikbaar, met een rustig tijdslot.',
          'De locaties: toegang, licht, lawaai, toelatingen (industriële site, haven, instelling).',
          'De merkregels: logo, kleuren, typografie, muziek om te vermijden.',
          'De leverdatum, en wie valideert (idealiter één persoon).',
        ],
      },
    ],
    faq: [
      { question: 'Wat kost een bedrijfsvideo van 2 minuten?', answer: 'Tussen 1.000 en 3.000 € excl. btw bij een Belgische freelancer, tussen 3.000 en 10.000 € bij een bureau. Bij Heaven Motion ' + price('video') + ' excl. btw voor een halve dag, de montage, twee correcties en drie formaten.' },
      { question: 'Wat is het dagtarief van een freelance videograaf in België?', answer: 'Tussen 450 en 900 € excl. btw per draaidag volgens Malt en de freelancesites, montage niet inbegrepen; montage wordt aan 350 tot 700 € per dag aangerekend.' },
      { question: 'Is de btw aftrekbaar?', answer: 'Ja, voor een btw-plichtige onderneming: de prijzen zijn exclusief btw, de btw van 21 % is aftrekbaar. Voor een Nederlands, Frans of Luxemburgs bedrijf wordt de btw verlegd.' },
      { question: 'Hoe lang duurt het voor de film klaar is?', answer: 'Twee tot vier weken na de opnames bij de meeste leveranciers, met een eerste montage om goed te keuren; een snelle levering (190 €) halveert de termijn.' },
      { question: 'Bureau of freelancer?', answer: 'Een bureau voor een campagne met script, acteurs en motion design; een freelancer voor een presentatiefilm, interviews, een aftermovie of portretten, aan een derde van de prijs. Het resultaat hangt meer af van de briefing dan van de structuur.' },
    ],
    ctaTitle: 'Een offerte excl. btw binnen 48 u',
    ctaBody: 'Beschrijf het doel, het kanaal, het aantal interviews en de locatie: u krijgt een offerte lijn per lijn, met de geleverde formaten, de inbegrepen correcties en de termijn.',
    related: [
      { label: 'Zakelijke fotograaf & videograaf', path: '/nl/diensten/zakelijk' },
      { label: 'De volledige tarieven en opties', path: '/nl/tarieven' },
      { label: 'Projecten', path: '/nl/projecten' },
    ],
  },
];
