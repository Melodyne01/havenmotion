import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { AdminApiService, LeadFilters } from '../../core/api/admin-api.service';
import { Lead, LeadStatus } from '../../models';
import { PACK_LABELS, PackType, PACK_TYPES } from '../../core/packs';
import { findRegion } from '../../core/regions';

const STATUS_LABELS: Record<LeadStatus, string> = {
  New: 'Nouveau',
  Handled: 'Traité',
  Won: 'Gagné',
  Lost: 'Perdu',
};

/** Demandes de devis : filtres, détail, statut et export CSV. */
@Component({
  selector: 'app-leads-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DatePipe, UpperCasePipe],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Demandes de devis</h1>
        <button class="a-btn a-btn--ghost" type="button" (click)="exportCsv()">Export CSV</button>
      </header>

      <div class="a-card a-grid">
        <label class="a-field">
          <span class="a-label">Type de projet</span>
          <input class="a-input" type="text" [(ngModel)]="filters.projectType" name="type" />
        </label>
        <label class="a-field">
          <span class="a-label">Budget</span>
          <input class="a-input" type="text" [(ngModel)]="filters.budgetRange" name="budget" />
        </label>
        <label class="a-field">
          <span class="a-label">Depuis</span>
          <input class="a-input" type="date" [(ngModel)]="filters.from" name="from" />
        </label>
        <label class="a-field">
          <span class="a-label">Jusqu’au</span>
          <input class="a-input" type="date" [(ngModel)]="filters.to" name="to" />
        </label>
        <div class="a-actions">
          <button class="a-btn" type="button" (click)="load()">Filtrer</button>
          <button class="a-btn a-btn--ghost" type="button" (click)="reset()">Réinitialiser</button>
        </div>
      </div>

      @if (status()) {
        <p class="a-status" role="status">{{ status() }}</p>
      }

      @if (leads().length > 0) {
        <div class="a-card stats">
          <p class="a-label">{{ leads().length }} demande(s) — par formule et par région</p>
          <ul class="stats__list">
            @for (row of stats(); track row.label) {
              <li><span>{{ row.label }}</span><strong>{{ row.count }}</strong></li>
            }
          </ul>
        </div>
      }

      @if (leads().length === 0) {
        <p class="a-empty">Aucune demande pour ces critères.</p>
      } @else {
        <div class="a-scroll">
          <table class="a-table">
            <thead>
              <tr>
                <th scope="col">Reçue le</th>
                <th scope="col">Nom</th>
                <th scope="col">E-mail</th>
                <th scope="col">Projet</th>
                <th scope="col">Formule</th>
                <th scope="col">Région</th>
                <th scope="col">Date</th>
                <th scope="col">Budget</th>
                <th scope="col">Message</th>
                <th scope="col">Statut</th>
              </tr>
            </thead>
            <tbody>
              @for (lead of leads(); track lead.id) {
                <tr>
                  <td>{{ lead.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ lead.name }}</td>
                  <td><a [href]="'mailto:' + lead.email">{{ lead.email }}</a></td>
                  <td>{{ lead.projectType }} <span class="lang">{{ lead.locale | uppercase }}</span></td>
                  <td>{{ packLabel(lead.pack) }}</td>
                  <td>{{ regionLabel(lead.region) }}</td>
                  <td>{{ lead.eventDate ? (lead.eventDate | date: 'dd/MM/yyyy') : '—' }}</td>
                  <td>{{ lead.budgetRange }}</td>
                  <td class="message">{{ lead.message || '—' }}</td>
                  <td>
                    <select
                      class="a-input"
                      [ngModel]="lead.status"
                      (ngModelChange)="setStatus(lead, $event)"
                      name="status-{{ lead.id }}"
                      [attr.aria-label]="'Statut de la demande de ' + lead.name"
                    >
                      @for (option of statusOptions; track option) {
                        <option [value]="option">{{ statusLabel(option) }}</option>
                      }
                    </select>
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
      .message {
        max-width: 320px;
      }

      .stats__list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 4px 24px;
        padding: 0;
        margin: 8px 0 0;
        list-style: none;

        li {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 13px;
        }
      }

      .lang {
        margin-left: 6px;
        opacity: 0.6;
        font-size: 11px;
      }
    `,
  ],
})
export class LeadsAdminComponent {
  private readonly api = inject(AdminApiService);

  protected readonly leads = signal<Lead[]>([]);
  protected readonly status = signal<string | null>(null);
  protected readonly statusOptions: LeadStatus[] = ['New', 'Handled', 'Won', 'Lost'];

  /** Répartition des demandes chargées par formule puis par région : la mesure qui dit quelles pages convertissent. */
  protected readonly stats = computed(() => {
    const count = (key: (lead: Lead) => string) => {
      const map = new Map<string, number>();
      for (const lead of this.leads()) {
        const k = key(lead);
        map.set(k, (map.get(k) ?? 0) + 1);
      }
      return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([label, n]) => ({ label, count: n }));
    };
    return [
      ...count((l) => `Formule : ${this.packLabel(l.pack)}`),
      ...count((l) => `Région : ${this.regionLabel(l.region)}`),
      ...count((l) => `Langue : ${l.locale.toUpperCase()}`),
    ];
  });
  protected filters: LeadFilters = {};

  constructor() {
    this.load();
  }

  protected statusLabel(value: LeadStatus): string {
    return STATUS_LABELS[value];
  }

  /** Code de formule (`combo`) → libellé FR ; vide = le prospect n'a pas choisi. */
  protected packLabel(pack: string): string {
    return PACK_TYPES.includes(pack as PackType) ? PACK_LABELS[pack as PackType].fr : '—';
  }

  /** Identifiant de région (`lille-nord`) → nom FR ; vide = à préciser. */
  protected regionLabel(region: string): string {
    return findRegion(region)?.name.fr ?? (region || '—');
  }

  protected load(): void {
    this.api.leads(this.filters).subscribe({
      next: (leads) => this.leads.set(leads),
      error: () => this.leads.set([]),
    });
  }

  protected reset(): void {
    this.filters = {};
    this.load();
  }

  protected setStatus(lead: Lead, status: LeadStatus): void {
    this.api.updateLeadStatus(lead.id, status).subscribe({
      next: (updated) =>
        this.leads.update((list) => list.map((item) => (item.id === updated.id ? updated : item))),
      error: () => this.status.set('Le statut n’a pas pu être enregistré.'),
    });
  }

  protected exportCsv(): void {
    this.api.exportLeads().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'demandes-de-devis.csv';
        link.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.status.set("L'export a échoué."),
    });
  }
}
