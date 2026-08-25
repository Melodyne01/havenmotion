import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/public-page.component').then((m) => m.PublicPageComponent),
  },
  {
    path: 'mentions-legales',
    loadComponent: () =>
      import('./public/legal-page.component').then((m) => m.LegalPageComponent),
    data: { document: 'mentions' },
  },
  {
    path: 'confidentialite',
    loadComponent: () =>
      import('./public/legal-page.component').then((m) => m.LegalPageComponent),
    data: { document: 'confidentialite' },
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
  { path: '**', redirectTo: '' },
];
