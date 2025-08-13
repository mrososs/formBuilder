import { Routes } from '@angular/router';
import { FormBuilderPageComponent } from './pages/form-builder-page/form-builder-page.component';
import { WorkflowDesignerPageComponent } from './pages/workflow-designer-page/workflow-designer-page.component';
import { WorkflowFormPageComponent } from './pages/workflow-form-page/workflow-form-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/form-builder', pathMatch: 'full' },
  {
    path: 'form-builder',
    component: FormBuilderPageComponent,
  },
  {
    path: 'workflow-designer',
    component: WorkflowDesignerPageComponent,
  },
  {
    path: 'workflow-form/:workflowId',
    component: WorkflowFormPageComponent,
  },
];
