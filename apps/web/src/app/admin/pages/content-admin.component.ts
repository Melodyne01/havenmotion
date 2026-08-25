import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/api/admin-api.service';
import { ClientLogo, ProcessStep, ServiceCard, SiteSettings, Testimonial } from '../../models';

/** Contenus texte : prestations, process, témoignages, logos, coordonnées. */
@Component({
  selector: 'app-content-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Contenus</h1>
        <p class="a-hint">Chaque bloc s’enregistre séparément.</p>
      </header>

      @if (status()) {
        <p class="a-status" role="status">{{ status() }}</p>
      }

      @if (settings(); as site) {
        <div class="a-card">
          <h2 class="a-label">Coordonnées &amp; identité</h2>
          <div class="a-grid">
            <label class="a-field">
              <span class="a-label">Nom de marque</span>
              <input class="a-input" type="text" [(ngModel)]="site.brandName" name="brand" />
            </label>
            <label class="a-field">
              <span class="a-label">Accroche</span>
              <input class="a-input" type="text" [(ngModel)]="site.tagline" name="tagline" />
            </label>
            <label class="a-field">
              <span class="a-label">E-mail</span>
              <input class="a-input" type="email" [(ngModel)]="site.email" name="email" />
            </label>
            <label class="a-field">
              <span class="a-label">Instagram</span>
              <input class="a-input" type="text" [(ngModel)]="site.instagram" name="instagram" />
            </label>
            <label class="a-field">
              <span class="a-label">Ville</span>
              <input class="a-input" type="text" [(ngModel)]="site.city" name="city" />
            </label>
            <label class="a-field">
              <span class="a-label">Région</span>
              <input class="a-input" type="text" [(ngModel)]="site.region" name="region" />
            </label>
            <label class="a-field">
              <span class="a-label">Mention légale</span>
              <textarea class="a-input" rows="3" [(ngModel)]="site.legalText" name="legal"></textarea>
            </label>
          </div>
          <div class="a-actions">
            <button class="a-btn" type="button" (click)="saveSettings(site)">Enregistrer</button>
          </div>
        </div>
      }

      <div class="a-card">
        <h2 class="a-label">Prestations</h2>
        @for (service of services(); track service.id) {
          <div class="a-grid block">
            <label class="a-field">
              <span class="a-label">Nom</span>
              <input class="a-input" type="text" [(ngModel)]="service.name" name="s-name-{{ service.id }}" />
            </label>
            <label class="a-field">
              <span class="a-label">Inclus (une ligne par élément)</span>
              <textarea
                class="a-input"
                rows="3"
                [ngModel]="service.included.join('\n')"
                (ngModelChange)="service.included = splitLines($event)"
                name="s-inc-{{ service.id }}"
              ></textarea>
            </label>
            <label class="a-field">
              <span class="a-label">Durée</span>
              <input class="a-input" type="text" [(ngModel)]="service.duration" name="s-dur-{{ service.id }}" />
            </label>
            <label class="a-field">
              <span class="a-label">Livrables</span>
              <input class="a-input" type="text" [(ngModel)]="service.deliverables" name="s-del-{{ service.id }}" />
            </label>
            <label class="a-field">
              <span class="a-label">À partir de</span>
              <input class="a-input" type="text" [(ngModel)]="service.startingPrice" name="s-price-{{ service.id }}" />
            </label>
            <div class="a-actions">
              <button class="a-btn" type="button" (click)="saveService(service)">Enregistrer</button>
              <button class="a-btn a-btn--danger" type="button" (click)="deleteService(service)">
                Supprimer
              </button>
            </div>
          </div>
        }
        <button class="a-btn a-btn--ghost" type="button" (click)="addService()">
          Ajouter une prestation
        </button>
      </div>

      <div class="a-card">
        <h2 class="a-label">Process</h2>
        @for (step of steps(); track step.id) {
          <div class="a-grid block">
            <label class="a-field">
              <span class="a-label">Index</span>
              <input class="a-input" type="text" [(ngModel)]="step.index" name="p-idx-{{ step.id }}" />
            </label>
            <label class="a-field">
              <span class="a-label">Titre</span>
              <input class="a-input" type="text" [(ngModel)]="step.title" name="p-title-{{ step.id }}" />
            </label>
            <label class="a-field">
              <span class="a-label">Texte</span>
              <textarea class="a-input" rows="2" [(ngModel)]="step.body" name="p-body-{{ step.id }}"></textarea>
            </label>
            <div class="a-actions">
              <button class="a-btn" type="button" (click)="saveStep(step)">Enregistrer</button>
              <button class="a-btn a-btn--danger" type="button" (click)="deleteStep(step)">
                Supprimer
              </button>
            </div>
          </div>
        }
        <button class="a-btn a-btn--ghost" type="button" (click)="addStep()">Ajouter une étape</button>
      </div>

      <div class="a-card">
        <h2 class="a-label">Témoignages</h2>
        @for (testimonial of testimonials(); track testimonial.id) {
          <div class="a-grid block">
            <label class="a-field">
              <span class="a-label">Citation</span>
              <textarea
                class="a-input"
                rows="3"
                [(ngModel)]="testimonial.quote"
                name="t-quote-{{ testimonial.id }}"
              ></textarea>
            </label>
            <label class="a-field">
              <span class="a-label">Auteur</span>
              <input class="a-input" type="text" [(ngModel)]="testimonial.author" name="t-author-{{ testimonial.id }}" />
            </label>
            <label class="a-field">
              <span class="a-label">Rôle</span>
              <input class="a-input" type="text" [(ngModel)]="testimonial.role" name="t-role-{{ testimonial.id }}" />
            </label>
            <div class="a-actions">
              <button class="a-btn" type="button" (click)="saveTestimonial(testimonial)">
                Enregistrer
              </button>
              <button class="a-btn a-btn--danger" type="button" (click)="deleteTestimonial(testimonial)">
                Supprimer
              </button>
            </div>
          </div>
        }
        <button class="a-btn a-btn--ghost" type="button" (click)="addTestimonial()">
          Ajouter un témoignage
        </button>
      </div>

      <div class="a-card">
        <h2 class="a-label">Logos clients</h2>
        @for (logo of logos(); track logo.id) {
          <div class="a-grid block">
            <label class="a-field">
              <span class="a-label">Nom</span>
              <input class="a-input" type="text" [(ngModel)]="logo.name" name="l-name-{{ logo.id }}" />
            </label>
            <label class="a-field">
              <span class="a-label">URL de l’image</span>
              <input class="a-input" type="text" [(ngModel)]="logo.imageUrl" name="l-url-{{ logo.id }}" />
            </label>
            <div class="a-actions">
              <button class="a-btn" type="button" (click)="saveLogo(logo)">Enregistrer</button>
              <button class="a-btn a-btn--danger" type="button" (click)="deleteLogo(logo)">
                Supprimer
              </button>
            </div>
          </div>
        }
        <button class="a-btn a-btn--ghost" type="button" (click)="addLogo()">Ajouter un logo</button>
      </div>
    </section>
  `,
  styles: [
    `
      @use 'tokens' as *;

      .block {
        padding: 16px 0;
        border-bottom: $rule-width solid $color-rule-10;
      }
    `,
  ],
})
export class ContentAdminComponent {
  private readonly api = inject(AdminApiService);

  protected readonly settings = signal<SiteSettings | null>(null);
  protected readonly services = signal<ServiceCard[]>([]);
  protected readonly steps = signal<ProcessStep[]>([]);
  protected readonly testimonials = signal<Testimonial[]>([]);
  protected readonly logos = signal<ClientLogo[]>([]);
  protected readonly status = signal<string | null>(null);

  constructor() {
    this.api.settings().subscribe({ next: (v) => this.settings.set(v), error: () => undefined });
    this.reloadServices();
    this.reloadSteps();
    this.reloadTestimonials();
    this.reloadLogos();
  }

  protected splitLines(value: string): string[] {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  protected saveSettings(site: SiteSettings): void {
    this.api.updateSettings(site).subscribe({
      next: () => this.status.set('Coordonnées enregistrées.'),
      error: () => this.status.set("L'enregistrement a échoué."),
    });
  }

  protected addService(): void {
    this.services.update((list) => [
      ...list,
      {
        id: '',
        name: '',
        included: [],
        duration: '',
        deliverables: '',
        startingPrice: '',
        sortOrder: list.length + 1,
      },
    ]);
  }

  protected saveService(service: ServiceCard): void {
    this.api.saveService(service).subscribe({
      next: () => {
        this.status.set('Prestation enregistrée.');
        this.reloadServices();
      },
      error: () => this.status.set("L'enregistrement a échoué."),
    });
  }

  protected deleteService(service: ServiceCard): void {
    if (!service.id) {
      this.services.update((list) => list.filter((item) => item !== service));
      return;
    }
    this.api.deleteService(service.id).subscribe({ next: () => this.reloadServices() });
  }

  protected addStep(): void {
    this.steps.update((list) => [
      ...list,
      { id: '', index: String(list.length + 1).padStart(2, '0'), title: '', body: '', sortOrder: list.length + 1 },
    ]);
  }

  protected saveStep(step: ProcessStep): void {
    this.api.saveProcessStep(step).subscribe({
      next: () => {
        this.status.set('Étape enregistrée.');
        this.reloadSteps();
      },
      error: () => this.status.set("L'enregistrement a échoué."),
    });
  }

  protected deleteStep(step: ProcessStep): void {
    if (!step.id) {
      this.steps.update((list) => list.filter((item) => item !== step));
      return;
    }
    this.api.deleteProcessStep(step.id).subscribe({ next: () => this.reloadSteps() });
  }

  protected addTestimonial(): void {
    this.testimonials.update((list) => [
      ...list,
      { id: '', quote: '', author: '', role: '', sortOrder: list.length + 1 },
    ]);
  }

  protected saveTestimonial(testimonial: Testimonial): void {
    this.api.saveTestimonial(testimonial).subscribe({
      next: () => {
        this.status.set('Témoignage enregistré.');
        this.reloadTestimonials();
      },
      error: () => this.status.set("L'enregistrement a échoué."),
    });
  }

  protected deleteTestimonial(testimonial: Testimonial): void {
    if (!testimonial.id) {
      this.testimonials.update((list) => list.filter((item) => item !== testimonial));
      return;
    }
    this.api.deleteTestimonial(testimonial.id).subscribe({ next: () => this.reloadTestimonials() });
  }

  protected addLogo(): void {
    this.logos.update((list) => [
      ...list,
      { id: '', name: '', imageUrl: null, sortOrder: list.length + 1 },
    ]);
  }

  protected saveLogo(logo: ClientLogo): void {
    this.api.saveLogo(logo).subscribe({
      next: () => {
        this.status.set('Logo enregistré.');
        this.reloadLogos();
      },
      error: () => this.status.set("L'enregistrement a échoué."),
    });
  }

  protected deleteLogo(logo: ClientLogo): void {
    if (!logo.id) {
      this.logos.update((list) => list.filter((item) => item !== logo));
      return;
    }
    this.api.deleteLogo(logo.id).subscribe({ next: () => this.reloadLogos() });
  }

  private reloadServices(): void {
    this.api.services().subscribe({ next: (v) => this.services.set(v), error: () => undefined });
  }

  private reloadSteps(): void {
    this.api.processSteps().subscribe({ next: (v) => this.steps.set(v), error: () => undefined });
  }

  private reloadTestimonials(): void {
    this.api
      .testimonials()
      .subscribe({ next: (v) => this.testimonials.set(v), error: () => undefined });
  }

  private reloadLogos(): void {
    this.api.logos().subscribe({ next: (v) => this.logos.set(v), error: () => undefined });
  }
}
