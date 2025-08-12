import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormElementsMenuComponent } from './components/form-elements-menu/form-elements-menu.component';
import { MainCanvasComponent } from './components/main-canvas/main-canvas.component';
import { FieldSettingsComponent } from './components/field-settings/field-settings.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  imports: [
    FormElementsMenuComponent,
    MainCanvasComponent,
    FieldSettingsComponent,
    DragDropModule,
  ],
  template: `
    <div class="app-container">
      <div class="app-header">
        <div class="header-content">
          <h1 class="app-title">Angular Form Builder</h1>
          <p class="app-subtitle">Create your own forms with ease</p>
        </div>
      </div>
      <div class="app-main" cdkDropListGroup>
        <app-form-elements-menu class="sidebar-left" />
        <app-main-canvas class="main-content" />
        <app-field-settings class="sidebar-right" />
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: white;
        overflow: hidden;
      }

      .app-header {
        padding: 20px 24px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      .header-content {
        text-align: center;
      }

      .app-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: black;
        margin: 0 0 8px 0;
        margin-bottom: 20px;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .app-subtitle {
        font-size: 1.1rem;
        color: black;
        margin: 0;
        font-weight: 400;
      }

      .app-main {
        display: flex;
        flex: 1;
        gap: 16px;
        padding: 16px;
        overflow: hidden;
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
        .app-main {
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
export class AppComponent {
  title = 'formBuilder-custom';
}
