import type { Guide } from '../guide-content';
import { formatPrice, pricingFor } from '../packs';

const c = pricingFor('corporate');
const l = pricingFor('lifestyle');
const team = formatPrice(c.packs.find((p) => p.type === 'photo')!.price!);
const solo = formatPrice(l.packs.find((p) => p.type === 'photo')!.price!);

/**
 * Guide « préparer » : la photo LinkedIn professionnelle. Trois versions,
 * le sujet étant universel et les requêtes réparties entre « photo LinkedIn
 * professionnelle », « professionele LinkedIn foto » et « LinkedIn headshot
 * Brussels ». Les spécifications techniques citées sont celles publiées par
 * LinkedIn en 2026 (400 × 400 px minimum, 8 Mo, recadrage circulaire).
 */
export const GUIDES_LINKEDIN: readonly Guide[] = [
  {
    slug: 'photo-linkedin-professionnelle-ce-qui-marche-2026',
    locale: 'fr',
    group: 'photo-linkedin',
    category: 'corporate',
    title: 'Photo LinkedIn professionnelle : ce qui marche en 2026',
    metaTitle: 'Photo LinkedIn professionnelle (2026) : cadrage, fond, lumière, tenue, prix',
    metaDescription: 'Ce qui fait une bonne photo de profil LinkedIn en 2026 : cadrage, fond, lumière, regard, tenue, les erreurs qui coûtent des vues, les spécifications techniques, et ce que coûte un portrait professionnel en Belgique, seul ou en équipe.',
    eyebrow: 'Guide corporate',
    published: '2026-10-05',
    readingMinutes: 7,
    answer: `Une bonne photo LinkedIn en 2026 est un portrait cadré de la poitrine au sommet de la tête, le visage occupant environ 60 % de l’image, le regard vers l’objectif, un léger sourire, un fond uni ou flou qui ne raconte rien, une lumière douce venant de face ou de trois quarts, et une tenue qui est celle de vos rendez-vous, pas de votre mariage. Elle est récente (moins de deux ans), nette, et la même sur LinkedIn, votre signature mail et le site de l’entreprise. En Belgique, un portrait individuel chez un photographe coûte entre 90 et 250 €, une séance d’équipe entre 400 et 900 € pour 10 à 30 personnes. Chez Heaven Motion : ${solo} TTC pour une séance individuelle, ${team} HTVA pour une demi-journée en entreprise.`,
    sections: [
      {
        title: 'Les sept règles d’une photo de profil qui marche',
        paragraphs: ['Elles sont les mêmes pour un dirigeant, un commercial, un avocat ou un développeur ; seule la tenue change.'],
        list: [
          'Le cadrage : de la poitrine au sommet de la tête, le visage à 60 % de l’image. LinkedIn recadre en cercle et affiche la photo en miniature de 48 pixels dans les fils : un plan large devient un point.',
          'Le regard : vers l’objectif. C’est le seul contact visuel que le lecteur aura avec vous avant le rendez-vous.',
          'L’expression : un sourire léger, bouche fermée ou à peine ouverte. Le sourire « photo de classe » et le visage fermé perdent tous les deux.',
          'Le fond : uni (gris, blanc cassé, bleu sombre) ou flou (bureau, verrière, mur de brique). Jamais de logo lisible, jamais de salon, jamais de plage.',
          'La lumière : douce, venant de face ou de trois quarts, sans ombres dures sous les yeux. La lumière d’une fenêtre, ou une boîte à lumière en studio.',
          'La tenue : celle de vos rendez-vous clients, dans des couleurs unies. Pas de rayures fines (moiré), pas de blanc pur, pas de logo.',
          'La cohérence : la même photo partout, et la même série pour toute l’équipe sur le site de l’entreprise. Le lecteur reconnaît un visage en quelques millisecondes ; changez-le et vous repartez de zéro.',
        ],
      },
      {
        title: 'Les erreurs qui coûtent des vues',
        paragraphs: ['Vu sur des milliers de profils, dans l’ordre de fréquence.'],
        list: [
          'Le recadrage d’une photo de groupe ou de mariage : on voit l’épaule de quelqu’un d’autre, et la résolution ne suit pas.',
          'Le selfie en voiture ou devant un miroir : l’angle est faux, la lumière aussi.',
          'La photo de dix ans : le rendez-vous commence par une surprise.',
          'Les lunettes de soleil, le chapeau, l’animal : sympathiques, hors sujet.',
          'Le filtre lissant : le visage perd sa texture et le lecteur le sent.',
          'Le fond chargé : le lecteur regarde le fond, pas vous.',
        ],
      },
      {
        title: 'Les spécifications techniques en 2026',
        paragraphs: ['Pour que la photo reste nette une fois chargée.'],
        table: {
          columns: ['Élément', 'Spécification'],
          rows: [
            ['Photo de profil', 'Carrée, 400 × 400 px minimum, 8 Mo maximum, JPG ou PNG ; livrez en 1 000 × 1 000 px'],
            ['Affichage', 'Recadrée en cercle ; vérifiez que le haut du crâne et le menton restent dans le cercle'],
            ['Bannière', '1 584 × 396 px ; la photo de profil en couvre le coin inférieur gauche'],
            ['Photo du site de l’entreprise', 'Souvent en 4:5 ou 3:4 ; demandez les deux formats au photographe'],
          ],
          note: 'Spécifications publiées par LinkedIn ; elles changent rarement, mais vérifiez-les si la photo s’affiche floue.',
        },
      },
      {
        title: 'Seul ou en équipe : les deux séances',
        paragraphs: [
          `La séance individuelle dure trente à quarante-cinq minutes, en studio, chez vous ou dans un lieu neutre, avec deux tenues et une dizaine de propositions, dont trois à cinq retouchées et livrées en carré et en portrait. Chez Heaven Motion, c’est la séance lifestyle d’une heure trente à ${solo} TTC ; sur le marché belge, un portrait individuel se situe entre 90 et 250 €.`,
          `La séance d’équipe se fait dans vos bureaux : un espace portrait monté en vingt minutes (fond, lumière), cinq à dix minutes par personne, et la même lumière pour tous, ce qui donne une série cohérente sur le site et sur LinkedIn. Chez Heaven Motion, la demi-journée en entreprise coûte ${team} HTVA pour 10 à 30 personnes, chaque portrait retouché et livré en format LinkedIn et site ; sur le marché, entre 400 et 900 € HTVA selon le nombre de personnes.`,
        ],
      },
      {
        title: 'Comment se préparer',
        paragraphs: ['La veille et le jour même.'],
        list: [
          'Deux tenues unies, repassées, essayées la veille. Une veste si c’est votre tenue de rendez-vous.',
          'Une bonne nuit. Les cernes se retouchent, la fatigue dans le regard non.',
          'Cheveux et barbe comme un jour de rendez-vous important, pas coupés la veille.',
          'Lunettes : nettoyées, et portées si vous les portez tous les jours.',
          'Pour une équipe : un responsable qui tient la liste et envoie les gens par créneaux de dix minutes.',
        ],
      },
    ],
    faq: [
      { question: 'Faut-il sourire sur une photo LinkedIn ?', answer: 'Un sourire léger, oui. Les profils avec un sourire naturel sont perçus comme plus compétents et plus accessibles ; le grand sourire et le visage fermé font moins bien.' },
      { question: 'Quel fond pour une photo LinkedIn ?', answer: 'Uni ou flou, dans une couleur neutre. Le fond ne doit rien raconter : le lecteur doit regarder votre visage.' },
      { question: 'Combien coûte une photo LinkedIn professionnelle en Belgique ?', answer: 'Entre 90 et 250 € pour un portrait individuel, entre 400 et 900 € HTVA pour une équipe de 10 à 30 personnes. Chez Heaven Motion : ' + solo + ' TTC la séance individuelle, ' + team + ' HTVA la demi-journée en entreprise.' },
      { question: 'À quelle fréquence changer sa photo ?', answer: 'Tous les deux à trois ans, ou dès qu’elle ne vous ressemble plus (lunettes, barbe, cheveux). Entre-temps, gardez la même partout.' },
      { question: 'Peut-on utiliser une photo générée par IA ?', answer: 'Techniquement oui, mais le rendez-vous qui suit commence par un écart entre la photo et la personne. Une photo réelle, bien faite, évite ce premier malaise.' },
    ],
    ctaTitle: 'Vos portraits LinkedIn, seul ou en équipe',
    ctaBody: 'Dites-nous combien de personnes et où : vous recevez sous 48 h un devis, avec les formats livrés et le délai.',
    related: [
      { label: 'Portraits d’équipe et films d’entreprise : la formule corporate', path: '/prestations/corporate' },
      { label: 'Combien coûte une vidéo d’entreprise en Belgique', path: '/guides/prix-video-entreprise-belgique-2026' },
      { label: 'La grille complète et les options', path: '/tarifs' },
    ],
  },
  {
    slug: 'professionele-linkedin-foto-wat-werkt-2026',
    locale: 'nl',
    group: 'photo-linkedin',
    category: 'corporate',
    title: 'Professionele LinkedIn-foto: wat werkt in 2026',
    metaTitle: 'Professionele LinkedIn-foto (2026): kadrering, achtergrond, licht, kledij, prijs',
    metaDescription: 'Wat een goede LinkedIn-profielfoto maakt in 2026: kadrering, achtergrond, licht, blik, kledij, de fouten die views kosten, de technische specificaties, en wat een professioneel portret kost in België, alleen of met het team.',
    eyebrow: 'Zakelijke gids',
    published: '2026-10-05',
    readingMinutes: 7,
    answer: `Een goede LinkedIn-foto in 2026 is een portret van de borst tot de kruin, met het gezicht op ongeveer 60 % van het beeld, de blik in de lens, een lichte glimlach, een effen of onscherpe achtergrond die niets vertelt, zacht licht van voren of van driekwart, en de kledij van uw afspraken, niet van uw huwelijk. Ze is recent (minder dan twee jaar), scherp, en dezelfde op LinkedIn, in uw e-mailhandtekening en op de bedrijfswebsite. In België kost een individueel portret bij een fotograaf 90 tot 250 €, een teamsessie 400 tot 900 € voor 10 tot 30 personen. Bij Heaven Motion: ${solo} incl. btw voor een individuele sessie, ${team} excl. btw voor een halve dag in het bedrijf.`,
    sections: [
      {
        title: 'De zeven regels van een profielfoto die werkt',
        paragraphs: ['Ze gelden voor een zaakvoerder, een verkoper, een advocaat of een ontwikkelaar; alleen de kledij verschilt.'],
        list: [
          'De kadrering: van de borst tot de kruin, het gezicht op 60 % van het beeld. LinkedIn snijdt rond bij en toont de foto als miniatuur van 48 pixels in de feed: een wijd shot wordt een stip.',
          'De blik: in de lens. Het is het enige oogcontact dat de lezer met u heeft vóór de afspraak.',
          'De uitdrukking: een lichte glimlach, mond dicht of net open. De « klasfoto »-glimlach en het gesloten gezicht verliezen allebei.',
          'De achtergrond: effen (grijs, gebroken wit, donkerblauw) of onscherp (kantoor, glaswand, bakstenen muur). Nooit een leesbaar logo, nooit een salon, nooit een strand.',
          'Het licht: zacht, van voren of van driekwart, zonder harde schaduwen onder de ogen. Het licht van een raam, of een softbox in de studio.',
          'De kledij: die van uw klantafspraken, in effen kleuren. Geen fijne strepen (moiré), geen zuiver wit, geen logo.',
          'De consistentie: dezelfde foto overal, en dezelfde reeks voor het hele team op de bedrijfswebsite. De lezer herkent een gezicht in milliseconden; verander het en u begint van nul.',
        ],
      },
      {
        title: 'De fouten die views kosten',
        paragraphs: ['Gezien op duizenden profielen, in volgorde van frequentie.'],
        list: [
          'De bijgesneden groeps- of trouwfoto: u ziet de schouder van iemand anders, en de resolutie volgt niet.',
          'De selfie in de auto of voor de spiegel: de hoek klopt niet, het licht ook niet.',
          'De foto van tien jaar geleden: de afspraak begint met een verrassing.',
          'Zonnebril, hoed, huisdier: sympathiek, naast de kwestie.',
          'De gladmaakfilter: het gezicht verliest zijn textuur en de lezer voelt het.',
          'De drukke achtergrond: de lezer kijkt naar de achtergrond, niet naar u.',
        ],
      },
      {
        title: 'De technische specificaties in 2026',
        paragraphs: ['Zodat de foto scherp blijft na het uploaden.'],
        table: {
          columns: ['Element', 'Specificatie'],
          rows: [
            ['Profielfoto', 'Vierkant, minimum 400 × 400 px, maximum 8 MB, JPG of PNG; lever in 1.000 × 1.000 px'],
            ['Weergave', 'Rond bijgesneden; controleer dat kruin en kin binnen de cirkel blijven'],
            ['Banner', '1.584 × 396 px; de profielfoto bedekt de linkerbenedenhoek'],
            ['Foto voor de bedrijfswebsite', 'Vaak 4:5 of 3:4; vraag beide formaten aan de fotograaf'],
          ],
          note: 'Specificaties gepubliceerd door LinkedIn; ze veranderen zelden, maar check ze als de foto wazig wordt weergegeven.',
        },
      },
      {
        title: 'Alleen of met het team: de twee sessies',
        paragraphs: [
          `De individuele sessie duurt dertig tot vijfenveertig minuten, in de studio, bij u of op een neutrale plek, met twee outfits en een tiental voorstellen, waarvan drie tot vijf bewerkt en geleverd in vierkant en portret. Bij Heaven Motion is dat de lifestyle-sessie van anderhalf uur aan ${solo} incl. btw; op de Belgische markt kost een individueel portret 90 tot 250 €.`,
          `De teamsessie gebeurt in uw kantoren: een portretset in twintig minuten opgesteld (achtergrond, licht), vijf tot tien minuten per persoon, en hetzelfde licht voor iedereen, wat een consistente reeks geeft op de website en op LinkedIn. Bij Heaven Motion kost de halve dag in het bedrijf ${team} excl. btw voor 10 tot 30 personen, elk portret bewerkt en geleverd in LinkedIn- en websiteformaat; op de markt 400 tot 900 € excl. btw naargelang het aantal personen.`,
        ],
      },
      {
        title: 'Hoe u zich voorbereidt',
        paragraphs: ['De dag voordien en de dag zelf.'],
        list: [
          'Twee effen outfits, gestreken, de dag voordien gepast. Een vest als dat uw afspraakkledij is.',
          'Een goede nacht. Wallen worden bewerkt, vermoeidheid in de blik niet.',
          'Haar en baard zoals op een belangrijke afspraak, niet de dag voordien geknipt.',
          'Bril: gepoetst, en gedragen als u hem elke dag draagt.',
          'Voor een team: één verantwoordelijke die de lijst bijhoudt en de mensen per tien minuten stuurt.',
        ],
      },
    ],
    faq: [
      { question: 'Moet ik glimlachen op een LinkedIn-foto?', answer: 'Een lichte glimlach, ja. Profielen met een natuurlijke glimlach worden als competenter en toegankelijker ervaren; de brede glimlach en het gesloten gezicht doen het minder goed.' },
      { question: 'Welke achtergrond voor een LinkedIn-foto?', answer: 'Effen of onscherp, in een neutrale kleur. De achtergrond mag niets vertellen: de lezer moet naar uw gezicht kijken.' },
      { question: 'Wat kost een professionele LinkedIn-foto in België?', answer: 'Tussen 90 en 250 € voor een individueel portret, tussen 400 en 900 € excl. btw voor een team van 10 tot 30 personen. Bij Heaven Motion: ' + solo + ' incl. btw de individuele sessie, ' + team + ' excl. btw de halve dag in het bedrijf.' },
      { question: 'Hoe vaak de foto vervangen?', answer: 'Elke twee tot drie jaar, of zodra ze niet meer op u lijkt (bril, baard, haar). Ondertussen: dezelfde foto overal.' },
    ],
    ctaTitle: 'Uw LinkedIn-portretten, alleen of met het team',
    ctaBody: 'Zeg ons hoeveel personen en waar: u krijgt binnen 48 u een offerte, met de geleverde formaten en de termijn.',
    related: [
      { label: 'Teamportretten en bedrijfsfilms: de zakelijke formule', path: '/nl/diensten/zakelijk' },
      { label: 'Wat kost een bedrijfsvideo in België', path: '/nl/gidsen/wat-kost-een-bedrijfsvideo-belgie-2026' },
      { label: 'De volledige tarieven en opties', path: '/nl/tarieven' },
    ],
  },
  {
    slug: 'linkedin-headshot-what-works-2026',
    locale: 'en',
    group: 'photo-linkedin',
    category: 'corporate',
    title: 'LinkedIn headshot: what works in 2026',
    metaTitle: 'LinkedIn headshot (2026): framing, background, light, outfit, price in Brussels',
    metaDescription: 'What makes a good LinkedIn profile photo in 2026: framing, background, light, gaze, outfit, the mistakes that cost views, the technical specs, and what a professional headshot costs in Brussels, alone or for a team.',
    eyebrow: 'Corporate guide',
    published: '2026-10-05',
    readingMinutes: 7,
    answer: `A good LinkedIn headshot in 2026 is framed from the chest to the top of the head, with the face filling about 60% of the image, eyes to the lens, a slight smile, a plain or blurred background that tells no story, soft light from the front or three-quarters, and the outfit you wear to meetings, not to weddings. It is recent (under two years), sharp, and the same on LinkedIn, your email signature and the company website. In Brussels, an individual headshot costs between €90 and €250, a team session between €400 and €900 for 10 to 30 people. At Heaven Motion: ${solo} incl. VAT for an individual session, ${team} excl. VAT for half a day at your office, in English.`,
    sections: [
      {
        title: 'The seven rules of a profile photo that works',
        paragraphs: ['They are the same for an executive, a salesperson, a lawyer or a developer; only the outfit changes.'],
        list: [
          'Framing: chest to top of head, face at 60% of the frame. LinkedIn crops to a circle and shows the photo as a 48-pixel thumbnail in feeds: a wide shot becomes a dot.',
          'Gaze: to the lens. It is the only eye contact the reader will have with you before the meeting.',
          'Expression: a slight smile, mouth closed or barely open. The “class photo” grin and the closed face both lose.',
          'Background: plain (grey, off-white, dark blue) or blurred (office, glass wall, brick). Never a readable logo, never a living room, never a beach.',
          'Light: soft, from the front or three-quarters, with no hard shadows under the eyes. Window light, or a softbox in the studio.',
          'Outfit: what you wear to client meetings, in plain colours. No fine stripes (moiré), no pure white, no logos.',
          'Consistency: the same photo everywhere, and the same series for the whole team on the company website. Readers recognise a face in milliseconds; change it and you start from zero.',
        ],
      },
      {
        title: 'The mistakes that cost views',
        paragraphs: ['Seen on thousands of profiles, in order of frequency.'],
        list: [
          'The cropped group or wedding photo: someone else’s shoulder is visible, and the resolution does not hold.',
          'The car or mirror selfie: the angle is wrong, so is the light.',
          'The ten-year-old photo: the meeting starts with a surprise.',
          'Sunglasses, hat, pet: friendly, off topic.',
          'The smoothing filter: the face loses its texture and the reader feels it.',
          'The busy background: the reader looks at the background, not at you.',
        ],
      },
      {
        title: 'The technical specs in 2026',
        paragraphs: ['So the photo stays sharp once uploaded.'],
        table: {
          columns: ['Element', 'Specification'],
          rows: [
            ['Profile photo', 'Square, 400 × 400 px minimum, 8 MB maximum, JPG or PNG; deliver at 1,000 × 1,000 px'],
            ['Display', 'Cropped to a circle; check that crown and chin stay inside the circle'],
            ['Banner', '1,584 × 396 px; the profile photo covers its bottom-left corner'],
            ['Company website photo', 'Often 4:5 or 3:4; ask the photographer for both formats'],
          ],
          note: 'Specifications published by LinkedIn; they rarely change, but check them if the photo displays blurry.',
        },
      },
      {
        title: 'Alone or as a team: the two sessions',
        paragraphs: [
          `The individual session lasts thirty to forty-five minutes, in a studio, at your place or in a neutral location, with two outfits and about ten proposals, of which three to five are edited and delivered in square and portrait. At Heaven Motion it is the ninety-minute lifestyle session at ${solo} incl. VAT; on the Brussels market an individual headshot runs between €90 and €250.`,
          `The team session happens at your office: a portrait set built in twenty minutes (background, light), five to ten minutes per person, and the same light for everyone, which gives a consistent series on the website and on LinkedIn. At Heaven Motion, half a day at your office costs ${team} excl. VAT for 10 to 30 people, each portrait edited and delivered in LinkedIn and website formats; on the market, between €400 and €900 excl. VAT depending on headcount. Common in the EU quarter, where teams change every few years.`,
        ],
      },
      {
        title: 'How to prepare',
        paragraphs: ['The day before and on the day.'],
        list: [
          'Two plain outfits, ironed, tried on the day before. A jacket if that is your meeting outfit.',
          'A good night. Dark circles can be edited, tiredness in the eyes cannot.',
          'Hair and beard as for an important meeting, not cut the day before.',
          'Glasses: cleaned, and worn if you wear them every day.',
          'For a team: one person who keeps the list and sends people in ten-minute slots.',
        ],
      },
    ],
    faq: [
      { question: 'Should I smile in a LinkedIn photo?', answer: 'A slight smile, yes. Profiles with a natural smile are perceived as more competent and approachable; the wide grin and the closed face both do worse.' },
      { question: 'What background for a LinkedIn headshot?', answer: 'Plain or blurred, in a neutral colour. The background should tell nothing: the reader should look at your face.' },
      { question: 'How much does a professional LinkedIn headshot cost in Brussels?', answer: 'Between €90 and €250 for an individual portrait, between €400 and €900 excl. VAT for a team of 10 to 30 people. At Heaven Motion: ' + solo + ' incl. VAT for the individual session, ' + team + ' excl. VAT for half a day at your office.' },
      { question: 'How often should I change my photo?', answer: 'Every two to three years, or as soon as it no longer looks like you (glasses, beard, hair). In between, keep the same one everywhere.' },
      { question: 'Can I use an AI-generated photo?', answer: 'Technically yes, but the meeting that follows starts with a gap between the photo and the person. A real, well-made photo avoids that first awkwardness.' },
    ],
    ctaTitle: 'Your LinkedIn headshots, alone or as a team',
    ctaBody: 'Tell us how many people and where: you receive a quote within 48 h, with the delivered formats and the timeline.',
    related: [
      { label: 'Team headshots and corporate films: the corporate package', path: '/en/services/corporate' },
      { label: 'Photographer & videographer in Brussels', path: '/en/areas/belgium/brussels' },
      { label: 'Full pricing and options', path: '/en/pricing' },
    ],
  },
];
