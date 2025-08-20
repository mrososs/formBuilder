import { Routes } from '@angular/router';
import { FormBuilderPageComponent } from './pages/form-builder-page/form-builder-page.component';
import { ActorsManagementComponent } from './components/actors-management/actors-management.component';
import { ActorsExampleComponent } from './examples/actors-example.component';

export const routes: Routes = [
  { path: '', redirectTo: '/form-builder', pathMatch: 'full' },
  {
    path: 'form-builder',
    component: FormBuilderPageComponent,
  },
  {
    path: 'actors-management',
    component: ActorsManagementComponent,
  },
  {
    path: 'actors-example',
    component: ActorsExampleComponent,
  },
];
