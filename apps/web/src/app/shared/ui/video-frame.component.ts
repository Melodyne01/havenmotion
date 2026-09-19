import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MediaAsset, Rendition } from '../../models';
import { prefersLightMedia, prefersReducedMotion } from '../../core/motion';

/**
 * `auto`     — lit en boucle dès que le cadre est visible (hero).
 * `hover`    — lit au survol sur pointeur fin, à l'entrée dans l'écran sinon.
 * `manual`   — lecture pilotée par le parent via `play`.
 * `poster`   — n'affiche jamais la vidéo (mouvement réduit, économie de données).
 */
export type VideoFramePlayback = 'auto' | 'hover' | 'manual' | 'poster';

/**
 * Cadre vidéo unique du site.
 *
 * Le ratio est réservé en CSS (`aspect-ratio`) avant tout chargement : le
 * poster s'affiche immédiatement et aucun décalage de mise en page ne se
 * produit. La source n'est attachée qu'à l'entrée dans l'écran.
 */
@Component({
  selector: 'app-video-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="frame" [style.aspect-ratio]="ratio()" [style.min-height.px]="minHeight()">
      @if (shouldMount()) {
        <video
          #video
          class="frame__video"
          [class.frame__video--travelling]="travelling() && !reducedMotion()"
          [class.frame__video--reverse]="travellingReverse()"
          [poster]="poster() ?? ''"
          [muted]="muted()"
          [loop]="loop()"
          [attr.aria-label]="label()"
          playsinline
          preload="none"
          [attr.controls]="controls() ? '' : null"
          disablepictureinpicture
          (timeupdate)="onTimeUpdate()"
          (emptied)="progressPercent.set(0)"
        >
          @for (source of sources(); track source.url) {
            <source [src]="source.url" [type]="source.type" />
          }
          @if (captionsUrl(); as track) {
            <track kind="captions" srclang="fr" label="Français" [src]="track" default />
          }
        </video>
      } @else {
        <img
          class="frame__poster"
          [src]="poster() ?? ''"
          [alt]="label()"
          decoding="async"
          [attr.fetchpriority]="priority() ? 'high' : null"
          [attr.loading]="priority() ? 'eager' : 'lazy'"
        />
      }
      <ng-content />
    </span>
  `,
  styleUrl: './video-frame.component.scss',
})
export class VideoFrameComponent implements AfterViewInit, OnDestroy {
  /** Ratio du cadre, `2.39` par défaut (cinémascope). */
  readonly ratio = input(2.39);
  /**
   * Hauteur plancher en pixels. Le ratio seul ne suffit pas quand le cadre
   * porte du texte : sur un téléphone, un 2.39:1 ne fait que 163 px de haut et
   * le contenu superposé déborde. Ce plancher ne mord que sur les écrans trop
   * étroits — dès que la largeur redonne au ratio une hauteur suffisante, le
   * cinémascope reprend exactement.
   */
  readonly minHeight = input<number | null>(null);
  readonly asset = input<MediaAsset | null>(null);
  readonly playback = input<VideoFramePlayback>('hover');
  readonly muted = input(true);
  readonly loop = input(true);
  /** Travelling lent (scale 1.04 → 1.12 sur 26 s). */
  readonly travelling = input(false);
  readonly travellingReverse = input(false);
  /** Libellé accessible du cadre. */
  readonly label = input('');
  /** Marque le média comme critique (hero) : poster chargé en priorité. */
  readonly priority = input(false);
  readonly captionsUrl = input<string | null>(null);
  /** Affiche les contrôles natifs (modale : lecture avec son, pause, volume). */
  readonly controls = input(false);

  private readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('video');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private readonly inView = signal(false);
  private readonly hovered = signal(false);
  private readonly manualPlay = signal(false);
  private readonly lightMedia = signal(false);
  protected readonly reducedMotion = signal(false);
  private readonly sourcesAttached = signal(false);

  private observer?: IntersectionObserver;

  protected readonly poster = computed(() => this.asset()?.posterUrl ?? null);

  /** WebM d'abord (plus léger), MP4 ensuite pour Safari. */
  protected readonly sources = computed<Rendition[]>(() => {
    const renditions = this.asset()?.renditions ?? [];
    const wantsSilent = this.muted();
    const pool = renditions.filter((r) => (wantsSilent ? true : !r.muted));
    const preferred = wantsSilent ? pool.filter((r) => r.muted) : pool;
    const chosen = preferred.length > 0 ? preferred : pool;
    return [...chosen].sort((a, b) => (a.type === 'video/webm' ? -1 : b.type === 'video/webm' ? 1 : 0));
  });

  /** La balise `<video>` n'est montée que si une source lisible existe. */
  protected readonly shouldMount = computed(() => {
    if (!this.isBrowser || this.sources().length === 0) {
      return false;
    }
    if (this.playback() === 'poster' || this.lightMedia()) {
      return false;
    }
    if (this.reducedMotion() && this.playback() === 'auto') {
      return false;
    }
    return this.inView();
  });

  constructor() {
    effect(() => {
      const element = this.videoRef()?.nativeElement;
      if (!element) {
        return;
      }
      // `muted` doit aussi être posé en propriété : l'attribut seul ne suffit
      // pas pour que Chrome autorise la lecture automatique.
      element.muted = this.muted();
      if (!this.sourcesAttached()) {
        element.load();
        this.sourcesAttached.set(true);
      }
      if (this.wantsPlayback()) {
        void element.play().catch(() => undefined);
      } else {
        element.pause();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }
    this.reducedMotion.set(prefersReducedMotion());
    this.lightMedia.set(prefersLightMedia());

    const element = this.host.nativeElement;
    if (!('IntersectionObserver' in window)) {
      this.inView.set(true);
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.inView.set(entry.isIntersecting);
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 },
    );
    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  /** Appelé par le parent (survol d'une bande, ouverture d'une modale). */
  setHovered(value: boolean): void {
    this.hovered.set(value);
  }

  play(): void {
    this.manualPlay.set(true);
  }

  pause(): void {
    this.manualPlay.set(false);
  }

  /** Position de lecture en pourcentage, lue par la barre de progression. */
  readonly progressPercent = signal(0);

  protected onTimeUpdate(): void {
    const element = this.videoRef()?.nativeElement;
    if (!element || !element.duration || !isFinite(element.duration)) {
      this.progressPercent.set(0);
      return;
    }
    this.progressPercent.set((element.currentTime / element.duration) * 100);
  }

  private wantsPlayback(): boolean {
    if (!this.inView()) {
      return false;
    }
    switch (this.playback()) {
      case 'auto':
        return true;
      case 'manual':
        return this.manualPlay();
      case 'hover':
        // Sur pointeur grossier (mobile), il n'y a pas de survol : on lit dès
        // que la bande entre dans l'écran.
        return this.hovered() || !this.hasFinePointer();
      default:
        return false;
    }
  }

  private hasFinePointer(): boolean {
    return this.isBrowser && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;
  }
}
