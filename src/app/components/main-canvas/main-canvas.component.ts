import { Component, inject, signal, input } from '@angular/core';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormPreviewComponent } from './form-preview/form-preview.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormService } from '../../services/form.service';
import { FormExportComponent } from '../form-export/form-export.component';

@Component({
  selector: 'app-main-canvas',
  imports: [
    FormEditorComponent,
    MatButtonToggleModule,
    FormPreviewComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
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
          @if(showExportButton()){
          <button
            mat-raised-button
            color="accent"
            (click)="openExportDialog()"
            class="export-btn"
          >
            <mat-icon>download</mat-icon>
            Export Form
          </button>
          }
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
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #e2e8f0;
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
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
    }

    .title-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      color: white;
    }

    .tab-group {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 4px;
      backdrop-filter: blur(10px);
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
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .tab-group ::ng-deep .mat-button-toggle-label-content {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-weight: 500;
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
      backdrop-filter: blur(10px);
    }

    .add-row-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .export-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.2s ease;
      backdrop-filter: blur(10px);
    }

    .export-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .canvas-content {
      flex: 1;
      overflow: hidden;
      background: #f8fafc;
      min-height: 0;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .canvas-header {
        padding: 16px 20px;
      }

      .header-content {
        gap: 16px;
      }

      .canvas-title {
        font-size: 1.125rem;
      }

      .title-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    @media (max-width: 1024px) {
      .canvas-header {
        padding: 12px 16px;
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }

      .header-content {
        justify-content: space-between;
        gap: 12px;
      }

      .header-actions {
        justify-content: center;
      }

      .tab-group ::ng-deep .mat-button-toggle-label-content {
        padding: 6px 12px;
        font-size: 0.875rem;
      }
    }

    @media (max-width: 768px) {
      .canvas-header {
        padding: 12px 16px;
      }

      .header-content {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
      }

      .canvas-title {
        font-size: 1rem;
        justify-content: center;
      }

      .title-icon {
        font-size: 1.125rem;
        width: 1.125rem;
        height: 1.125rem;
      }

      .header-actions {
        flex-direction: column;
        gap: 8px;
      }

      .add-row-btn,
      .export-btn {
        width: 100%;
        justify-content: center;
      }
    }
  `,
})
export class MainCanvasComponent {
  activeTab = signal<'preview' | 'editor'>('editor');
  formService = inject(FormService);
  private dialog = inject(MatDialog);

  // Input to control export button visibility - defaults to true for backward compatibility
  showExportButton = input<boolean>(true);

  openExportDialog(): void {
    const fields = this.formService.getFormFields();
    if (fields.length === 0) {
      alert('Please add some fields to the form before exporting.');
      return;
    }

    const dialogRef = this.dialog.open(FormExportComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      data: { fields },
    });
  }
}
