import { SiteLocale } from './locale';
import { FaqEntry } from './faq-content';

/**
 * FAQ propre à chaque page catégorie (mariage, corporate, sport, clip,
 * lifestyle), indexée par le slug réel de la catégorie dans la langue
 * courante (celui que `category.slug` porte déjà — voir CATEGORY_SLUG_MAP).
 * Chaque réponse reprend un fait déjà réel et déjà affiché ailleurs sur le
 * site (durée, inclus, livrable, prix de départ dans SITE_CONTENT ;
 * discrétion du tournage et allers-retours dans about/process) — reformulé
 * pour la catégorie plutôt qu'inventé pour l'occasion. Les questions
 * mélangent volontairement un mot-clé local ("à Bruxelles") et un mot-clé
 * général propre au métier (prix, délai, inclus, droits) : c'est le même
 * principe d'intention de recherche que sur les pages commune.
 */
export const CATEGORY_FAQ_CONTENT: Record<SiteLocale, Record<string, readonly FaqEntry[]>> = {
  fr: {
    mariage: [
      {
        question: 'Combien coûte un film de mariage à Bruxelles ?',
        answer:
          "À partir de 1 400 €, le prix final dépendant de la durée du tournage et des livrables souhaités. Un devis chiffré est envoyé sous 48 h après un premier échange.",
      },
      {
        question: 'Combien de temps dure le tournage d’un mariage ?',
        answer:
          'Une journée complète, de la préparation à la soirée, pour capter la cérémonie et les temps forts sans rien précipiter.',
      },
      {
        question: 'Qu’est-ce qui est inclus dans la prestation mariage ?',
        answer:
          'Le repérage du lieu, la captation de la cérémonie et de la soirée, l’étalonnage de l’image et une musique sous licence pour le montage final.',
      },
      {
        question: 'Quel est le format du film livré ?',
        answer:
          'Un film de 5 à 8 minutes qui raconte la journée, accompagné d’un teaser d’environ 60 secondes pensé pour les réseaux sociaux.',
      },
      {
        question: 'Le vidéaste est-il discret pendant la cérémonie ?',
        answer:
          'Oui : le tournage se fait seul ou en équipe réduite, pour rester proche des invités sans jamais s’imposer dans les moments importants.',
      },
      {
        question: 'Peut-on demander des retouches sur le film de mariage ?',
        answer: 'Oui, deux allers-retours sont prévus après le premier montage avant la livraison en ligne définitive.',
      },
      {
        question: 'Le film de mariage peut-il être partagé sur les réseaux sans problème de droits ?',
        answer:
          'Oui : la musique utilisée est systématiquement sous licence, ce qui évite tout retrait ou mise en sourdine sur Instagram ou YouTube.',
      },
      {
        question: 'Le vidéaste se déplace-t-il dans toute la région bruxelloise pour un mariage ?',
        answer:
          'Oui, dans les 19 communes de la Région de Bruxelles-Capitale ainsi qu’à Wemmel et dans sa périphérie flamande, sans frais de déplacement supplémentaires.',
      },
    ],
    corporate: [
      {
        question: 'Combien coûte une vidéo d’entreprise à Bruxelles ?',
        answer:
          'À partir de 1 800 €, selon la durée de tournage et les formats de livraison souhaités. Devis chiffré sous 48 h après un premier échange.',
      },
      {
        question: 'Combien de temps prend le tournage d’une vidéo corporate ?',
        answer: 'Entre 1 et 2 jours, selon le nombre de scènes, d’interviews et de lieux à couvrir.',
      },
      {
        question: 'Qu’est-ce qui est inclus dans une prestation vidéo d’entreprise ?',
        answer:
          'L’écriture du script, le tournage, les interviews de collaborateurs ou clients, et l’habillage graphique (logo, sous-titres) en post-production.',
      },
      {
        question: 'Quel est le format de la vidéo livrée ?',
        answer:
          'Un film de 2 à 3 minutes, décliné en plusieurs formats adaptés aux réseaux sociaux et à une utilisation professionnelle, LinkedIn notamment.',
      },
      {
        question: 'Peut-on filmer des interviews de nos collaborateurs ou clients ?',
        answer:
          'Oui, les interviews font partie de la prestation standard, avec un cadrage et un son pensés pour un rendu professionnel.',
      },
      {
        question: 'Le tournage peut-il se faire directement dans nos bureaux à Bruxelles ?',
        answer: 'Oui, le tournage se déroule dans vos locaux ou sur le lieu de votre choix, à Bruxelles et dans sa périphérie.',
      },
      {
        question: 'La vidéo peut-elle inclure notre logo et nos couleurs de marque ?',
        answer:
          'Oui, l’habillage graphique en post-production reprend l’identité visuelle de l’entreprise : logo, sous-titres, charte de couleurs.',
      },
    ],
    sport: [
      {
        question: 'Combien coûte la captation d’un événement sportif à Bruxelles ?',
        answer: 'À partir de 900 €, selon la durée de l’événement et le nombre de caméras nécessaires. Devis chiffré sous 48 h.',
      },
      {
        question: 'Combien de temps dure le tournage d’un événement sportif ?',
        answer: 'D’une demi-journée à deux jours, selon qu’il s’agisse d’une seule épreuve ou d’une compétition sur plusieurs jours.',
      },
      {
        question: 'Qu’est-ce qu’un aftermovie sportif ?',
        answer:
          'Un montage de 2 minutes qui restitue l’intensité de l’événement, livré avec 3 formats verticaux prêts pour Instagram et TikTok.',
      },
      {
        question: 'Le tournage se fait-il sous plusieurs angles de caméra ?',
        answer: 'Oui, la captation multi-focale permet de suivre l’action depuis plusieurs points de vue, avec des ralentis pour les temps forts.',
      },
      {
        question: 'Le montage sportif inclut-il un travail sur le son ?',
        answer: 'Oui, un sound design accompagne le montage pour renforcer l’intensité des moments clés : impacts, ambiance, public.',
      },
      {
        question: 'Peut-on filmer un tournoi ou une compétition de club amateur ?',
        answer: 'Oui, la prestation s’adapte aussi bien à un club amateur qu’à un événement plus important, à discuter selon le format de la compétition.',
      },
      {
        question: 'Le vidéaste se déplace-t-il sur les terrains et salles de toute la région bruxelloise ?',
        answer: 'Oui, dans les 19 communes de la Région de Bruxelles-Capitale ainsi qu’à Wemmel et sa périphérie.',
      },
    ],
    clip: [
      {
        question: 'Combien coûte un clip musical à Bruxelles ?',
        answer: 'À partir de 1 200 €, selon la durée du tournage et la complexité de la direction artistique. Devis chiffré sous 48 h.',
      },
      {
        question: 'Combien de temps dure le tournage d’un clip ?',
        answer: 'Une journée complète, du premier plan au dernier, pour garder une cohérence visuelle sur l’ensemble du clip.',
      },
      {
        question: 'La direction artistique est-elle incluse ?',
        answer: 'Oui, la direction artistique — ambiance, mise en scène, choix des plans — fait partie intégrante de la prestation clip.',
      },
      {
        question: 'Qu’est-ce qui est livré à la fin du tournage ?',
        answer: 'Le clip complet, accompagné de déclinaisons courtes pensées pour les réseaux sociaux (Instagram, TikTok).',
      },
      {
        question: 'Le montage suit-il le rythme de la musique ?',
        answer: 'Oui, le montage est rythmique : chaque coupe est pensée en fonction du tempo et de la structure du morceau.',
      },
      {
        question: 'Doit-on fournir sa propre musique pour le clip ?',
        answer:
          'Oui, le clip musical se construit autour du morceau de l’artiste — contrairement aux autres prestations, où la musique de fond est fournie sous licence.',
      },
      {
        question: 'Le tournage peut-il se faire en extérieur à Bruxelles ou en studio ?',
        answer: 'Les deux sont possibles : le lieu de tournage se décide ensemble lors du premier échange, selon l’univers recherché pour le clip.',
      },
    ],
    lifestyle: [
      {
        question: 'Combien coûte une prestation lifestyle (vlog, série) à Bruxelles ?',
        answer: 'À partir de 1 200 €, selon la durée de tournage et le nombre de formats livrés. Devis chiffré sous 48 h.',
      },
      {
        question: 'Combien de temps dure une journée de tournage lifestyle ?',
        answer: 'Une journée complète, pour capter suffisamment de matière et garder un rendu naturel plutôt que scénarisé.',
      },
      {
        question: 'Qu’est-ce qui est livré à la fin du tournage ?',
        answer: 'Un montage complet accompagné de déclinaisons courtes, prêtes à publier sur les réseaux sociaux.',
      },
      {
        question: 'Ce format convient-il pour du contenu de marque récurrent ?',
        answer:
          'Oui, c’est justement l’usage le plus fréquent : vlogs, séries sociales ou contenu de marque au quotidien pour alimenter une présence en ligne régulière.',
      },
      {
        question: 'Le montage garde-t-il un rythme dynamique adapté aux réseaux sociaux ?',
        answer: 'Oui, le montage reste rythmique, pensé pour retenir l’attention dès les premières secondes sur Instagram ou TikTok.',
      },
      {
        question: 'Peut-on prévoir plusieurs tournages lifestyle dans le mois ?',
        answer: 'C’est possible, à discuter ensemble lors du premier échange selon la fréquence de contenu recherchée.',
      },
      {
        question: 'Le tournage lifestyle se fait-il à Bruxelles et dans les communes environnantes ?',
        answer:
          'Oui, dans toute la zone d’intervention du studio : les 19 communes de la Région de Bruxelles-Capitale, Wemmel et sa périphérie flamande.',
      },
    ],
  },
  nl: {
    huwelijk: [
      {
        question: 'Hoeveel kost een huwelijksfilm in Brussel?',
        answer:
          'Vanaf € 1 400, de uiteindelijke prijs hangt af van de opnameduur en de gewenste eindproducten. Een concrete offerte volgt binnen 48 u na een eerste gesprek.',
      },
      {
        question: 'Hoe lang duurt de opname van een huwelijk?',
        answer: 'Een volledige dag, van de voorbereiding tot het feest, om de ceremonie en de hoogtepunten zonder haast vast te leggen.',
      },
      {
        question: 'Wat is inbegrepen in de huwelijksprestatie?',
        answer:
          'De verkenning van de locatie, de opname van ceremonie en feest, de kleurcorrectie van het beeld en muziek in licentie voor de montage.',
      },
      {
        question: 'Wat is het formaat van de geleverde film?',
        answer: 'Een film van 5 tot 8 minuten die de dag vertelt, samen met een teaser van ongeveer 60 seconden voor sociale media.',
      },
      {
        question: 'Is de videograaf discreet tijdens de ceremonie?',
        answer: 'Ja: er wordt alleen of met een klein team gefilmd, dicht bij de gasten zonder ooit de belangrijke momenten te verstoren.',
      },
      {
        question: 'Kan er nog aangepast worden aan de huwelijksfilm?',
        answer: 'Ja, na de eerste montage zijn er twee rondes feedback voorzien vóór de definitieve levering online.',
      },
      {
        question: 'Kan de huwelijksfilm zonder problemen gedeeld worden op sociale media?',
        answer: 'Ja: de gebruikte muziek is steeds in licentie, zodat Instagram of YouTube de video nooit dempen of verwijderen.',
      },
      {
        question: 'Komt de videograaf filmen in het hele Brusselse gewest voor een huwelijk?',
        answer:
          'Ja, in de 19 gemeenten van het Brussels Hoofdstedelijk Gewest, en ook in Wemmel en de Vlaamse rand, zonder extra verplaatsingskosten.',
      },
    ],
    zakelijk: [
      {
        question: 'Hoeveel kost een bedrijfsvideo in Brussel?',
        answer: 'Vanaf € 1 800, afhankelijk van de opnameduur en de gewenste leverformaten. Concrete offerte binnen 48 u na een eerste gesprek.',
      },
      {
        question: 'Hoe lang duurt de opname van een bedrijfsvideo?',
        answer: 'Tussen 1 en 2 dagen, afhankelijk van het aantal scènes, interviews en locaties.',
      },
      {
        question: 'Wat is inbegrepen in een bedrijfsvideo?',
        answer:
          'Het schrijven van het script, de opname, interviews met medewerkers of klanten, en grafische opmaak (logo, ondertitels) in postproductie.',
      },
      {
        question: 'Wat is het formaat van de geleverde video?',
        answer: 'Een film van 2 tot 3 minuten, aangevuld met formaten voor sociale media en professioneel gebruik, onder meer LinkedIn.',
      },
      {
        question: 'Kunnen er interviews met onze medewerkers of klanten gefilmd worden?',
        answer: 'Ja, interviews maken deel uit van de standaardprestatie, met beeld en geluid gericht op een professioneel resultaat.',
      },
      {
        question: 'Kan er in onze kantoren in Brussel gefilmd worden?',
        answer: 'Ja, de opname gebeurt in uw kantoren of op de locatie van uw keuze, in Brussel en omstreken.',
      },
      {
        question: 'Kan de video ons logo en onze huisstijl bevatten?',
        answer: 'Ja, de grafische opmaak in postproductie neemt de visuele identiteit van het bedrijf over: logo, ondertitels, kleuren.',
      },
    ],
    sport: [
      {
        question: 'Hoeveel kost de opname van een sportevenement in Brussel?',
        answer: 'Vanaf € 900, afhankelijk van de duur van het evenement en het aantal camera’s. Concrete offerte binnen 48 u.',
      },
      {
        question: 'Hoe lang duurt de opname van een sportevenement?',
        answer: 'Van een halve dag tot twee dagen, naargelang het om één wedstrijd of een meerdaagse competitie gaat.',
      },
      {
        question: 'Wat is een sport-aftermovie?',
        answer:
          'Een montage van 2 minuten die de intensiteit van het evenement weergeeft, geleverd met 3 verticale formaten klaar voor Instagram en TikTok.',
      },
      {
        question: 'Wordt er vanuit meerdere camerahoeken gefilmd?',
        answer: 'Ja, de opname vanuit meerdere hoeken volgt de actie vanuit verschillende standpunten, met slow motion voor de hoogtepunten.',
      },
      {
        question: 'Wordt er ook aan het geluid gewerkt bij de montage?',
        answer: 'Ja, sound design versterkt de intensiteit van de belangrijkste momenten: impact, sfeer, publiek.',
      },
      {
        question: 'Kan er gefilmd worden bij een amateurwedstrijd of -toernooi?',
        answer: 'Ja, de prestatie past zich aan een amateurclub of een groter evenement aan, te bespreken volgens het format van de competitie.',
      },
      {
        question: 'Komt de videograaf filmen op terreinen en in zalen in heel het Brusselse gewest?',
        answer: 'Ja, in de 19 gemeenten van het Brussels Hoofdstedelijk Gewest, en ook in Wemmel en de Vlaamse rand.',
      },
    ],
    clip: [
      {
        question: 'Hoeveel kost een muziekclip in Brussel?',
        answer: 'Vanaf € 1 200, afhankelijk van de opnameduur en de complexiteit van de artistieke leiding. Concrete offerte binnen 48 u.',
      },
      {
        question: 'Hoe lang duurt de opname van een clip?',
        answer: 'Eén volledige dag, van het eerste tot het laatste shot, om een visuele lijn doorheen de hele clip te bewaren.',
      },
      {
        question: 'Is artistieke leiding inbegrepen?',
        answer: 'Ja, de artistieke leiding — sfeer, enscenering, keuze van de shots — maakt integraal deel uit van de clipprestatie.',
      },
      {
        question: 'Wat wordt er geleverd na de opname?',
        answer: 'De volledige clip, samen met korte varianten voor sociale media (Instagram, TikTok).',
      },
      {
        question: 'Volgt de montage het ritme van de muziek?',
        answer: 'Ja, de montage is ritmisch: elke snit is afgestemd op het tempo en de opbouw van het nummer.',
      },
      {
        question: 'Moeten we onze eigen muziek aanleveren voor de clip?',
        answer:
          'Ja, de muziekclip wordt rond het nummer van de artiest gebouwd — in tegenstelling tot andere prestaties, waar achtergrondmuziek in licentie wordt geleverd.',
      },
      {
        question: 'Kan er buiten in Brussel of in een studio gefilmd worden?',
        answer: 'Beide zijn mogelijk: de opnamelocatie wordt samen bepaald tijdens het eerste gesprek, afhankelijk van de gewenste sfeer voor de clip.',
      },
    ],
    lifestyle: [
      {
        question: 'Hoeveel kost een lifestyle-opname (vlog, reeks) in Brussel?',
        answer: 'Vanaf € 1 200, afhankelijk van de opnameduur en het aantal geleverde formaten. Concrete offerte binnen 48 u.',
      },
      {
        question: 'Hoe lang duurt een dag lifestyle-opname?',
        answer: 'Eén volledige dag, om voldoende materiaal te verzamelen voor een natuurlijk resultaat in plaats van iets te gescripts.',
      },
      {
        question: 'Wat wordt er geleverd na de opname?',
        answer: 'Een volledige montage samen met korte varianten, klaar om te publiceren op sociale media.',
      },
      {
        question: 'Is dit formaat geschikt voor terugkerende merkcontent?',
        answer:
          'Ja, dat is net het meest voorkomende gebruik: vlogs, sociale reeksen of merkcontent voor een regelmatige online aanwezigheid.',
      },
      {
        question: 'Blijft de montage dynamisch, afgestemd op sociale media?',
        answer: 'Ja, de montage blijft ritmisch, gemaakt om vanaf de eerste seconden de aandacht vast te houden op Instagram of TikTok.',
      },
      {
        question: 'Kunnen er meerdere lifestyle-opnames per maand gepland worden?',
        answer: 'Dat is mogelijk, te bespreken tijdens het eerste gesprek naargelang de gewenste contentfrequentie.',
      },
      {
        question: 'Wordt er gefilmd in Brussel en de omliggende gemeenten?',
        answer: 'Ja, in het volledige werkgebied van de studio: de 19 gemeenten van het Brussels Hoofdstedelijk Gewest, Wemmel en de Vlaamse rand.',
      },
    ],
  },
};
