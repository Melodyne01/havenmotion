import { Routes } from '@angular/router';
import { authGuard } from '../core/auth/auth.guard';

export const adminRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./admin-shell.component').then((m) => m.AdminShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'categories' },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories-admin.component').then((m) => m.CategoriesAdminComponent),
      },
      {
        path: 'films',
        loadComponent: () =>
          import('./pages/films-admin.component').then((m) => m.FilmsAdminComponent),
      },
      {
        path: 'showreel',
        loadComponent: () =>
          import('./pages/showreel-admin.component').then((m) => m.ShowreelAdminComponent),
      },
      {
        path: 'medias',
        loadComponent: () =>
          import('./pages/media-admin.component').then((m) => m.MediaAdminComponent),
      },
      {
        path: 'contenus',
        loadComponent: () =>
          import('./pages/content-admin.component').then((m) => m.ContentAdminComponent),
      },
      {
        path: 'devis',
        loadComponent: () =>
          import('./pages/leads-admin.component').then((m) => m.LeadsAdminComponent),
      },
      {
        path: 'journal',
        loadComponent: () =>
          import('./pages/audit-admin.component').then((m) => m.AuditAdminComponent),
      },
    ],
  },
];
