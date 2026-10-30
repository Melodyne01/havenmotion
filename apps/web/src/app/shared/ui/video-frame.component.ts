import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  afterRenderEffect,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MediaAsset, Rendition } from '../../models';
import { prefersLightMedia, prefersReducedMotion } from '../../core/motion';
import { SITE_LOCALE, SiteLocale } from '../../core/locale';
import { UI_TEXT } from '../../core/ui-text';
import { AnalyticsService } from '../../core/analytics';

/**
 * `auto`     — lit en boucle dès que le cadre est visible (hero).
 * `hover`    — lit au survol sur pointeur fin, à l'entrée dans l'écran sinon.
 * `manual`   — lecture pilotée par le parent via `play`.
 * `teaser`   — extrait muet en boucle dès que le cadre est visible ; un clic
 *              (ou `playFull`) lance le film complet avec le son.
 * `poster`   — n'affiche jamais la vidéo (mouvement réduit, économie de données).
 */
export type VideoFramePlayback = 'auto' | 'hover' | 'manual' | 'teaser' | 'poster';

/** Durée de la boucle quand la vidéo n'a pas encore d'extrait dédié (traitée avant son ajout). */
const TEASER_SECONDS = 20;

/** Début de l'extrait, aligné sur le transcodeur : 10 % du film au-delà d'une minute. */
export function teaserStart(duration: number): number {
  if (!isFinite(duration) || duration <= 60) {
    return 0;
  }
  return Math.min(duration * 0.1, duration - TEASER_SECONDS);
}

/** WebM d'abord (plus léger), MP4 ensuite pour Safari. */
function webmFirst(renditions: Rendition[]): Rendition[] {
  return [...renditions].sort((a, b) => (a.type === 'video/webm' ? -1 : b.type === 'video/webm' ? 1 : 0));
}

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
          [muted]="effectiveMuted()"
          [loop]="effectiveLoop()"
          [attr.aria-label]="label()"
          playsinline
          preload="none"
          [attr.controls]="effectiveControls() ? '' : null"
          disablepictureinpicture
          (loadedmetadata)="onLoadedMetadata()"
          (timeupdate)="onTimeUpdate()"
          (emptied)="progressPercent.set(0)"
          (play)="onPlay()"
        >
          @for (source of sources(); track source.url) {
            <source [src]="source.url" [type]="source.type" />
          }
          @if (captionsUrl(); as track) {
            <track
              kind="captions"
              [srclang]="captionsLocale()"
              [label]="captionsLabel()"
              [src]="track"
              default
            />
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
      @if (teaserActive() && asset()) {
        <button class="frame__play" type="button" (click)="playFull()">
          <span class="frame__play-label">
            <svg class="frame__play-icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" /></svg>
            {{ watchFilmText }}
          </span>
          <span class="frame__play-title">{{ label() }}</span>
        </button>
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
  /** Langue des sous-titres pointés par `captionsUrl`, "fr" par défaut. */
  readonly captionsLocale = input<SiteLocale>('fr');
  protected readonly captionsLabel = computed(() => UI_TEXT[this.captionsLocale()].captions);
  /** Affiche les contrôles natifs (modale : lecture avec son, pause, volume). */
  readonly controls = input(false);

  private readonly videoRef = viewChild<ElementRef<HTMLVideoElement>>('video');
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly analytics = inject(AnalyticsService);
  protected readonly watchFilmText = UI_TEXT[inject(SITE_LOCALE)].watchFilm;
  /** Une seule mesure par film, même si le visiteur relance la lecture. */
  private trackedAsset: MediaAsset | null = null;

  private readonly inView = signal(false);
  private readonly hovered = signal(false);
  private readonly manualPlay = signal(false);
  private readonly lightMedia = signal(false);
  protected readonly reducedMotion = signal(false);

  /**
   * Mode `teaser` : film lancé en version complète. Lié au média demandé, si
   * bien qu'un autre film choisi dans la liste repart sur son extrait muet.
   */
  private readonly fullAsset = signal<MediaAsset | null>(null);
  protected readonly fullMode = computed(() => this.playback() === 'teaser' && this.fullAsset() !== null && this.fullAsset() === this.asset());
  /** Le film complet doit jouer : vrai au lancement, faux après une sortie de l'écran. */
  private readonly fullPlaying = signal(false);
  protected readonly teaserActive = computed(() => this.playback() === 'teaser' && !this.fullMode());

  protected readonly effectiveMuted = computed(() => this.teaserActive() || this.muted());
  protected readonly effectiveLoop = computed(() => this.teaserActive() || this.loop());
  protected readonly effectiveControls = computed(() => (this.playback() === 'teaser' ? this.fullMode() : this.controls()));

  /** Sources déjà chargées dans l'élément : un changement de film impose un `load()`. */
  private loadedElement: HTMLVideoElement | null = null;
  private loadedKey = '';

  private observer?: IntersectionObserver;

  protected readonly poster = computed(() => this.asset()?.posterUrl ?? null);

  private readonly teaserRendition = computed(() => (this.asset()?.renditions ?? []).filter((r) => r.teaser));

  protected readonly sources = computed<Rendition[]>(() => {
    const renditions = (this.asset()?.renditions ?? []).filter((r) => !r.teaser);
    if (this.teaserActive()) {
      // Extrait dédié (quelques Mo) ; à défaut, version muette 720p bornée
      // à une fenêtre de 20 s dans `onTimeUpdate`.
      const teaser = this.teaserRendition();
      if (teaser.length > 0) {
        return teaser;
      }
    }
    const wantsSilent = this.effectiveMuted();
    const pool = renditions.filter((r) => (wantsSilent ? true : !r.muted));
    const preferred = wantsSilent ? pool.filter((r) => r.muted) : pool;
    return webmFirst(preferred.length > 0 ? preferred : pool);
  });

  /** La balise `<video>` n'est montée que si une source lisible existe. */
  protected readonly shouldMount = computed(() => {
    if (!this.isBrowser || this.sources().length === 0) {
      return false;
    }
    if (this.fullMode()) {
      // Lecture demandée par le visiteur : ni le mouvement réduit ni
      // l'économie de données ne s'y opposent.
      return true;
    }
    if (this.playback() === 'poster' || this.lightMedia()) {
      return false;
    }
    if (this.reducedMotion() && (this.playback() === 'auto' || this.playback() === 'teaser')) {
      return false;
    }
    return this.inView();
  });

  constructor() {
    afterRenderEffect(() => {
      const element = this.videoRef()?.nativeElement;
      if (!element) {
        this.loadedElement = null;
        return;
      }
      // `muted` doit aussi être posé en propriété : l'attribut seul ne suffit
      // pas pour que Chrome autorise la lecture automatique.
      element.muted = this.effectiveMuted();
      const key = this.sources()
        .map((s) => s.url)
        .join('|');
      if (element !== this.loadedElement || key !== this.loadedKey) {
        // `playFull` a pu poser `src` directement : il masquerait les <source>.
        element.removeAttribute('src');
        element.load();
        this.loadedElement = element;
        this.loadedKey = key;
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
          // Film complet sorti de l'écran : mis en pause, il ne reprend pas
          // seul au retour (le son surprendrait) ; le visiteur relance.
          if (!entry.isIntersecting && this.fullMode()) {
            this.fullPlaying.set(false);
          }
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

  /**
   * Mode `teaser` : passe au film complet, avec le son et les contrôles.
   * `asset` permet au parent de viser le film qu'il vient de choisir, avant
   * que l'entrée `asset` ne soit mise à jour.
   */
  playFull(asset: MediaAsset | null = this.asset()): void {
    if (!asset) {
      return;
    }
    this.fullAsset.set(asset);
    this.fullPlaying.set(true);

    // Même film déjà monté : la source est changée et lue tout de suite, dans
    // le geste du visiteur — Safari iOS refuse le son en dehors.
    const element = this.videoRef()?.nativeElement;
    if (!element || asset !== this.asset()) {
      return;
    }
    const full = this.sources();
    const playable = full.find((s) => element.canPlayType(s.type) !== '');
    if (!playable) {
      return;
    }
    element.muted = false;
    element.loop = this.loop();
    element.src = playable.url;
    this.loadedElement = element;
    this.loadedKey = full.map((s) => s.url).join('|');
    void element.play().catch(() => undefined);
  }

  /** Position de lecture en pourcentage, lue par la barre de progression. */
  readonly progressPercent = signal(0);

  protected onLoadedMetadata(): void {
    const element = this.videoRef()?.nativeElement;
    if (element && this.loopsInsideFilm()) {
      element.currentTime = teaserStart(element.duration);
    }
  }

  protected onTimeUpdate(): void {
    const element = this.videoRef()?.nativeElement;
    if (!element || !element.duration || !isFinite(element.duration)) {
      this.progressPercent.set(0);
      return;
    }
    if (this.loopsInsideFilm()) {
      const start = teaserStart(element.duration);
      if (element.currentTime < start - 1 || element.currentTime >= start + TEASER_SECONDS) {
        element.currentTime = start;
      }
    }
    this.progressPercent.set((element.currentTime / element.duration) * 100);
  }

  /** Extrait lu dans le film muet entier, faute d'extrait dédié. */
  private loopsInsideFilm(): boolean {
    return this.teaserActive() && this.teaserRendition().length === 0;
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
      case 'teaser':
        return this.fullMode() ? this.fullPlaying() : true;
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

  /**
   * Mesure Umami : seules les lectures lancées par le visiteur comptent (films
   * avec contrôles, sur les pages catégorie et projet) ; les fonds vidéo et
   * les extraits muets en lecture automatique ne sont pas des lectures.
   */
  protected onPlay(): void {
    if (this.fullMode()) {
      this.fullPlaying.set(true);
    }
    const asset = this.asset();
    if (!this.effectiveControls() || !asset || this.trackedAsset === asset) {
      return;
    }
    this.trackedAsset = asset;
    this.analytics.track('video_play', {
      title: this.label(),
      path: typeof location !== 'undefined' ? location.pathname : undefined,
    });
  }
}
