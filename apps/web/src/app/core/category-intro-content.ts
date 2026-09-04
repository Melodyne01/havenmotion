import { SiteLocale } from './locale';

/**
 * Paragraphe d'intro propre à chaque page catégorie, distinct de la FAQ
 * (qui répond à des questions précises) : une présentation en prose qui
 * mélange mot-clé local ("à Bruxelles", zone) et mot-clé général du métier
 * (vidéaste mariage, vidéo d'entreprise…), construite sur des faits déjà
 * réels de SITE_CONTENT (durée, inclus) — jamais une affirmation inventée.
 * Indexé par le slug réel de la catégorie dans la langue courante.
 */
export const CATEGORY_INTRO_CONTENT: Record<SiteLocale, Record<string, string>> = {
  fr: {
    mariage:
      'Vidéaste mariage à Bruxelles : le tournage se fait seul ou en équipe réduite pour rester proche des invités sans jamais s’imposer pendant la cérémonie. Repérage du lieu inclus, captation de la journée complète jusqu’à la soirée, dans les 19 communes de la Région de Bruxelles-Capitale, à Wemmel et dans sa périphérie flamande.',
    corporate:
      'Vidéo d’entreprise à Bruxelles : script, tournage et interviews de collaborateurs ou clients, avec un habillage graphique en post-production pour intégrer logo et charte de marque. Le tournage se déroule dans vos bureaux ou sur le lieu de votre choix, à Bruxelles et dans toute sa périphérie flamande.',
    sport:
      'Captation sportive à Bruxelles : plusieurs angles de caméra pendant l’action, ralentis sur les temps forts et sound design au montage, du club amateur à l’événement sur plusieurs jours. Déplacement sur les terrains et salles de toute la région bruxelloise, jusqu’à Wemmel et sa périphérie.',
    clip:
      'Clip musical à Bruxelles : direction artistique, tournage sur une journée complète et montage rythmique calé sur le morceau fourni par l’artiste — la seule prestation du studio où la musique n’est pas sous licence, puisqu’elle est justement le point de départ du clip.',
    lifestyle:
      'Contenu lifestyle à Bruxelles : vlogs, séries sociales et contenu de marque tournés pour un rendu naturel plutôt que scénarisé, avec un montage rythmique pensé pour les réseaux sociaux. Disponible dans toute la zone d’intervention du studio, de Bruxelles à Wemmel et sa périphérie flamande.',
  },
  nl: {
    huwelijk:
      'Huwelijksvideograaf in Brussel: er wordt alleen of met een klein team gefilmd om dicht bij de gasten te blijven zonder de ceremonie te verstoren. Verkenning van de locatie inbegrepen, opname van de volledige dag tot het feest, in de 19 gemeenten van het Brussels Hoofdstedelijk Gewest, in Wemmel en de Vlaamse rand.',
    zakelijk:
      'Bedrijfsvideo in Brussel: script, opname en interviews met medewerkers of klanten, met grafische opmaak in postproductie voor logo en huisstijl. De opname gebeurt in uw kantoren of op de locatie van uw keuze, in Brussel en de hele Vlaamse rand.',
    sport:
      'Sportopname in Brussel: meerdere camerahoeken tijdens de actie, slow motion op de hoogtepunten en sound design bij de montage, van de amateurclub tot een meerdaags evenement. Verplaatsing naar terreinen en zalen in het hele Brusselse gewest, tot in Wemmel en de Vlaamse rand.',
    clip:
      'Muziekclip in Brussel: artistieke leiding, opname op één volledige dag en ritmische montage afgestemd op het nummer dat de artiest zelf aanlevert — de enige prestatie van de studio waar de muziek niet in licentie wordt geleverd, want ze is net het vertrekpunt van de clip.',
    lifestyle:
      'Lifestyle-content in Brussel: vlogs, sociale reeksen en merkcontent gefilmd voor een natuurlijk resultaat in plaats van iets gescripts, met een ritmische montage gericht op sociale media. Beschikbaar in het volledige werkgebied van de studio, van Brussel tot Wemmel en de Vlaamse rand.',
  },
};
