import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Template-Driven Forms Playground',
    loadComponent:
      () => import('./pages/template-forms-page/template-forms-page.component')
        .then(m => m.TemplateFormsPageComponent)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
