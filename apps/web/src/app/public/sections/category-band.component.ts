import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { VideoFrameComponent } from '../../shared/ui/video-frame.component';
import { Category } from '../../models';

/**
 * Une bande = une catégorie, plein écran, en 2.39:1.
 *
 * Survol : le reel démarre en muet, un voile ambre 10 % s'installe, une barre
 * de progression ambre de 3 px suit la lecture et l'invite « voir la catégorie »
 * apparaît. Clic (ou Entrée/Espace) : navigation vers la page de la catégorie —
 * un vrai lien, pas un simple gestionnaire de clic, pour rester crawlable.
 */
@Component({
  selector: 'app-category-band',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VideoFrameComponent, RouterLink],
  host: {
    class: 'band-host',
  },
  template: `
    <a
      class="band"
      [routerLink]="['/realisations', category().slug]"
      [attr.aria-label]="ariaLabel()"
      (mouseenter)="setHover(true)"
      (mouseleave)="setHover(false)"
      (focus)="setHover(true)"
      (blur)="setHover(false)"
    >
      <app-video-frame
        #frame
        [asset]="category().reel"
        playback="hover"
        [travelling]="true"
        [travellingReverse]="reverseTravelling()"
        [label]="'Extrait ' + category().name"
      >
        <span class="band__veil" aria-hidden="true"></span>
        <span class="band__scrim" aria-hidden="true"></span>

        <span class="band__body">
          <span class="band__index">{{ indexLabel() }}</span>
          <span class="band__name">{{ category().name }}</span>
          <span class="band__meta">
            <span class="band__tagline">{{ category().tagline }}</span>
            <span class="band__count">{{ filmCountLabel() }}</span>
          </span>
          <span class="band__invite" aria-hidden="true">&#9654; Voir la catégorie &#8594;</span>
        </span>

        <span class="band__progress" aria-hidden="true">
          <span class="band__progress-bar" [style.width.%]="progress()"></span>
        </span>
      </app-video-frame>
    </a>
  `,
  styleUrl: './category-band.component.scss',
})
export class CategoryBandComponent {
  readonly category = input.required<Category>();
  readonly index = input.required<number>();

  private readonly frame = viewChild.required<VideoFrameComponent>('frame');

  protected readonly indexLabel = computed(() => String(this.index() + 1).padStart(2, '0'));
  protected readonly reverseTravelling = computed(() => this.index() % 2 === 1);
  protected readonly filmCountLabel = computed(() => {
    const count = this.category().filmCount;
    return count > 1 ? `${count} films` : `${count} film`;
  });
  protected readonly ariaLabel = computed(
    () => `${this.category().name} — ${this.filmCountLabel()}. Ouvrir la catégorie.`,
  );

  protected progress(): number {
    return this.frame().progressPercent();
  }

  protected setHover(hovered: boolean): void {
    this.frame().setHovered(hovered);
  }
}
