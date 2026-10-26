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
        answer: `${price('evenementiel', 'photo')} TTC pour 3 heures sur place et environ 100 photos retouchées, livrées dans la semaine. L’aftermovie vidéo (30 secondes à 1 minute) est à ${price('evenementiel', 'video')}, et les deux par la même personne à ${price('evenementiel', 'combo')}. Au-delà de 3 heures, l’heure supplémentaire est à 150 €.`,
      },
      {
        question: 'Quels types d’événements sont couverts ?',
        answer:
          'Communions, lentefeesten, baptêmes, anniversaires, fêtes de famille, soirées privées, lancements. Tout événement dont vous voulez garder une trace vraie, sans mise en scène.',
      },
      {
        question: 'Que contient l’aftermovie ?',
        answer:
          'Un montage de 30 secondes à 1 minute des temps forts, étalonné, sur une musique sous licence, prêt à partager sur Instagram ou WhatsApp.',
      },
      {
        question: 'Pour une communion, quand faut-il faire les photos ?',
        answer:
          'Le jour même pour la fête, ou lors d’une séance quelques semaines avant si vous voulez des photos pour les faire-part : une séance lifestyle, sur devis, convient alors mieux.',
      },
      {
        question: 'Le photographe est-il discret pendant la fête ?',
        answer:
          'Oui : une seule personne, sans flash déporté ni installation, pour rester proche des invités sans jamais s’imposer.',
      },
      {
        question: 'Quel est le délai de livraison ?',
        answer: 'Les photos dans la semaine, l’aftermovie sous 1 à 2 semaines, avec deux allers-retours de retouche inclus. Livraison express possible en option.',
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
          'Environ 300 photos retouchées dans une galerie en ligne, livrées sous 2 à 4 semaines. Le film de 7 à 10 minutes suit dans le même délai.',
      },
      {
        question: 'Qu’est-ce qui est inclus dans la journée complète ?',
        answer:
          'Le repérage du lieu, les préparatifs, la cérémonie, le cocktail et la soirée, la retouche de toutes les photos, l’étalonnage du film et deux allers-retours de montage.',
      },
      {
        question: 'Faites-vous les mariages civils seuls, à la maison communale ?',
        answer:
          'Oui, sur mesure : une cérémonie civile courte en photo, en vidéo ou les deux, avec une séance couple après la mairie si vous le souhaitez. Devis sous 48 h.',
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
        answer:
          'Sur devis : chaque projet est différent — un film, des portraits, une journée où tout est tourné, monté et publié le jour même, ou un suivi régulier de vos réseaux. Après un premier échange, vous recevez un devis chiffré sous 48 h.',
      },
      {
        question: 'Que contient une vidéo d’entreprise ?',
        answer:
          'Ce que nous fixons ensemble au devis : le script, le tournage dans vos locaux, les interviews de collaborateurs ou clients, l’habillage graphique à votre charte (logo, couleurs), les sous-titres et deux allers-retours de montage.',
      },
      {
        question: 'Peut-on faire les portraits LinkedIn de toute l’équipe en une fois ?',
        answer:
          'Oui : une demi-journée dans vos locaux, un fond et une lumière identiques pour tous, chaque portrait retouché, livré en format LinkedIn et site web. Prix sur devis, selon le nombre de personnes.',
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
        answer: `${price('sport', 'photo')} HTVA en photo (environ 70 photos retouchées), ${price('sport', 'video')} HTVA en vidéo (résumé de 1 à 2 minutes), ${price('sport', 'combo')} HTVA pour les deux par la même personne. Compétition sur plusieurs jours : sur devis.`,
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
        answer:
          'Sur devis : la durée du tournage, le nombre de lieux, la mise en scène et les photos de promo changent tout. Après un échange sur le morceau et vos idées, vous recevez un devis chiffré sous 48 h.',
      },
      {
        question: 'Qu’est-ce qui est inclus dans le clip ?',
        answer:
          'Ce que nous fixons ensemble au devis, en général : la direction artistique (ambiance, mise en scène, choix des plans), le repérage, le tournage, le montage rythmique calé sur le morceau, l’étalonnage et deux allers-retours.',
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
        answer: 'Le délai est fixé au devis, en général 2 à 4 semaines après le tournage ; option express possible.',
      },
      {
        question: 'Le montage suit-il le rythme de la musique ?',
        answer: 'Oui : chaque coupe est pensée sur le tempo et la structure du morceau, qui est le point de départ du montage.',
      },
      {
        question: 'Peut-on faire un clip avec un petit budget ?',
        answer:
          'Oui : le devis s’adapte, par exemple une demi-journée de tournage en un seul lieu, avec un montage plus court, pour un artiste indépendant qui démarre. Devis sous 48 h.',
      },
    ],
    lifestyle: [
      {
        question: 'Combien coûte une séance photo couple, famille ou grossesse ?',
        answer:
          'Sur devis, selon la durée, le lieu et ce que vous voulez recevoir : des photos, des reels vidéo ou les deux. Vous recevez un devis chiffré sous 48 h.',
      },
      {
        question: 'Où se passe la séance ?',
        answer:
          'Le lieu se choisit ensemble : Grand-Place, Cinquantenaire, forêt de Soignes, bois de la Cambre, Bruges, la côte, ou chez vous. Déplacement inclus jusqu’à 60 km de Bruxelles.',
      },
      {
        question: 'Faites-vous les demandes en mariage ?',
        answer:
          'Oui, en toute discrétion : nous convenons du lieu et de l’heure, vous ne me voyez pas avant le oui. La vidéo de la demande est possible aussi, sur devis.',
      },
      {
        question: 'Proposez-vous du contenu pour les réseaux sociaux d’une marque ?',
        answer:
          'Oui, sur devis : des reels prêts à publier, ou un lot mensuel (4 reels, vlog, série) pour un restaurant, un indépendant ou une marque.',
      },
      {
        question: 'Combien de temps dure une séance ?',
        answer: 'En général 1 h 30 pour une séance photo, une demi-journée pour du contenu vidéo ; la durée exacte est fixée au devis. Les enfants se lassent vite : on adapte le rythme sur place.',
      },
      {
        question: 'Quel est le délai de livraison ?',
        answer: 'Le délai figure sur le devis : en général les photos sous 2 semaines, les reels sous 2 à 4 semaines, avec deux allers-retours inclus.',
      },
      {
        question: 'Peut-on utiliser les photos librement ?',
        answer:
          'Oui pour un usage personnel (partage, tirages, réseaux). Pour une marque, la cession des droits d’usage commercial est précisée sur le devis.',
      },
    ],
  },
  nl: {
    evenementiel: [
      {
        question: 'Hoeveel kost een fotograaf voor een communie, verjaardag of feest?',
        answer: `${price('evenementiel', 'photo')} incl. btw voor 3 uur ter plaatse en ongeveer 100 bewerkte foto’s, geleverd binnen de week. De aftermovie (30 seconden tot 1 minuut) kost ${price('evenementiel', 'video')}, en beide door dezelfde persoon ${price('evenementiel', 'combo')}. Na 3 uur kost een extra uur € 150.`,
      },
      {
        question: 'Welke soorten evenementen worden gedekt?',
        answer:
          'Communies, lentefeesten, doopfeesten, verjaardagen, familiefeesten, privéfeestjes, lanceringen. Elk evenement waarvan u een echte herinnering wilt, zonder regie.',
      },
      {
        question: 'Wat zit er in de aftermovie?',
        answer:
          'Een montage van 30 seconden tot 1 minuut met de hoogtepunten, met kleurcorrectie, op muziek in licentie, klaar om te delen op Instagram of WhatsApp.',
      },
      {
        question: 'Wanneer maak je best de foto’s voor een communie of lentefeest?',
        answer:
          'Op de dag zelf voor het feest, of tijdens een sessie enkele weken vooraf als u foto’s wilt voor de uitnodigingen: dan past een lifestyle-sessie, op offerte, beter.',
      },
      {
        question: 'Is de fotograaf discreet tijdens het feest?',
        answer: 'Ja: één persoon, zonder losse flitsers of installatie, om dicht bij de gasten te blijven zonder op te vallen.',
      },
      {
        question: 'Wat is de levertijd?',
        answer: 'De foto’s binnen de week, de aftermovie binnen 1 tot 2 weken, met twee rondes feedback inbegrepen. Snelle levering als optie.',
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
          'Ongeveer 300 bewerkte foto’s in een online galerij, geleverd binnen 2 tot 4 weken. De trouwfilm van 7 tot 10 minuten volgt in dezelfde termijn.',
      },
      {
        question: 'Wat is inbegrepen in de volledige dag?',
        answer:
          'De verkenning van de locatie, de voorbereidingen, de ceremonie, de receptie en het feest, de bewerking van alle foto’s, de kleurcorrectie van de film en twee rondes feedback.',
      },
      {
        question: 'Doet u ook enkel het burgerlijk huwelijk op het gemeentehuis?',
        answer:
          'Ja, op maat: een korte burgerlijke ceremonie in foto, video of beide, met een koppelshoot na het gemeentehuis als u dat wilt. Offerte binnen 48 u.',
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
        answer:
          'Op offerte: elk project is anders — een film, portretten, een dag waarop alles dezelfde dag gefilmd, gemonteerd en gepost wordt, of een regelmatige opvolging van uw sociale media. Na een eerste gesprek ontvangt u een concrete offerte binnen 48 u.',
      },
      {
        question: 'Wat zit er in een bedrijfsvideo?',
        answer:
          'Wat we samen in de offerte vastleggen: het script, de opname in uw kantoren, interviews met medewerkers of klanten, grafische opmaak in uw huisstijl (logo, kleuren), ondertitels en twee rondes feedback.',
      },
      {
        question: 'Kunnen de LinkedIn-portretten van het hele team in één keer?',
        answer:
          'Ja: een halve dag in uw kantoren, dezelfde achtergrond en lichtopstelling voor iedereen, elk portret bewerkt, geleverd in LinkedIn- en websiteformaat. Prijs op offerte, volgens het aantal personen.',
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
        answer: `${price('sport', 'photo')} excl. btw in foto (ongeveer 70 bewerkte foto’s), ${price('sport', 'video')} excl. btw in video (samenvatting van 1 tot 2 minuten), ${price('sport', 'combo')} excl. btw voor beide door dezelfde persoon. Meerdaagse competitie: op offerte.`,
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
        answer:
          'Op offerte: de opnameduur, het aantal locaties, de regie en de promofoto’s maken het verschil. Na een gesprek over het nummer en uw ideeën ontvangt u een concrete offerte binnen 48 u.',
      },
      {
        question: 'Wat is inbegrepen in de clip?',
        answer: 'Wat we samen in de offerte vastleggen, meestal: de artistieke leiding (sfeer, regie, keuze van de shots), de verkenning, de opname, de ritmische montage op het nummer, de kleurcorrectie en twee rondes feedback.',
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
        answer: 'De termijn staat in de offerte, meestal 2 tot 4 weken na de opname; snelle levering mogelijk.',
      },
      {
        question: 'Volgt de montage het ritme van de muziek?',
        answer: 'Ja: elke cut is bedacht op het tempo en de structuur van het nummer, dat het vertrekpunt van de montage is.',
      },
      {
        question: 'Kan een clip met een klein budget?',
        answer: 'Ja: de offerte past zich aan, bijvoorbeeld een halve dag opname op één locatie, met een kortere montage, voor een onafhankelijke artiest die start. Offerte binnen 48 u.',
      },
    ],
    lifestyle: [
      {
        question: 'Hoeveel kost een koppel-, gezins- of zwangerschapsshoot?',
        answer: 'Op offerte, volgens de duur, de locatie en wat u wilt ontvangen: foto’s, videoreels of beide. U ontvangt een concrete offerte binnen 48 u.',
      },
      {
        question: 'Waar vindt de shoot plaats?',
        answer: 'De locatie kiezen we samen: Grote Markt, Jubelpark, Zoniënwoud, Ter Kamerenbos, Brugge, de kust, of bij u thuis. Verplaatsing inbegrepen tot 60 km van Brussel.',
      },
      {
        question: 'Doet u ook huwelijksaanzoeken?',
        answer: 'Ja, in alle discretie: we spreken plaats en uur af, u ziet me niet vóór het ja-woord. Een video van het aanzoek kan ook, op offerte.',
      },
      {
        question: 'Maakt u content voor de sociale media van een merk?',
        answer: 'Ja, op offerte: reels klaar om te posten, of een maandelijks pakket (4 reels, vlog, reeks) voor een restaurant, een zelfstandige of een merk.',
      },
      {
        question: 'Hoe lang duurt een sessie?',
        answer: 'Meestal 1 u 30 voor een fotoshoot, een halve dag voor videocontent; de precieze duur staat in de offerte. Kinderen zijn snel moe: we passen het ritme ter plaatse aan.',
      },
      {
        question: 'Wat is de levertijd?',
        answer: 'De termijn staat in de offerte: meestal de foto’s binnen 2 weken, de reels binnen 2 tot 4 weken, met twee rondes feedback inbegrepen.',
      },
      {
        question: 'Mogen we de foto’s vrij gebruiken?',
        answer: 'Ja voor persoonlijk gebruik (delen, afdrukken, sociale media). Voor een merk staan de commerciële gebruiksrechten in de offerte.',
      },
    ],
  },
  en: {
    evenementiel: [
      {
        question: 'How much does a photographer cost for a communion, a birthday or a party?',
        answer: `${price('evenementiel', 'photo')} incl. VAT for 3 hours on site and around 100 edited photos, delivered within a week. The aftermovie (30 seconds to 1 minute) is ${price('evenementiel', 'video')}, and both by the same person ${price('evenementiel', 'combo')}. Beyond 3 hours, an extra hour is €150.`,
      },
      {
        question: 'What kinds of events do you cover?',
        answer: 'Communions, christenings, birthdays, family celebrations, private parties, launches. Any event you want a true record of, with no staging.',
      },
      {
        question: 'What is in the aftermovie?',
        answer: 'A 30-second to 1-minute edit of the highlights, colour graded, on licensed music, ready to share on Instagram or WhatsApp.',
      },
      {
        question: 'For a communion, when should the photos be taken?',
        answer: 'On the day for the party, or during a session a few weeks before if you want photos for the invitations: a lifestyle session, on quote, then fits better.',
      },
      {
        question: 'Is the photographer unobtrusive during the party?',
        answer: 'Yes: one person, no off-camera flash or setup, staying close to the guests without ever getting in the way.',
      },
      {
        question: 'How long does delivery take?',
        answer: 'Photos within a week, the aftermovie within 1 to 2 weeks, with two rounds of edits included. Express delivery available as an option.',
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
        answer: 'Around 300 edited photos in an online gallery, delivered within 2 to 4 weeks. The 7 to 10 minute film follows in the same window.',
      },
      {
        question: 'What is included in the full day?',
        answer: 'Venue scouting, getting ready, the ceremony, drinks and the party, every photo edited, the film colour graded and two rounds of edits.',
      },
      {
        question: 'Do you cover civil ceremonies at the town hall on their own?',
        answer: 'Yes, as a custom package: a short civil ceremony in photo, video or both, with a couple session after the town hall if you like. Quote within 48 h.',
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
        answer:
          'On quote: every project is different — a film, headshots, a day where everything is shot, edited and posted the same day, or ongoing social media coverage. After a first conversation, you receive an itemised quote within 48 h.',
      },
      {
        question: 'What does a corporate video include?',
        answer: 'What we set together in the quote: the script, the shoot at your offices, interviews with staff or clients, branding to your guidelines (logo, colours), subtitles and two rounds of edits.',
      },
      {
        question: 'Can the whole team get LinkedIn headshots in one go?',
        answer: 'Yes: a half day at your offices, the same backdrop and lighting for everyone, every portrait retouched, delivered in LinkedIn and website formats. Priced on quote, by team size.',
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
        answer: `${price('sport', 'photo')} excl. VAT for photos (around 70 edited), ${price('sport', 'video')} excl. VAT for video (1 to 2 minute highlights), ${price('sport', 'combo')} excl. VAT for both by the same person. Multi-day competitions: on quote.`,
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
        answer:
          'On quote: shooting time, the number of locations, the staging and the promo photos change everything. After a conversation about the track and your ideas, you receive an itemised quote within 48 h.',
      },
      {
        question: 'What is included in the music video?',
        answer: 'What we set together in the quote, usually: art direction (mood, staging, shot choices), scouting, the shoot, the rhythmic edit cut to the track, colour grading and two rounds of edits.',
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
        answer: 'The timing is set in the quote, usually 2 to 4 weeks after the shoot; express option available.',
      },
      {
        question: 'Does the edit follow the rhythm of the music?',
        answer: 'Yes: every cut is designed on the tempo and structure of the track, which is the starting point of the edit.',
      },
      {
        question: 'Can we make a music video on a small budget?',
        answer: 'Yes: the quote adapts, for example a half-day shoot in a single location with a shorter edit, for an independent artist starting out. Quote within 48 h.',
      },
    ],
    lifestyle: [
      {
        question: 'How much does a couple, family or maternity photo session cost?',
        answer: 'On quote, depending on duration, location and what you want to receive: photos, video reels or both. You receive an itemised quote within 48 h.',
      },
      {
        question: 'Where does the session take place?',
        answer: 'The location is chosen together: Grand-Place, Cinquantenaire, Sonian Forest, Bois de la Cambre, Bruges, the coast, or your home. Travel included up to 60 km from Brussels.',
      },
      {
        question: 'Do you shoot proposals?',
        answer: 'Yes, discreetly: we agree on the place and time, you will not see me before the yes. A video of the proposal is possible too, on quote.',
      },
      {
        question: 'Do you produce social media content for brands?',
        answer: 'Yes, on quote: ready-to-post reels, or a monthly batch (4 reels, vlog, series) for a restaurant, a freelancer or a brand.',
      },
      {
        question: 'How long does a session last?',
        answer: 'Usually 1.5 hours for a photo session, a half day for video content; the exact duration is set in the quote. Children tire quickly: we adapt the pace on the spot.',
      },
      {
        question: 'How long does delivery take?',
        answer: 'The timing is on the quote: usually photos within 2 weeks, reels within 2 to 4 weeks, with two rounds of edits included.',
      },
      {
        question: 'Can we use the photos freely?',
        answer: 'Yes for personal use (sharing, prints, social media). For a brand, commercial usage rights are set out in the quote.',
      },
    ],
  },
};
