import { FaqEntry } from './faq-content';
import { SiteLocale } from './locale';
import { formatPrice, pricingFor } from './packs';

export interface OnePersonContent {
  readonly title: string;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly eyebrow: string;
  /** Réponse directe, dans les 100 premiers mots : c'est ce que les moteurs citent. */
  readonly answer: string;
  readonly momentsTitle: string;
  readonly momentsLead: string;
  readonly moments: readonly { readonly title: string; readonly body: string }[];
  readonly advantagesTitle: string;
  readonly advantages: readonly { readonly title: string; readonly body: string }[];
  readonly limitsTitle: string;
  readonly limits: readonly string[];
  readonly secondTitle: string;
  readonly second: string;
  readonly faqTitle: string;
  readonly faq: readonly FaqEntry[];
  readonly ctaTitle: string;
  readonly ctaBody: string;
}

const combo = pricingFor('mariage').packs.find((p) => p.type === 'combo')!.price!;
const photo = pricingFor('mariage').packs.find((p) => p.type === 'photo')!.price!;
const video = pricingFor('mariage').packs.find((p) => p.type === 'video')!.price!;
const saving = formatPrice(photo + video - combo);

/**
 * Page « photo et vidéo par une seule personne » : l'argument central du
 * site, et l'objection n°1 relevée dans l'analyse concurrentielle (« on
 * rate des moments »). Réponse honnête : la méthode, les avantages, les
 * limites, et le cas où un second opérateur est proposé. Les faits
 * viennent des packs ; aucun matériel n'est nommé tant que le client ne
 * l'a pas communiqué.
 */
export const ONE_PERSON_CONTENT: Record<SiteLocale, OnePersonContent> = {
  fr: {
    title: 'Photo et vidéo par une seule personne',
    metaTitle: 'Photographe et vidéaste de mariage : une seule personne pour les deux',
    metaDescription: `Oui, une seule personne peut faire la photo et la vidéo d’un mariage sans rater de moments — à condition d’une méthode. Comment ça marche, les avantages (un seul style, ${saving} d’économie), les limites, et quand ajouter un second opérateur.`,
    eyebrow: 'La méthode',
    answer: `Oui, une seule personne peut faire la photo et la vidéo de votre mariage sans rater de moments — à trois conditions : préparer les moments clés au repérage, décider avec vous de la priorité quand photo et vidéo se disputent la même seconde, et ajouter un second opérateur quand la journée le demande (plus de 120 invités, cérémonie religieuse longue). C’est le principe du pack photo + vidéo : un seul style, un seul interlocuteur, moins de monde autour de vous, et ${saving} de moins que deux prestataires séparés.`,
    momentsTitle: 'Les cinq moments où tout se joue',
    momentsLead: 'Un mariage a une poignée d’instants qui n’arrivent qu’une fois. Pour chacun, la priorité entre photo et vidéo est décidée avant, pas sur le moment.',
    moments: [
      { title: 'Les préparatifs', body: 'Le moment le plus calme et le plus riche. Vidéo en plans fixes pendant que la photo circule : les détails, les mains, les regards. Rien n’est simultané, tout est captable.' },
      { title: 'L’entrée', body: 'La vidéo tourne en continu depuis un point fixe, dans l’axe ; la photo se prend en rafale sur les trois premières secondes, puis sur l’émotion des invités. Préparé au repérage, l’axe ne change pas.' },
      { title: 'L’échange des alliances', body: 'Le moment le plus disputé. Par défaut, la vidéo est prioritaire : c’est elle qui garde les voix et les mots. La photo se fait juste avant et juste après — ce sont de toute façon les images qu’on garde. Si vous préférez l’inverse, on le décide ensemble.' },
      { title: 'Le premier regard et la sortie', body: 'Deux temps longs, pas des secondes : il y a de quoi faire les deux. La photo d’abord sur le premier regard, la vidéo sur la sortie, puis l’inverse.' },
      { title: 'L’ouverture de bal', body: 'Vidéo en continu, photo au flash entre les figures. La danse dure assez longtemps pour les deux.' },
    ],
    advantagesTitle: 'Ce que ça change pour vous',
    advantages: [
      { title: 'Un seul style', body: 'Les photos et le film racontent la même journée, avec le même regard, les mêmes couleurs. Deux prestataires donnent deux lectures qui se contredisent parfois.' },
      { title: 'Un seul interlocuteur', body: 'Un devis, un contrat, une facture, un numéro à appeler la veille. Pas de coordination entre deux agendas, deux styles, deux délais de livraison.' },
      { title: 'Moins de monde autour de vous', body: 'Une personne au lieu de deux ou trois : la cérémonie reste la vôtre, les invités oublient la caméra, les photos sont plus naturelles.' },
      { title: `${saving} d’économie`, body: `Un seul déplacement, un seul repérage, une seule journée de travail. Le pack photo + vidéo mariage est à ${formatPrice(combo)} TTC, contre ${formatPrice(photo)} + ${formatPrice(video)} pour les deux séparés.` },
    ],
    limitsTitle: 'Ce qu’une seule personne ne peut pas faire',
    limits: [
      'Deux angles en même temps sur une même seconde : pendant l’échange des alliances, le film et la photo ne viennent pas du même point de vue qu’avec deux personnes.',
      'Couvrir deux lieux à la fois : si les préparatifs des deux mariés se font à dix kilomètres l’un de l’autre, il faut choisir ou ajouter un second opérateur.',
      'Une cérémonie religieuse d’une heure et demie avec 200 invités sans un moment de battement : là, un second opérateur n’est pas un luxe, c’est la bonne décision.',
    ],
    secondTitle: 'Quand je propose un second opérateur',
    second: 'Au-delà de 120 invités, pour une cérémonie religieuse longue, ou quand les préparatifs se font sur deux lieux. Il est proposé, jamais imposé : 490 € pour la journée, et il couvre le second angle pendant les moments simultanés. Dans tous les autres cas, une seule personne suffit, et c’est ce que je recommande.',
    faqTitle: 'Questions fréquentes',
    faq: [
      { question: 'Avec un seul appareil, comment faites-vous photo et vidéo ?', answer: 'Avec un boîtier hybride qui bascule de l’un à l’autre en une pression, et une seconde optique montée sur un second boîtier pour ne jamais changer d’objectif pendant un moment clé.' },
      { question: 'Le film sera-t-il moins bon que celui d’un vidéaste seul ?', answer: 'Non sur la narration et l’image ; oui sur le nombre d’angles pendant les secondes où photo et vidéo se disputent le même instant. C’est précisément ce que le second opérateur compense quand la journée le justifie.' },
      { question: 'Combien de photos et quelle durée de film ?', answer: 'Environ 400 photos retouchées et un film de 5 à 8 minutes avec un teaser d’une minute, comme pour les packs séparés. Le combo ne réduit aucun livrable.' },
      { question: 'Et si je veux surtout la vidéo, avec quelques photos ?', answer: 'Le sur mesure permet exactement ça : vidéo complète et un best-of photo réduit, à un prix intermédiaire.' },
      { question: 'Pouvons-nous vous voir travailler avant de réserver ?', answer: 'Oui : un film et une galerie d’un même mariage, côte à côte, vous sont envoyés avec le devis.' },
    ],
    ctaTitle: 'Un devis photo + vidéo en 48 h',
    ctaBody: 'Dites-moi la date, le lieu et le nombre d’invités : le devis précise si un second opérateur est recommandé, et pourquoi.',
  },
  nl: {
    title: 'Foto en video door één persoon',
    metaTitle: 'Trouwfotograaf en -videograaf: één persoon voor beide',
    metaDescription: `Ja, één persoon kan de foto en de video van een huwelijk maken zonder momenten te missen — op voorwaarde van een methode. Hoe het werkt, de voordelen (één stijl, ${saving} besparing), de grenzen, en wanneer een tweede operator erbij komt.`,
    eyebrow: 'De methode',
    answer: `Ja, één persoon kan de foto en de video van uw huwelijk maken zonder momenten te missen — onder drie voorwaarden: de sleutelmomenten voorbereiden bij de verkenning, samen met u beslissen wat voorrang krijgt als foto en video dezelfde seconde opeisen, en een tweede operator toevoegen als de dag erom vraagt (meer dan 120 gasten, lange kerkelijke ceremonie). Dat is het principe van het pakket foto + video: één stijl, één aanspreekpunt, minder volk rond u, en ${saving} minder dan twee aparte leveranciers.`,
    momentsTitle: 'De vijf momenten waar alles om draait',
    momentsLead: 'Een huwelijk heeft een handvol ogenblikken die maar één keer gebeuren. Voor elk ervan wordt de voorrang tussen foto en video vooraf beslist, niet op het moment zelf.',
    moments: [
      { title: 'De voorbereidingen', body: 'Het rustigste en rijkste moment. Video in vaste shots terwijl de foto rondgaat: de details, de handen, de blikken. Niets gebeurt tegelijk, alles is vast te leggen.' },
      { title: 'De intrede', body: 'De video draait continu vanaf een vast punt, in de as; de foto in burst op de eerste drie seconden, daarna op de emotie van de gasten. Voorbereid bij de verkenning, de as verandert niet.' },
      { title: 'De ringen', body: 'Het meest betwiste moment. Standaard krijgt de video voorrang: zij bewaart de stemmen en de woorden. De foto’s komen net ervoor en net erna — dat zijn sowieso de beelden die men bijhoudt. Wilt u het omgekeerde, dan beslissen we dat samen.' },
      { title: 'De first look en het buitenkomen', body: 'Twee lange momenten, geen seconden: er is tijd voor beide. Eerst foto op de first look, video op het buitenkomen, en dan omgekeerd.' },
      { title: 'De openingsdans', body: 'Video continu, foto met flits tussen de figuren. De dans duurt lang genoeg voor beide.' },
    ],
    advantagesTitle: 'Wat het voor u verandert',
    advantages: [
      { title: 'Eén stijl', body: 'De foto’s en de film vertellen dezelfde dag, met dezelfde blik, dezelfde kleuren. Twee leveranciers geven twee lezingen die elkaar soms tegenspreken.' },
      { title: 'Eén aanspreekpunt', body: 'Eén offerte, één contract, één factuur, één nummer om de avond ervoor te bellen. Geen coördinatie tussen twee agenda’s, twee stijlen, twee levertermijnen.' },
      { title: 'Minder volk rond u', body: 'Eén persoon in plaats van twee of drie: de ceremonie blijft de uwe, de gasten vergeten de camera, de foto’s zijn natuurlijker.' },
      { title: `${saving} besparing`, body: `Eén verplaatsing, één verkenning, één werkdag. Het pakket foto + video huwelijk kost ${formatPrice(combo)} incl. btw, tegenover ${formatPrice(photo)} + ${formatPrice(video)} voor de twee apart.` },
    ],
    limitsTitle: 'Wat één persoon niet kan',
    limits: [
      'Twee hoeken tegelijk op dezelfde seconde: tijdens de ringen komen film en foto niet uit hetzelfde standpunt als met twee personen.',
      'Twee locaties tegelijk dekken: als de voorbereidingen van beide partners tien kilometer uit elkaar liggen, moet u kiezen of een tweede operator toevoegen.',
      'Een kerkelijke ceremonie van anderhalf uur met 200 gasten zonder één adempauze: daar is een tweede operator geen luxe, maar de juiste beslissing.',
    ],
    secondTitle: 'Wanneer ik een tweede operator voorstel',
    second: 'Vanaf 120 gasten, bij een lange kerkelijke ceremonie, of als de voorbereidingen op twee locaties plaatsvinden. Hij wordt voorgesteld, nooit opgelegd: € 490 voor de dag, en hij dekt de tweede hoek tijdens de gelijktijdige momenten. In alle andere gevallen volstaat één persoon, en dat is wat ik aanbeveel.',
    faqTitle: 'Veelgestelde vragen',
    faq: [
      { question: 'Hoe maakt u foto en video met één camera?', answer: 'Met een hybride camera die met één druk van het ene naar het andere schakelt, en een tweede lens op een tweede body om nooit van objectief te wisselen tijdens een sleutelmoment.' },
      { question: 'Wordt de film minder goed dan die van een aparte videograaf?', answer: 'Niet op vlak van verhaal en beeld; wel op het aantal hoeken tijdens de seconden waarin foto en video hetzelfde moment opeisen. Dat is precies wat de tweede operator compenseert als de dag het rechtvaardigt.' },
      { question: 'Hoeveel foto’s en hoe lang is de film?', answer: 'Ongeveer 400 bewerkte foto’s en een film van 5 tot 8 minuten met een teaser van één minuut, zoals bij de aparte pakketten. De combinatie vermindert geen enkel eindproduct.' },
      { question: 'En als ik vooral de video wil, met enkele foto’s?', answer: 'Op maat laat precies dat toe: volledige video en een beperkte best-of in foto, aan een tussenprijs.' },
      { question: 'Kunnen we uw werk zien vóór we boeken?', answer: 'Ja: een film en een galerij van eenzelfde huwelijk, naast elkaar, worden met de offerte meegestuurd.' },
    ],
    ctaTitle: 'Een offerte foto + video binnen 48 u',
    ctaBody: 'Geef me de datum, de locatie en het aantal gasten: de offerte vermeldt of een tweede operator aanbevolen is, en waarom.',
  },
  en: {
    title: 'Photo and video by one person',
    metaTitle: 'Wedding photographer and videographer: one person for both',
    metaDescription: `Yes, one person can shoot the photos and the video of a wedding without missing moments — provided there is a method. How it works, the advantages (one style, ${saving} saved), the limits, and when to add a second operator.`,
    eyebrow: 'The method',
    answer: `Yes, one person can shoot the photos and the video of your wedding without missing moments — on three conditions: prepare the key moments during scouting, decide with you which takes priority when photo and video compete for the same second, and add a second operator when the day calls for it (more than 120 guests, a long religious ceremony). That is the point of the photo + video package: one style, one point of contact, fewer people around you, and ${saving} less than two separate suppliers.`,
    momentsTitle: 'The five moments where it all happens',
    momentsLead: 'A wedding has a handful of instants that only happen once. For each one, the priority between photo and video is decided beforehand, not in the moment.',
    moments: [
      { title: 'Getting ready', body: 'The calmest and richest moment. Video on fixed shots while the camera moves around for photos: the details, the hands, the looks. Nothing is simultaneous, everything can be captured.' },
      { title: 'The entrance', body: 'Video rolls continuously from a fixed point, on the aisle axis; photos in burst over the first three seconds, then on the guests’ emotion. Prepared during scouting, the axis never changes.' },
      { title: 'The rings', body: 'The most contested moment. By default, video takes priority: it is what keeps the voices and the words. Photos come just before and just after — those are the images you keep anyway. If you prefer the opposite, we decide together.' },
      { title: 'The first look and the exit', body: 'Two long moments, not seconds: there is time for both. Photos first on the first look, video on the exit, then the other way round.' },
      { title: 'The first dance', body: 'Video continuous, flash photos between the figures. The dance lasts long enough for both.' },
    ],
    advantagesTitle: 'What it changes for you',
    advantages: [
      { title: 'One style', body: 'The photos and the film tell the same day, with the same eye, the same colours. Two suppliers give two readings that sometimes contradict each other.' },
      { title: 'One point of contact', body: 'One quote, one contract, one invoice, one number to call the night before. No coordination between two diaries, two styles, two delivery times.' },
      { title: 'Fewer people around you', body: 'One person instead of two or three: the ceremony stays yours, guests forget the camera, photos are more natural.' },
      { title: `${saving} saved`, body: `One trip, one scouting visit, one day of work. The wedding photo + video package is ${formatPrice(combo)} incl. VAT, against ${formatPrice(photo)} + ${formatPrice(video)} for the two separately.` },
    ],
    limitsTitle: 'What one person cannot do',
    limits: [
      'Two angles at once on the same second: during the rings, the film and the photos do not come from the same viewpoint as with two people.',
      'Cover two places at once: if both partners get ready ten kilometres apart, you have to choose or add a second operator.',
      'A ninety-minute religious ceremony with 200 guests and no pause: there, a second operator is not a luxury, it is the right call.',
    ],
    secondTitle: 'When I suggest a second operator',
    second: 'Above 120 guests, for a long religious ceremony, or when getting ready happens in two places. It is suggested, never imposed: €490 for the day, and it covers the second angle during simultaneous moments. In every other case, one person is enough, and that is what I recommend.',
    faqTitle: 'Frequently asked questions',
    faq: [
      { question: 'With one camera, how do you shoot photo and video?', answer: 'With a hybrid camera that switches from one to the other at the press of a button, and a second lens mounted on a second body so I never change lenses during a key moment.' },
      { question: 'Will the film be worse than a dedicated videographer’s?', answer: 'Not in storytelling or image; yes in the number of angles during the seconds when photo and video compete for the same instant. That is exactly what the second operator makes up for when the day justifies it.' },
      { question: 'How many photos and how long is the film?', answer: 'Around 400 edited photos and a 5 to 8 minute film with a one-minute teaser, as in the separate packages. The combo does not reduce any deliverable.' },
      { question: 'What if I mostly want the video, with a few photos?', answer: 'The custom option allows exactly that: full video and a reduced photo best-of, at an in-between price.' },
      { question: 'Can we see your work before booking?', answer: 'Yes: a film and a gallery from the same wedding, side by side, are sent with the quote.' },
    ],
    ctaTitle: 'A photo + video quote within 48 h',
    ctaBody: 'Tell me the date, the venue and the guest count: the quote says whether a second operator is recommended, and why.',
  },
};
