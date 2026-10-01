import { CategoryKey, SiteLocale } from './locale';
import { FaqEntry } from './faq-content';
import { PackType, comboSaving, formatPrice, pricingFor } from './packs';

/** Prix formaté d'un pack ("1 290 €"), lu depuis la grille pour rester exact. */
function price(key: CategoryKey, type: PackType): string {
  const pack = pricingFor(key).packs.find((p) => p.type === type);
  return pack?.price === null || pack?.price === undefined ? '' : formatPrice(pack.price);
}

const saving = (key: CategoryKey) => formatPrice(comboSaving(pricingFor(key)));

/**
 * FAQ propre à chaque page catégorie, indexée par la clé neutre de la
 * catégorie (slug FR), commune aux trois langues. Chaque réponse reprend un
 * fait réel des packs (prix lu dans `PRICING`, durée, inclus, livrable) ou
 * du déroulé (deux allers-retours, devis sous 48 h, forfaits de
 * déplacement) — reformulé pour la catégorie plutôt qu'inventé. Les
 * questions reprennent les intentions de recherche relevées dans l'analyse
 * concurrentielle (prix, ce qui est inclus, combien de photos, délai, une
 * seule personne pour photo et vidéo, déplacement, droits).
 */
export const CATEGORY_FAQ_CONTENT: Record<SiteLocale, Record<CategoryKey, readonly FaqEntry[]>> = {
  fr: {
    evenementiel: [
      {
        question: 'Combien coûte un photographe pour une communion, un anniversaire ou une soirée ?',
        answer: `${price('evenementiel', 'photo')} TTC pour 3 heures de reportage et environ 150 photos retouchées. L’aftermovie vidéo est à ${price('evenementiel', 'video')}, et les deux par la même personne à ${price('evenementiel', 'combo')}. Au-delà de 3 heures, l’heure supplémentaire est à 150 €.`,
      },
      {
        question: 'Quels types d’événements sont couverts ?',
        answer:
          'Communions, lentefeesten, baptêmes, anniversaires, fêtes de famille, soirées privées, lancements. Tout événement dont vous voulez garder une trace vraie, sans mise en scène.',
      },
      {
        question: 'Que contient l’aftermovie ?',
        answer:
          'Un montage de 2 à 3 minutes des temps forts, étalonné, sur une musique sous licence, plus un format vertical prêt pour Instagram ou WhatsApp.',
      },
      {
        question: 'Pour une communion, quand faut-il faire les photos ?',
        answer:
          'Le jour même pour la fête, ou lors d’une séance quelques semaines avant si vous voulez des photos pour les faire-part : le pack photo lifestyle (1 h 30, 25 photos) convient alors mieux.',
      },
      {
        question: 'Le photographe est-il discret pendant la fête ?',
        answer:
          'Oui : une seule personne, sans flash déporté ni installation, pour rester proche des invités sans jamais s’imposer.',
      },
      {
        question: 'Quel est le délai de livraison ?',
        answer: 'Les photos sous 3 semaines, l’aftermovie sous 2 à 4 semaines, avec deux allers-retours de retouche inclus. Livraison express possible en option.',
      },
      {
        question: 'Vous déplacez-vous hors de Bruxelles ?',
        answer:
          'Oui : déplacement inclus jusqu’à 60 km, puis forfait fixe par zone (90 € pour Liège, Lille ou Maastricht, 190 € pour le Luxembourg, 290 € pour Paris).',
      },
    ],
    mariage: [
      {
        question: 'Combien coûte un photographe et vidéaste de mariage ?',
        answer: `${price('mariage', 'photo')} TTC pour la photo sur la journée complète, ${price('mariage', 'video')} TTC pour le film, et ${price('mariage', 'combo')} TTC pour les deux par la même personne — soit ${saving('mariage')} de moins que les deux formules séparées. Déplacement inclus jusqu’à 60 km de Bruxelles.`,
      },
      {
        question: 'Une seule personne peut-elle faire la photo et la vidéo sans rater de moments ?',
        answer:
          'Oui, avec une méthode : un boîtier hybride, les moments clés (entrée, échange des alliances, premier regard, ouverture de bal) préparés au repérage, et une priorité décidée avec vous. Au-delà de 120 invités ou pour une cérémonie religieuse longue, un second opérateur (490 €) couvre les moments simultanés.',
      },
      {
        question: 'Combien de photos recevons-nous, et en combien de temps ?',
        answer:
          'Environ 400 photos retouchées dans une galerie en ligne, avec un aperçu sous 7 jours et la galerie complète sous 4 semaines. Le film de 5 à 8 minutes et son teaser d’une minute suivent dans le même délai.',
      },
      {
        question: 'Qu’est-ce qui est inclus dans la journée complète ?',
        answer:
          'Le repérage du lieu, les préparatifs, la cérémonie, le cocktail et la soirée, la retouche de toutes les photos, l’étalonnage du film, la musique sous licence et deux allers-retours de montage.',
      },
      {
        question: 'Faites-vous les mariages civils seuls, à la maison communale ?',
        answer:
          'Oui : le pack photo lifestyle (1 h 30, 25 photos) couvre une cérémonie civile courte, et le sur mesure permet d’ajouter un court film ou une séance couple après la mairie.',
      },
      {
        question: 'Le film peut-il être partagé sur les réseaux ?',
        answer:
          'Oui : la musique est systématiquement sous licence, ce qui évite tout retrait ou mise en sourdine sur Instagram, YouTube ou Facebook.',
      },
      {
        question: 'Vous déplacez-vous pour un mariage en France, au Luxembourg ou aux Pays-Bas ?',
        answer:
          'Oui. Forfait de déplacement fixe : 90 € pour Lille, Liège ou Maastricht, 190 € pour le Luxembourg, la Côte d’Opale ou Amsterdam, 290 € pour Paris, plus une nuit d’hôtel (150 €) quand la soirée finit tard loin de Bruxelles. À l’étranger, sur devis.',
      },
      {
        question: 'Quand faut-il réserver ?',
        answer:
          'Le plus tôt possible pour un samedi de mai à septembre : la plupart des couples réservent 10 à 14 mois à l’avance. Un acompte de 30 % bloque la date.',
      },
    ],
    corporate: [
      {
        question: 'Combien coûte une vidéo d’entreprise ?',
        answer: `${price('corporate', 'video')} HTVA pour une demi-journée de tournage et un film de 1 à 2 minutes avec trois formats réseaux. Les portraits d’équipe sont à ${price('corporate', 'photo')} HTVA, et les deux sur la même demi-journée à ${price('corporate', 'combo')} HTVA.`,
      },
      {
        question: 'Que contient une vidéo d’entreprise ?',
        answer:
          'Le script, le tournage dans vos locaux, les interviews de collaborateurs ou clients, l’habillage graphique à votre charte (logo, couleurs), les sous-titres et deux allers-retours de montage.',
      },
      {
        question: 'Peut-on faire les portraits LinkedIn de toute l’équipe en une fois ?',
        answer:
          'Oui, c’est le pack photo : une demi-journée dans vos locaux, un fond et une lumière identiques pour tous, chaque portrait retouché, livré en format LinkedIn et site web.',
      },
      {
        question: 'Couvrez-vous un événement d’entreprise (conférence, séminaire, soirée) ?',
        answer:
          'Oui : photo, aftermovie et portraits sur la même journée, par une seule personne. Le sur mesure adapte la durée et les livrables à votre programme.',
      },
      {
        question: 'Combien de révisions sont incluses ?',
        answer: 'Deux allers-retours de montage après la première version, avant la livraison définitive.',
      },
      {
        question: 'Qui détient les droits sur les images ?',
        answer:
          'Vous recevez la cession des droits d’usage commercial : site, réseaux, recrutement, salons, diffusion interne, sans limite de durée.',
      },
      {
        question: 'Intervenez-vous en France, au Luxembourg ou aux Pays-Bas ?',
        answer:
          'Oui, avec un forfait de déplacement fixe par zone (90 € pour Lille, 190 € pour Luxembourg-Ville ou Amsterdam, 290 € pour Paris). Pour une entreprise assujettie hors Belgique, la facture est établie en autoliquidation de TVA.',
      },
    ],
    sport: [
      {
        question: 'Combien coûte la couverture d’un match ou d’une compétition ?',
        answer: `${price('sport', 'photo')} HTVA en photo (environ 100 photos retouchées), ${price('sport', 'video')} HTVA en vidéo (résumé de 1 à 2 minutes), ${price('sport', 'combo')} HTVA pour les deux par la même personne. Compétition sur plusieurs jours : sur devis.`,
      },
      {
        question: 'À qui s’adresse cette prestation ?',
        answer:
          'Aux clubs qui veulent des images pour leurs réseaux et leurs sponsors, aux organisateurs de tournois, aux athlètes qui montent un dossier, aux centres équestres et aux sponsors.',
      },
      {
        question: 'Le tournage se fait-il sous plusieurs angles ?',
        answer:
          'Oui : captation multi-focale pour suivre l’action de plusieurs points de vue, ralentis sur les temps forts et sound design au montage.',
      },
      {
        question: 'Peut-on avoir des images le soir même pour les réseaux ?',
        answer:
          'Une sélection de photos prête pour les réseaux peut être livrée le soir même, en option express ; le résumé vidéo suit sous 2 semaines.',
      },
      {
        question: 'Les photos peuvent-elles être vendues ou diffusées par le club ?',
        answer:
          'Oui, les droits d’usage sont cédés au club ou à l’organisateur : réseaux, site, sponsors, vente aux participants.',
      },
      {
        question: 'Couvrez-vous un club amateur ?',
        answer:
          'Oui, du club amateur à l’événement sur plusieurs jours : le prix affiché vaut pour un match ou une compétition d’une journée.',
      },
      {
        question: 'Vous déplacez-vous pour une compétition hors de Belgique ?',
        answer:
          'Oui, avec un forfait de déplacement par zone : inclus jusqu’à 60 km de Bruxelles, 90 € jusqu’à 150 km, 190 € jusqu’à 250 km, 290 € pour Paris.',
      },
    ],
    clip: [
      {
        question: 'Combien coûte un clip musical ?',
        answer: `${price('clip', 'video')} HTVA pour une journée de tournage et un clip jusqu’à 4 minutes, étalonné, avec ses déclinaisons courtes. Les photos de promo et de pochette sont à ${price('clip', 'photo')} HTVA, et les deux à ${price('clip', 'combo')} HTVA.`,
      },
      {
        question: 'Qu’est-ce qui est inclus dans le clip ?',
        answer:
          'La direction artistique (ambiance, mise en scène, choix des plans), le repérage, la journée de tournage, le montage rythmique calé sur le morceau, l’étalonnage et deux allers-retours.',
      },
      {
        question: 'Que doit fournir l’artiste ?',
        answer:
          'Le morceau final en haute qualité, ses références visuelles s’il en a, et les figurants ou lieux particuliers qu’il souhaite. Le reste se construit ensemble au brief.',
      },
      {
        question: 'Le tournage peut-il se faire en extérieur, en studio, à l’étranger ?',
        answer:
          'Oui : le lieu se décide au brief selon l’univers du clip — Bruxelles, ailleurs en Belgique, Lille, Paris, ou plus loin avec le forfait de déplacement correspondant.',
      },
      {
        question: 'Quel est le délai de livraison ?',
        answer: 'Le clip est livré sous 2 à 4 semaines après le tournage, déclinaisons verticales comprises ; option express possible.',
      },
      {
        question: 'Le montage suit-il le rythme de la musique ?',
        answer: 'Oui : chaque coupe est pensée sur le tempo et la structure du morceau. C’est la seule prestation où la musique n’est pas sous licence, puisqu’elle est le point de départ.',
      },
      {
        question: 'Peut-on faire un clip avec un petit budget ?',
        answer:
          'Le sur mesure permet une demi-journée de tournage en un seul lieu, avec un montage plus court, pour un artiste indépendant qui démarre. Devis sous 48 h.',
      },
    ],
    lifestyle: [
      {
        question: 'Combien coûte une séance photo couple, famille ou grossesse ?',
        answer: `${price('lifestyle', 'photo')} TTC pour 1 h 30 et 25 photos retouchées dans une galerie en ligne. Deux reels vidéo de 30 à 60 secondes sont à ${price('lifestyle', 'video')}, et les deux à ${price('lifestyle', 'combo')}.`,
      },
      {
        question: 'Où se passe la séance ?',
        answer:
          'Le lieu se choisit ensemble : Grand-Place, Cinquantenaire, forêt de Soignes, bois de la Cambre, Bruges, la côte, ou chez vous. Déplacement inclus jusqu’à 60 km de Bruxelles.',
      },
      {
        question: 'Faites-vous les demandes en mariage ?',
        answer:
          'Oui, en toute discrétion : nous convenons du lieu et de l’heure, vous ne me voyez pas avant le oui. Option vidéo de la demande en pack combo.',
      },
      {
        question: 'Proposez-vous du contenu pour les réseaux sociaux d’une marque ?',
        answer:
          'Oui : le pack vidéo livre deux reels prêts à publier sur une demi-journée de tournage, et le sur mesure permet un lot mensuel (4 reels, vlog, série) pour un restaurant, un indépendant ou une marque.',
      },
      {
        question: 'Combien de temps dure une séance ?',
        answer: '1 h 30 pour une séance photo, une demi-journée pour du contenu vidéo. Les enfants se lassent vite : on adapte le rythme sur place.',
      },
      {
        question: 'Quel est le délai de livraison ?',
        answer: 'Les photos sous 2 semaines, les reels sous 2 à 4 semaines, avec deux allers-retours inclus.',
      },
      {
        question: 'Peut-on utiliser les photos librement ?',
        answer:
          'Oui pour un usage personnel (partage, tirages, réseaux). Pour une marque, la cession des droits d’usage commercial est incluse dans le pack.',
      },
    ],
  },
  nl: {
    evenementiel: [
      {
        question: 'Hoeveel kost een fotograaf voor een communie, verjaardag of feest?',
        answer: `${price('evenementiel', 'photo')} incl. btw voor 3 uur reportage en ongeveer 150 bewerkte foto’s. De aftermovie kost ${price('evenementiel', 'video')}, en beide door dezelfde persoon ${price('evenementiel', 'combo')}. Na 3 uur kost een extra uur € 150.`,
      },
      {
        question: 'Welke soorten evenementen worden gedekt?',
        answer:
          'Communies, lentefeesten, doopfeesten, verjaardagen, familiefeesten, privéfeestjes, lanceringen. Elk evenement waarvan u een echte herinnering wilt, zonder regie.',
      },
      {
        question: 'Wat zit er in de aftermovie?',
        answer:
          'Een montage van 2 tot 3 minuten met de hoogtepunten, met kleurcorrectie, op muziek in licentie, plus een verticaal formaat klaar voor Instagram of WhatsApp.',
      },
      {
        question: 'Wanneer maak je best de foto’s voor een communie of lentefeest?',
        answer:
          'Op de dag zelf voor het feest, of tijdens een sessie enkele weken vooraf als u foto’s wilt voor de uitnodigingen: dan past het lifestyle-fotopakket (1 u 30, 25 foto’s) beter.',
      },
      {
        question: 'Is de fotograaf discreet tijdens het feest?',
        answer: 'Ja: één persoon, zonder losse flitsers of installatie, om dicht bij de gasten te blijven zonder op te vallen.',
      },
      {
        question: 'Wat is de levertijd?',
        answer: 'De foto’s binnen 3 weken, de aftermovie binnen 2 tot 4 weken, met twee rondes feedback inbegrepen. Snelle levering als optie.',
      },
      {
        question: 'Komt u ook buiten Brussel?',
        answer:
          'Ja: verplaatsing inbegrepen tot 60 km, daarna een vast tarief per zone (€ 90 voor Luik, Rijsel of Maastricht, € 190 voor Luxemburg, € 290 voor Parijs).',
      },
    ],
    mariage: [
      {
        question: 'Hoeveel kost een trouwfotograaf en -videograaf?',
        answer: `${price('mariage', 'photo')} incl. btw voor de foto’s van de volledige dag, ${price('mariage', 'video')} incl. btw voor de trouwfilm, en ${price('mariage', 'combo')} incl. btw voor beide door dezelfde persoon — dat is ${saving('mariage')} minder dan de twee formules apart. Verplaatsing inbegrepen tot 60 km van Brussel.`,
      },
      {
        question: 'Kan één persoon foto én video maken zonder momenten te missen?',
        answer:
          'Ja, met een methode: een hybride camera, de sleutelmomenten (intrede, ringen, first look, openingsdans) voorbereid bij de verkenning, en een prioriteit die we samen bepalen. Vanaf 120 gasten of bij een lange kerkelijke ceremonie dekt een tweede operator (€ 490) de gelijktijdige momenten.',
      },
      {
        question: 'Hoeveel foto’s krijgen we, en wanneer?',
        answer:
          'Ongeveer 400 bewerkte foto’s in een online galerij, met een voorproefje binnen 7 dagen en de volledige galerij binnen 4 weken. De trouwfilm van 5 tot 8 minuten en de teaser van één minuut volgen in dezelfde termijn.',
      },
      {
        question: 'Wat is inbegrepen in de volledige dag?',
        answer:
          'De verkenning van de locatie, de voorbereidingen, de ceremonie, de receptie en het feest, de bewerking van alle foto’s, de kleurcorrectie van de film, muziek in licentie en twee rondes feedback.',
      },
      {
        question: 'Doet u ook enkel het burgerlijk huwelijk op het gemeentehuis?',
        answer:
          'Ja: het lifestyle-fotopakket (1 u 30, 25 foto’s) dekt een korte burgerlijke ceremonie, en op maat kunt u een korte film of een koppelshoot na het gemeentehuis toevoegen.',
      },
      {
        question: 'Mag de trouwfilm op sociale media?',
        answer: 'Ja: de muziek is altijd in licentie, zodat Instagram, YouTube of Facebook de video nooit verwijderen of dempen.',
      },
      {
        question: 'Komt u voor een huwelijk naar Nederland, Frankrijk of Luxemburg?',
        answer:
          'Ja. Vast verplaatsingstarief: € 90 voor Maastricht, Eindhoven, Breda of Rijsel, € 190 voor Luxemburg, Amsterdam of Utrecht, € 290 voor Parijs, plus een hotelovernachting (€ 150) als het feest laat eindigt ver van Brussel. Buitenland: op offerte.',
      },
      {
        question: 'Wanneer moeten we boeken?',
        answer:
          'Zo vroeg mogelijk voor een zaterdag van mei tot september: de meeste koppels boeken 10 tot 14 maanden vooraf. Een voorschot van 30 % legt de datum vast.',
      },
    ],
    corporate: [
      {
        question: 'Hoeveel kost een bedrijfsvideo?',
        answer: `${price('corporate', 'video')} excl. btw voor een halve dag opname en een film van 1 tot 2 minuten met drie formaten voor sociale media. Teamportretten kosten ${price('corporate', 'photo')} excl. btw, en beide op dezelfde halve dag ${price('corporate', 'combo')} excl. btw.`,
      },
      {
        question: 'Wat zit er in een bedrijfsvideo?',
        answer:
          'Het script, de opname in uw kantoren, interviews met medewerkers of klanten, grafische opmaak in uw huisstijl (logo, kleuren), ondertitels en twee rondes feedback.',
      },
      {
        question: 'Kunnen de LinkedIn-portretten van het hele team in één keer?',
        answer:
          'Ja, dat is het fotopakket: een halve dag in uw kantoren, dezelfde achtergrond en lichtopstelling voor iedereen, elk portret bewerkt, geleverd in LinkedIn- en websiteformaat.',
      },
      {
        question: 'Dekt u een bedrijfsevenement (conferentie, seminarie, personeelsfeest)?',
        answer: 'Ja: foto, aftermovie en portretten op dezelfde dag, door één persoon. Op maat past duur en eindproducten aan uw programma aan.',
      },
      {
        question: 'Hoeveel revisies zijn inbegrepen?',
        answer: 'Twee rondes feedback na de eerste versie, vóór de definitieve levering.',
      },
      {
        question: 'Wie heeft de rechten op de beelden?',
        answer: 'U krijgt de commerciële gebruiksrechten: website, sociale media, rekrutering, beurzen, interne verspreiding, zonder beperking in tijd.',
      },
      {
        question: 'Werkt u ook in Nederland, Frankrijk of Luxemburg?',
        answer:
          'Ja, met een vast verplaatsingstarief per zone (€ 90 voor Eindhoven of Rijsel, € 190 voor Luxemburg-Stad of Amsterdam, € 290 voor Parijs). Voor een btw-plichtig bedrijf buiten België wordt de factuur met verlegde btw opgemaakt.',
      },
    ],
    sport: [
      {
        question: 'Hoeveel kost de verslaggeving van een wedstrijd of competitie?',
        answer: `${price('sport', 'photo')} excl. btw in foto (ongeveer 100 bewerkte foto’s), ${price('sport', 'video')} excl. btw in video (samenvatting van 1 tot 2 minuten), ${price('sport', 'combo')} excl. btw voor beide door dezelfde persoon. Meerdaagse competitie: op offerte.`,
      },
      {
        question: 'Voor wie is deze dienst bedoeld?',
        answer:
          'Voor clubs die beelden willen voor hun sociale media en sponsors, tornooiorganisatoren, atleten die een dossier samenstellen, maneges en sponsors.',
      },
      {
        question: 'Wordt er vanuit meerdere hoeken gefilmd?',
        answer: 'Ja: opname met meerdere brandpunten om de actie vanuit verschillende standpunten te volgen, slow motion op de hoogtepunten en sound design bij de montage.',
      },
      {
        question: 'Kunnen we dezelfde avond al beelden hebben voor sociale media?',
        answer: 'Een selectie foto’s klaar voor sociale media kan dezelfde avond geleverd worden, als expresoptie; de videosamenvatting volgt binnen 2 weken.',
      },
      {
        question: 'Mag de club de foto’s verkopen of verspreiden?',
        answer: 'Ja, de gebruiksrechten gaan naar de club of de organisator: sociale media, website, sponsors, verkoop aan deelnemers.',
      },
      {
        question: 'Komt u ook voor een amateurclub?',
        answer: 'Ja, van amateurclub tot meerdaags evenement: de getoonde prijs geldt voor één wedstrijd of een competitie van één dag.',
      },
      {
        question: 'Komt u naar een competitie buiten België?',
        answer: 'Ja, met een vast verplaatsingstarief per zone: inbegrepen tot 60 km van Brussel, € 90 tot 150 km, € 190 tot 250 km, € 290 voor Parijs.',
      },
    ],
    clip: [
      {
        question: 'Hoeveel kost een videoclip?',
        answer: `${price('clip', 'video')} excl. btw voor één opnamedag en een clip tot 4 minuten, met kleurcorrectie en korte versies. Promo- en hoesfoto’s kosten ${price('clip', 'photo')} excl. btw, en beide ${price('clip', 'combo')} excl. btw.`,
      },
      {
        question: 'Wat is inbegrepen in de clip?',
        answer: 'De artistieke leiding (sfeer, regie, keuze van de shots), de verkenning, de opnamedag, de ritmische montage op het nummer, de kleurcorrectie en twee rondes feedback.',
      },
      {
        question: 'Wat moet de artiest aanleveren?',
        answer: 'Het definitieve nummer in hoge kwaliteit, visuele referenties als die er zijn, en de figuranten of bijzondere locaties die hij wenst. De rest bouwen we samen op tijdens de briefing.',
      },
      {
        question: 'Kan de opname buiten, in een studio of in het buitenland?',
        answer: 'Ja: de locatie wordt bij de briefing bepaald volgens de wereld van de clip — Brussel, elders in België, Rijsel, Parijs, of verder met het bijbehorende verplaatsingstarief.',
      },
      {
        question: 'Wat is de levertijd?',
        answer: 'De clip wordt binnen 2 tot 4 weken na de opname geleverd, verticale versies inbegrepen; snelle levering mogelijk.',
      },
      {
        question: 'Volgt de montage het ritme van de muziek?',
        answer: 'Ja: elke cut is bedacht op het tempo en de structuur van het nummer. Het is de enige dienst waar de muziek niet in licentie is, want ze is het vertrekpunt.',
      },
      {
        question: 'Kan een clip met een klein budget?',
        answer: 'Op maat is een halve dag opname op één locatie mogelijk, met een kortere montage, voor een onafhankelijke artiest die start. Offerte binnen 48 u.',
      },
    ],
    lifestyle: [
      {
        question: 'Hoeveel kost een koppel-, gezins- of zwangerschapsshoot?',
        answer: `${price('lifestyle', 'photo')} incl. btw voor 1 u 30 en 25 bewerkte foto’s in een online galerij. Twee videoreels van 30 tot 60 seconden kosten ${price('lifestyle', 'video')}, en beide ${price('lifestyle', 'combo')}.`,
      },
      {
        question: 'Waar vindt de shoot plaats?',
        answer: 'De locatie kiezen we samen: Grote Markt, Jubelpark, Zoniënwoud, Ter Kamerenbos, Brugge, de kust, of bij u thuis. Verplaatsing inbegrepen tot 60 km van Brussel.',
      },
      {
        question: 'Doet u ook huwelijksaanzoeken?',
        answer: 'Ja, in alle discretie: we spreken plaats en uur af, u ziet me niet vóór het ja-woord. Video van het aanzoek als optie in het combopakket.',
      },
      {
        question: 'Maakt u content voor de sociale media van een merk?',
        answer: 'Ja: het videopakket levert twee reels klaar om te posten op een halve dag opname, en op maat is een maandelijks pakket (4 reels, vlog, reeks) mogelijk voor een restaurant, een zelfstandige of een merk.',
      },
      {
        question: 'Hoe lang duurt een sessie?',
        answer: '1 u 30 voor een fotoshoot, een halve dag voor videocontent. Kinderen zijn snel moe: we passen het ritme ter plaatse aan.',
      },
      {
        question: 'Wat is de levertijd?',
        answer: 'De foto’s binnen 2 weken, de reels binnen 2 tot 4 weken, met twee rondes feedback inbegrepen.',
      },
      {
        question: 'Mogen we de foto’s vrij gebruiken?',
        answer: 'Ja voor persoonlijk gebruik (delen, afdrukken, sociale media). Voor een merk zijn de commerciële gebruiksrechten in het pakket inbegrepen.',
      },
    ],
  },
  en: {
    evenementiel: [
      {
        question: 'How much does a photographer cost for a communion, a birthday or a party?',
        answer: `${price('evenementiel', 'photo')} incl. VAT for 3 hours of coverage and around 150 edited photos. The aftermovie is ${price('evenementiel', 'video')}, and both by the same person ${price('evenementiel', 'combo')}. Beyond 3 hours, an extra hour is €150.`,
      },
      {
        question: 'What kinds of events do you cover?',
        answer: 'Communions, christenings, birthdays, family celebrations, private parties, launches. Any event you want a true record of, with no staging.',
      },
      {
        question: 'What is in the aftermovie?',
        answer: 'A 2 to 3 minute edit of the highlights, colour graded, on licensed music, plus a vertical cut ready for Instagram or WhatsApp.',
      },
      {
        question: 'For a communion, when should the photos be taken?',
        answer: 'On the day for the party, or during a session a few weeks before if you want photos for the invitations: the lifestyle photo package (1.5 hours, 25 photos) then fits better.',
      },
      {
        question: 'Is the photographer unobtrusive during the party?',
        answer: 'Yes: one person, no off-camera flash or setup, staying close to the guests without ever getting in the way.',
      },
      {
        question: 'How long does delivery take?',
        answer: 'Photos within 3 weeks, the aftermovie within 2 to 4 weeks, with two rounds of edits included. Express delivery available as an option.',
      },
      {
        question: 'Do you travel outside Brussels?',
        answer: 'Yes: travel included up to 60 km, then a flat fee per zone (€90 for Liège, Lille or Maastricht, €190 for Luxembourg, €290 for Paris).',
      },
    ],
    mariage: [
      {
        question: 'How much does a wedding photographer and videographer cost?',
        answer: `${price('mariage', 'photo')} incl. VAT for full-day photography, ${price('mariage', 'video')} incl. VAT for the film, and ${price('mariage', 'combo')} incl. VAT for both by the same person — ${saving('mariage')} less than the two packages separately. Travel included up to 60 km from Brussels.`,
      },
      {
        question: 'Can one person shoot photo and video without missing moments?',
        answer:
          'Yes, with a method: a hybrid camera, the key moments (entrance, rings, first look, first dance) prepared during scouting, and a priority agreed with you. Above 120 guests or for a long religious ceremony, a second operator (€490) covers simultaneous moments.',
      },
      {
        question: 'How many photos do we get, and when?',
        answer: 'Around 400 edited photos in an online gallery, with a sneak peek within 7 days and the full gallery within 4 weeks. The 5 to 8 minute film and its one-minute teaser follow in the same window.',
      },
      {
        question: 'What is included in the full day?',
        answer: 'Venue scouting, getting ready, the ceremony, drinks and the party, every photo edited, the film colour graded, licensed music and two rounds of edits.',
      },
      {
        question: 'Do you cover civil ceremonies at the town hall on their own?',
        answer: 'Yes: the lifestyle photo package (1.5 hours, 25 photos) covers a short civil ceremony, and the custom option adds a short film or a couple session after the town hall.',
      },
      {
        question: 'Can the film be shared on social media?',
        answer: 'Yes: music is always licensed, so nothing gets taken down or muted on Instagram, YouTube or Facebook.',
      },
      {
        question: 'Do you travel for a wedding in France, Luxembourg or the Netherlands?',
        answer: 'Yes. Flat travel fee: €90 for Lille, Liège or Maastricht, €190 for Luxembourg, the Opal Coast or Amsterdam, €290 for Paris, plus a hotel night (€150) when the party ends late far from Brussels. Abroad, on quote.',
      },
      {
        question: 'When should we book?',
        answer: 'As early as you can for a Saturday from May to September: most couples book 10 to 14 months ahead. A 30% deposit secures the date.',
      },
    ],
    corporate: [
      {
        question: 'How much does a corporate video cost?',
        answer: `${price('corporate', 'video')} excl. VAT for a half-day shoot and a 1 to 2 minute film with three social media cuts. Team headshots are ${price('corporate', 'photo')} excl. VAT, and both on the same half day ${price('corporate', 'combo')} excl. VAT.`,
      },
      {
        question: 'What does a corporate video include?',
        answer: 'The script, the shoot at your offices, interviews with staff or clients, branding to your guidelines (logo, colours), subtitles and two rounds of edits.',
      },
      {
        question: 'Can the whole team get LinkedIn headshots in one go?',
        answer: 'Yes, that is the photo package: a half day at your offices, the same backdrop and lighting for everyone, every portrait retouched, delivered in LinkedIn and website formats.',
      },
      {
        question: 'Do you cover corporate events (conferences, seminars, parties)?',
        answer: 'Yes: photo, aftermovie and headshots on the same day, by one person. The custom option adapts duration and deliverables to your programme.',
      },
      {
        question: 'How many revisions are included?',
        answer: 'Two rounds of edits after the first cut, before final delivery.',
      },
      {
        question: 'Who owns the rights to the images?',
        answer: 'You receive commercial usage rights: website, social media, recruitment, trade shows, internal use, with no time limit.',
      },
      {
        question: 'Do you work in France, Luxembourg or the Netherlands?',
        answer: 'Yes, with a flat travel fee per zone (€90 for Lille, €190 for Luxembourg City or Amsterdam, €290 for Paris). For a VAT-registered company outside Belgium, the invoice is issued under the reverse-charge mechanism.',
      },
    ],
    sport: [
      {
        question: 'How much does covering a match or competition cost?',
        answer: `${price('sport', 'photo')} excl. VAT for photos (around 100 edited), ${price('sport', 'video')} excl. VAT for video (1 to 2 minute highlights), ${price('sport', 'combo')} excl. VAT for both by the same person. Multi-day competitions: on quote.`,
      },
      {
        question: 'Who is this service for?',
        answer: 'Clubs that want images for their social media and sponsors, tournament organisers, athletes building a portfolio, equestrian centres and sponsors.',
      },
      {
        question: 'Do you shoot from several angles?',
        answer: 'Yes: multi-lens coverage to follow the action from several viewpoints, slow motion on key moments and sound design in the edit.',
      },
      {
        question: 'Can we have images the same evening for social media?',
        answer: 'A social-ready photo selection can be delivered the same evening as an express option; the video highlights follow within 2 weeks.',
      },
      {
        question: 'Can the club sell or distribute the photos?',
        answer: 'Yes, usage rights go to the club or organiser: social media, website, sponsors, sales to participants.',
      },
      {
        question: 'Do you cover amateur clubs?',
        answer: 'Yes, from amateur clubs to multi-day events: the published price is for one match or a one-day competition.',
      },
      {
        question: 'Do you travel for a competition outside Belgium?',
        answer: 'Yes, with a flat travel fee per zone: included up to 60 km from Brussels, €90 up to 150 km, €190 up to 250 km, €290 for Paris.',
      },
    ],
    clip: [
      {
        question: 'How much does a music video cost?',
        answer: `${price('clip', 'video')} excl. VAT for one shooting day and a video up to 4 minutes, colour graded, with short cuts. Promo and cover photos are ${price('clip', 'photo')} excl. VAT, and both ${price('clip', 'combo')} excl. VAT.`,
      },
      {
        question: 'What is included in the music video?',
        answer: 'Art direction (mood, staging, shot choices), scouting, the shooting day, the rhythmic edit cut to the track, colour grading and two rounds of edits.',
      },
      {
        question: 'What does the artist need to provide?',
        answer: 'The final track in high quality, visual references if any, and any extras or specific locations they want. The rest is built together at the brief.',
      },
      {
        question: 'Can we shoot outdoors, in a studio, abroad?',
        answer: 'Yes: the location is decided at the brief according to the world of the video — Brussels, elsewhere in Belgium, Lille, Paris, or further with the matching travel fee.',
      },
      {
        question: 'How long does delivery take?',
        answer: 'The video is delivered within 2 to 4 weeks after the shoot, vertical cuts included; express option available.',
      },
      {
        question: 'Does the edit follow the rhythm of the music?',
        answer: 'Yes: every cut is designed on the tempo and structure of the track. It is the only service where the music is not licensed, since it is the starting point.',
      },
      {
        question: 'Can we make a music video on a small budget?',
        answer: 'The custom option allows a half-day shoot in a single location with a shorter edit, for an independent artist starting out. Quote within 48 h.',
      },
    ],
    lifestyle: [
      {
        question: 'How much does a couple, family or maternity photo session cost?',
        answer: `${price('lifestyle', 'photo')} incl. VAT for 1.5 hours and 25 edited photos in an online gallery. Two video reels of 30 to 60 seconds are ${price('lifestyle', 'video')}, and both ${price('lifestyle', 'combo')}.`,
      },
      {
        question: 'Where does the session take place?',
        answer: 'The location is chosen together: Grand-Place, Cinquantenaire, Sonian Forest, Bois de la Cambre, Bruges, the coast, or your home. Travel included up to 60 km from Brussels.',
      },
      {
        question: 'Do you shoot proposals?',
        answer: 'Yes, discreetly: we agree on the place and time, you will not see me before the yes. Video of the proposal available in the combo package.',
      },
      {
        question: 'Do you produce social media content for brands?',
        answer: 'Yes: the video package delivers two ready-to-post reels from a half-day shoot, and the custom option allows a monthly batch (4 reels, vlog, series) for a restaurant, a freelancer or a brand.',
      },
      {
        question: 'How long does a session last?',
        answer: '1.5 hours for a photo session, a half day for video content. Children tire quickly: we adapt the pace on the spot.',
      },
      {
        question: 'How long does delivery take?',
        answer: 'Photos within 2 weeks, reels within 2 to 4 weeks, with two rounds of edits included.',
      },
      {
        question: 'Can we use the photos freely?',
        answer: 'Yes for personal use (sharing, prints, social media). For a brand, commercial usage rights are included in the package.',
      },
    ],
  },
};
