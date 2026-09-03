import { ChangeDetectionStrategy, Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../sections/site-header.component';
import { SiteFooterComponent } from '../sections/site-footer.component';
import { VideoFrameComponent } from '../../shared/ui/video-frame.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { SiteStore } from '../site-store';
import { SeoService } from '../../core/seo.service';
import { SITE_LOCALE } from '../../core/locale';
import { findCommune } from '../../core/communes';
import { UI_TEXT } from '../../core/ui-text';
import { SITE_CONTENT } from '../../core/site-content';
import { Category, ServiceCard } from '../../models';

/**
 * Page locale par commune (`/zones/{slug}`) : les 19 communes de la Région
 * de Bruxelles-Capitale, plus Wemmel et sa périphérie flamande. Contenu
 * volontairement différencié par page (repère géographique, code postal,
 * maillage vers les catégories) plutôt qu'un simple mail-merge du nom de
 * ville : des pages quasi identiques seraient un pattern de "doorway pages"
 * pénalisé plutôt que valorisé par les moteurs de recherche. Le texte
 * distingue aussi les deux groupes : Wemmel n'est pas une commune de la
 * Région de Bruxelles-Capitale, une phrase qui le laisserait entendre serait
 * une erreur factuelle.
 */
@Component({
  selector: 'app-commune-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, VideoFrameComponent, CtaButtonComponent, RouterLink],
  template: `
    <a class="skip-link" href="#contenu">{{ text.skipLink }}</a>
    <app-site-header />

    <main id="contenu">
      @if (commune(); as c) {
        <article class="commune-page">
          <nav class="commune-page__breadcrumb" [attr.aria-label]="text.breadcrumbAriaLabel">
            <a [routerLink]="homePath()">{{ text.home }}</a>
            <span aria-hidden="true">/</span>
            <a [routerLink]="zonesPath()">{{ zonesLabel() }}</a>
            <span aria-hidden="true">/</span>
            <span>{{ communeName() }}</span>
          </nav>

          <app-video-frame
            [asset]="store.settings().showreel"
            playback="hover"
            [muted]="true"
            [loop]="true"
            [controls]="false"
            [label]="communeName()"
            class="commune-page__frame"
          />

          <div class="commune-page__body">
            <p class="commune-page__eyebrow">{{ c.postalCode }} — {{ zonesLabel() }}</p>
            <h1 class="commune-page__title">{{ heroTitle() }}</h1>
            <p class="commune-page__intro">{{ introText() }}</p>

            <h2 class="commune-page__section-title">{{ servicesSectionTitle() }}</h2>
            <ul class="commune-page__services">
              @for (cat of store.categories(); track cat.id) {
                <li class="commune-page__service">
                  <a class="commune-page__service-name" [routerLink]="categoryHref(cat)">{{ serviceHeading(cat) }}</a>
                  @if (serviceFor(cat); as service) {
                    <p class="commune-page__service-detail">{{ service.deliverables }}, {{ service.startingPrice }}.</p>
                    <dl class="commune-page__service-facts">
                      <dt>{{ text.services.duration }}</dt>
                      <dd>{{ service.duration }}</dd>
                      <dt>{{ text.services.included }}</dt>
                      <dd>{{ service.included.join(', ') }}</dd>
                    </dl>
                  }
                </li>
              }
            </ul>

            <div class="commune-page__faq">
              <p class="commune-page__faq-q">{{ faqQuestion() }}</p>
              <p class="commune-page__faq-a">{{ faqAnswer() }}</p>
              <p class="commune-page__faq-q">{{ faqQuestion2() }}</p>
              <p class="commune-page__faq-a">{{ faqAnswer2() }}</p>
              <p class="commune-page__faq-q">{{ faqQuestion3() }}</p>
              <p class="commune-page__faq-a">{{ faqAnswer3() }}</p>
            </div>

            <app-cta-button [href]="contactHref()">{{ ctaLabel() }}</app-cta-button>
          </div>
        </article>
      }
    </main>

    <app-site-footer />
  `,
  styleUrl: './commune-page.component.scss',
})
export class CommunePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly store = inject(SiteStore);
  private readonly seo = inject(SeoService);
  private readonly locale = inject(SITE_LOCALE);

  private readonly paramMap = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });

  protected readonly commune = computed(() =>
    findCommune(this.paramMap().get('commune') ?? '', this.locale),
  );

  protected readonly homePath = computed(() => (this.locale === 'nl' ? '/nl' : '/'));
  protected readonly zonesPath = computed(() => (this.locale === 'nl' ? '/nl/zones' : '/zones'));
  protected readonly zonesLabel = computed(() =>
    this.locale === 'nl' ? 'Werkgebied' : "Zone d'intervention",
  );
  protected readonly contactHref = computed(() => (this.locale === 'nl' ? '/nl/contact' : '/contact'));
  protected readonly ctaLabel = computed(() =>
    this.locale === 'nl' ? 'Offerte aanvragen' : 'Demander un devis',
  );

  protected readonly communeName = computed(
    () => (this.locale === 'nl' ? this.commune()?.nameNl : this.commune()?.nameFr) ?? '',
  );
  protected readonly text = UI_TEXT[this.locale];
  private readonly services = SITE_CONTENT[this.locale].services;

  constructor() {
    this.store.load(this.locale);

    effect(() => {
      // Le dictionnaire des communes est statique (pas de chargement réseau) :
      // un slug qui ne correspond à rien renvoie tout de suite à la home,
      // plutôt que de laisser une page vide indexable.
      if (!this.commune()) {
        this.router.navigateByUrl(this.homePath());
      }
    });

    effect(() => {
      const c = this.commune();
      if (!c) {
        return;
      }
      const settings = this.store.settings();
      const slug = this.locale === 'nl' ? c.slugNl : c.slugFr;
      const path = `${this.zonesPath()}/${slug}`;
      const name = this.communeName();
      this.seo.apply({
        title:
          this.locale === 'nl'
            ? `Videograaf in ${name} (${c.postalCode}) — ${settings.brandName}`
            : `Vidéaste à ${name} (${c.postalCode}) — ${settings.brandName}`,
        description: this.metaDescription(c.isBrusselsRegion, name, settings.brandName),
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: this.text.home, path: this.homePath() },
        { name: this.zonesLabel(), path: this.zonesPath() },
        { name, path },
      ]);
      this.seo.applyAreaServed(settings, name, c.postalCode);
      this.seo.applyFaq([
        { question: this.faqQuestion(), answer: this.faqAnswer() },
        { question: this.faqQuestion2(), answer: this.faqAnswer2() },
        { question: this.faqQuestion3(), answer: this.faqAnswer3() },
      ]);
      this.seo.applyHreflang({
        fr: `/zones/${c.slugFr}`,
        nl: `/nl/zones/${c.slugNl}`,
      });
    });
  }

  protected heroTitle(): string {
    const name = this.communeName();
    return this.locale === 'nl' ? `Videograaf in ${name}` : `Vidéaste à ${name}`;
  }

  protected introText(): string {
    const c = this.commune();
    if (!c) {
      return '';
    }
    const name = this.communeName();
    const landmark = this.locale === 'nl' ? c.landmarkNl : c.landmarkFr;
    const brand = this.store.settings().brandName;

    if (c.isBrusselsRegion) {
      return this.locale === 'nl'
        ? `${brand} draait en monteert video's in ${name}, zoals in de rest van het Brussels Hoofdstedelijk Gewest: huwelijksfilms, bedrijfsvideo's, sportverslagen, clips en lifestyle-content. Niet ver van ${landmark}, net als in elke andere Brusselse gemeente.`
        : `${brand} tourne et monte des films à ${name}, comme dans le reste de la Région de Bruxelles-Capitale : films de mariage, vidéos d'entreprise, captations sportives, clips et contenu lifestyle. Non loin de ${landmark}, comme dans chacune des communes bruxelloises.`;
    }

    // Communes de la périphérie flamande (Wemmel et alentours) : pas partie
    // de la Région de Bruxelles-Capitale, la phrase ne peut pas le laisser
    // entendre. Le repère géographique est optionnel (toutes n'en ont pas
    // un que l'on connaisse avec certitude).
    const suffixFr = landmark ? ` Non loin de ${landmark}.` : '';
    const suffixNl = landmark ? ` Niet ver van ${landmark}.` : '';
    return this.locale === 'nl'
      ? `${brand} draait en monteert ook video's in ${name}, in de Brusselse rand: huwelijksfilms, bedrijfsvideo's, sportverslagen, clips en lifestyle-content, net als in Brussel zelf en de omliggende gemeenten.${suffixNl}`
      : `${brand} tourne et monte aussi des films à ${name}, dans la périphérie bruxelloise : films de mariage, vidéos d'entreprise, captations sportives, clips et contenu lifestyle, comme à Bruxelles même et dans les communes environnantes.${suffixFr}`;
  }

  private metaDescription(isBrusselsRegion: boolean, name: string, brandName: string): string {
    if (isBrusselsRegion) {
      return this.locale === 'nl'
        ? `${brandName} filmt in ${name} en de rest van het Brussels Hoofdstedelijk Gewest: huwelijk, bedrijfsvideo, sport, clip. Offerte binnen 48 u.`
        : `${brandName} tourne à ${name} et dans le reste de la Région de Bruxelles-Capitale : mariage, vidéo d'entreprise, sport, clip. Devis sous 48 h.`;
    }
    return this.locale === 'nl'
      ? `${brandName} filmt in ${name}, in de Brusselse rand: huwelijk, bedrijfsvideo, sport, clip. Offerte binnen 48 u.`
      : `${brandName} tourne à ${name}, dans la périphérie bruxelloise : mariage, vidéo d'entreprise, sport, clip. Devis sous 48 h.`;
  }

  protected categoryHref(cat: Category): string {
    const base = this.locale === 'nl' ? '/nl/realisaties' : '/realisations';
    return `${base}/${cat.slug}`;
  }

  protected servicesSectionTitle(): string {
    const name = this.communeName();
    return this.locale === 'nl' ? `Diensten in ${name}` : `Prestations à ${name}`;
  }

  /**
   * "Vidéaste Mariage à Uccle" / "Videograaf Huwelijk in Wemmel" : le titre de
   * chaque prestation reprend le nom de la commune — c'est exactement la
   * phrase qu'un client tape dans un moteur de recherche, pas un mot-clé
   * ajouté au hasard dans une liste.
   */
  protected serviceHeading(cat: Category): string {
    const name = this.communeName();
    return this.locale === 'nl' ? `Videograaf ${cat.name} in ${name}` : `Vidéaste ${cat.name} à ${name}`;
  }

  /**
   * Sport, Clip et Lifestyle sont 5 catégories mais seulement 4 fiches
   * tarifaires ("Sport & event" couvre Sport, "Clip & lifestyle" couvre Clip
   * et Lifestyle) — même rapprochement souple que SeoService.applyService,
   * pour rester cohérent avec ce qu'affiche la page catégorie elle-même.
   */
  protected serviceFor(cat: Category): ServiceCard | undefined {
    const needle = cat.name.toLowerCase();
    return this.services.find(
      (s) => s.name.toLowerCase().includes(needle) || needle.includes(s.name.toLowerCase()),
    );
  }

  protected faqQuestion(): string {
    const name = this.communeName();
    return this.locale === 'nl' ? `Komt u filmen in ${name}?` : `Est-ce que vous vous déplacez à ${name} ?`;
  }

  protected faqAnswer(): string {
    const name = this.communeName();
    return this.locale === 'nl'
      ? `Ja, ${name} maakt deel uit van ons werkgebied (Brussel en omliggende gemeenten). De verplaatsing zit inbegrepen in de offerte, zonder toeslag.`
      : `Oui, ${name} fait partie de notre zone d'intervention (Bruxelles et communes environnantes). Le déplacement est inclus dans le devis, sans supplément.`;
  }

  protected faqQuestion2(): string {
    const name = this.communeName();
    return this.locale === 'nl'
      ? `Welke soorten video's kan ik in ${name} laten maken?`
      : `Quels types de vidéos peut-on tourner à ${name} ?`;
  }

  protected faqAnswer2(): string {
    const name = this.communeName();
    return this.locale === 'nl'
      ? `Alle vijf categorieën van de studio zijn beschikbaar in ${name}: huwelijk, bedrijfsvideo, sport, muziekclip en lifestyle-content, met dezelfde kwaliteit als in de rest van het werkgebied.`
      : `Les cinq catégories du studio sont disponibles à ${name} : mariage, vidéo d'entreprise, sport, clip musical et contenu lifestyle, avec le même niveau de qualité que sur le reste de la zone d'intervention.`;
  }

  /**
   * Répond à une intention de recherche fréquente côté mariage ("est-ce que
   * le vidéaste est discret pendant la cérémonie ?") en reprenant tel quel
   * un fait déjà validé du site (page "à propos"), pas une affirmation
   * inventée pour l'occasion.
   */
  protected faqQuestion3(): string {
    const name = this.communeName();
    return this.locale === 'nl' ? `Is de opname discreet in ${name}?` : `Le tournage est-il discret à ${name} ?`;
  }

  protected faqAnswer3(): string {
    const name = this.communeName();
    return this.locale === 'nl'
      ? `Ja: ik film alleen of met een klein team, om dicht bij de gasten en de echte momenten te blijven, in ${name} net als elders.`
      : `Oui : le tournage se fait seul ou en équipe réduite, pour rester au plus près des invités et des moments réels, à ${name} comme ailleurs.`;
  }
}
