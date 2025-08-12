import { Component, inject, signal } from '@angular/core';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormPreviewComponent } from './form-preview/form-preview.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'app-main-canvas',
  imports: [
    FormEditorComponent,
    MatButtonToggleModule,
    FormPreviewComponent,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="main-canvas-container">
      <div class="canvas-header">
        <div class="header-content">
          <h3 class="canvas-title">
            <mat-icon class="title-icon">edit</mat-icon>
            Form Canvas
          </h3>
          <mat-button-toggle-group
            [(value)]="activeTab"
            hideSingleSelectionIndicator="true"
            class="tab-group"
          >
            <mat-button-toggle value="editor">
              <mat-icon>build</mat-icon>
              Editor
            </mat-button-toggle>
            <mat-button-toggle value="preview">
              <mat-icon>visibility</mat-icon>
              Preview
            </mat-button-toggle>
          </mat-button-toggle-group>
        </div>
        @if(activeTab()==='editor'){
        <div class="header-actions">
          <button
            mat-raised-button
            color="primary"
            (click)="formService.addRow()"
            class="add-row-btn"
          >
            <mat-icon>add_circle</mat-icon>
            Add Row
          </button>
        </div>
        }
      </div>
      <div class="canvas-content">
        @if (activeTab()==='editor') {
        <app-form-editor />
        }@else {
        <app-form-preview />
        }
      </div>
    </div>
  `,
  styles: `
    .main-canvas-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .canvas-header {
      padding: 20px 24px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .canvas-title {
      font-size: 24px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .tab-group {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 4px;
    }

    .tab-group ::ng-deep .mat-button-toggle {
      color: rgba(255, 255, 255, 0.8);
      border: none;
      background: transparent;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .tab-group ::ng-deep .mat-button-toggle.mat-button-toggle-checked {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .tab-group ::ng-deep .mat-button-toggle-label-content {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .add-row-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.2s ease;
    }

    .add-row-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .canvas-content {
      flex: 1;
      overflow: hidden;
      background: #f8fafc;
    }

    @media (max-width: 768px) {
      .canvas-header {
        padding: 16px 20px;
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header-content {
        justify-content: space-between;
      }

      .canvas-title {
        font-size: 20px;
      }

      .title-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
  `,
})
export class MainCanvasComponent {
  activeTab = signal<'preview' | 'editor'>('editor');
  formService = inject(FormService);
}
