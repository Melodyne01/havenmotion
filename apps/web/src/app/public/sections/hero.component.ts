import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { VideoFrameComponent } from '../../shared/ui/video-frame.component';
import { BrandMarkComponent } from '../../shared/ui/brand-mark.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { SiteStore } from '../site-store';

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
        [travelling]="true"
        [priority]="true"
        [label]="'Showreel ' + settings().brandName"
      >
        <div class="hero__veil" aria-hidden="true"></div>
        <div class="hero__watermark">
          <app-brand-mark [watermark]="true" />
        </div>
        <div class="hero__content">
          <p class="hero__eyebrow">{{ settings().city }} · {{ settings().region }}</p>
          <h1 class="hero__title">{{ settings().brandName }}</h1>
          <p class="hero__tagline">{{ settings().tagline }}</p>
          <app-cta-button href="#contact">Demander un devis</app-cta-button>
        </div>
      </app-video-frame>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  private readonly store = inject(SiteStore);
  protected readonly settings = this.store.settings;
}
