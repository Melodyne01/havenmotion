import type { SiteLocale } from './locale';
import type { RegionContent } from './region-content';

/**
 * Allemagne, ajoutée à la demande du client : la Rhénanie frontalière
 * (Aix-la-Chapelle et l'Eifel), Cologne – Düsseldorf, et Trèves – Sarre.
 * Le site n'existe pas en allemand : ces pages visent les couples et les
 * entreprises qui cherchent en français ou en anglais (frontaliers belges,
 * expatriés de Cologne et de Düsseldorf, institutions de Trèves). Aucune
 * compétence en allemand n'est revendiquée ; le reportage se mène en
 * anglais ou en français. Aucun lieu n'est présenté comme déjà tourné.
 */
export const REGION_CONTENT_DE: Readonly<Record<string, Partial<Record<SiteLocale, RegionContent>>>> = {
  'aix-la-chapelle-eifel': {
    fr: {
      intro:
        'Photographe et vidéaste à Aix-la-Chapelle et dans l’Eifel, depuis Bruxelles avec un forfait de déplacement fixe de 90 € : Aix-la-Chapelle est à une heure et demie par l’E40, Monschau, Düren et le lac de Rur un peu au-delà. Mariages à l’hôtel de ville d’Aix-la-Chapelle, dans les châteaux de l’Eifel ou les salles de Monschau, séances dans la vieille ville ou sur les hauteurs du Lousberg, portraits d’équipe pour les entreprises de la région des trois frontières : une seule personne pour la photo et la vidéo, en français ou en anglais, avec la grille belge et une facture intracommunautaire sans formalité.',
      citiesTitle: 'Dans la région',
      cities: [
        { name: 'Aix-la-Chapelle', fact: 'l’hôtel de ville gothique et sa salle du couronnement pour le civil, la cathédrale et l’Elisenbrunnen pour les photos de couple, le Lousberg pour la vue sur la ville.' },
        { name: 'Monschau', fact: 'la vieille ville à colombages au fond de la vallée de la Rur, le château pour les réceptions, les ruelles pour une séance à pied.' },
        { name: 'Kornelimünster et Stolberg', fact: 'l’abbaye et le bourg de Kornelimünster, le château de Stolberg : deux décors à quinze minutes d’Aix.' },
        { name: 'Düren et le lac de Rur', fact: 'le château de Burgau pour les mariages, le lac de Rur et la forêt de Hürtgen pour les séances en pleine nature.' },
        { name: 'Nideggen et la vallée de la Rur', fact: 'le château de Nideggen sur son rocher, les falaises de grès rouge pour les photos de couple.' },
        { name: 'Les trois frontières', fact: 'Vaals, Kelmis et les Cantons de l’Est à dix minutes : les couples belgo-allemands et néerlando-allemands se marient d’un côté et fêtent de l’autre.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Hôtel de ville d’Aix-la-Chapelle (Krönungssaal)', 'Cathédrale d’Aix-la-Chapelle', 'Burg Wilhelmstein (Würselen)', 'Abbaye de Kornelimünster', 'Burg Monschau', 'Schloss Burgau (Düren)', 'Burg Nideggen', 'Burg Satzvey (Mechernich)', 'Elisenbrunnen et Elisengarten', 'Lousberg', 'Rursee', 'Vieille ville de Monschau'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 90 € (zone 2) pour Aix-la-Chapelle, Würselen, Stolberg et Düren ; Monschau, Nideggen et l’Eifel sud sont au bord de la zone 3 (190 €), confirmés au devis.',
        'Mariage civil : en Allemagne, on s’inscrit au Standesamt de sa commune de résidence, mais on peut se marier dans n’importe quel Standesamt du pays ; l’hôtel de ville d’Aix-la-Chapelle est l’un des plus demandés de la région. La cérémonie est en allemand, un interprète est admis.',
        'Langue : reportage en français ou en anglais ; contrat, devis et livraison en français. L’allemand n’est pas une langue de travail de Heaven Motion.',
        'Facturation : facture belge avec TVA pour un particulier, autoliquidation pour une entreprise allemande assujettie ; musique sous licence, sans déclaration GEMA.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage à Aix-la-Chapelle ?', answer: 'Le prix belge plus 90 € de déplacement : 1 290 € en photo, 1 590 € en vidéo, 2 690 € pour les deux par la même personne, journée complète, TVA comprise. Le marché allemand se situe entre 1 800 et 3 500 € pour la photo seule.' },
        { question: 'Un photographe belge peut-il travailler en Allemagne sans formalité ?', answer: 'Oui : prestation de service intracommunautaire, facture belge avec TVA pour un particulier, autoliquidation pour une entreprise. Rien à faire de votre côté.' },
        { question: 'Parlez-vous allemand ?', answer: 'Non. Le reportage se mène en français ou en anglais, ce qui convient aux couples frontaliers et internationaux ; pour une famille uniquement germanophone, un prestataire local sera plus à l’aise.' },
      ],
    },
    en: {
      intro:
        'Photographer and videographer in Aachen and the Eifel, from Brussels with a flat travel fee of €90: Aachen is ninety minutes away on the E40, Monschau, Düren and the Rursee a little further. Weddings at Aachen’s town hall, in the castles of the Eifel or the halls of Monschau, sessions in the old town or on the Lousberg, team headshots for the companies and the university of the three-border region — one person for both photo and video, working in English, with Belgian prices and an intra-EU invoice with no formalities on your side.',
      citiesTitle: 'Across the region',
      cities: [
        { name: 'Aachen', fact: 'the Gothic town hall and its coronation hall for civil ceremonies, the cathedral and the Elisenbrunnen for couple photos, the Lousberg for the view over the city.' },
        { name: 'Monschau', fact: 'the half-timbered old town at the bottom of the Rur valley, the castle for receptions, the lanes for a session on foot.' },
        { name: 'Kornelimünster and Stolberg', fact: 'the abbey and village of Kornelimünster, Stolberg castle: two settings fifteen minutes from Aachen.' },
        { name: 'Düren and the Rursee', fact: 'Schloss Burgau for weddings, the Rursee and the Hürtgen forest for sessions in open nature.' },
        { name: 'Nideggen and the Rur valley', fact: 'Nideggen castle on its rock, the red sandstone cliffs for couple photos.' },
        { name: 'The three-border area', fact: 'Vaals, Kelmis and the East Cantons ten minutes away: Belgian-German and Dutch-German couples marry on one side and celebrate on the other.' },
      ],
      venuesTitle: 'Reception and shooting venues',
      venues: ['Aachen Town Hall (Krönungssaal)', 'Aachen Cathedral', 'Burg Wilhelmstein (Würselen)', 'Kornelimünster Abbey', 'Burg Monschau', 'Schloss Burgau (Düren)', 'Burg Nideggen', 'Burg Satzvey (Mechernich)', 'Elisenbrunnen and Elisengarten', 'Lousberg', 'Rursee', 'Monschau old town'],
      practicalTitle: 'Practical',
      practical: [
        'Travel: flat fee of €90 (zone 2) for Aachen, Würselen, Stolberg and Düren; Monschau, Nideggen and the southern Eifel sit on the edge of zone 3 (€190) and are confirmed on the quote.',
        'Civil wedding: in Germany you register at the Standesamt of your place of residence, but you may marry at any Standesamt in the country; Aachen’s town hall is one of the most requested in the region. The ceremony is in German, an interpreter is allowed.',
        'Language: the day is run in English; contract, quote and delivery in English. German is not a working language at Heaven Motion.',
        'Invoicing: Belgian invoice with VAT for a private client, reverse charge for a VAT-registered German company; licensed music, no GEMA declaration.',
      ],
      faq: [
        { question: 'How much does a wedding photographer and videographer cost in Aachen?', answer: 'The Belgian price plus €90 of travel: €1,290 for photo, €1,590 for video, €2,690 for both by the same person, full day, VAT included. The German market sits between €1,800 and €3,500 for photography alone.' },
        { question: 'Can a Belgian photographer work in Germany without formalities?', answer: 'Yes: intra-EU service, Belgian invoice with VAT for a private client, reverse charge for a company. Nothing to do on your side.' },
        { question: 'Do you speak German?', answer: 'No. The day is run in English or French, which suits cross-border and international couples; for a family that only speaks German, a local supplier will be more comfortable.' },
      ],
    },
  },

  'cologne-dusseldorf': {
    en: {
      intro:
        'Photographer and videographer for international couples and companies in Cologne and Düsseldorf, based in Brussels, with a flat travel fee of €190: both cities are two and a half hours away on the E40 and A4. Not a page for the German-speaking market, which has its own excellent suppliers, but for the expats, the Japanese and international communities of Düsseldorf, the EU and corporate teams of Cologne, and the mixed couples who want their day run in English — one person for both photo and video, at Belgian prices, with an intra-EU invoice.',
      citiesTitle: 'Across the two cities',
      cities: [
        { name: 'Cologne', fact: 'the historic town hall for civil ceremonies, the cathedral and the Hohenzollern bridge for couple photos, the Rheinauhafen and its crane houses for a contemporary look.' },
        { name: 'Düsseldorf', fact: 'the Standesamt on the Inselstraße or Schloss Benrath for the ceremony, the Medienhafen and the Rhine tower for sessions, the Altstadt and the Königsallee for the evening.' },
        { name: 'Benrath and Mickeln', fact: 'Schloss Benrath, where the city celebrates weddings, and Schloss Mickeln on the Rhine for receptions.' },
        { name: 'Jüchen and Schloss Dyck', fact: 'one of the finest moated castles of the Rhineland, thirty minutes from Düsseldorf, for weddings and corporate events.' },
        { name: 'Brühl and Bonn', fact: 'Schloss Augustusburg for photos, the Rhine promenade and the former government quarter in Bonn for corporate shoots.' },
        { name: 'Köln-Deutz and the fair', fact: 'Koelnmesse and the Lanxess Arena for trade shows, conferences and sports events; Belgian companies exhibiting in Cologne are a frequent case.' },
      ],
      venuesTitle: 'Reception and shooting venues',
      venues: ['Historic Town Hall of Cologne', 'Cologne Cathedral and Hohenzollern bridge', 'Flora Köln', 'Wolkenburg (Cologne)', 'Rheinauhafen crane houses', 'Schloss Benrath (Düsseldorf)', 'Schloss Mickeln (Düsseldorf)', 'Schloss Dyck (Jüchen)', 'Medienhafen and Rhine tower', 'Schloss Augustusburg (Brühl)', 'Koelnmesse and Lanxess Arena', 'Düsseldorf Altstadt and Königsallee'],
      practicalTitle: 'Practical',
      practical: [
        'Travel: flat fee of €190 (zone 3) for Cologne, Düsseldorf, Bonn, Brühl and Neuss.',
        'Wedding: a hotel night (€150) is added, as the party ends late two and a half hours from Brussels; a couple session the next morning on the empty Hohenzollern bridge is possible as an extra hour.',
        'Civil wedding: you register at the Standesamt of your residence and may marry at any Standesamt in Germany; the ceremony is in German, interpreters are allowed and common for international couples.',
        'Invoicing: Belgian invoice with VAT for a private client, reverse charge for a VAT-registered German company; licensed music, no GEMA declaration.',
      ],
      faq: [
        { question: 'How much does a Brussels-based photographer and videographer cost for a wedding in Cologne or Düsseldorf?', answer: 'The Belgian price plus €190 of travel and a €150 hotel night: €2,690 for photo and video by the same person, full day, about €3,030 all in. German photo + video duos in the two cities usually start above €4,000.' },
        { question: 'Do you shoot corporate events at Koelnmesse or in Düsseldorf?', answer: 'Yes, as a corporate booking: trade show report, conference, dinner or team headshots, half a day from €490 excl. VAT plus travel, invoiced in Belgium with reverse charge for your company.' },
        { question: 'Do you speak German?', answer: 'No. The day is run in English or French; the venue is addressed in English, which is the norm in both cities. For a family that only speaks German, a local supplier will be more comfortable.' },
      ],
    },
  },

  'treves-sarre': {
    fr: {
      intro:
        'Photographe et vidéaste à Trèves, sur la Moselle allemande et en Sarre, depuis Bruxelles avec un forfait de déplacement fixe de 190 € : Trèves est à deux heures et demie par le Luxembourg, Sarrebruck une heure plus loin. Mariages au Palais Walderdorff ou dans les vignobles de la Moselle, séances devant la Porta Nigra, tournages pour les institutions et les entreprises frontalières : la même personne pour la photo et la vidéo, en français, pour les couples et les équipes qui vivent entre le Luxembourg, la Lorraine et l’Allemagne.',
      citiesTitle: 'Dans la région',
      cities: [
        { name: 'Trèves', fact: 'la plus ancienne ville d’Allemagne : la Porta Nigra et la cathédrale pour les photos, le Palais Walderdorff pour le civil, le palais électoral et ses jardins pour la séance couple.' },
        { name: 'Bernkastel-Kues et la Moselle', fact: 'les villages à colombages, les vignobles en terrasses et les domaines viticoles pour les mariages de vigne.' },
        { name: 'Cochem', fact: 'la Reichsburg, où la ville célèbre des mariages civils, au-dessus de la boucle de la Moselle.' },
        { name: 'Sarrebruck', fact: 'le château de Sarrebruck pour le civil, la Ludwigskirche et le quartier Saint-Jean pour les photos ; en zone 4, à 290 €.' },
        { name: 'Völklingen et Mettlach', fact: 'l’usine sidérurgique de Völklingen, classée à l’UNESCO, pour les clips et les événements ; la boucle de la Sarre pour les séances.' },
        { name: 'Les frontières', fact: 'Luxembourg à vingt minutes de Trèves, Metz et Thionville à une heure : les couples frontaliers se marient d’un côté et reçoivent de l’autre, avec un seul prestataire.' },
      ],
      venuesTitle: 'Lieux de réception et de tournage',
      venues: ['Palais Walderdorff (Trèves)', 'Porta Nigra et cathédrale de Trèves', 'Palais électoral et jardins (Trèves)', 'Reichsburg Cochem', 'Domaines viticoles de Bernkastel-Kues', 'Château de Sarrebruck', 'Ludwigskirche (Sarrebruck)', 'Völklinger Hütte', 'Boucle de la Sarre (Mettlach)', 'Vignobles de la Moselle', 'Europahalle Trèves', 'Vieille ville de Trèves'],
      practicalTitle: 'Pratique',
      practical: [
        'Déplacement : forfait de 190 € (zone 3) pour Trèves, Bernkastel-Kues et Cochem ; Sarrebruck et la Sarre sont en zone 4, à 290 €.',
        'Mariage : nuit d’hôtel (150 €) ajoutée, la soirée finissant tard à plus de deux heures de Bruxelles ; une séance couple dans les vignes le lendemain matin est possible en heure supplémentaire.',
        'Mariage civil : inscription au Standesamt de résidence, cérémonie possible dans n’importe quel Standesamt allemand, en allemand ; interprète admis. Les couples luxembourgeois ou lorrains se marient souvent chez eux et fêtent sur la Moselle.',
        'Facturation : facture belge avec TVA pour un particulier, autoliquidation pour une entreprise allemande assujettie ; musique sous licence, sans déclaration GEMA.',
      ],
      faq: [
        { question: 'Combien coûte un photographe-vidéaste de mariage à Trèves ?', answer: 'Le prix belge plus 190 € de déplacement et 150 € de nuit d’hôtel : 2 690 € pour la photo et la vidéo par la même personne, journée complète, soit environ 3 030 € tout compris.' },
        { question: 'Couvrez-vous un mariage à cheval sur le Luxembourg et l’Allemagne ?', answer: 'Oui, c’est un cas fréquent : civil à Luxembourg ou à Trèves, réception dans un domaine de la Moselle. Un seul forfait de déplacement, celui de la zone la plus éloignée.' },
        { question: 'Parlez-vous allemand ?', answer: 'Non. Le reportage se mène en français ou en anglais, ce qui convient aux couples frontaliers ; pour une famille uniquement germanophone, un prestataire local sera plus à l’aise.' },
      ],
    },
  },
};
