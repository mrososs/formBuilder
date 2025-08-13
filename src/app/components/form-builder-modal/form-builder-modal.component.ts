import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormElementsMenuComponent } from '../form-elements-menu/form-elements-menu.component';
import { MainCanvasComponent } from '../main-canvas/main-canvas.component';
import { FieldSettingsComponent } from '../field-settings/field-settings.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-form-builder-modal',
  imports: [
    CommonModule,
    FormElementsMenuComponent,
    MainCanvasComponent,
    FieldSettingsComponent,
    DragDropModule,
  ],
  template: `
    <div class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">Configure Form for Workflow</h2>
          <button class="modal-close" (click)="closeModal()">×</button>
        </div>

        <div class="modal-body">
          <div class="form-builder-container" cdkDropListGroup>
            <app-form-elements-menu class="sidebar-left" />
            <app-main-canvas class="main-content" />
            <app-field-settings class="sidebar-right" />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeModal()">
            Cancel
          </button>
          <button class="btn btn-primary" (click)="saveForm()">
            Save Form
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        border-radius: 8px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04);
        width: 90vw;
        height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #e2e8f0;
        background: #f8fafc;
      }

      .modal-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
      }

      .modal-close {
        width: 32px;
        height: 32px;
        border: none;
        background: none;
        color: #64748b;
        cursor: pointer;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: all 0.2s;
      }

      .modal-close:hover {
        background: #f1f5f9;
        color: #374151;
      }

      .modal-body {
        flex: 1;
        overflow: hidden;
      }

      .form-builder-container {
        display: flex;
        height: 100%;
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

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 20px 24px;
        border-top: 1px solid #e2e8f0;
        background: #f8fafc;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: white;
        color: #374151;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
      }

      .btn:hover {
        background: #f9fafb;
        border-color: #9ca3af;
      }

      .btn-primary {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
      }

      .btn-primary:hover {
        background: #2563eb;
        border-color: #2563eb;
      }

      .btn-secondary {
        background: #6b7280;
        color: white;
        border-color: #6b7280;
      }

      .btn-secondary:hover {
        background: #4b5563;
        border-color: #4b5563;
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
export class FormBuilderModalComponent {
  @Input() workflowNode: any;
  @Output() formSaved = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  closeModal() {
    this.modalClosed.emit();
  }

  saveForm() {
    // Get the form data from the main canvas component
    // This would typically involve getting the form configuration
    const formData = {
      formId: this.workflowNode?.config?.formId || `form_${Date.now()}`,
      fields: [], // This would be populated from the form builder
      createdAt: new Date().toISOString(),
    };

    this.formSaved.emit({
      node: this.workflowNode,
      formData: formData,
    });
  }
}
