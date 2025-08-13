import { Component } from '@angular/core';
import { FormElementsMenuComponent } from '../../components/form-elements-menu/form-elements-menu.component';
import { MainCanvasComponent } from '../../components/main-canvas/main-canvas.component';
import { FieldSettingsComponent } from '../../components/field-settings/field-settings.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-builder-page',
  imports: [
    FormElementsMenuComponent,
    MainCanvasComponent,
    FieldSettingsComponent,
    DragDropModule,
  ],
  template: `
    <div class="form-builder-container" cdkDropListGroup>
      <app-form-elements-menu class="sidebar-left" />
      <app-main-canvas class="main-content" />
      <app-field-settings class="sidebar-right" />
    </div>
  `,
  styles: [
    `
      .form-builder-container {
        display: flex;
        flex: 1;
        gap: 16px;
        padding: 16px;
        overflow: hidden;
        height: 100%;
      }

      .sidebar-left {
        width: 280px;
        min-width: 280px;
        flex-shrink: 0;
      }

      .main-content {
        flex: 1;
        min-width: 0;
      }

      .sidebar-right {
        width: 280px;
        min-width: 280px;
        flex-shrink: 0;
      }

      @media (max-width: 1200px) {
        .sidebar-left,
        .sidebar-right {
          width: 260px;
          min-width: 260px;
        }
      }

      @media (max-width: 1024px) {
        .form-builder-container {
          gap: 12px;
          padding: 12px;
        }

        .sidebar-left,
        .sidebar-right {
          width: 240px;
          min-width: 240px;
        }
      }
    `,
  ],
})
export class FormBuilderPageComponent {}
