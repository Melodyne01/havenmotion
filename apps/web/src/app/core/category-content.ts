import { CategoryKey, SiteLocale } from './locale';

/**
 * Contenu rédactionnel de chaque page catégorie, au-delà de l'intro, des
 * packs et de la FAQ : pour qui, comment ça se passe, ce que vous recevez
 * et quand, les lieux typiques. Écrit pour répondre aux intentions de
 * recherche relevées dans l'analyse concurrentielle (« combien de
 * photos », « combien de temps », « est-ce discret », « peut-on filmer en
 * entreprise », « où faire la séance ») — pas pour remplir la page.
 *
 * Aucun lieu n'est présenté comme une référence tournée : la liste des
 * projets réels (chantier 9) viendra prouver ce que ces pages annoncent.
 * Les faits chiffrés reprennent les packs (`packs.ts`) et les conditions
 * de la page tarifs.
 */
export interface CategoryContent {
  /** « Pour qui » : les situations concrètes où cette prestation s'applique. */
  readonly audienceTitle: string;
  readonly audience: readonly string[];
  /** Déroulé, du premier contact à la livraison. */
  readonly stepsTitle: string;
  readonly steps: readonly { readonly title: string; readonly body: string }[];
  /** Ce que vous recevez, et quand. */
  readonly deliveryTitle: string;
  readonly delivery: readonly string[];
  /** Les lieux typiques de cette prestation, sans en revendiquer aucun. */
  readonly placesTitle: string;
  readonly places: string;
}

export const CATEGORY_CONTENT: Record<SiteLocale, Record<CategoryKey, CategoryContent>> = {
  fr: {
    mariage: {
      audienceTitle: 'Pour quel mariage',
      audience: [
        'Un mariage civil puis une fête le même jour, des préparatifs à l’ouverture de bal : la journée complète, photo, vidéo ou les deux.',
        'Une cérémonie civile seule à la maison communale, suivie d’un verre : le pack lifestyle (1 h 30) ou le sur mesure.',
        'Un mariage religieux ou laïque avec une cérémonie longue et plus de 120 invités : le combo avec un second opérateur en option.',
        'Un mariage à Lille, au Luxembourg, à Maastricht ou à Paris : même grille, forfait de déplacement affiché, nuit d’hôtel quand la soirée finit tard.',
        'Un mariage à l’étranger : sur devis, avec la logistique (vols, matériel, autorisations) chiffrée d’avance.',
      ],
      stepsTitle: 'Comment ça se passe',
      steps: [
        { title: 'Un premier échange', body: 'Par téléphone ou en visio : votre date, le lieu, le nombre d’invités, ce qui compte pour vous. Devis chiffré sous 48 h, date bloquée à l’acompte de 30 %.' },
        { title: 'Le repérage', body: 'Je visite le lieu avant le jour J, ou je m’appuie sur ses plans et sa lumière si c’est loin. C’est là que je prépare les cinq moments clés : préparatifs, entrée, échange des alliances, premier regard, ouverture de bal.' },
        { title: 'Le jour J', body: 'Une seule personne, présente des préparatifs à la soirée, sans flash déporté ni installation lourde. Les invités m’oublient vite ; c’est voulu.' },
        { title: 'La livraison', body: 'Un aperçu photo sous 7 jours pour partager tout de suite, puis la galerie complète et le film sous 2 à 4 semaines, avec deux allers-retours de montage.' },
      ],
      deliveryTitle: 'Ce que vous recevez',
      delivery: [
        'Pack photo : environ 400 photos retouchées, dans une galerie en ligne privée, téléchargeables en haute définition et en format réseaux.',
        'Pack vidéo : un film de 5 à 8 minutes qui raconte la journée, étalonné, sur une musique sous licence, plus un teaser d’une minute pour les réseaux.',
        'Pack photo + vidéo : les deux, par la même personne, avec un seul style — et une économie affichée par rapport aux deux packs séparés.',
        'Dans tous les cas : droits d’usage complets pour vous, sauvegarde double le jour même, galerie conservée 12 mois.',
      ],
      placesTitle: 'Où',
      places: 'Maisons communales, églises et salles de réception de Bruxelles et des deux Brabants ; châteaux et fermes du Brabant wallon et des Ardennes ; domaines autour de Lille et de la Côte d’Opale ; mairies et châteaux de l’Île-de-France ; Luxembourg-Ville et ses environs ; Maastricht, Eindhoven et le Limbourg néerlandais. Déplacement inclus jusqu’à 60 km de Bruxelles, forfait fixe au-delà.',
    },
    evenementiel: {
      audienceTitle: 'Pour quel événement',
      audience: [
        'Une communion, un lentefeest ou un baptême : la cérémonie et la fête, ou une séance quelques semaines avant pour les faire-part.',
        'Un anniversaire, des noces d’or, une fête de famille : trois heures de reportage discret, et un aftermovie à partager le lendemain.',
        'Une soirée privée, un lancement, une inauguration : photo, vidéo ou les deux, par une seule personne qui ne gêne pas le déroulé.',
        'Une fête qui s’étire : heure supplémentaire à 150 €, décidée sur place.',
      ],
      stepsTitle: 'Comment ça se passe',
      steps: [
        { title: 'Un premier échange', body: 'Le type de fête, l’horaire, le lieu, les moments à ne pas manquer (discours, gâteau, surprise). Devis sous 48 h.' },
        { title: 'Le jour même', body: 'J’arrive un quart d’heure avant, je repère la lumière et les visages importants, puis je me fais oublier. Pas de pose imposée, sauf si vous en voulez.' },
        { title: 'La livraison', body: 'Les photos sous 3 semaines, l’aftermovie sous 2 à 4 semaines ; une sélection pour les réseaux peut partir plus tôt en option express.' },
      ],
      deliveryTitle: 'Ce que vous recevez',
      delivery: [
        'Pack photo : environ 150 photos retouchées pour 3 heures, galerie en ligne, haute définition et formats réseaux.',
        'Pack vidéo : un aftermovie de 2 à 3 minutes des temps forts, étalonné, musique sous licence, plus un format vertical.',
        'Pack photo + vidéo : les deux, par la même personne, moins cher que séparément.',
        'Communion et lentefeest : un format court de 60 secondes pour les grands-parents et les groupes WhatsApp est compris dans l’aftermovie.',
      ],
      placesTitle: 'Où',
      places: 'Chez vous, dans un restaurant, une salle des fêtes, un jardin, une église ou une salle communale — à Bruxelles et dans les deux Brabants sans frais de déplacement, et partout ailleurs en Belgique, dans le nord de la France, au Luxembourg et aux Pays-Bas avec le forfait de la zone.',
    },
    corporate: {
      audienceTitle: 'Pour quelle entreprise',
      audience: [
        'Une PME ou un cabinet qui veut des portraits d’équipe cohérents pour LinkedIn et son site : une demi-journée dans vos locaux, tout le monde sur le même fond et la même lumière.',
        'Une entreprise qui a besoin d’un film de présentation ou de recrutement de 1 à 2 minutes, avec interviews et formats réseaux.',
        'Un événement d’entreprise — séminaire, conférence, soirée du personnel, inauguration — couvert en photo, en aftermovie et en portraits sur la même journée.',
        'Une institution, une fédération ou un cabinet à Bruxelles, au Luxembourg ou à Lille, qui attend une facture claire, hors TVA, et une cession de droits sans ambiguïté.',
      ],
      stepsTitle: 'Comment ça se passe',
      steps: [
        { title: 'Le brief', body: 'Objectif, public, canaux de diffusion, charte graphique, personnes à interviewer. Devis hors TVA sous 48 h, avec le nombre de livrables.' },
        { title: 'Le script et le planning', body: 'Pour une vidéo : un script court validé par vous, un plan de tournage par créneau pour ne pas immobiliser les équipes plus d’une demi-journée.' },
        { title: 'Le tournage', body: 'Dans vos locaux ou sur le lieu de votre choix. Une seule personne, du matériel léger, un espace portrait monté en vingt minutes.' },
        { title: 'La livraison', body: 'Deux allers-retours de montage, sous-titres et habillage à votre charte, livraison sous 2 à 4 semaines, formats LinkedIn, Instagram et site.' },
      ],
      deliveryTitle: 'Ce que vous recevez',
      delivery: [
        'Pack photo : les portraits de l’équipe, retouchés et cadrés en formats LinkedIn et site, plus des photos des locaux et de l’activité.',
        'Pack vidéo : un film de 1 à 2 minutes, sous-titré, habillé (logo, couleurs), plus trois formats réseaux sociaux.',
        'Pack photo + vidéo : les deux sur la même demi-journée, une seule facture, un seul interlocuteur.',
        'Dans tous les cas : cession des droits d’usage commercial, sans limite de durée, pour le site, les réseaux, le recrutement, les salons et l’interne.',
      ],
      placesTitle: 'Où',
      places: 'Vos bureaux, votre atelier ou votre chantier, un centre de conférence, un hôtel de séminaire — à Bruxelles et dans sa périphérie sans frais de déplacement ; Anvers, Gand, Lille, Luxembourg-Ville, Eindhoven ou Paris avec le forfait de la zone. Pour une entreprise assujettie hors Belgique, facture en autoliquidation.',
    },
    sport: {
      audienceTitle: 'Pour qui',
      audience: [
        'Un club qui veut des images de match pour ses réseaux, son site et ses sponsors, et des droits clairs pour les réutiliser.',
        'Un organisateur de tournoi, de course ou de meeting qui veut un résumé vidéo le lendemain et des photos vendables aux participants.',
        'Un athlète qui monte un dossier de sponsoring ou de sélection : un highlight de 1 à 2 minutes et des portraits.',
        'Un centre équestre, un club de combat, une salle d’escalade, une équipe de e-sport : la prestation s’adapte à la discipline.',
      ],
      stepsTitle: 'Comment ça se passe',
      steps: [
        { title: 'Le brief', body: 'La discipline, le lieu, l’horaire, les temps forts attendus, les joueurs ou athlètes à suivre. Devis hors TVA sous 48 h.' },
        { title: 'Sur place', body: 'Accréditation et placement convenus avec l’organisateur. Captation multi-focale, depuis le bord du terrain et en hauteur quand c’est possible ; ralentis sur les temps forts.' },
        { title: 'La livraison', body: 'Une sélection prête pour les réseaux le soir même en option express ; le résumé vidéo sous 2 semaines, les photos sous 3 semaines.' },
      ],
      deliveryTitle: 'Ce que vous recevez',
      delivery: [
        'Pack photo : environ 100 photos retouchées d’un match ou d’une compétition, action et coulisses, avec les droits d’usage pour le club ou l’organisateur.',
        'Pack vidéo : un résumé de 1 à 2 minutes, multi-focale, ralentis, sound design, plus un format vertical.',
        'Pack photo + vidéo : les deux, par la même personne, le même jour.',
        'Compétition sur plusieurs jours, plusieurs terrains ou plusieurs caméras : sur mesure.',
      ],
      placesTitle: 'Où',
      places: 'Stades et salles de Bruxelles et de sa périphérie, hippodromes et manèges du Brabant, circuits et parcours en Wallonie et en Flandre, salles de Lille et de Maastricht — et partout où se joue votre compétition, avec le forfait de la zone.',
    },
    clip: {
      audienceTitle: 'Pour quel artiste',
      audience: [
        'Un rappeur, un chanteur, un groupe ou un DJ indépendant qui veut un clip professionnel sans passer par une société de production.',
        'Un label ou un manager qui cherche un réalisateur freelance pour un titre, avec un forfait lisible et un délai tenu.',
        'Un artiste qui sort un EP et a besoin de photos de promo et de pochette en plus du clip : le combo couvre les deux.',
        'Un premier clip avec un petit budget : une demi-journée en un seul lieu, sur mesure.',
      ],
      stepsTitle: 'Comment ça se passe',
      steps: [
        { title: 'Le brief', body: 'Le morceau, l’univers, les références visuelles, le budget. Je propose une direction artistique et un ou deux lieux. Devis hors TVA sous 48 h.' },
        { title: 'Le repérage', body: 'Validation du lieu, des autorisations, des figurants et du planning de la journée, plan par plan.' },
        { title: 'Le tournage', body: 'Une journée, du premier plan au dernier, pour garder une cohérence visuelle. Playback sur enceinte, plusieurs prises par séquence.' },
        { title: 'Le montage', body: 'Montage calé sur le tempo et la structure du morceau, étalonnage, deux allers-retours, livraison sous 2 à 4 semaines avec les déclinaisons verticales.' },
      ],
      deliveryTitle: 'Ce que vous recevez',
      delivery: [
        'Pack vidéo : le clip jusqu’à 4 minutes, étalonné, en 4K, plus des versions courtes pour Instagram, TikTok et YouTube Shorts.',
        'Pack photo : 15 photos retouchées pour la promo, la pochette et la presse, en formats réseaux et impression.',
        'Pack photo + vidéo : le clip et les photos sur la même journée.',
        'La musique est la vôtre : c’est la seule prestation du studio sans musique sous licence, puisque le morceau est le point de départ.',
      ],
      placesTitle: 'Où',
      places: 'Bruxelles et sa périphérie sans frais de déplacement : friches, toits, parkings, studios, bords de canal ; la côte belge, les Ardennes, Lille, Paris ou plus loin selon l’univers du clip, avec le forfait de la zone.',
    },
    lifestyle: {
      audienceTitle: 'Pour quelle séance',
      audience: [
        'Un couple qui veut des photos naturelles, en ville ou en forêt, avant un mariage ou simplement pour soi.',
        'Une famille, une grossesse, un nouveau-né : une séance courte, au rythme des enfants, chez vous ou dehors.',
        'Une demande en mariage : discrète, préparée ensemble, avec la vidéo du oui en option.',
        'Un restaurant, un indépendant, une marque qui a besoin de contenu régulier pour Instagram et TikTok : reels, vlog, série mensuelle.',
      ],
      stepsTitle: 'Comment ça se passe',
      steps: [
        { title: 'Le choix du lieu', body: 'Ensemble, selon la lumière et l’ambiance que vous voulez : un parc, une rue, la côte, votre salon. Devis sous 48 h.' },
        { title: 'La séance', body: '1 h 30 pour la photo, une demi-journée pour la vidéo. Pas de pose figée : je vous fais bouger, parler, marcher. Les enfants dictent le rythme.' },
        { title: 'La livraison', body: 'Les photos sous 2 semaines dans une galerie en ligne ; les reels sous 2 à 4 semaines, prêts à publier.' },
      ],
      deliveryTitle: 'Ce que vous recevez',
      delivery: [
        'Pack photo : 25 photos retouchées, galerie en ligne, haute définition et formats réseaux.',
        'Pack vidéo : deux reels de 30 à 60 secondes, montés pour Instagram et TikTok, musique sous licence.',
        'Pack photo + vidéo : les deux sur la même demi-journée.',
        'Pour une marque : cession des droits d’usage commercial incluse ; lot mensuel (4 reels, vlog, série) sur mesure.',
      ],
      placesTitle: 'Où',
      places: 'Grand-Place, Cinquantenaire, bois de la Cambre, forêt de Soignes, Atomium, canal ; Louvain, Bruges, la côte ; le Vieux-Lille ; Luxembourg-Ville. Déplacement inclus jusqu’à 60 km de Bruxelles, forfait fixe au-delà.',
    },
  },
  nl: {
    mariage: {
      audienceTitle: 'Voor welk huwelijk',
      audience: [
        'Een burgerlijk huwelijk en een feest op dezelfde dag, van de voorbereidingen tot de openingsdans: de volledige dag, foto, video of beide.',
        'Alleen de burgerlijke ceremonie op het gemeentehuis, gevolgd door een receptie: het lifestyle-pakket (1 u 30) of op maat.',
        'Een kerkelijk of vrijzinnig huwelijk met een lange ceremonie en meer dan 120 gasten: de combinatie met een tweede operator als optie.',
        'Een huwelijk in Maastricht, Luxemburg, Rijsel of Parijs: dezelfde grille, verplaatsingstarief online, hotelovernachting als het feest laat eindigt.',
        'Een huwelijk in het buitenland: op offerte, met de logistiek (vluchten, materiaal, toelatingen) vooraf geprijsd.',
      ],
      stepsTitle: 'Hoe het verloopt',
      steps: [
        { title: 'Een eerste gesprek', body: 'Telefonisch of via video: uw datum, de locatie, het aantal gasten, wat voor u telt. Offerte binnen 48 u, datum vastgelegd bij het voorschot van 30 %.' },
        { title: 'De verkenning', body: 'Ik bezoek de locatie vóór de dag zelf, of werk met de plannen en het licht als het ver is. Daar bereid ik de vijf sleutelmomenten voor: voorbereidingen, intrede, ringen, first look, openingsdans.' },
        { title: 'De dag zelf', body: 'Eén persoon, aanwezig van de voorbereidingen tot het feest, zonder losse flitsers of zware installatie. De gasten vergeten me snel; dat is de bedoeling.' },
        { title: 'De levering', body: 'Een voorproefje van de foto’s binnen 7 dagen om meteen te delen, daarna de volledige galerij en de film binnen 2 tot 4 weken, met twee rondes feedback.' },
      ],
      deliveryTitle: 'Wat u ontvangt',
      delivery: [
        'Fotopakket: ongeveer 400 bewerkte foto’s, in een privé online galerij, te downloaden in hoge resolutie en in formaat voor sociale media.',
        'Videopakket: een trouwfilm van 5 tot 8 minuten die de dag vertelt, met kleurcorrectie, op muziek in licentie, plus een teaser van één minuut.',
        'Pakket foto + video: beide, door dezelfde persoon, in één stijl — en een getoonde besparing tegenover de twee pakketten apart.',
        'Altijd: volledige gebruiksrechten voor u, dubbele back-up dezelfde dag, galerij 12 maanden bewaard.',
      ],
      placesTitle: 'Waar',
      places: 'Gemeentehuizen, kerken en feestzalen in Brussel en de twee Brabanten; kastelen en hoeves in Waals-Brabant en de Ardennen; domeinen rond Antwerpen, Gent en Brugge; Luxemburg-Stad; Maastricht, Eindhoven en Nederlands Limburg. Verplaatsing inbegrepen tot 60 km van Brussel, vast tarief daarbuiten.',
    },
    evenementiel: {
      audienceTitle: 'Voor welk evenement',
      audience: [
        'Een communie, lentefeest of doopfeest: de ceremonie en het feest, of een sessie enkele weken vooraf voor de uitnodigingen.',
        'Een verjaardag, een gouden bruiloft, een familiefeest: drie uur discrete reportage, en een aftermovie om de dag erna te delen.',
        'Een privéfeest, een lancering, een opening: foto, video of beide, door één persoon die het verloop niet stoort.',
        'Een feest dat uitloopt: extra uur aan € 150, ter plaatse beslist.',
      ],
      stepsTitle: 'Hoe het verloopt',
      steps: [
        { title: 'Een eerste gesprek', body: 'Het soort feest, het uur, de locatie, de momenten die niet gemist mogen worden (speeches, taart, verrassing). Offerte binnen 48 u.' },
        { title: 'De dag zelf', body: 'Ik kom een kwartier vooraf, verken het licht en de belangrijke gezichten, en laat me dan vergeten. Geen opgelegde poses, tenzij u dat wilt.' },
        { title: 'De levering', body: 'De foto’s binnen 3 weken, de aftermovie binnen 2 tot 4 weken; een selectie voor sociale media kan vroeger vertrekken met de expresoptie.' },
      ],
      deliveryTitle: 'Wat u ontvangt',
      delivery: [
        'Fotopakket: ongeveer 150 bewerkte foto’s voor 3 uur, online galerij, hoge resolutie en formaten voor sociale media.',
        'Videopakket: een aftermovie van 2 tot 3 minuten met de hoogtepunten, met kleurcorrectie, muziek in licentie, plus een verticaal formaat.',
        'Pakket foto + video: beide, door dezelfde persoon, goedkoper dan apart.',
        'Communie en lentefeest: een kort formaat van 60 seconden voor de grootouders en de WhatsApp-groepen zit in de aftermovie.',
      ],
      placesTitle: 'Waar',
      places: 'Bij u thuis, in een restaurant, een feestzaal, een tuin, een kerk of een gemeentezaal — in Brussel en de twee Brabanten zonder verplaatsingskosten, en overal elders in België, Noord-Frankrijk, Luxemburg en Nederland met het tarief van de zone.',
    },
    corporate: {
      audienceTitle: 'Voor welk bedrijf',
      audience: [
        'Een kmo of kantoor dat uniforme teamportretten wil voor LinkedIn en de website: een halve dag in uw kantoren, iedereen op dezelfde achtergrond en in hetzelfde licht.',
        'Een bedrijf dat een bedrijfsfilm of rekruteringsvideo van 1 tot 2 minuten nodig heeft, met interviews en formaten voor sociale media.',
        'Een bedrijfsevenement — seminarie, conferentie, personeelsfeest, opening — gedekt in foto, aftermovie en portretten op dezelfde dag.',
        'Een instelling, federatie of kantoor in Brussel, Luxemburg of Eindhoven dat een duidelijke factuur excl. btw verwacht en een ondubbelzinnige overdracht van rechten.',
      ],
      stepsTitle: 'Hoe het verloopt',
      steps: [
        { title: 'De briefing', body: 'Doel, publiek, kanalen, huisstijl, te interviewen personen. Offerte excl. btw binnen 48 u, met het aantal eindproducten.' },
        { title: 'Script en planning', body: 'Voor een video: een kort script dat u goedkeurt, een opnameplan per tijdslot zodat de teams niet langer dan een halve dag bezet zijn.' },
        { title: 'De opname', body: 'In uw kantoren of op de locatie van uw keuze. Eén persoon, licht materiaal, een portretruimte opgesteld in twintig minuten.' },
        { title: 'De levering', body: 'Twee rondes feedback, ondertitels en opmaak in uw huisstijl, levering binnen 2 tot 4 weken, formaten voor LinkedIn, Instagram en website.' },
      ],
      deliveryTitle: 'Wat u ontvangt',
      delivery: [
        'Fotopakket: de teamportretten, bewerkt en uitgesneden in LinkedIn- en websiteformaat, plus foto’s van de bedrijfsruimte en de activiteit.',
        'Videopakket: een film van 1 tot 2 minuten, ondertiteld, opgemaakt (logo, kleuren), plus drie formaten voor sociale media.',
        'Pakket foto + video: beide op dezelfde halve dag, één factuur, één aanspreekpunt.',
        'Altijd: overdracht van de commerciële gebruiksrechten, zonder beperking in tijd, voor website, sociale media, rekrutering, beurzen en intern gebruik.',
      ],
      placesTitle: 'Waar',
      places: 'Uw kantoren, uw atelier of werf, een congrescentrum, een seminariehotel — in Brussel en de rand zonder verplaatsingskosten; Antwerpen, Gent, Rijsel, Luxemburg-Stad, Eindhoven of Parijs met het tarief van de zone. Voor een btw-plichtig bedrijf buiten België: factuur met verlegde btw.',
    },
    sport: {
      audienceTitle: 'Voor wie',
      audience: [
        'Een club die wedstrijdbeelden wil voor sociale media, website en sponsors, met duidelijke rechten om ze te hergebruiken.',
        'Een organisator van een tornooi, een loop of een meeting die de dag erna een videosamenvatting wil en foto’s die aan deelnemers verkocht kunnen worden.',
        'Een atleet die een sponsor- of selectiedossier samenstelt: een highlight van 1 tot 2 minuten en portretten.',
        'Een manege, een vechtsportclub, een klimzaal, een e-sportteam: de dienst past zich aan de discipline aan.',
      ],
      stepsTitle: 'Hoe het verloopt',
      steps: [
        { title: 'De briefing', body: 'De discipline, de locatie, het uur, de verwachte hoogtepunten, de spelers of atleten om te volgen. Offerte excl. btw binnen 48 u.' },
        { title: 'Ter plaatse', body: 'Accreditatie en positie afgesproken met de organisator. Opname met meerdere brandpunten, vanaf de zijlijn en in de hoogte waar mogelijk; slow motion op de hoogtepunten.' },
        { title: 'De levering', body: 'Een selectie klaar voor sociale media dezelfde avond met de expresoptie; de videosamenvatting binnen 2 weken, de foto’s binnen 3 weken.' },
      ],
      deliveryTitle: 'Wat u ontvangt',
      delivery: [
        'Fotopakket: ongeveer 100 bewerkte foto’s van een wedstrijd of competitie, actie en backstage, met gebruiksrechten voor de club of organisator.',
        'Videopakket: een samenvatting van 1 tot 2 minuten, meerdere brandpunten, slow motion, sound design, plus een verticaal formaat.',
        'Pakket foto + video: beide, door dezelfde persoon, op dezelfde dag.',
        'Meerdaagse competitie, meerdere terreinen of meerdere camera’s: op maat.',
      ],
      placesTitle: 'Waar',
      places: 'Stadions en sporthallen in Brussel en de rand, hippodromen en maneges in Brabant, circuits en parcoursen in Vlaanderen en Wallonië, zalen in Antwerpen, Gent en Maastricht — en overal waar uw competitie plaatsvindt, met het tarief van de zone.',
    },
    clip: {
      audienceTitle: 'Voor welke artiest',
      audience: [
        'Een rapper, zanger, band of dj die een professionele clip wil zonder langs een productiehuis te gaan.',
        'Een label of manager die een freelance regisseur zoekt voor een nummer, met een leesbaar tarief en een gehaalde deadline.',
        'Een artiest die een EP uitbrengt en naast de clip ook promo- en hoesfoto’s nodig heeft: de combinatie dekt beide.',
        'Een eerste clip met een klein budget: een halve dag op één locatie, op maat.',
      ],
      stepsTitle: 'Hoe het verloopt',
      steps: [
        { title: 'De briefing', body: 'Het nummer, de wereld, de visuele referenties, het budget. Ik stel een artistieke richting en één of twee locaties voor. Offerte excl. btw binnen 48 u.' },
        { title: 'De verkenning', body: 'Validatie van de locatie, de toelatingen, de figuranten en de planning van de dag, shot per shot.' },
        { title: 'De opname', body: 'Eén dag, van het eerste tot het laatste shot, voor een coherent beeld. Playback op luidspreker, meerdere takes per sequentie.' },
        { title: 'De montage', body: 'Montage op het tempo en de structuur van het nummer, kleurcorrectie, twee rondes feedback, levering binnen 2 tot 4 weken met de verticale versies.' },
      ],
      deliveryTitle: 'Wat u ontvangt',
      delivery: [
        'Videopakket: de clip tot 4 minuten, met kleurcorrectie, in 4K, plus korte versies voor Instagram, TikTok en YouTube Shorts.',
        'Fotopakket: 15 bewerkte foto’s voor promo, hoes en pers, in formaten voor sociale media en druk.',
        'Pakket foto + video: de clip en de foto’s op dezelfde dag.',
        'De muziek is de uwe: het is de enige dienst van de studio zonder muziek in licentie, want het nummer is het vertrekpunt.',
      ],
      placesTitle: 'Waar',
      places: 'Brussel en de rand zonder verplaatsingskosten: braakliggende terreinen, daken, parkings, studio’s, kanaaloevers; de kust, de Ardennen, Antwerpen, Rijsel, Parijs of verder naargelang de wereld van de clip, met het tarief van de zone.',
    },
    lifestyle: {
      audienceTitle: 'Voor welke sessie',
      audience: [
        'Een koppel dat natuurlijke foto’s wil, in de stad of in het bos, vóór een huwelijk of gewoon voor zichzelf.',
        'Een gezin, een zwangerschap, een pasgeborene: een korte sessie, op het ritme van de kinderen, thuis of buiten.',
        'Een huwelijksaanzoek: discreet, samen voorbereid, met de video van het ja-woord als optie.',
        'Een restaurant, een zelfstandige, een merk dat regelmatig content nodig heeft voor Instagram en TikTok: reels, vlog, maandelijkse reeks.',
      ],
      stepsTitle: 'Hoe het verloopt',
      steps: [
        { title: 'De keuze van de locatie', body: 'Samen, volgens het licht en de sfeer die u wilt: een park, een straat, de kust, uw woonkamer. Offerte binnen 48 u.' },
        { title: 'De sessie', body: '1 u 30 voor foto, een halve dag voor video. Geen stijve poses: ik laat u bewegen, praten, wandelen. De kinderen bepalen het ritme.' },
        { title: 'De levering', body: 'De foto’s binnen 2 weken in een online galerij; de reels binnen 2 tot 4 weken, klaar om te posten.' },
      ],
      deliveryTitle: 'Wat u ontvangt',
      delivery: [
        'Fotopakket: 25 bewerkte foto’s, online galerij, hoge resolutie en formaten voor sociale media.',
        'Videopakket: twee reels van 30 tot 60 seconden, gemonteerd voor Instagram en TikTok, muziek in licentie.',
        'Pakket foto + video: beide op dezelfde halve dag.',
        'Voor een merk: commerciële gebruiksrechten inbegrepen; maandelijks pakket (4 reels, vlog, reeks) op maat.',
      ],
      placesTitle: 'Waar',
      places: 'Grote Markt, Jubelpark, Ter Kamerenbos, Zoniënwoud, Atomium, kanaal; Leuven, Brugge, de kust; Antwerpen; Luxemburg-Stad. Verplaatsing inbegrepen tot 60 km van Brussel, vast tarief daarbuiten.',
    },
  },
  en: {
    mariage: {
      audienceTitle: 'For which wedding',
      audience: [
        'A civil ceremony and a party on the same day, from getting ready to the first dance: the full day, photo, video or both.',
        'A civil ceremony alone at the town hall, followed by drinks: the lifestyle package (1.5 hours) or the custom option.',
        'A religious or humanist ceremony that runs long, with more than 120 guests: the combo with a second operator as an option.',
        'A wedding in Lille, Luxembourg, Maastricht or Paris: same grid, published travel fee, hotel night when the party ends late.',
        'A destination wedding abroad: on quote, with the logistics (flights, equipment, permits) priced upfront.',
      ],
      stepsTitle: 'How it works',
      steps: [
        { title: 'A first conversation', body: 'By phone or video call: your date, the venue, the guest count, what matters to you. Itemised quote within 48 h, date secured with a 30% deposit.' },
        { title: 'Scouting', body: 'I visit the venue before the day, or work from its plans and light if it is far. That is where I prepare the five key moments: getting ready, entrance, rings, first look, first dance.' },
        { title: 'The day', body: 'One person, there from getting ready to the party, with no off-camera flash or heavy setup. Guests forget me quickly; that is the point.' },
        { title: 'Delivery', body: 'A photo sneak peek within 7 days to share right away, then the full gallery and the film within 2 to 4 weeks, with two rounds of edits.' },
      ],
      deliveryTitle: 'What you receive',
      delivery: [
        'Photo package: around 400 edited photos in a private online gallery, downloadable in high resolution and social formats.',
        'Video package: a 5 to 8 minute film that tells the day, colour graded, on licensed music, plus a one-minute teaser for social media.',
        'Photo + video package: both, by the same person, in one style — with a published saving compared with the two packages separately.',
        'In every case: full usage rights for you, double backup the same day, gallery kept for 12 months.',
      ],
      placesTitle: 'Where',
      places: 'Town halls, churches and reception venues across Brussels and both Brabants; castles and farms in Walloon Brabant and the Ardennes; estates around Lille and the Opal Coast; town halls and châteaux of the Paris region; Luxembourg City and its surroundings; Maastricht, Eindhoven and Dutch Limburg. Travel included up to 60 km from Brussels, flat fee beyond.',
    },
    evenementiel: {
      audienceTitle: 'For which event',
      audience: [
        'A communion, a spring celebration or a christening: the ceremony and the party, or a session a few weeks before for the invitations.',
        'A birthday, a golden anniversary, a family gathering: three hours of unobtrusive coverage, and an aftermovie to share the next day.',
        'A private party, a launch, an opening: photo, video or both, by one person who does not get in the way.',
        'A party that runs late: extra hour at €150, decided on the spot.',
      ],
      stepsTitle: 'How it works',
      steps: [
        { title: 'A first conversation', body: 'The kind of celebration, the schedule, the venue, the moments not to miss (speeches, cake, surprise). Quote within 48 h.' },
        { title: 'On the day', body: 'I arrive fifteen minutes early, check the light and the faces that matter, then fade into the background. No imposed poses, unless you want them.' },
        { title: 'Delivery', body: 'Photos within 3 weeks, the aftermovie within 2 to 4 weeks; a social media selection can go out earlier with the express option.' },
      ],
      deliveryTitle: 'What you receive',
      delivery: [
        'Photo package: around 150 edited photos for 3 hours, online gallery, high resolution and social formats.',
        'Video package: a 2 to 3 minute aftermovie of the highlights, colour graded, licensed music, plus a vertical cut.',
        'Photo + video package: both, by the same person, cheaper than separately.',
        'Communions and spring celebrations: a 60-second short for grandparents and WhatsApp groups is included in the aftermovie.',
      ],
      placesTitle: 'Where',
      places: 'At home, in a restaurant, a function room, a garden, a church or a community hall — in Brussels and both Brabants with no travel fee, and anywhere else in Belgium, northern France, Luxembourg and the Netherlands with the zone fee.',
    },
    corporate: {
      audienceTitle: 'For which business',
      audience: [
        'An SME or a firm that wants consistent team headshots for LinkedIn and its website: a half day at your offices, everyone on the same backdrop and lighting.',
        'A company that needs a 1 to 2 minute presentation or recruitment film, with interviews and social media cuts.',
        'A corporate event — seminar, conference, staff party, opening — covered in photo, aftermovie and headshots on the same day.',
        'An institution, a federation or a firm in Brussels, Luxembourg or Lille that expects a clear invoice, VAT excluded, and an unambiguous transfer of rights.',
      ],
      stepsTitle: 'How it works',
      steps: [
        { title: 'The brief', body: 'Goal, audience, channels, brand guidelines, people to interview. Quote excl. VAT within 48 h, with the number of deliverables.' },
        { title: 'Script and schedule', body: 'For a video: a short script you approve, a shooting plan by time slot so teams are not tied up for more than half a day.' },
        { title: 'The shoot', body: 'At your offices or the location of your choice. One person, light equipment, a headshot corner set up in twenty minutes.' },
        { title: 'Delivery', body: 'Two rounds of edits, subtitles and branding to your guidelines, delivery within 2 to 4 weeks, LinkedIn, Instagram and website formats.' },
      ],
      deliveryTitle: 'What you receive',
      delivery: [
        'Photo package: the team headshots, retouched and cropped for LinkedIn and website, plus photos of the premises and the activity.',
        'Video package: a 1 to 2 minute film, subtitled, branded (logo, colours), plus three social media cuts.',
        'Photo + video package: both on the same half day, one invoice, one point of contact.',
        'In every case: commercial usage rights, with no time limit, for website, social media, recruitment, trade shows and internal use.',
      ],
      placesTitle: 'Where',
      places: 'Your offices, workshop or site, a conference centre, a seminar hotel — in Brussels and its periphery with no travel fee; Antwerp, Ghent, Lille, Luxembourg City, Eindhoven or Paris with the zone fee. For a VAT-registered business outside Belgium, reverse-charge invoicing.',
    },
    sport: {
      audienceTitle: 'Who it is for',
      audience: [
        'A club that wants match images for its social media, website and sponsors, with clear rights to reuse them.',
        'A tournament, race or meeting organiser who wants a video recap the next day and photos that can be sold to participants.',
        'An athlete building a sponsorship or selection portfolio: a 1 to 2 minute highlight and portraits.',
        'An equestrian centre, a combat sports club, a climbing gym, an e-sports team: the service adapts to the discipline.',
      ],
      stepsTitle: 'How it works',
      steps: [
        { title: 'The brief', body: 'The discipline, the venue, the schedule, the expected highlights, the players or athletes to follow. Quote excl. VAT within 48 h.' },
        { title: 'On site', body: 'Accreditation and position agreed with the organiser. Multi-lens coverage, from the sideline and from above where possible; slow motion on key moments.' },
        { title: 'Delivery', body: 'A social-ready selection the same evening with the express option; the video recap within 2 weeks, the photos within 3 weeks.' },
      ],
      deliveryTitle: 'What you receive',
      delivery: [
        'Photo package: around 100 edited photos of a match or competition, action and behind the scenes, with usage rights for the club or organiser.',
        'Video package: a 1 to 2 minute recap, multi-lens, slow motion, sound design, plus a vertical cut.',
        'Photo + video package: both, by the same person, on the same day.',
        'Multi-day competitions, several pitches or several cameras: custom quote.',
      ],
      placesTitle: 'Where',
      places: 'Stadiums and halls in Brussels and its periphery, racecourses and riding arenas in Brabant, circuits and courses across Wallonia and Flanders, venues in Lille and Maastricht — and wherever your competition is played, with the zone fee.',
    },
    clip: {
      audienceTitle: 'For which artist',
      audience: [
        'A rapper, singer, band or DJ who wants a professional music video without going through a production company.',
        'A label or manager looking for a freelance director for a track, with a readable flat fee and a deadline that holds.',
        'An artist releasing an EP who needs promo and cover photos on top of the video: the combo covers both.',
        'A first video on a small budget: a half day in a single location, custom.',
      ],
      stepsTitle: 'How it works',
      steps: [
        { title: 'The brief', body: 'The track, the world, the visual references, the budget. I propose an art direction and one or two locations. Quote excl. VAT within 48 h.' },
        { title: 'Scouting', body: 'Confirming the location, permits, extras and the schedule of the day, shot by shot.' },
        { title: 'The shoot', body: 'One day, from the first shot to the last, to keep a coherent look. Playback on a speaker, several takes per sequence.' },
        { title: 'The edit', body: 'Cut to the tempo and structure of the track, colour graded, two rounds of edits, delivered within 2 to 4 weeks with the vertical versions.' },
      ],
      deliveryTitle: 'What you receive',
      delivery: [
        'Video package: the video up to 4 minutes, colour graded, in 4K, plus short versions for Instagram, TikTok and YouTube Shorts.',
        'Photo package: 15 edited photos for promo, cover art and press, in social and print formats.',
        'Photo + video package: the video and the photos on the same day.',
        'The music is yours: it is the only service of the studio without licensed music, since the track is the starting point.',
      ],
      placesTitle: 'Where',
      places: 'Brussels and its periphery with no travel fee: wastelands, rooftops, car parks, studios, canal banks; the Belgian coast, the Ardennes, Lille, Paris or further depending on the world of the video, with the zone fee.',
    },
    lifestyle: {
      audienceTitle: 'For which session',
      audience: [
        'A couple who want natural photos, in the city or in the woods, before a wedding or simply for themselves.',
        'A family, a pregnancy, a newborn: a short session, at the children’s pace, at home or outdoors.',
        'A proposal: discreet, prepared together, with the video of the yes as an option.',
        'A restaurant, a freelancer, a brand that needs regular content for Instagram and TikTok: reels, vlog, monthly series.',
      ],
      stepsTitle: 'How it works',
      steps: [
        { title: 'Choosing the location', body: 'Together, according to the light and mood you want: a park, a street, the coast, your living room. Quote within 48 h.' },
        { title: 'The session', body: '1.5 hours for photo, a half day for video. No stiff poses: I get you moving, talking, walking. The children set the pace.' },
        { title: 'Delivery', body: 'Photos within 2 weeks in an online gallery; reels within 2 to 4 weeks, ready to post.' },
      ],
      deliveryTitle: 'What you receive',
      delivery: [
        'Photo package: 25 edited photos, online gallery, high resolution and social formats.',
        'Video package: two reels of 30 to 60 seconds, edited for Instagram and TikTok, licensed music.',
        'Photo + video package: both on the same half day.',
        'For a brand: commercial usage rights included; monthly batch (4 reels, vlog, series) on quote.',
      ],
      placesTitle: 'Where',
      places: 'Grand-Place, Cinquantenaire, Bois de la Cambre, Sonian Forest, Atomium, the canal; Leuven, Bruges, the coast; old Lille; Luxembourg City. Travel included up to 60 km from Brussels, flat fee beyond.',
    },
  },
};
