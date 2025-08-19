import { Component, computed, inject } from '@angular/core';
import { FormService } from '../../services/form.service';
import { FieldTypesService } from '../../services/field-types.service';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatLabel, MatHint } from '@angular/material/form-field';
import { MatOption } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-field-settings',
  imports: [
    MatFormField,
    MatInput,
    MatSelect,
    MatCheckbox,
    FormsModule,
    MatLabel,
    MatHint,
    MatOption,
    MatIcon,
    CommonModule,
  ],
  template: `
    <div class="field-settings-container">
      @if(formService.selectField(); as selectField){
      <div class="settings-header">
        <h3 class="settings-title">
          <svg
            class="title-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          Field Properties
        </h3>
        <p class="settings-subtitle">Configure field settings and validation</p>
      </div>
      <div class="settings-content">
        <div class="settings-list">
          @for (setting of fieldSettings(); track setting.key) { @if
          (shouldShowSetting(setting, selectField)) { @switch (setting.type) {
          @case('text'){
          <mat-form-field appearance="outline" class="setting-field">
            <mat-label>{{ setting.label }}</mat-label>
            <input
              matInput
              [ngModel]="findValues()[setting.key]"
              (ngModelChange)="updateField(selectField.id, setting.key, $event)"
              [placeholder]="getPlaceholder(setting.key)"
            />
          </mat-form-field>
          } @case('number'){
          <mat-form-field appearance="outline" class="setting-field">
            <mat-label>{{ setting.label }}</mat-label>
            <input
              matInput
              type="number"
              [ngModel]="findValues()[setting.key]"
              (ngModelChange)="updateField(selectField.id, setting.key, $event)"
            />
          </mat-form-field>
          } @case('checkbox'){
          <div class="setting-checkbox">
            <mat-checkbox
              [checked]="findValues()[setting.key]"
              (change)="
                updateField(selectField.id, setting.key, $event.checked)
              "
              class="checkbox-input"
            >
            </mat-checkbox>
            <span class="checkbox-label">{{ setting.label }}</span>
          </div>
          } @case('select'){
          <mat-form-field appearance="outline" class="setting-field">
            <mat-label>{{ setting.label }}</mat-label>
            <mat-select
              [ngModel]="findValues()[setting.key]"
              (ngModelChange)="updateField(selectField.id, setting.key, $event)"
            >
              @for (option of setting.options; track option.value) {
              <mat-option [value]="option.value">{{ option.label }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          } } } }

          <!-- Validation Settings Section -->
          <div class="validation-section">
            <div class="validation-header">
              <h4 class="validation-title">
                <svg
                  class="validation-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                Validation Rules
              </h4>
              <button
                mat-icon-button
                (click)="toggleValidationExpanded()"
                class="expand-button"
              >
                <mat-icon>{{
                  validationExpanded ? 'expand_less' : 'expand_more'
                }}</mat-icon>
              </button>
            </div>

            @if (validationExpanded) {
            <div class="validation-content">
              <!-- Required Field -->
              <div class="validation-item">
                <mat-checkbox
                  [checked]="findValues().required"
                  (change)="
                    updateField(selectField.id, 'required', $event.checked)
                  "
                  class="validation-checkbox"
                >
                  Required field
                </mat-checkbox>
              </div>

              <!-- Min/Max Length (for text fields) -->
              @if (selectField.type === 'text' || selectField.type ===
              'textarea' || selectField.type === 'email' || selectField.type ===
              'password') {
              <div class="validation-row">
                <mat-form-field appearance="outline" class="validation-field">
                  <mat-label>Min Length</mat-label>
                  <input
                    matInput
                    type="number"
                    [ngModel]="findValues().minLength"
                    (ngModelChange)="
                      updateField(selectField.id, 'minLength', $event)
                    "
                    placeholder="0"
                  />
                </mat-form-field>
                <mat-form-field appearance="outline" class="validation-field">
                  <mat-label>Max Length</mat-label>
                  <input
                    matInput
                    type="number"
                    [ngModel]="findValues().maxLength"
                    (ngModelChange)="
                      updateField(selectField.id, 'maxLength', $event)
                    "
                    placeholder="100"
                  />
                </mat-form-field>
              </div>
              }

              <!-- Min/Max Value (for number fields) -->
              @if (selectField.type === 'number') {
              <div class="validation-row">
                <mat-form-field appearance="outline" class="validation-field">
                  <mat-label>Min Value</mat-label>
                  <input
                    matInput
                    type="number"
                    [ngModel]="findValues().minValue"
                    (ngModelChange)="
                      updateField(selectField.id, 'minValue', $event)
                    "
                    placeholder="0"
                  />
                </mat-form-field>
                <mat-form-field appearance="outline" class="validation-field">
                  <mat-label>Max Value</mat-label>
                  <input
                    matInput
                    type="number"
                    [ngModel]="findValues().maxValue"
                    (ngModelChange)="
                      updateField(selectField.id, 'maxValue', $event)
                    "
                    placeholder="100"
                  />
                </mat-form-field>
              </div>
              }

              <!-- Pattern Validation -->
              <div class="validation-item">
                <mat-form-field appearance="outline" class="validation-field">
                  <mat-label>Validation Pattern (Regex)</mat-label>
                  <input
                    matInput
                    [ngModel]="findValues().pattern"
                    (ngModelChange)="
                      updateField(selectField.id, 'pattern', $event)
                    "
                    placeholder="Enter regex pattern..."
                  />
                  <mat-hint>e.g., ^[A-Za-z]+$ for letters only</mat-hint>
                </mat-form-field>
              </div>

              <!-- Custom Validation Message -->
              <div class="validation-item">
                <mat-form-field appearance="outline" class="validation-field">
                  <mat-label>Custom Error Message</mat-label>
                  <textarea
                    matInput
                    rows="2"
                    [ngModel]="findValues().customErrorMessage"
                    (ngModelChange)="
                      updateField(selectField.id, 'customErrorMessage', $event)
                    "
                    placeholder="Enter custom validation message..."
                  ></textarea>
                </mat-form-field>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
      } @else {
      <div class="no-selection">
        <svg
          class="no-selection-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <h3 class="no-selection-title">No Field Selected</h3>
        <p class="no-selection-text">
          Select a field from the form to configure its properties
        </p>
      </div>
      }
    </div>
  `,
  styles: `
    .field-settings-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
      overflow: hidden;
    }

    .settings-header {
      padding: 20px 20px 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      flex-shrink: 0;
    }

    .settings-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 4px 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
    }

    .title-icon {
      width: 20px;
      height: 20px;
      color: #3b82f6;
    }

    .settings-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 400;
    }

    .settings-content {
      flex: 1;
      overflow: hidden;
      padding: 16px;
    }

    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
      overflow-y: auto;
      padding-right: 4px;
    }

    .settings-list::-webkit-scrollbar {
      width: 6px;
    }

    .settings-list::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }

    .settings-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .settings-list::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .setting-field {
      width: 100%;
    }

    .setting-checkbox {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
    }

    .checkbox-input {
      margin: 0;
    }

    .checkbox-label {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }

    .validation-section {
      border-top: 1px solid #e2e8f0;
      padding-top: 16px;
      margin-top: 8px;
    }

    .validation-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .validation-title {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1e293b;
    }

    .validation-icon {
      width: 16px;
      height: 16px;
      color: #10b981;
    }

    .expand-button {
      width: 32px;
      height: 32px;
      color: #64748b;
    }

    .expand-button:hover {
      background: #f1f5f9;
      color: #374151;
    }

    .validation-content {
      padding: 12px;
      background: #f8fafc;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .validation-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .validation-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }

    .validation-field {
      width: 100%;
    }

    .validation-checkbox {
      margin: 0;
    }

    .validation-checkbox ::ng-deep .mat-checkbox-label {
      font-size: 0.875rem;
      color: #374151;
      font-weight: 500;
    }

    .no-selection {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 40px 20px;
      text-align: center;
      color: #64748b;
    }

    .no-selection-icon {
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      color: #cbd5e1;
    }

    .no-selection-title {
      margin: 0 0 8px 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
    }

    .no-selection-text {
      margin: 0;
      font-size: 0.875rem;
      color: #64748b;
      max-width: 200px;
    }

    /* Responsive adjustments */
    @media (max-width: 1024px) {
      .settings-header {
        padding: 16px 16px 12px 16px;
      }

      .settings-content {
        padding: 12px;
      }

      .settings-title {
        font-size: 1rem;
      }

      .settings-subtitle {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 768px) {
      .settings-header {
        padding: 12px 12px 8px 12px;
      }

      .settings-content {
        padding: 8px;
      }

      .settings-list {
        gap: 12px;
      }

      .validation-row {
        grid-template-columns: 1fr;
        gap: 12px;
      }

      .validation-content {
        padding: 8px;
        gap: 8px;
      }
    }
  `,
})
export class FieldSettingsComponent {
  formService = inject(FormService);
  fieldTypesService = inject(FieldTypesService);

  validationExpanded = false;

  fieldSettings = computed(() => {
    const selectedField = this.formService.selectField();
    if (!selectedField) return [];

    const fieldType = this.fieldTypesService.getFieldType(selectedField.type);
    return fieldType?.settingsConfig || [];
  });

  findValues() {
    const selectedField = this.formService.selectField();
    return (selectedField as any) || {};
  }

  shouldShowSetting(setting: any, field: any): boolean {
    if (setting.condition) {
      return setting.condition(field);
    }
    return true;
  }

  getPlaceholder(key: string): string {
    const placeholders: { [key: string]: string } = {
      label: 'Enter field label...',
      placeholder: 'Enter placeholder text...',
      defaultValue: 'Enter default value...',
    };
    return placeholders[key] || '';
  }

  updateField(fieldId: string, key: string, value: any) {
    this.formService.updateField(fieldId, key, value);
  }

  toggleValidationExpanded() {
    this.validationExpanded = !this.validationExpanded;
  }
}
