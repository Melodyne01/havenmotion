import { CategoryKey, SiteLocale } from './locale';

/**
 * Paragraphe d'intro propre à chaque page catégorie, distinct de la FAQ
 * (qui répond à des questions précises) : une présentation en prose qui
 * mélange le mot-clé du métier (photographe et vidéaste mariage, vidéo
 * d'entreprise…) et la zone couverte (Belgique, nord de la France,
 * Luxembourg, Pays-Bas), construite sur des faits réels des packs (durée,
 * inclus) — jamais une affirmation inventée. Indexé par la clé neutre de la
 * catégorie (slug FR), commune aux trois langues.
 */
export const CATEGORY_INTRO_CONTENT: Record<SiteLocale, Record<CategoryKey, string>> = {
  fr: {
    evenementiel:
      'Photographe et vidéaste événementiel en Belgique, dans le nord de la France, au Luxembourg et aux Pays-Bas : communions, baptêmes, anniversaires, soirées et fêtes de famille, captés dans l’instant sans mise en scène ni temps mort imposé aux invités. Trois formules pour 3 heures de présence — photo, aftermovie, ou les deux par la même personne — et le sur mesure pour une soirée plus longue.',
    mariage:
      'Photographe et vidéaste mariage en Belgique, dans le nord de la France, au Luxembourg et aux Pays-Bas : une seule personne pour la photo et la vidéo, pour rester proche des invités sans jamais s’imposer pendant la cérémonie. Repérage du lieu inclus, journée complète des préparatifs à la soirée, environ 300 photos et un film de 7 à 10 minutes livrés sous 2 à 4 semaines. Le pack photo + vidéo coûte moins cher que deux prestataires séparés.',
    corporate:
      'Photographe et vidéaste d’entreprise en Belgique, dans le nord de la France, au Luxembourg et aux Pays-Bas : portraits d’équipe homogènes pour LinkedIn, film de présentation de 1 à 2 minutes avec interviews et habillage graphique, ou une journée où tout est tourné, monté et publié le jour même. Sur devis, hors TVA, avec formats réseaux sociaux, sous-titres et cession des droits d’usage commercial.',
    sport:
      'Photographe et vidéaste sportif en Belgique, dans le nord de la France, au Luxembourg et aux Pays-Bas : un match, un tournoi ou une compétition couverts en photo, en vidéo multi-focale avec ralentis et sound design, ou les deux. Pour un club, un organisateur, un athlète ou un sponsor, avec une sélection prête pour les réseaux et les droits d’usage pour le club.',
    clip:
      'Réalisateur de clips musicaux en Belgique, dans le nord de la France, au Luxembourg et aux Pays-Bas : direction artistique, repérage, une journée de tournage et un montage rythmique calé sur le morceau de l’artiste, étalonné, avec ses déclinaisons courtes pour les réseaux. Photos de promo et de pochette sur la même journée si vous le souhaitez. Sur devis.',
    lifestyle:
      'Photographe et vidéaste lifestyle en Belgique, dans le nord de la France, au Luxembourg et aux Pays-Bas : séances couple, famille, grossesse ou demande en mariage, et contenu de marque pour les réseaux sociaux — reels, vlogs, séries. Tournage naturel plutôt que scénarisé, montage rythmé pour Instagram et TikTok, lieu choisi ensemble. Sur devis.',
  },
  nl: {
    evenementiel:
      'Fotograaf en videograaf voor evenementen in België, Noord-Frankrijk, Luxemburg en Nederland: communies, lentefeesten, doopfeesten, verjaardagen, feestavonden en familiefeesten, vastgelegd in het moment zonder regie of opgelegde stiltes voor de gasten. Drie formules voor 3 uur ter plaatse — foto, aftermovie, of beide door dezelfde persoon — en op maat voor een langere avond.',
    mariage:
      'Fotograaf en videograaf voor huwelijken in België, Noord-Frankrijk, Luxemburg en Nederland: één persoon voor foto en video, om dicht bij de gasten te blijven zonder de ceremonie te verstoren. Verkenning van de locatie inbegrepen, volledige dag van de voorbereidingen tot het feest, ongeveer 300 foto’s en een trouwfilm van 7 tot 10 minuten geleverd binnen 2 tot 4 weken. Het pakket foto + video kost minder dan twee aparte leveranciers.',
    corporate:
      'Bedrijfsfotograaf en -videograaf in België, Noord-Frankrijk, Luxemburg en Nederland: uniforme teamportretten voor LinkedIn, een bedrijfsvideo van 1 tot 2 minuten met interviews en grafische opmaak, of een dag waarop alles dezelfde dag gefilmd, gemonteerd en gepost wordt. Op offerte, excl. btw, met formaten voor sociale media, ondertitels en commerciële gebruiksrechten.',
    sport:
      'Sportfotograaf en -videograaf in België, Noord-Frankrijk, Luxemburg en Nederland: een wedstrijd, tornooi of competitie in foto, in video met meerdere brandpunten, slow motion en sound design, of beide. Voor een club, organisator, atleet of sponsor, met een selectie klaar voor sociale media en gebruiksrechten voor de club.',
    clip:
      'Regisseur van videoclips in België, Noord-Frankrijk, Luxemburg en Nederland: artistieke leiding, verkenning, één opnamedag en een ritmische montage op het nummer van de artiest, met kleurcorrectie en korte versies voor sociale media. Promo- en hoesfoto’s op dezelfde dag als u dat wilt. Op offerte.',
    lifestyle:
      'Lifestyle-fotograaf en -videograaf in België, Noord-Frankrijk, Luxemburg en Nederland: koppel-, gezins- en zwangerschapsshoots, huwelijksaanzoeken, en merkcontent voor sociale media — reels, vlogs, reeksen. Natuurlijke opname in plaats van script, ritmische montage voor Instagram en TikTok, locatie samen gekozen. Op offerte.',
  },
  en: {
    evenementiel:
      'Event photographer and videographer in Belgium, northern France, Luxembourg and the Netherlands: communions, christenings, birthdays, parties and family celebrations, captured as they happen with no staging and no dead time imposed on your guests. Three packages for 3 hours on site — photo, aftermovie, or both by the same person — and a custom option for a longer evening.',
    mariage:
      'Wedding photographer and videographer in Belgium, northern France, Luxembourg and the Netherlands: one person for both photo and video, close to the guests without ever getting in the way of the ceremony. Venue scouting included, full day from getting ready to the party, around 300 photos and a 7 to 10 minute film delivered within 2 to 4 weeks. The photo + video package costs less than two separate suppliers.',
    corporate:
      'Corporate photographer and videographer in Belgium, northern France, Luxembourg and the Netherlands: consistent team headshots for LinkedIn, a 1 to 2 minute company film with interviews and branding, or a day where everything is shot, edited and posted the same day. On quote, excluding VAT, with social media cuts, subtitles and commercial usage rights.',
    sport:
      'Sports photographer and videographer in Belgium, northern France, Luxembourg and the Netherlands: a match, tournament or competition covered in photo, in multi-lens video with slow motion and sound design, or both. For a club, an organiser, an athlete or a sponsor, with a social-ready selection and usage rights for the club.',
    clip:
      'Music video director in Belgium, northern France, Luxembourg and the Netherlands: art direction, scouting, one shooting day and a rhythmic edit cut to the artist’s track, colour graded, with short versions for social media. Promo and cover photos on the same day if you like. On quote.',
    lifestyle:
      'Lifestyle photographer and videographer in Belgium, northern France, Luxembourg and the Netherlands: couple, family and maternity sessions, proposals, and brand content for social media — reels, vlogs, series. Natural rather than scripted, punchy edits for Instagram and TikTok, location chosen together. On quote.',
  },
};
