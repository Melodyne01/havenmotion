import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AdminApiService } from '../../core/api/admin-api.service';
import { AuditLogEntry } from '../../models';

/** Journal : qui a modifié quoi, quand. */
@Component({
  selector: 'app-audit-admin',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  template: `
    <section class="a-page">
      <header class="a-page__head">
        <h1 class="a-title">Journal</h1>
        <button class="a-btn a-btn--ghost" type="button" (click)="load()">Rafraîchir</button>
      </header>

      @if (entries().length === 0) {
        <p class="a-empty">Aucune modification enregistrée.</p>
      } @else {
        <div class="a-scroll">
          <table class="a-table">
            <thead>
              <tr>
                <th scope="col">Quand</th>
                <th scope="col">Qui</th>
                <th scope="col">Entité</th>
                <th scope="col">Action</th>
                <th scope="col">Détail</th>
              </tr>
            </thead>
            <tbody>
              @for (entry of entries(); track entry.id) {
                <tr>
                  <td>{{ entry.createdAt | date: 'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ entry.userEmail }}</td>
                  <td>{{ entry.entity }}</td>
                  <td>{{ entry.action }}</td>
                  <td class="diff">{{ entry.diff }}</td>
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
      .diff {
        max-width: 460px;
        font-size: 11px;
        word-break: break-word;
      }
    `,
  ],
})
export class AuditAdminComponent {
  private readonly api = inject(AdminApiService);

  protected readonly entries = signal<AuditLogEntry[]>([]);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.api.auditLog().subscribe({
      next: (entries) => this.entries.set(entries),
      error: () => this.entries.set([]),
    });
  }
}
