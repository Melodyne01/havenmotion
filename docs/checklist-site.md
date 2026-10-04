# Checklist — construire un site qui convertit et qui ranke

Checklist réutilisable pour les prochains sites, quel que soit le type (vitrine, e-commerce, SaaS, blog) et quelle que soit la stack. Elle est pensée pour briefer une IA : chaque phase dit ce qu'il faut demander, produire et vérifier, et ce qui doit être vrai pour passer à la suivante. Elle vient du projet Heaven Motion (septembre–octobre 2026) et des décisions prises pendant ce projet.

Rien n'est une règle fixe : tout ce qui a été décidé ici (prix affichés, langues, zones) est posé comme une **question à trancher avec le client**, au début, avant d'écrire une ligne.

---

## Phase 0 — Cadrage et matière première

**Objectif** : savoir pour qui, pour quoi, et avec quels faits.

### À demander au client (version courte, 10 questions)

1. **Objectif n°1 du site** : une demande de devis, une vente, une inscription, un appel ? Un seul objectif principal.
2. **Identité légale** : raison sociale, forme juridique, adresse, numéro de TVA, hébergeur du site (obligation légale en Belgique et en France).
3. **Offre** : la liste des prestations ou produits, et pour chacun ce que le client reçoit, en combien de temps, à quel prix. Si pas de prix : pourquoi, et peut-on afficher un « à partir de » ?
4. **Prix** : TTC ou HTVA ? Pour qui (particuliers, pros, les deux) ? Y a-t-il des options, des frais annexes (déplacement, livraison) ?
5. **Zone** : où le client travaille ou livre, concrètement (villes, régions, pays). Où a-t-il **déjà** travaillé ?
6. **Langues** : lesquelles, et pour quel marché chacune ? (une langue n'a de sens que si des gens cherchent dans cette langue)
7. **Chiffres vérifiables** : années d'activité, nombre de projets ou de clients, pays, certifications. Rien d'approximatif ne sera publié.
8. **Preuves** : 5 à 10 avis clients réels (nom, ville, 2-3 phrases, accord écrit), des références nommées, des photos ou vidéos du travail réel.
9. **Méthode et différence** : comment il travaille, en quoi il diffère des concurrents (ce qu'il dirait à un client au téléphone).
10. **Contraintes** : ce qu'il refuse d'afficher, les concurrents à ne pas copier, les délais, le budget.

### À faire

- [ ] Relever ce qui existe déjà : site actuel, pages indexées, positions, fiche Google Business, avis en ligne. Noter les URL à ne pas perdre.
- [ ] Lister les décisions à trancher avant d'écrire (voir les questions ci-dessus) et les faire valider par écrit.
- [ ] Mettre la matière première dans un fichier versionné (`docs/matiere-premiere.md`) : c'est la source de vérité, pas la mémoire de la conversation.

**Critère de sortie** : l'objectif n°1 est écrit en une phrase, l'offre et les prix sont validés, les chiffres et les preuves sont réels ou explicitement absents. Tout fait manquant est listé comme manquant, pas comblé.

---

## Phase 1 — Marché, concurrence, mots-clés

**Objectif** : savoir contre qui on joue et sur quelles recherches.

- [ ] Définir les **marchés** : par pays, région ou ville, et par langue. Un marché = une combinaison lieu × langue × intention.
- [ ] Pour chaque marché, lister les **requêtes** : courtes (volume), moyennes (page cible) et longues (conversion). Vérifier le vocabulaire local (une même langue change d'un pays à l'autre).
- [ ] **Vérifier les volumes** dans un outil (Keyword Planner, Semrush, Ahrefs). Sans outil, le dire : les estimations restent des estimations.
- [ ] **Analyser la concurrence réelle** : pour les 10 à 15 requêtes qui comptent, qui est en tête, annuaires ou indépendants, ce que leurs pages contiennent (structure, prix, FAQ, preuves), ce qui leur manque. Ouvrir les pages, pas seulement lire les extraits.
- [ ] Repérer les **terrains libres** : requêtes où aucun concurrent solide ne répond, niches ignorées, objections sans réponse.
- [ ] Relever les **questions réelles** des clients (People Also Ask, forums, FAQ concurrentes) : elles deviendront les titres de sections et les FAQ.
- [ ] Relever les **fourchettes de prix du marché** avec leurs sources : elles serviront à positionner l'offre et, si le client le veut, à l'afficher en comparaison.
- [ ] Décider, avec le client, de l'**ordre d'attaque** : par quel marché on commence, lequel attend. Un site qui démarre ne gagne pas une requête saturée.

**Critère de sortie** : un tableau marché × requête × page cible × concurrent principal × opportunité. Chaque page prévue a **un** mot-clé principal, et deux pages ne visent jamais la même requête.

---

## Phase 2 — Architecture et contenu

**Objectif** : décider quelles pages existent, dans quelles langues, et ce que chacune contient.

### Architecture

- [ ] Dessiner l'**arborescence** à partir des pages cibles de la phase 1, pas l'inverse. Une page par intention.
- [ ] **Langues** : une page n'existe dans une langue que si elle y est cherchée. Pas de traduction à la chaîne.
- [ ] **Adresses** : segments traduits par langue, stables, lisibles. Prévoir la table des anciennes adresses → nouvelles (301) si le site existe déjà.
- [ ] **Pages locales** (si pertinent) : par région plutôt que par ville, sauf si la ville a du volume et de la matière. Une page locale sans lieux réels, sans fait par ville et sans projet n'est pas publiée.
- [ ] **Hubs et maillage** : chaque page importante est atteignable en deux clics ; pied de page, menu et liens internes mènent vers la page la plus rentable.

### Contenu, page par page

- [ ] Écrire pour **l'intention de recherche**, pas pour remplir : chaque section répond à une question que le visiteur se pose.
- [ ] **Répondre dans les 100 premiers mots** : qui, quoi, où, combien, en combien de temps. C'est ce que les moteurs et les IA citent.
- [ ] **Des faits, pas des adjectifs** : chiffres, délais, inclus, conditions. Chaque fait vient de la matière première ou est marqué comme à valider.
- [ ] **Ne jamais inventer** : pas de lieu « où nous avons travaillé », pas de chiffre, pas de matériel, pas de témoignage sans source. Un placeholder visible (« à compléter ») ne part jamais en production.
- [ ] **Prix** : si le client affiche ses prix, les mettre partout où ils sont cherchés (page tarifs, page offre, FAQ), avec le régime de TVA à côté, et calculés depuis une source unique (pas de prix recopié à la main dans trois endroits).
- [ ] **Objections** : identifier l'objection n°1 (trouvée en phase 1) et y répondre de front, sur une page dédiée si elle est importante.
- [ ] **FAQ** par page, avec les questions réelles relevées en phase 1, en réponses directes de 1 à 3 phrases.
- [ ] **Preuves** : avis réels, chiffres vérifiables, projets nommés. Si elles manquent, la page le montre en creux : ne pas simuler.
- [ ] **Longueur** : assez pour répondre, pas plus. Fixer un plancher (par exemple 600 mots propres pour une page commerciale) et un contrôle avant publication.
- [ ] **Vocabulaire** : celui du marché visé, pas celui du client. Vérifier les termes dans chaque langue et chaque pays.
- [ ] Prévoir le **contenu continu** (projets, études de cas, guides) : qui l'écrit, à quel rythme, avec quel modèle de page.

**Critère de sortie** : chaque page a son mot-clé, son intention, son plan de sections, sa FAQ et sa liste de faits sourcés. Aucune page prévue n'est creuse. La table des redirections est écrite.

---

## Phase 3 — Technique et SEO/GEO

**Objectif** : que les robots et les IA lisent la même chose que les humains, vite.

### Rendu et adresses

- [ ] **Rendu côté serveur** (ou statique) pour tout le contenu public : titres, textes, balises, données structurées présents dans le HTML sans JavaScript.
- [ ] **Une seule adresse par contenu** : canonical, redirection www → apex (ou l'inverse), pas de doublon avec ou sans slash.
- [ ] **Vrais codes HTTP** : 404 pour ce qui n'existe pas (pas une home en 200), 301 pour ce qui a bougé, en conservant la query string.
- [ ] **Redirections** des anciennes adresses testées une par une.
- [ ] **Performance** : images dimensionnées, vidéos en lecture différée, bundle initial sous le budget fixé, pas de décalage de mise en page.

### Balises et données structurées

- [ ] `title` et `description` propres à chaque page, avec le mot-clé, et le chiffre de preuve quand il existe (avis, projets).
- [ ] `hreflang` entre les versions d'une même page, **uniquement** pour les langues où elle existe, avec `x-default`.
- [ ] `og:*` et `twitter:*` avec une image au bon ratio.
- [ ] JSON-LD : l'organisation (`LocalBusiness` ou `Organization` avec nom légal, adresse, TVA, zones desservies, langues), les offres (`Offer` avec prix et TVA), les FAQ (`FAQPage`), le fil d'Ariane (`BreadcrumbList`), les avis (`Review`) quand ils sont réels. Valider dans le Rich Results Test.
- [ ] `sitemap.xml` généré, avec les alternates par langue, et `robots.txt` qui bloque l'environnement de test.
- [ ] `llms.txt` (et une page « faits » en texte brut) qui liste ce que le site affirme : offre, prix, zones, langues, chiffres. Les moteurs d'IA citent ce qui est clair.

### Données et backoffice

- [ ] Décider ce qui est **en base** (ce qui change souvent : médias, projets, avis, demandes) et ce qui est **dans le code** (ce qui change rarement : prix, textes marketing). Le dire au client : un contenu dans le code demande un déploiement pour changer.
- [ ] **Une source par donnée** : un prix, un nom légal, une adresse n'existent qu'à un endroit et sont dérivés partout ailleurs.
- [ ] **Formulaire** : les champs qui qualifient la demande (offre choisie, lieu, date, langue), un anti-spam sans captcha tiers si possible, un accusé de réception, une notification. Ce qui est saisi arrive lisible dans le backoffice et dans l'export.
- [ ] **Mentions légales et confidentialité** : complètes, dans chaque langue, avec l'hébergeur. Pas de « à compléter ».

### Vérifications avant chaque mise en ligne

- [ ] Lint, tests unitaires, build de production, parcours end-to-end du formulaire principal.
- [ ] Rendu serveur contrôlé page par page : code HTTP, `title`, `hreflang`, JSON-LD, redirections.
- [ ] Un passage en mode « robot » : lire chaque page clé sans JavaScript et sans CSS. Ce qu'on ne voit pas n'existe pas.
- [ ] Un test sur mobile réel.

**Critère de sortie** : tout est vert, chaque page clé a été lue rendue par le serveur, aucune adresse ancienne ne répond autre chose que 301, aucun texte d'attente n'est visible.

---

## Phase 4 — Mise en ligne et hors site

**Objectif** : que les moteurs trouvent le site et lui fassent confiance.

- [ ] Déployer sur un environnement de test d'abord, bloqué à l'indexation, et faire valider par le client page par page.
- [ ] Soumettre le sitemap dans Google Search Console (une propriété par langue ou une seule, mais la décision est prise) et Bing Webmaster Tools.
- [ ] **Fiche Google Business Profile** : catégories justes, zone desservie si pas d'adresse ouverte au public, photos, premiers avis dans le mois, un post régulier.
- [ ] **Annuaires** du secteur, par pays et par langue, avec une fiche complète et cohérente (nom, adresse, téléphone identiques partout).
- [ ] **Liens** : partenaires, lieux, fournisseurs, clients, presse locale. Chaque projet publié est envoyé à ceux qui y figurent.
- [ ] **Réseaux sociaux** : chaque contenu publié renvoie vers sa page ; les profils pointent vers le site.
- [ ] Définir le **calendrier de contenu** (phase 2) et la personne qui le tient.

**Critère de sortie** : sitemap accepté, fiche Google créée et vérifiée, les 5 premières fiches annuaires posées, le calendrier de contenu daté.

---

## Phase 5 — Mesure et suivi

**Objectif** : savoir ce qui marche et corriger.

- [ ] Suivre les **requêtes prioritaires** (10 par marché) chaque mois : position, impressions, clics.
- [ ] Suivre les **demandes** par page d'origine et par lieu : c'est la seule mesure qui compte pour l'objectif n°1.
- [ ] Repérer le **contenu creux** : pages sans clic après trois mois, sous le plancher de mots, sans lieu ou fait propre. Retravailler ou retirer du sitemap.
- [ ] Mettre à jour les **pages datées** (« prix 2026 ») chaque année, et les prix dès qu'ils changent.
- [ ] Revue trimestrielle avec le client : quels marchés ouvrir, quels guides écrire, quelles pages fusionner.

**Critère de sortie** : un tableau de bord lu chaque mois, une revue par trimestre, et une liste d'actions qui en sort.

---

## Ce qui a coûté du temps sur Heaven Motion (à éviter)

- Des **prix recopiés à plusieurs endroits**, devenus incohérents : une seule source dès le départ.
- Des **textes d'attente** (« témoignage à compléter », « micro-entreprise, mentions à compléter ») restés en production : un contrôle avant publication.
- Des **pages ville en masse** sans matière propre : par région, avec des faits, ou pas du tout.
- Des **ternaires de langue** dispersés dans le code : un dictionnaire par langue dès la première langue, pour que la troisième n'oblige pas à tout relire.
- Une **analyse concurrentielle sans ouvrir les pages** (proxy bloqué) : le dire, et refaire à la main avant d'écrire.
- Des **faits posés par l'IA** (délais, acompte, méthode) faute de matière : les marquer « à valider » et les faire valider avant la mise en ligne, pas après.
