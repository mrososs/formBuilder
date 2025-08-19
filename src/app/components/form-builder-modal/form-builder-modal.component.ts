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
            <app-main-canvas class="main-content" [showExportButton]="false" />
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
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 16px;
        backdrop-filter: blur(4px);
      }

      .modal-content {
        background: white;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25),
          0 0 0 1px rgba(0, 0, 0, 0.05);
        width: 100%;
        max-width: 1400px;
        height: 100%;
        max-height: 95vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 1px solid #e2e8f0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        flex-shrink: 0;
      }

      .modal-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: white;
      }

      .modal-close {
        width: 36px;
        height: 36px;
        border: none;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        cursor: pointer;
        font-size: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s;
        backdrop-filter: blur(10px);
      }

      .modal-close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.05);
      }

      .modal-body {
        flex: 1;
        overflow: hidden;
        min-height: 0;
      }

      .form-builder-container {
        display: flex;
        height: 100%;
        gap: 0;
        overflow: hidden;
      }

      .sidebar-left {
        width: 280px;
        min-width: 280px;
        flex-shrink: 0;
        border-right: 1px solid #e2e8f0;
        background: #f8fafc;
      }

      .main-content {
        flex: 1;
        min-width: 0;
        overflow: hidden;
      }

      .sidebar-right {
        width: 280px;
        min-width: 280px;
        flex-shrink: 0;
        border-left: 1px solid #e2e8f0;
        background: #f8fafc;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 20px 24px;
        border-top: 1px solid #e2e8f0;
        background: #f8fafc;
        flex-shrink: 0;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 20px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #374151;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
        min-height: 40px;
      }

      .btn:hover {
        background: #f9fafb;
        border-color: #9ca3af;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

      /* Responsive Design */
      @media (max-width: 1400px) {
        .modal-content {
          max-width: 95vw;
          max-height: 90vh;
        }

        .sidebar-left,
        .sidebar-right {
          width: 260px;
          min-width: 260px;
        }
      }

      @media (max-width: 1200px) {
        .sidebar-left,
        .sidebar-right {
          width: 240px;
          min-width: 240px;
        }

        .form-builder-container {
          gap: 0;
        }
      }

      @media (max-width: 1024px) {
        .modal-overlay {
          padding: 8px;
        }

        .modal-content {
          max-width: 98vw;
          max-height: 95vh;
        }

        .form-builder-container {
          flex-direction: column;
          height: 100%;
        }

        .sidebar-left,
        .sidebar-right {
          width: 100%;
          min-width: 100%;
          max-height: 200px;
          overflow-y: auto;
        }

        .sidebar-left {
          border-right: none;
          border-bottom: 1px solid #e2e8f0;
        }

        .sidebar-right {
          border-left: none;
          border-top: 1px solid #e2e8f0;
        }

        .main-content {
          flex: 1;
          min-height: 0;
        }
      }

      @media (max-width: 768px) {
        .modal-header {
          padding: 16px 20px;
        }

        .modal-title {
          font-size: 1.125rem;
        }

        .modal-footer {
          padding: 16px 20px;
        }

        .btn {
          padding: 8px 16px;
          font-size: 0.8rem;
        }
      }

      /* Animation for modal appearance */
      .modal-overlay {
        animation: fadeIn 0.3s ease-out;
      }

      .modal-content {
        animation: slideIn 0.3s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
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
    const formData = {
      formId: this.workflowNode?.config?.formId || `form_${Date.now()}`,
      title: this.workflowNode?.title || 'Workflow Form',
      description: this.workflowNode?.description || 'Form for workflow step',
      fields: this.getFormFields(), // Get fields from form builder
      createdAt: new Date().toISOString(),
    };

    this.formSaved.emit({
      node: this.workflowNode,
      formData: formData,
    });
  }

  private getFormFields(): any[] {
    // This would typically get fields from the form builder's state
    // For now, return sample fields based on the node type
    const nodeType = this.workflowNode?.type || 'form';

    switch (nodeType) {
      case 'safety-incident-report':
        return [
          {
            name: 'incidentType',
            type: 'select',
            label: 'Incident Type',
            required: true,
            options: [
              { value: 'injury', label: 'Injury' },
              { value: 'near-miss', label: 'Near Miss' },
              { value: 'property-damage', label: 'Property Damage' },
              { value: 'environmental', label: 'Environmental' },
            ],
          },
          {
            name: 'location',
            type: 'text',
            label: 'Incident Location',
            required: true,
            placeholder: 'Enter incident location',
          },
          {
            name: 'dateTime',
            type: 'datetime-local',
            label: 'Date and Time',
            required: true,
          },
          {
            name: 'description',
            type: 'textarea',
            label: 'Incident Description',
            required: true,
            placeholder: 'Describe what happened in detail',
          },
          {
            name: 'witnesses',
            type: 'textarea',
            label: 'Witnesses',
            required: false,
            placeholder: 'List any witnesses',
          },
        ];

      case 'permit-application':
        return [
          {
            name: 'permitType',
            type: 'select',
            label: 'Permit Type',
            required: true,
            options: [
              { value: 'hot-work', label: 'Hot Work Permit' },
              { value: 'confined-space', label: 'Confined Space Entry' },
              { value: 'working-at-height', label: 'Working at Height' },
              { value: 'electrical', label: 'Electrical Work' },
            ],
          },
          {
            name: 'workLocation',
            type: 'text',
            label: 'Work Location',
            required: true,
            placeholder: 'Enter work location',
          },
          {
            name: 'startDate',
            type: 'date',
            label: 'Start Date',
            required: true,
          },
          {
            name: 'endDate',
            type: 'date',
            label: 'End Date',
            required: true,
          },
          {
            name: 'workDescription',
            type: 'textarea',
            label: 'Work Description',
            required: true,
            placeholder: 'Describe the work to be performed',
          },
          {
            name: 'safetyMeasures',
            type: 'textarea',
            label: 'Safety Measures',
            required: true,
            placeholder: 'List safety measures to be implemented',
          },
        ];

      case 'audit-schedule':
        return [
          {
            name: 'auditType',
            type: 'select',
            label: 'Audit Type',
            required: true,
            options: [
              { value: 'safety', label: 'Safety Audit' },
              { value: 'environmental', label: 'Environmental Audit' },
              { value: 'compliance', label: 'Compliance Audit' },
              { value: 'process', label: 'Process Audit' },
            ],
          },
          {
            name: 'auditScope',
            type: 'text',
            label: 'Audit Scope',
            required: true,
            placeholder: 'Define audit scope',
          },
          {
            name: 'auditDate',
            type: 'date',
            label: 'Audit Date',
            required: true,
          },
          {
            name: 'auditors',
            type: 'textarea',
            label: 'Auditors',
            required: true,
            placeholder: 'List assigned auditors',
          },
          {
            name: 'objectives',
            type: 'textarea',
            label: 'Audit Objectives',
            required: true,
            placeholder: 'Define audit objectives',
          },
        ];

      case 'contact-registration':
        return [
          {
            name: 'contactName',
            type: 'text',
            label: 'Contact Name',
            required: true,
            placeholder: 'Enter full name',
          },
          {
            name: 'relationship',
            type: 'select',
            label: 'Relationship',
            required: true,
            options: [
              { value: 'spouse', label: 'Spouse' },
              { value: 'parent', label: 'Parent' },
              { value: 'sibling', label: 'Sibling' },
              { value: 'friend', label: 'Friend' },
              { value: 'other', label: 'Other' },
            ],
          },
          {
            name: 'phoneNumber',
            type: 'tel',
            label: 'Phone Number',
            required: true,
            placeholder: 'Enter phone number',
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email Address',
            required: false,
            placeholder: 'Enter email address',
          },
          {
            name: 'address',
            type: 'textarea',
            label: 'Address',
            required: false,
            placeholder: 'Enter full address',
          },
        ];

      case 'msds-upload':
        return [
          {
            name: 'chemicalName',
            type: 'text',
            label: 'Chemical Name',
            required: true,
            placeholder: 'Enter chemical name',
          },
          {
            name: 'manufacturer',
            type: 'text',
            label: 'Manufacturer',
            required: true,
            placeholder: 'Enter manufacturer name',
          },
          {
            name: 'casNumber',
            type: 'text',
            label: 'CAS Number',
            required: false,
            placeholder: 'Enter CAS number',
          },
          {
            name: 'msdsFile',
            type: 'file',
            label: 'MSDS Document',
            required: true,
            accept: '.pdf,.doc,.docx',
          },
          {
            name: 'hazards',
            type: 'textarea',
            label: 'Hazards',
            required: true,
            placeholder: 'List known hazards',
          },
        ];

      default:
        return [
          {
            name: 'field1',
            type: 'text',
            label: 'Field 1',
            required: true,
            placeholder: 'Enter value',
          },
          {
            name: 'field2',
            type: 'textarea',
            label: 'Field 2',
            required: false,
            placeholder: 'Enter description',
          },
        ];
    }
  }
}
