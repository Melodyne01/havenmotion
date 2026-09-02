import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./public/public-page.component').then((m) => m.PublicPageComponent),
  },
  {
    path: 'realisations/:slug',
    loadComponent: () =>
      import('./public/pages/category-page.component').then((m) => m.CategoryPageComponent),
  },
  {
    path: 'a-propos',
    loadComponent: () =>
      import('./public/pages/about-page.component').then((m) => m.AboutPageComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./public/pages/contact-page.component').then((m) => m.ContactPageComponent),
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./public/pages/faq-page.component').then((m) => m.FaqPageComponent),
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
