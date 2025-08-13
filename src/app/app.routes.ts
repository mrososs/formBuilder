import { Routes } from '@angular/router';
import { FormBuilderPageComponent } from './pages/form-builder-page/form-builder-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/form-builder', pathMatch: 'full' },
  {
    path: 'form-builder',
    component: FormBuilderPageComponent,
  },
];
