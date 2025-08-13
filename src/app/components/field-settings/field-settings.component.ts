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
    <div
      class="p-4 bg-white rounded-lg h-[calc(100vh-150px)] overflow-y-auto border-gray-200 shadow-sm"
    >
      @if(formService.selectField(); as selectField){
      <h3 class="text-xl font-md mb-6">Field Properties</h3>
      <div class="flex flex-col gap-6">
        @for (setting of fieldSettings(); track setting.key) { @if
        (shouldShowSetting(setting, selectField)) { @switch (setting.type) {
        @case('text'){
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ setting.label }}</mat-label>
          <input
            matInput
            [ngModel]="findValues()[setting.key]"
            (ngModelChange)="updateField(selectField.id, setting.key, $event)"
            [placeholder]="getPlaceholder(setting.key)"
          />
        </mat-form-field>
        } @case('number'){
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ setting.label }}</mat-label>
          <input
            matInput
            type="number"
            [ngModel]="findValues()[setting.key]"
            (ngModelChange)="updateField(selectField.id, setting.key, $event)"
          />
        </mat-form-field>
        } @case('checkbox'){
        <div class="flex items-center">
          <mat-checkbox
            [checked]="findValues()[setting.key]"
            (change)="updateField(selectField.id, setting.key, $event.checked)"
            class="mr-2"
          >
          </mat-checkbox>
          <span>{{ setting.label }}</span>
        </div>
        } @case('select'){
        <mat-form-field appearance="outline" class="w-full">
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
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-800">
              Validation Rules
            </h4>
            <button
              mat-icon-button
              (click)="toggleValidationExpanded()"
              class="text-gray-600 hover:text-gray-800"
            >
              <mat-icon>{{
                validationExpanded ? 'expand_less' : 'expand_more'
              }}</mat-icon>
            </button>
          </div>

          @if (validationExpanded) {
          <div class="validation-content space-y-4">
            <!-- Required Field -->
            <div class="flex items-center">
              <mat-checkbox
                [checked]="selectField.required"
                (change)="
                  updateField(selectField.id, 'required', $event.checked)
                "
                class="mr-2"
              >
              </mat-checkbox>
              <span class="text-sm font-medium text-gray-700"
                >Required Field</span
              >
            </div>

            <!-- Min/Max Length for text fields -->
            @if (selectField.type === 'text' || selectField.type === 'textarea'
            || selectField.type === 'email' || selectField.type === 'password')
            {
            <div class="grid grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Min Length</mat-label>
                <input
                  matInput
                  type="number"
                  [ngModel]="getValidationValue(selectField, 'minLength')"
                  (ngModelChange)="
                    setValidationValue(selectField.id, 'minLength', $event)
                  "
                  min="0"
                />
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Max Length</mat-label>
                <input
                  matInput
                  type="number"
                  [ngModel]="getValidationValue(selectField, 'maxLength')"
                  (ngModelChange)="
                    setValidationValue(selectField.id, 'maxLength', $event)
                  "
                  min="0"
                />
              </mat-form-field>
            </div>
            }

            <!-- Min/Max Value for number fields -->
            @if (selectField.type === 'number') {
            <div class="grid grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Min Value</mat-label>
                <input
                  matInput
                  type="number"
                  [ngModel]="getValidationValue(selectField, 'min')"
                  (ngModelChange)="
                    setValidationValue(selectField.id, 'min', $event)
                  "
                />
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Max Value</mat-label>
                <input
                  matInput
                  type="number"
                  [ngModel]="getValidationValue(selectField, 'max')"
                  (ngModelChange)="
                    setValidationValue(selectField.id, 'max', $event)
                  "
                />
              </mat-form-field>
            </div>
            }

            <!-- Pattern validation for text and email fields -->
            @if (selectField.type === 'text' || selectField.type === 'email') {
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Pattern (Regex)</mat-label>
              <input
                matInput
                [ngModel]="getValidationValue(selectField, 'pattern')"
                (ngModelChange)="
                  setValidationValue(selectField.id, 'pattern', $event)
                "
                placeholder="Enter regex pattern"
              />
              <mat-hint
                >e.g., ^[a-zA-Z0-9._%+-]+&#64;[a-zA-Z0-9.-]+\\.[a-zA-Z]{{
                  '{'
                }}2,{{ '}' }}$ for email</mat-hint
              >
            </mat-form-field>
            }

            <!-- Custom validation message -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Custom Validation Message</mat-label>
              <textarea
                matInput
                [ngModel]="getValidationMessage(selectField)"
                (ngModelChange)="setValidationMessage(selectField.id, $event)"
                placeholder="Enter custom validation message"
                rows="2"
              ></textarea>
            </mat-form-field>
          </div>
          }
        </div>
      </div>
      }
    </div>
  `,
  styles: `
    .validation-section {
      border-top: 1px solid #e5e7eb;
      padding-top: 1rem;
    }

    .validation-content {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 0.375rem;
      border: 1px solid #e5e7eb;
    }

    @media (max-width: 768px) {
      .grid-cols-2 {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class FieldSettingsComponent {
  formService = inject(FormService);
  fieldTypesService = inject(FieldTypesService);

  validationExpanded = false;

  fieldSettings = computed(() => {
    const field = this.formService.selectField();
    if (!field) {
      return [];
    }
    const fieldDef = this.fieldTypesService.getFieldType(field.type);
    return fieldDef?.settingsConfig ?? [];
  });

  findValues = computed(() => {
    const field = this.formService.selectField();
    if (!field) {
      return {};
    }
    return field as any;
  });

  updateField(fieldId: string, key: string, value: any) {
    this.formService.updateField(fieldId, key, value);
  }

  toggleValidationExpanded() {
    this.validationExpanded = !this.validationExpanded;
  }

  getValidationValue(field: any, type: string): any {
    if (!field.validations) {
      field.validations = [];
    }

    const validation = field.validations.find((v: any) => v.type === type);
    return validation ? validation.value : null;
  }

  setValidationValue(fieldId: string, type: string, value: any): void {
    const field = this.formService.selectField();
    if (!field) return;

    if (!field.validations) {
      field.validations = [];
    }

    let validation = field.validations.find((v: any) => v.type === type);
    if (!validation) {
      validation = { type: type as any, value: value, message: '' };
      field.validations.push(validation);
    } else {
      validation.value = value;
    }

    // Update the field in the service
    this.formService.updateField(fieldId, 'validations', field.validations);
  }

  getValidationMessage(field: any): string {
    if (!field.validations) {
      field.validations = [];
    }

    const validation = field.validations.find(
      (v: any) => v.type === 'required'
    );
    return validation ? validation.message : '';
  }

  setValidationMessage(fieldId: string, message: string): void {
    const field = this.formService.selectField();
    if (!field) return;

    if (!field.validations) {
      field.validations = [];
    }

    let validation = field.validations.find((v: any) => v.type === 'required');
    if (!validation) {
      validation = { type: 'required', value: true, message: message };
      field.validations.push(validation);
    } else {
      validation.message = message;
    }

    // Update the field in the service
    this.formService.updateField(fieldId, 'validations', field.validations);
  }

  shouldShowSetting(setting: any, field: any): boolean {
    // Show Static Options setting only when optionSource is 'static'
    if (setting.key === 'staticOptions') {
      return field.optionSource === 'static';
    }

    // Show API Group setting only when optionSource is 'api'
    if (setting.key === 'apiGroupId') {
      return field.optionSource === 'api';
    }

    // Show Custom Options setting only when optionSource is 'custom'
    if (setting.key === 'customOptions') {
      return field.optionSource === 'custom';
    }

    // Show all other settings
    return true;
  }

  getPlaceholder(key: string): string {
    switch (key) {
      case 'staticOptions':
        return 'Option 1, Option 2, Option 3';
      case 'customOptions':
        return '[{"value": "option1", "label": "Option 1"}, {"value": "option2", "label": "Option 2"}]';
      default:
        return '';
    }
  }
}
