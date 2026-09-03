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
import { Category } from '../../models';

/**
 * Page locale par commune bruxelloise (`/zones/{slug}`). Contenu volontairement
 * différencié par page (repère géographique, code postal, maillage vers les
 * catégories) plutôt qu'un simple mail-merge du nom de ville : 19 pages
 * quasi identiques seraient un pattern de "doorway pages" pénalisé plutôt que
 * valorisé par les moteurs de recherche.
 */
@Component({
  selector: 'app-commune-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SiteHeaderComponent, SiteFooterComponent, VideoFrameComponent, CtaButtonComponent, RouterLink],
  template: `
    <a class="skip-link" href="#contenu">Aller au contenu</a>
    <app-site-header />

    <main id="contenu">
      @if (commune(); as c) {
        <article class="commune-page">
          <nav class="commune-page__breadcrumb" aria-label="Fil d'Ariane">
            <a [routerLink]="homePath()">Accueil</a>
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

            <ul class="commune-page__categories">
              @for (cat of store.categories(); track cat.id) {
                <li><a [routerLink]="categoryHref(cat)">{{ cat.name }}</a></li>
              }
            </ul>

            <div class="commune-page__faq">
              <p class="commune-page__faq-q">{{ faqQuestion() }}</p>
              <p class="commune-page__faq-a">{{ faqAnswer() }}</p>
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
        description:
          this.locale === 'nl'
            ? `${settings.brandName} filmt in ${name} en de rest van het Brussels Hoofdstedelijk Gewest: huwelijk, bedrijfsvideo, sport, clip. Offerte binnen 48 u.`
            : `${settings.brandName} tourne à ${name} et dans le reste de la Région de Bruxelles-Capitale : mariage, vidéo d'entreprise, sport, clip. Devis sous 48 h.`,
        path,
        locale: this.locale,
      });
      this.seo.applyBreadcrumbs([
        { name: 'Accueil', path: this.homePath() },
        { name: this.zonesLabel(), path: this.zonesPath() },
        { name, path },
      ]);
      this.seo.applyAreaServed(settings, name, c.postalCode);
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
    return this.locale === 'nl'
      ? `${brand} draait en monteert video's in ${name}, zoals in de rest van het Brussels Hoofdstedelijk Gewest: huwelijksfilms, bedrijfsvideo's, sportverslagen, clips en lifestyle-content. Niet ver van ${landmark}, net als in elke andere Brusselse gemeente.`
      : `${brand} tourne et monte des films à ${name}, comme dans le reste de la Région de Bruxelles-Capitale : films de mariage, vidéos d'entreprise, captations sportives, clips et contenu lifestyle. Non loin de ${landmark}, comme dans chacune des communes bruxelloises.`;
  }

  protected categoryHref(cat: Category): string {
    const base = this.locale === 'nl' ? '/nl/realisaties' : '/realisations';
    return `${base}/${cat.slug}`;
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
}
