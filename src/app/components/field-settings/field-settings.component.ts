import { Component, computed, inject } from '@angular/core';
import { FormService } from '../../services/form.service';
import { FieldTypesService } from '../../services/field-types.service';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/select';

@Component({
  selector: 'app-field-settings',
  imports: [
    MatFormField,
    MatInput,
    MatSelect,
    MatCheckbox,
    FormsModule,
    MatLabel,
    MatOption,
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
      </div>
      }
    </div>
  `,
  styles: ``,
})
export class FieldSettingsComponent {
  formService = inject(FormService);
  fieldTypesService = inject(FieldTypesService);

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
