import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/api/admin-api.service';
import { MediaPickerComponent } from '../components/media-picker.component';
import { MediaAsset, Project, SaveProject } from '../../models';
import { CATEGORY_NAMES } from '../../core/site-content';
import { CategoryKey } from '../../core/locale';
import { REGIONS, regionId } from '../../core/regions';
import { PACK_LABELS, PACK_TYPES } from '../../core/packs';

const CATEGORY_KEYS: readonly CategoryKey[] = ['evenementiel', 'mariage', 'corporate', 'sport', 'clip', 'lifestyle'];

/** Brouillon éditable : le projet à plat, avec le récit en texte brut par langue. */
interface ProjectDraft extends SaveProject {
  id: string;
  coverAsset: MediaAsset | null;
  videoAsset: MediaAsset | null;
  galleryAssets: MediaAsset[];
}

/**
 * Projets réels : la preuve que le studio travaille là où le site le dit.
 * Un projet a une page dans chaque langue dont le titre est rempli ; le
 * slug contient le lieu (`mariage-chateau-de-la-hulpe`) parce que c'est ce
 * que les couples cherchent. Les champs lieu, ville et région alimentent
 * les pages région et catégorie.
 */
@Component({
  selector: 'app-projects-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, MediaPickerComponent],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Projets</h1>
        <button class="a-btn" type="button" (click)="startNew()">Nouveau projet</button>
      </header>
      <p class="a-hint">
        Un projet = un mariage, un tournage, un événement réel. Le slug contient le lieu ; la page existe dans
        chaque langue dont le titre est rempli. Demandez l’accord écrit du client avant de publier.
      </p>

      @if (status()) {
        <p class="a-status" role="status">{{ status() }}</p>
      }

      @if (draft(); as p) {
        <div class="a-card">
          <h2 class="a-label">Faits</h2>
          <div class="a-grid">
            <label class="a-field">
              <span class="a-label">Slug (URL)</span>
              <input class="a-input" type="text" [(ngModel)]="p.slug" name="slug" placeholder="mariage-chateau-de-la-hulpe" />
            </label>
            <label class="a-field">
              <span class="a-label">Catégorie</span>
              <select class="a-input" [(ngModel)]="p.categoryKey" name="category">
                @for (key of categoryKeys; track key) {
                  <option [value]="key">{{ categoryName(key) }}</option>
                }
              </select>
            </label>
            <label class="a-field">
              <span class="a-label">Région</span>
              <select class="a-input" [(ngModel)]="p.regionId" name="region">
                <option value="">—</option>
                @for (region of regions; track region.id) {
                  <option [value]="region.id">{{ region.name }}</option>
                }
              </select>
            </label>
            <label class="a-field">
              <span class="a-label">Lieu (salle, château, entreprise)</span>
              <input class="a-input" type="text" [(ngModel)]="p.venue" name="venue" />
            </label>
            <label class="a-field">
              <span class="a-label">Ville</span>
              <input class="a-input" type="text" [(ngModel)]="p.city" name="city" />
            </label>
            <label class="a-field">
              <span class="a-label">Pays (code)</span>
              <select class="a-input" [(ngModel)]="p.countryCode" name="country">
                @for (code of countries; track code) {
                  <option [value]="code">{{ code }}</option>
                }
              </select>
            </label>
            <label class="a-field">
              <span class="a-label">Date</span>
              <input class="a-input" type="date" [(ngModel)]="p.date" name="date" />
            </label>
            <label class="a-field">
              <span class="a-label">Formule livrée</span>
              <select class="a-input" [(ngModel)]="p.pack" name="pack">
                <option value="">—</option>
                @for (pack of packTypes; track pack) {
                  <option [value]="pack">{{ packLabel(pack) }}</option>
                }
              </select>
            </label>
            <label class="a-field">
              <span class="a-label">Statut</span>
              <select class="a-input" [(ngModel)]="p.status" name="status">
                <option value="Draft">Brouillon</option>
                <option value="Published">Publié</option>
              </select>
            </label>
            <label class="a-field">
              <span class="a-label">Mise en avant (home)</span>
              <select class="a-input" [(ngModel)]="p.isFeatured" name="featured">
                <option [ngValue]="true">Oui</option>
                <option [ngValue]="false">Non</option>
              </select>
            </label>
          </div>

          @for (lang of languages; track lang.code) {
            <h2 class="a-label lang-title">{{ lang.label }}</h2>
            <div class="a-grid">
              <label class="a-field">
                <span class="a-label">Titre</span>
                <input class="a-input" type="text" [(ngModel)]="p[lang.code].title" name="title-{{ lang.code }}" />
              </label>
              <label class="a-field">
                <span class="a-label">Résumé (1-2 phrases)</span>
                <input class="a-input" type="text" [(ngModel)]="p[lang.code].summary" name="summary-{{ lang.code }}" />
              </label>
              <label class="a-field a-field--wide">
                <span class="a-label">Récit (paragraphes séparés par une ligne vide)</span>
                <textarea class="a-input" rows="6" [(ngModel)]="p[lang.code].body" name="body-{{ lang.code }}"></textarea>
              </label>
            </div>
          }

          <h2 class="a-label lang-title">Médias</h2>
          <div class="a-grid">
            <app-media-picker label="Image de couverture" accept="image/*" [selected]="p.coverAsset" (choose)="setCover(p, $event)" />
            <app-media-picker label="Film" accept="video/*" [selected]="p.videoAsset" (choose)="setVideo(p, $event)" />
          </div>
          <div class="gallery">
            <p class="a-label">Galerie ({{ p.galleryAssets.length }})</p>
            <ul class="gallery__list">
              @for (asset of p.galleryAssets; track asset.id; let i = $index) {
                <li class="gallery__item">
                  @if (asset.posterUrl; as poster) {
                    <img class="gallery__thumb" [src]="poster" [alt]="asset.fileName" />
                  }
                  <span class="a-hint">{{ asset.fileName }}</span>
                  <button class="a-btn a-btn--ghost" type="button" (click)="removeFromGallery(p, i)">Retirer</button>
                </li>
              }
            </ul>
            <app-media-picker label="Ajouter à la galerie" accept="image/*" [selected]="null" (choose)="addToGallery(p, $event)" />
          </div>

          <div class="a-actions">
            <button class="a-btn" type="button" (click)="save(p)">Enregistrer</button>
            <button class="a-btn a-btn--ghost" type="button" (click)="draft.set(null)">Annuler</button>
          </div>
        </div>
      }

      @if (projects().length === 0) {
        <p class="a-empty">Aucun projet pour l’instant.</p>
      } @else {
        <div class="a-scroll">
          <table class="a-table">
            <caption class="sr-only">Projets, glisser une ligne pour réordonner</caption>
            <thead>
              <tr>
                <th scope="col">Ordre</th>
                <th scope="col">Titre</th>
                <th scope="col">Catégorie</th>
                <th scope="col">Lieu</th>
                <th scope="col">Langues</th>
                <th scope="col">Statut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (project of projects(); track project.id; let i = $index) {
                <tr draggable="true" (dragstart)="draggedIndex.set(i)" (dragover)="onDragOver($event, i)" (dragend)="commitOrder()">
                  <td>{{ i + 1 }}</td>
                  <td>{{ project.fr?.title || project.nl?.title || project.en?.title }}</td>
                  <td>{{ categoryName(project.categoryKey) }}</td>
                  <td>{{ project.venue }}{{ project.city ? ', ' + project.city : '' }}</td>
                  <td>{{ languagesOf(project) }}</td>
                  <td>
                    <span class="a-tag" [class.a-tag--muted]="project.status !== 'Published'">
                      {{ project.status === 'Published' ? 'Publié' : 'Brouillon' }}
                    </span>
                  </td>
                  <td class="a-actions">
                    <button class="a-btn a-btn--ghost" type="button" (click)="edit(project)">Éditer</button>
                    <button class="a-btn a-btn--danger" type="button" (click)="remove(project)">Supprimer</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </section>
  `,
  styles: [
    `
      .lang-title {
        margin-top: 24px;
      }

      .a-field--wide {
        grid-column: 1 / -1;
      }

      .gallery {
        margin-top: 16px;
      }

      .gallery__list {
        display: grid;
        gap: 8px;
        padding: 0;
        margin: 8px 0 16px;
        list-style: none;
      }

      .gallery__item {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .gallery__thumb {
        width: 64px;
        height: 40px;
        object-fit: cover;
      }
    `,
  ],
})
export class ProjectsAdminComponent {
  private readonly api = inject(AdminApiService);

  protected readonly projects = signal<Project[]>([]);
  protected readonly draft = signal<ProjectDraft | null>(null);
  protected readonly status = signal<string | null>(null);
  protected readonly draggedIndex = signal<number | null>(null);

  protected readonly categoryKeys = CATEGORY_KEYS;
  protected readonly packTypes = PACK_TYPES;
  protected readonly countries = ['BE', 'FR', 'LU', 'NL', 'GR', 'DE', 'ES', 'IT', 'PT', 'CH', 'GB', 'US'];
  protected readonly regions = REGIONS.map((r) => ({ id: regionId(r), name: `${r.name.fr} (${r.country})` }));
  protected readonly languages = [
    { code: 'fr' as const, label: 'Français' },
    { code: 'nl' as const, label: 'Nederlands' },
    { code: 'en' as const, label: 'English' },
  ];

  constructor() {
    this.load();
  }

  protected categoryName(key: string): string {
    return CATEGORY_NAMES[key as CategoryKey]?.fr ?? key;
  }

  protected packLabel(pack: (typeof PACK_TYPES)[number]): string {
    return PACK_LABELS[pack].fr;
  }

  protected languagesOf(project: Project): string {
    return (['fr', 'nl', 'en'] as const).filter((l) => project[l]).map((l) => l.toUpperCase()).join(' · ') || '—';
  }

  protected load(): void {
    this.api.projects().subscribe({
      next: (projects) => this.projects.set(projects),
      error: () => this.projects.set([]),
    });
  }

  protected startNew(): void {
    this.draft.set({
      id: '',
      slug: '',
      categoryKey: 'mariage',
      regionId: '',
      venue: '',
      city: '',
      countryCode: 'BE',
      date: null,
      pack: '',
      fr: { title: '', summary: '', body: '' },
      nl: { title: '', summary: '', body: '' },
      en: { title: '', summary: '', body: '' },
      cover: null,
      video: null,
      gallery: [],
      isFeatured: false,
      status: 'Draft',
      coverAsset: null,
      videoAsset: null,
      galleryAssets: [],
    });
  }

  protected edit(project: Project): void {
    const text = (t: Project['fr']) => ({
      title: t?.title ?? '',
      summary: t?.summary ?? '',
      body: t?.paragraphs.join('\n\n') ?? '',
    });
    this.draft.set({
      id: project.id,
      slug: project.slug,
      categoryKey: project.categoryKey,
      regionId: project.regionId,
      venue: project.venue,
      city: project.city,
      countryCode: project.countryCode,
      date: project.date,
      pack: project.pack,
      fr: text(project.fr),
      nl: text(project.nl),
      en: text(project.en),
      cover: project.cover ? { id: project.cover.id } : null,
      video: project.video ? { id: project.video.id } : null,
      gallery: project.gallery.map((a) => a.id),
      isFeatured: project.isFeatured,
      status: project.status,
      coverAsset: project.cover,
      videoAsset: project.video,
      galleryAssets: [...project.gallery],
    });
  }

  protected setCover(draft: ProjectDraft, asset: MediaAsset): void {
    draft.cover = { id: asset.id };
    draft.coverAsset = asset;
  }

  protected setVideo(draft: ProjectDraft, asset: MediaAsset): void {
    draft.video = { id: asset.id };
    draft.videoAsset = asset;
  }

  protected addToGallery(draft: ProjectDraft, asset: MediaAsset): void {
    if (draft.gallery.includes(asset.id)) {
      return;
    }
    draft.gallery = [...draft.gallery, asset.id];
    draft.galleryAssets = [...draft.galleryAssets, asset];
    this.draft.set({ ...draft });
  }

  protected removeFromGallery(draft: ProjectDraft, index: number): void {
    draft.gallery = draft.gallery.filter((_, i) => i !== index);
    draft.galleryAssets = draft.galleryAssets.filter((_, i) => i !== index);
    this.draft.set({ ...draft });
  }

  protected save(draft: ProjectDraft): void {
    const payload: SaveProject = {
      slug: draft.slug,
      categoryKey: draft.categoryKey,
      regionId: draft.regionId,
      venue: draft.venue,
      city: draft.city,
      countryCode: draft.countryCode,
      date: draft.date || null,
      pack: draft.pack,
      fr: draft.fr,
      nl: draft.nl,
      en: draft.en,
      cover: draft.cover,
      video: draft.video,
      gallery: draft.gallery,
      isFeatured: draft.isFeatured,
      status: draft.status,
    };
    const id = draft.id;
    const request = id ? this.api.updateProject(id, payload) : this.api.createProject(payload);
    request.subscribe({
      next: () => {
        this.status.set('Projet enregistré.');
        this.draft.set(null);
        this.load();
      },
      error: (err) => this.status.set(err?.error?.title ?? "L'enregistrement a échoué. Vérifiez le slug et le titre."),
    });
  }

  protected remove(project: Project): void {
    this.api.deleteProject(project.id).subscribe({
      next: () => this.load(),
      error: () => this.status.set('La suppression a échoué.'),
    });
  }

  protected onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    const from = this.draggedIndex();
    if (from === null || from === index) {
      return;
    }
    const list = [...this.projects()];
    const [moved] = list.splice(from, 1);
    list.splice(index, 0, moved);
    this.projects.set(list);
    this.draggedIndex.set(index);
  }

  protected commitOrder(): void {
    this.draggedIndex.set(null);
    this.api.reorderProjects(this.projects().map((p) => p.id)).subscribe({
      error: () => this.status.set("L'ordre n'a pas pu être enregistré."),
    });
  }
}
