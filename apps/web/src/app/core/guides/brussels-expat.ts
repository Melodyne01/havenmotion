import type { Guide } from '../guide-content';
import { formatPrice, pricingFor } from '../packs';

const m = pricingFor('mariage');
const price = (type: 'photo' | 'video' | 'combo') => formatPrice(m.packs.find((p) => p.type === type)!.price!);

/**
 * Guide organisation, en anglais uniquement : se marier à Bruxelles quand on
 * est expatrié. Les règles citées sont celles du Code civil belge et des
 * communes bruxelloises (déclaration de mariage, documents, langue de la
 * cérémonie) telles que publiées en 2026 ; les montants et délais varient
 * d'une commune à l'autre et sont donnés comme des ordres de grandeur, avec
 * l'invitation à vérifier auprès de la commune. Renvoie vers la page
 * Bruxelles EN.
 */
export const GUIDES_BRUSSELS_EXPAT: readonly Guide[] = [
  {
    slug: 'getting-married-in-brussels-expat-guide',
    locale: 'en',
    group: 'brussels-expat',
    category: 'mariage',
    title: 'Getting married in Brussels as an expat: civil ceremony, communes, documents and photos',
    metaTitle: 'Getting married in Brussels as an expat (2026): civil wedding, communes, documents',
    metaDescription: 'Who can marry in Brussels, the declaration of marriage, the documents to legalise and translate, the language of the ceremony, what each commune is like, where to take the photos afterwards, and what it costs.',
    eyebrow: 'Expat guide',
    published: '2026-10-05',
    readingMinutes: 11,
    answer: 'You can marry in Brussels if at least one of you is Belgian or officially registered as a resident in one of the 19 communes. The wedding is a civil ceremony at the maison communale of the commune where one of you is registered; a religious or symbolic ceremony can only follow it. You first file a declaration of marriage (déclaration de mariage / huwelijksaangifte) at least 14 days and at most 6 months before the date, with your birth certificates, proof of identity, nationality and residence, and for non-Belgians a certificate of no impediment, all legalised or apostilled and translated by a sworn translator. The ceremony itself is in French or Dutch, with an interpreter if needed, and is free or costs a few dozen euros on weekdays. What follows is the step-by-step, the communes, the photo spots and the budget.',
    sections: [
      {
        title: 'Who can marry in Brussels',
        paragraphs: [
          'Belgian law lets you marry in Belgium when at least one of the future spouses is Belgian, or has their official residence (domicile) in Belgium at the time of the declaration. Residence means being registered in the population or foreigners’ register of a commune, with a Belgian ID or residence card. A tourist couple cannot marry here; an expat couple where one partner is registered in Ixelles, Etterbeek or any other commune can.',
          'Same-sex marriage has been legal in Belgium since 2003 and follows exactly the same procedure. Legal cohabitation (cohabitation légale / wettelijk samenwonen) is a lighter alternative, registered at the commune without a ceremony, with fewer rights.',
          'The wedding takes place at the maison communale of the commune where one of you is registered. You cannot choose a prettier town hall elsewhere, unless you move there first.',
        ],
      },
      {
        title: 'The procedure, step by step',
        paragraphs: ['Count three to five months from first contact with the commune to the wedding day, longer if documents have to come from far away.'],
        list: [
          'Contact the civil status office (état civil / burgerlijke stand) of your commune: most have a page listing the documents required for foreign nationals, and some take appointments online.',
          'Gather the documents (next section). Foreign documents must be legalised or apostilled in the issuing country, and translated by a Belgian sworn translator unless issued in French, Dutch or German. Some countries issue multilingual extracts that need no translation.',
          'File the declaration of marriage together, in person, between 6 months and 14 days before the planned date. The commune checks the file and may consult the public prosecutor for foreign documents; this check can take several weeks.',
          'Choose the date and the hall. Weekday ceremonies are usually free; Saturdays are limited, sometimes charged, and booked months ahead for spring and summer.',
          'The ceremony: the alderman or mayor reads the articles of the Civil Code, you say yes, you and your witnesses (up to four, none required) sign. It lasts 15 to 30 minutes. You leave with the marriage booklet (livret de mariage / trouwboekje).',
          'Afterwards, if you want, a religious or symbolic ceremony anywhere you like, the same day or later. Belgian law forbids holding it before the civil one.',
        ],
      },
      {
        title: 'The documents, and the two traps',
        paragraphs: ['The list varies slightly by commune and by your nationality, but the core is always the same.'],
        list: [
          'A recent birth certificate (certified copy, usually less than six months old for foreign documents), legalised or apostilled, translated.',
          'Proof of identity and nationality: passport or ID card, and for some nationalities a certificate of nationality.',
          'Proof of residence: for the registered partner, the commune has it; for the other, a certificate of residence from their country if required.',
          'A certificate of no impediment, celibacy or marital status (certificat de célibat / attest van ongehuwde staat), for non-Belgians, from your consulate or home authority.',
          'If previously married: the divorce decree or the death certificate of the former spouse, legalised and translated.',
          'The commune’s own form for the declaration, signed by both.',
        ],
      },
      {
        title: 'The two traps',
        paragraphs: [
          'Legalisation. A foreign civil document is only valid in Belgium if it has been apostilled (Hague Convention countries) or legalised through the embassy chain. Ask for this in the issuing country before you leave or through your consulate; it is the step that takes the longest. Documents from EU countries benefit from a 2019 regulation that removes legalisation and offers multilingual forms: ask your home authority for the “EU multilingual standard form”.',
          'Validity dates. Several communes require foreign birth certificates and certificates of no impediment to be less than six months old at the time of the declaration. Order them late enough to be valid, early enough to be translated. If in doubt, ask the civil status office for their exact rule before ordering.',
        ],
      },
      {
        title: 'The language of the ceremony',
        paragraphs: [
          'Brussels is officially bilingual: every commune celebrates in French or Dutch, and you choose which when you file the declaration. The ceremony cannot legally be held in English, but most aldermen add a few words in English for international couples, and you may bring an interpreter (some communes require a sworn one if neither of you understands the language of the ceremony). Your vows, if you want to say any, can be in any language; they are not part of the legal act.',
          'The marriage booklet and the extracts are issued in the language of the ceremony; you can later request a multilingual extract for use abroad.',
        ],
      },
      {
        title: 'The communes: what to expect in each',
        paragraphs: ['You do not pick your commune, but it helps to know what yours is like. Here are the ones where most international couples live.'],
        table: {
          columns: ['Commune', 'Where the ceremony is held', 'What it is like', 'Photos nearby'],
          rows: [
            ['Brussels-City', 'The Gothic city hall on the Grand-Place', 'The most spectacular hall in the city; Saturdays are rare and booked early', 'Grand-Place itself, Mont des Arts, Galeries Royales'],
            ['Ixelles', 'Maison communale, place Fernand Cocq', 'Busy, international, efficient', 'Ixelles ponds, Abbaye de la Cambre, Bois de la Cambre'],
            ['Etterbeek', 'Maison communale, avenue des Casernes (new building)', 'Modern hall, European quarter', 'Cinquantenaire, Parc Léopold'],
            ['Uccle', 'Maison communale, place Jean Vander Elst', 'Classic, quiet, large hall', 'Wolvendael park, Bois de la Cambre, Observatory'],
            ['Woluwe-Saint-Pierre', 'Maison communale, avenue Charles Thielemans', 'Art Deco building, generous light', 'Parc de Woluwe, Forêt de Soignes'],
            ['Schaerbeek', 'Maison communale, place Colignon', 'A neo-Renaissance town hall, one of the finest in Brussels', 'Parc Josaphat'],
            ['Saint-Gilles', 'Maison communale, place Van Meenen', 'Grand staircase and ceremonial hall', 'Parvis, Horta district'],
          ],
          note: 'Opening days, fees and photography rules are set by each commune and change; confirm with the civil status office when you book.',
        },
      },
      {
        title: 'Photos: what is allowed, and where to go afterwards',
        paragraphs: [
          'Every Brussels commune allows a photographer in the ceremony hall; some ask for no flash, some fix where the photographer stands. The exit on the steps and the first minutes outside are the images couples keep: it is worth asking your photographer to arrive thirty minutes early to catch the guests arriving and the two of you before.',
          'Then a couple session of 45 to 90 minutes: the Grand-Place at eight in the morning before the terraces, the Cinquantenaire arcades, the Abbaye de la Cambre and the Ixelles ponds, the Mont des Arts with the city below, the Bois de la Cambre in autumn light, the Atomium for something unmistakably Brussels. No permit is needed for a couple session in public spaces; parks close at dusk.',
          `A civil wedding with a short session is a lifestyle booking at Heaven Motion: ${formatPrice(250)} incl. VAT for ninety minutes of photos, ${formatPrice(640)} with a short film. A full day, from getting ready to the party, is the wedding package: ${price('photo')} for photo, ${price('video')} for video, ${price('combo')} for both by the same person. No travel fee anywhere in the 19 communes.`,
        ],
      },
      {
        title: 'What it costs, all in',
        paragraphs: ['A civil wedding in Brussels is cheap in itself; the costs are around it.'],
        list: [
          'The ceremony: free on weekdays in most communes; some charge for Saturdays or for the ceremonial hall, usually under €200. The marriage booklet is a few euros to a few dozen.',
          'Documents: apostilles and legalisations €20 to €100 each, sworn translations €40 to €80 per page.',
          'Photographer and videographer: see above, from €250 for a short session to €2,690 for a full day with both.',
          'Reception: Brussels venues range from a restaurant private room (€60 to €120 per guest) to a château or an orangery (€150 to €250 per guest, all included).',
        ],
      },
    ],
    faq: [
      { question: 'Can two foreigners marry in Brussels?', answer: 'Yes, if at least one of them is officially registered as a resident in a Brussels commune. Two tourists cannot.' },
      { question: 'Can the ceremony be in English?', answer: 'No, legally it is in French or Dutch. Most aldermen add a few words in English, and you may bring an interpreter. Your own vows can be in any language.' },
      { question: 'How far in advance should we file the declaration?', answer: 'Between 6 months and 14 days before the wedding. Count three to five months in total, because foreign documents must be ordered, legalised and translated first.' },
      { question: 'Do we need witnesses?', answer: 'No. Belgian law allows up to four witnesses but requires none. They must be adults with an ID.' },
      { question: 'Can we have a religious or symbolic ceremony instead?', answer: 'Only after the civil one. A religious or symbolic ceremony has no legal value in Belgium and cannot precede the civil wedding.' },
      { question: 'Will our Belgian marriage be recognised at home?', answer: 'In most countries, yes, after you register it with your consulate or home authority, with a legalised or multilingual extract. Check with your consulate before the wedding, as some countries require prior notice.' },
    ],
    ctaTitle: 'A photographer for your Brussels wedding, in English',
    ctaBody: 'Tell us the commune, the date and whether you want the ceremony only or the whole day: you receive a quote within 48 h, with no travel fee anywhere in Brussels.',
    related: [
      { label: 'Photographer & videographer in Brussels', path: '/en/areas/belgium/brussels' },
      { label: 'Wedding photographer & videographer', path: '/en/services/wedding' },
      { label: 'How much does a wedding photographer cost in Belgium', path: '/en/guides/wedding-photographer-cost-belgium-2026' },
    ],
  },
];
