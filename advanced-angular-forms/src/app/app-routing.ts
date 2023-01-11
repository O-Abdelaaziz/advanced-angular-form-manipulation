import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Template-Driven Forms Playground',
    loadComponent:
      () => import('./pages/template-forms-page/template-forms-page.component')
        .then(m => m.TemplateFormsPageComponent)
  },
];

