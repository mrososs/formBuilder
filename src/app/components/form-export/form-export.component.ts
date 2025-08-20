import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import {
  FormField,
  FormDefinition,
  AngularFormExport,
} from '../../models/field';
import { FormExportService } from '../../services/form-export.service';

@Component({
  selector: 'app-form-export',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
  ],
  template: `
    <div class="export-dialog">
      <div class="export-header">
        <h2 class="export-title">Export Form</h2>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="export-content">
        <div class="form-settings">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Form Name</mat-label>
            <input
              matInput
              [(ngModel)]="formName"
              placeholder="Enter form name"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Form Description</mat-label>
            <textarea
              matInput
              [(ngModel)]="formDescription"
              placeholder="Enter form description"
              rows="3"
            ></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Component Name (Optional)</mat-label>
            <input
              matInput
              [(ngModel)]="componentName"
              placeholder="Enter component name"
            />
            <mat-hint>Leave empty to auto-generate from form name</mat-hint>
          </mat-form-field>
        </div>

        <div class="validation-section">
          <h3 class="section-title">Field Validation Settings</h3>
          <div class="fields-list">
            <div *ngFor="let field of fields" class="field-item">
              <div
                class="field-header"
                (click)="toggleFieldValidation(field.id)"
              >
                <mat-icon>{{ getFieldIcon(field.type) }}</mat-icon>
                <span class="field-label">{{ field.label }}</span>
                <mat-icon class="expand-icon">{{
                  isFieldExpanded(field.id) ? 'expand_less' : 'expand_more'
                }}</mat-icon>
              </div>

              <div *ngIf="isFieldExpanded(field.id)" class="field-validation">
                <div class="validation-options">
                  <mat-checkbox
                    [(ngModel)]="field.required"
                    class="validation-checkbox"
                  >
                    Required
                  </mat-checkbox>

                  <div
                    *ngIf="
                      field.type === 'text' ||
                      field.type === 'textarea' ||
                      field.type === 'email' ||
                      field.type === 'password'
                    "
                    class="validation-row"
                  >
                    <mat-form-field appearance="outline">
                      <mat-label>Min Length</mat-label>
                      <input
                        matInput
                        type="number"
                        [ngModel]="getValidationValue(field, 'minLength')"
                        (ngModelChange)="
                          setValidationValue(field, 'minLength', $event)
                        "
                        min="0"
                      />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Max Length</mat-label>
                      <input
                        matInput
                        type="number"
                        [ngModel]="getValidationValue(field, 'maxLength')"
                        (ngModelChange)="
                          setValidationValue(field, 'maxLength', $event)
                        "
                        min="0"
                      />
                    </mat-form-field>
                  </div>

                  <div *ngIf="field.type === 'number'" class="validation-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Min Value</mat-label>
                      <input
                        matInput
                        type="number"
                        [ngModel]="getValidationValue(field, 'min')"
                        (ngModelChange)="
                          setValidationValue(field, 'min', $event)
                        "
                      />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Max Value</mat-label>
                      <input
                        matInput
                        type="number"
                        [ngModel]="getValidationValue(field, 'max')"
                        (ngModelChange)="
                          setValidationValue(field, 'max', $event)
                        "
                      />
                    </mat-form-field>
                  </div>

                  <mat-form-field
                    *ngIf="field.type === 'text' || field.type === 'email'"
                    appearance="outline"
                    class="full-width"
                  >
                    <mat-label>Pattern (Regex)</mat-label>
                    <input
                      matInput
                      [ngModel]="getValidationValue(field, 'pattern')"
                      (ngModelChange)="
                        setValidationValue(field, 'pattern', $event)
                      "
                      placeholder="Enter regex pattern"
                    />
                    <mat-hint
                      >e.g., ^[a-zA-Z0-9._%+-]+&#64;[a-zA-Z0-9.-]+\\.[a-zA-Z]{{
                        '{'
                      }}2,{{ '}' }}$ for email</mat-hint
                    >
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Custom Validation Message</mat-label>
                    <textarea
                      matInput
                      [ngModel]="getValidationMessage(field)"
                      (ngModelChange)="setValidationMessage(field, $event)"
                      placeholder="Enter custom validation message"
                      rows="2"
                    ></textarea>
                  </mat-form-field>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="export-options">
          <h3 class="section-title">Export Format</h3>

          <div class="export-format-options">
            <div class="format-option">
              <mat-checkbox [(ngModel)]="exportJSON" class="format-checkbox">
                <div class="format-info">
                  <strong>JSON Format</strong>
                  <span class="format-description"
                    >Export form definition as JSON file</span
                  >
                </div>
              </mat-checkbox>
            </div>

            <div class="format-option">
              <mat-checkbox [(ngModel)]="exportAngular" class="format-checkbox">
                <div class="format-info">
                  <strong>Angular Component</strong>
                  <span class="format-description"
                    >Generate complete Angular component files</span
                  >
                </div>
              </mat-checkbox>
            </div>
          </div>

          <div class="fields-summary">
            <h4 class="summary-title">Form Fields ({{ fields.length }})</h4>
            <div class="fields-list">
              <div *ngFor="let field of fields" class="field-item">
                <mat-icon class="field-icon">{{
                  getFieldIcon(field.type)
                }}</mat-icon>
                <span class="field-label">{{ field.label }}</span>
                <span class="field-type">{{ field.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="export-actions">
        <button mat-button (click)="close()">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          (click)="exportForm()"
          [disabled]="!canExport()"
        >
          Export Form
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .export-dialog {
        width: 800px;
        max-width: 90vw;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 0.5rem;
        overflow: hidden;
      }

      .export-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
      }

      .export-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      .close-btn {
        color: #6b7280;
      }

      .export-content {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
      }

      .form-settings {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .full-width {
        width: 100%;
      }

      .validation-section {
        margin-bottom: 2rem;
      }

      .section-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 1rem 0;
      }

      .fields-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .field-item {
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        overflow: hidden;
      }

      .field-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #f9fafb;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .field-header:hover {
        background: #f3f4f6;
      }

      .field-label {
        flex: 1;
        font-weight: 500;
        color: #374151;
      }

      .expand-icon {
        color: #6b7280;
      }

      .field-validation {
        padding: 1rem;
        border-top: 1px solid #e5e7eb;
        background: white;
      }

      .validation-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .validation-checkbox {
        margin-bottom: 0.5rem;
      }

      .validation-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .export-options {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .export-format-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .format-option {
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        padding: 1rem;
      }

      .format-checkbox {
        width: 100%;
      }

      .format-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .format-description {
        font-size: 0.875rem;
        color: #6b7280;
      }

      .fields-summary {
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        padding: 1rem;
      }

      .summary-title {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 1rem 0;
      }

      .field-icon {
        font-size: 1.25rem;
        color: #6b7280;
      }

      .field-type {
        font-size: 0.75rem;
        color: #6b7280;
        text-transform: uppercase;
        background: #e5e7eb;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
      }

      .export-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid #e5e7eb;
        background: #f9fafb;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .export-dialog {
          width: 95vw;
          max-height: 90vh;
        }

        .validation-row {
          grid-template-columns: 1fr;
        }

        .export-actions {
          flex-direction: column;
        }

        .export-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class FormExportComponent {
  fields: FormField[] = [];

  formName = '';
  formDescription = '';
  componentName = '';
  exportJSON = true;
  exportAngular = false;
  expandedFields = new Set<string>();

  private formExportService = inject(FormExportService);
  private dialogRef = inject(MatDialogRef<FormExportComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);

  constructor() {
    // Get fields from dialog data
    this.fields = this.dialogData.fields || [];

    // Initialize form name from first field or default
    if (this.fields.length > 0) {
      this.formName = 'My Form';
    }
  }

  getFieldIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      text: 'input',
      email: 'email',
      password: 'lock',
      number: 'pin',
      textarea: 'subject',
      select: 'arrow_drop_down',
      checkbox: 'check_box',
      radio: 'radio_button_checked',
      file: 'attach_file',
      button: 'smart_button',
      tel: 'phone',
      url: 'link',
    };
    return iconMap[type] || 'input';
  }

  toggleFieldValidation(fieldId: string): void {
    if (this.expandedFields.has(fieldId)) {
      this.expandedFields.delete(fieldId);
    } else {
      this.expandedFields.add(fieldId);
    }
  }

  isFieldExpanded(fieldId: string): boolean {
    return this.expandedFields.has(fieldId);
  }

  getValidationValue(field: FormField, type: string): any {
    if (!field.validations) {
      field.validations = [];
    }

    const validation = field.validations.find((v) => v.type === type);
    return validation ? validation.value : null;
  }

  setValidationValue(field: FormField, type: string, value: any): void {
    if (!field.validations) {
      field.validations = [];
    }

    let validation = field.validations.find((v) => v.type === type);
    if (!validation) {
      validation = { type: type as any, value: value, message: '' };
      field.validations.push(validation);
    } else {
      validation.value = value;
    }
  }

  getValidationMessage(field: FormField): string {
    if (!field.validations) {
      field.validations = [];
    }

    const validation = field.validations.find((v) => v.type === 'required');
    return validation ? validation.message : '';
  }

  setValidationMessage(field: FormField, message: string): void {
    if (!field.validations) {
      field.validations = [];
    }

    let validation = field.validations.find((v) => v.type === 'required');
    if (!validation) {
      validation = { type: 'required', value: true, message: message };
      field.validations.push(validation);
    } else {
      validation.message = message;
    }
  }

  canExport(): boolean {
    return (
      this.formName.trim() !== '' && (this.exportJSON || this.exportAngular)
    );
  }

  exportForm(): void {
    if (!this.canExport()) return;

    try {
      // Create FormDefinition object
      const formDefinition: FormDefinition = {
        id: this.generateFormId(),
        name: this.formName,
        description: this.formDescription,
        fields: this.fields,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (this.exportJSON) {
        const jsonData = this.formExportService.exportToJson(formDefinition);
        this.downloadFile(
          jsonData,
          `${this.formName.replace(/[^a-zA-Z0-9]/g, '_')}.json`,
          'application/json'
        );
      }

      if (this.exportAngular) {
        const exportData =
          this.formExportService.exportToAngular(formDefinition);
        this.downloadAngularFiles(exportData);
      }

      this.close();
    } catch (error) {
      console.error('Export failed:', error);
      // You could add a toast notification here
    }
  }

  private generateFormId(): string {
    return 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private downloadFile(
    content: string,
    filename: string,
    contentType: string
  ): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  private downloadAngularFiles(exportData: AngularFormExport): void {
    // Download HTML file
    this.downloadFile(
      exportData.htmlTemplate,
      `${exportData.componentName.toLowerCase()}.component.html`,
      'text/html'
    );

    // Download TypeScript file
    this.downloadFile(
      exportData.typescriptCode,
      `${exportData.componentName.toLowerCase()}.component.ts`,
      'text/plain'
    );

    // Download CSS file
    this.downloadFile(
      exportData.cssStyles,
      `${exportData.componentName.toLowerCase()}.component.css`,
      'text/css'
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
