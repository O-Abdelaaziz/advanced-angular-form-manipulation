import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Template-Driven Forms Playground',
    loadComponent: () =>
      import('./pages/template-forms-page/template-forms-page.component').then(
        (d) => d.TemplateFormsPageComponent
      ),
  },
  {
    path: 'reactive-forms',
    title: 'Reactive Forms Playground',
    loadComponent: () =>
      import('./pages/reactive-forms-page/reactive-forms-page.component').then(
        (r) => r.ReactiveFormsPageComponent
      ),
  },
  {
    path: 'custom-rating-picker',
    title: 'Custom Rating Picker',
    loadComponent: () =>
      import(
        './pages/custom-rating-picker/custom-rating-picker.component'
      ).then((c) => c.CustomRatingPickerComponent),
  },
];
