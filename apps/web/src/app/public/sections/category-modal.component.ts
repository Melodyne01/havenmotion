import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { ModalComponent } from '../../shared/ui/modal.component';
import { VideoFrameComponent } from '../../shared/ui/video-frame.component';
import { CtaButtonComponent } from '../../shared/ui/cta-button.component';
import { PublicApiService } from '../../core/api/public-api.service';
import { Category, Film } from '../../models';

/**
 * Modale de catégorie : le reel est rejoué avec le son, accompagné du titre,
 * des méta et de la liste des films publiés de la catégorie.
 */
@Component({
  selector: 'app-category-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalComponent, VideoFrameComponent, CtaButtonComponent],
  template: `
    <app-modal [label]="'Catégorie ' + category().name" (closed)="closed.emit()">
      <div class="modal">
        <app-video-frame
          [asset]="activeAsset()"
          playback="manual"
          [muted]="false"
          [loop]="false"
          [controls]="true"
          [label]="activeTitle()"
          class="modal__frame"
          #frame
        />

        <div class="modal__body">
          <p class="modal__eyebrow">{{ category().tagline }}</p>
          <h2 class="modal__title">{{ activeTitle() }}</h2>
          <p class="modal__meta">{{ metaLine() }}</p>

          @if (films().length > 0) {
            <ul class="modal__films">
              @for (film of films(); track film.id) {
                <li>
                  <button
                    class="modal__film"
                    type="button"
                    [class.is-active]="film.id === activeFilmId()"
                    (click)="selectFilm(film)"
                  >
                    <span class="modal__film-title">{{ film.title }}</span>
                    <span class="modal__film-meta">{{ film.client }} · {{ film.duration }}</span>
                  </button>
                </li>
              }
            </ul>
          }

          <app-cta-button href="#contact" (click)="closed.emit()">
            Un projet comme ça ? Devis
          </app-cta-button>
        </div>
      </div>
    </app-modal>
  `,
  styleUrl: './category-modal.component.scss',
})
export class CategoryModalComponent implements AfterViewInit {
  readonly category = input.required<Category>();
  readonly closed = output<void>();

  private readonly api = inject(PublicApiService);
  private readonly selected = signal<Film | null>(null);

  private readonly frame = viewChild.required<VideoFrameComponent>('frame');

  protected readonly films = toSignal(
    toObservable(this.category).pipe(switchMap((category) => this.api.films(category.slug))),
    { initialValue: [] as Film[] },
  );

  protected readonly activeFilmId = computed(() => this.selected()?.id ?? null);

  /**
   * L'ouverture de la modale vient d'un clic : la lecture avec son est donc
   * autorisée. Si le navigateur la refuse malgré tout, les contrôles natifs
   * laissent la main à l'utilisateur.
   */
  ngAfterViewInit(): void {
    this.frame().play();
  }

  protected activeAsset() {
    return this.selected()?.media ?? this.category().reel;
  }

  protected activeTitle(): string {
    return this.selected()?.title ?? this.category().name;
  }

  protected metaLine(): string {
    const film = this.selected();
    if (film) {
      return [film.client, film.duration, film.date?.slice(0, 4)].filter(Boolean).join(' · ');
    }
    const count = this.category().filmCount;
    return `${count} ${count > 1 ? 'films' : 'film'} · ${this.category().name}`;
  }

  protected selectFilm(film: Film): void {
    this.selected.set(film.id === this.selected()?.id ? null : film);
    this.frame().play();
  }
}
