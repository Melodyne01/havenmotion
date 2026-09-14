import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VideoFrameComponent } from '../../shared/ui/video-frame.component';
import { BrandMarkComponent } from '../../shared/ui/brand-mark.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { SiteStore } from '../site-store';
import { SITE_LOCALE } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';

/**
 * Hero : showreel plein cadre en 2.39:1, muet et en boucle.
 * Le cadre réserve son ratio avant le chargement, donc aucun décalage.
 */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VideoFrameComponent, BrandMarkComponent, CtaButtonComponent],
  template: `
    <section class="hero" id="hero">
      <app-video-frame
        [asset]="settings().showreel"
        playback="auto"
        [minHeight]="heroMinHeight"
        [travelling]="true"
        [priority]="true"
        [label]="'Showreel ' + settings().brandName"
      >
        <div class="hero__veil" aria-hidden="true"></div>
        <div class="hero__watermark">
          <app-brand-mark [watermark]="true" />
        </div>
        <div class="hero__content">
          <p class="hero__eyebrow">{{ text.hero.role }}</p>
          <h1 class="hero__title">
            {{ settings().brandName }}
            <span class="hero__title-sub">{{ titleSubtitle() }}</span>
          </h1>
          <p class="hero__tagline">{{ text.hero.tagline }}</p>
          <app-cta-button href="#contact">{{ text.hero.cta }}</app-cta-button>
        </div>
      </app-video-frame>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly store = inject(SiteStore);
  private readonly locale = inject(SITE_LOCALE);
  protected readonly settings = this.store.settings;
  protected readonly text = UI_TEXT[this.locale];

  /**
   * Plancher de hauteur du cadre : le bloc titre mesure jusqu'à 266 px sur un
   * téléphone étroit, il lui faut cette place sous le cadre. Au-delà de 813 px
   * de large le 2.39:1 redonne davantage et le plancher ne s'applique plus.
   * Revérifié après l'ajout du sous-titre SEO dans le H1 (une ligne de plus).
   */
  protected readonly heroMinHeight = 340;

  /**
   * Sous-titre dans le H1 : le nom de marque seul n'aide pas le
   * référencement. Reprend le positionnement réel du studio — basé à
   * {ville}, disponible dans le monde entier — plutôt qu'un ancrage
   * uniquement local, devenu inexact depuis que le studio se déplace à
   * l'international.
   */
  protected titleSubtitle(): string {
    const city = this.settings().city;
    return this.locale === 'nl'
      ? `Fotograaf & videograaf, gevestigd in ${city}, wereldwijd beschikbaar`
      : `Photographe & vidéaste, basé à ${city}, disponible dans le monde entier`;
  }
}
