import { Injectable } from '@angular/core';
import {
  FormField,
  FormDefinition,
  AngularFormExport,
  ValidationRule,
} from '../models/field';

@Injectable({
  providedIn: 'root',
})
export class FormExportService {
  constructor() {}

  exportFormAsJSON(
    fields: FormField[],
    formName: string,
    description?: string
  ): FormDefinition {
    return {
      id: this.generateId(),
      name: formName,
      description: description || '',
      fields: fields.map((field) => ({ ...field })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  exportFormAsAngular(
    fields: FormField[],
    formName: string,
    componentName?: string
  ): AngularFormExport {
    const componentNameClean =
      componentName || this.generateComponentName(formName);
    const formNameClean = this.generateFormName(formName);

    return {
      componentName: componentNameClean,
      formName: formNameClean,
      htmlTemplate: this.generateHTMLTemplate(fields, formNameClean),
      typescriptCode: this.generateTypeScriptCode(
        fields,
        formNameClean,
        componentNameClean
      ),
      cssStyles: this.generateCSSStyles(),
      validators: this.generateValidators(fields),
    };
  }

  private generateId(): string {
    return 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateComponentName(formName: string): string {
    return (
      formName
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/^[a-z]/, (letter) => letter.toUpperCase()) + 'FormComponent'
    );
  }

  private generateFormName(formName: string): string {
    return (
      formName
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/^[a-z]/, (letter) => letter.toUpperCase()) + 'Form'
    );
  }

  private generateHTMLTemplate(fields: FormField[], formName: string): string {
    let template = `<div class="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
  <form [formGroup]="${formName}" (ngSubmit)="onSubmit()" class="space-y-6">
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-800 mb-2">{{ formTitle }}</h2>
      <p class="text-gray-600">{{ formDescription }}</p>
    </div>

    <div class="space-y-6">`;

    fields.forEach((field) => {
      template += this.generateFieldHTML(field, formName);
    });

    template += `
    </div>

    <div class="flex gap-4 justify-end pt-6 border-t border-gray-200">
      <button type="submit" class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors" [disabled]="${formName}.invalid">
        Submit
      </button>
      <button type="button" class="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors" (click)="onReset()">
        Reset
      </button>
    </div>
  </form>
</div>`;

    return template;
  }

  private generateFieldHTML(field: FormField, formName: string): string {
    const fieldName = this.generateFieldName(field.label);
    const hasError = `${formName}.get('${fieldName}')?.invalid && ${formName}.get('${fieldName}')?.touched`;
    const validators = this.generateFieldValidators(field);

    let html = `
      <div class="space-y-2">
        <label for="${fieldName}" class="block text-sm font-medium text-gray-700">${
      field.label
    }${field.required ? ' <span class="text-red-500">*</span>' : ''}</label>`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
        html += `
        <mat-form-field appearance="outline" class="w-full">
          <input
            matInput
            type="${field.inputType || field.type}"
            id="${fieldName}"
            formControlName="${fieldName}"
            placeholder="${field.placeholder || ''}"
            ${field.required ? 'required' : ''}
          />`;

        // Only add error messages if validators are configured
        if (validators !== '[]') {
          if (field.required) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['required']">
            ${field.label} is required
          </mat-error>`;
          }
          if (field.validations?.some((v) => v.type === 'minLength')) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['minlength']">
            ${field.label} must be at least {{ ${formName}.get('${fieldName}')?.errors?.['minlength']?.requiredLength }} characters
          </mat-error>`;
          }
          if (field.validations?.some((v) => v.type === 'maxLength')) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['maxlength']">
            ${field.label} must be at most {{ ${formName}.get('${fieldName}')?.errors?.['maxlength']?.requiredLength }} characters
          </mat-error>`;
          }
          if (field.validations?.some((v) => v.type === 'pattern')) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['pattern']">
            ${field.label} format is invalid
          </mat-error>`;
          }
          if (
            field.type === 'email' ||
            field.validations?.some((v) => v.type === 'email')
          ) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['email']">
            Please enter a valid email address
          </mat-error>`;
          }
        }

        html += `
        </mat-form-field>`;
        break;

      case 'number':
        html += `
        <mat-form-field appearance="outline" class="w-full">
          <input
            matInput
            type="number"
            id="${fieldName}"
            formControlName="${fieldName}"
            placeholder="${field.placeholder || ''}"
            ${field.min ? `min="${field.min}"` : ''}
            ${field.max ? `max="${field.max}"` : ''}
            ${field.step ? `step="${field.step}"` : ''}
            ${field.required ? 'required' : ''}
          />`;

        // Only add error messages if validators are configured
        if (validators !== '[]') {
          if (field.required) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['required']">
            ${field.label} is required
          </mat-error>`;
          }
          if (field.validations?.some((v) => v.type === 'min')) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['min']">
            ${field.label} must be at least {{ ${formName}.get('${fieldName}')?.errors?.['min']?.min }}
          </mat-error>`;
          }
          if (field.validations?.some((v) => v.type === 'max')) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['max']">
            ${field.label} must be at most {{ ${formName}.get('${fieldName}')?.errors?.['max']?.max }}
          </mat-error>`;
          }
        }

        html += `
        </mat-form-field>`;
        break;

      case 'textarea':
        html += `
        <mat-form-field appearance="outline" class="w-full">
          <textarea
            matInput
            id="${fieldName}"
            formControlName="${fieldName}"
            placeholder="${field.placeholder || ''}"
            rows="${field.rows || 3}"
            ${field.required ? 'required' : ''}
          ></textarea>`;

        // Only add error messages if validators are configured
        if (validators !== '[]') {
          if (field.required) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['required']">
            ${field.label} is required
          </mat-error>`;
          }
          if (field.validations?.some((v) => v.type === 'minLength')) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['minlength']">
            ${field.label} must be at least {{ ${formName}.get('${fieldName}')?.errors?.['minlength']?.requiredLength }} characters
          </mat-error>`;
          }
          if (field.validations?.some((v) => v.type === 'maxLength')) {
            html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['maxlength']">
            ${field.label} must be at most {{ ${formName}.get('${fieldName}')?.errors?.['maxlength']?.requiredLength }} characters
          </mat-error>`;
          }
        }

        html += `
        </mat-form-field>`;
        break;

      case 'select':
        html += `
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>${field.label}</mat-label>
          <mat-select id="${fieldName}" formControlName="${fieldName}" ${
          field.required ? 'required' : ''
        }>
            <mat-option value="">Select ${field.label}</mat-option>`;
        if (field.options) {
          field.options.forEach((option) => {
            html += `
            <mat-option value="${option.value}">${option.label}</mat-option>`;
          });
        }
        html += `
          </mat-select>`;

        // Only add error message if required is set
        if (field.required) {
          html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['required']">
            ${field.label} is required
          </mat-error>`;
        }

        html += `
        </mat-form-field>`;
        break;

      case 'checkbox':
        html += `
        <div class="flex items-center space-x-2">
          <mat-checkbox
            id="${fieldName}"
            formControlName="${fieldName}"
            ${field.required ? 'required' : ''}
          >
            ${field.label}
          </mat-checkbox>`;

        // Only add error message if required is set
        if (field.required) {
          html += `
          <div *ngIf="${formName}.get('${fieldName}')?.errors?.['required'] && ${formName}.get('${fieldName}')?.touched" class="text-red-500 text-sm">
            ${field.label} is required
          </div>`;
        }

        html += `
        </div>`;
        break;

      case 'radio':
        html += `
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">${
            field.label
          }</label>
          <mat-radio-group formControlName="${fieldName}" ${
          field.required ? 'required' : ''
        } class="flex flex-col space-y-2">`;
        if (field.options) {
          field.options.forEach((option, index) => {
            html += `
            <mat-radio-button value="${option.value}">${option.label}</mat-radio-button>`;
          });
        }
        html += `
          </mat-radio-group>`;

        // Only add error message if required is set
        if (field.required) {
          html += `
          <div *ngIf="${formName}.get('${fieldName}')?.errors?.['required'] && ${formName}.get('${fieldName}')?.touched" class="text-red-500 text-sm">
            ${field.label} is required
          </div>`;
        }

        html += `
        </div>`;
        break;

      case 'file':
        html += `
        <div class="space-y-2">
          <input
            type="file"
            id="${fieldName}"
            formControlName="${fieldName}"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            ${field.accept ? `accept="${field.accept}"` : ''}
            ${field.required ? 'required' : ''}
          />`;

        // Only add error message if required is set
        if (field.required) {
          html += `
          <div *ngIf="${formName}.get('${fieldName}')?.errors?.['required'] && ${formName}.get('${fieldName}')?.touched" class="text-red-500 text-sm">
            ${field.label} is required
          </div>`;
        }

        html += `
        </div>`;
        break;

      case 'button':
        html += `
        <div class="space-y-2">
          <button
            type="button"
            class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            (click)="on${this.generateMethodName(field.label)}()"
          >
            ${field.buttonText || field.label}
          </button>
        </div>`;
        break;

      case 'date':
        html += `
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>${field.label}</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            id="${fieldName}"
            formControlName="${fieldName}"
            placeholder="${field.placeholder || 'Choose a date'}"
            ${field.required ? 'required' : ''}
          />
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>`;

        // Only add error message if required is set
        if (field.required) {
          html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['required']">
            ${field.label} is required
          </mat-error>`;
        }

        html += `
        </mat-form-field>`;
        break;

      default:
        html += `
        <mat-form-field appearance="outline" class="w-full">
          <input
            matInput
            type="text"
            id="${fieldName}"
            formControlName="${fieldName}"
            placeholder="${field.placeholder || ''}"
            ${field.required ? 'required' : ''}
          />`;

        // Only add error message if required is set
        if (field.required) {
          html += `
          <mat-error *ngIf="${formName}.get('${fieldName}')?.errors?.['required']">
            ${field.label} is required
          </mat-error>`;
        }

        html += `
        </mat-form-field>`;
    }

    html += `
      </div>`;

    return html;
  }

  private generateTypeScriptCode(
    fields: FormField[],
    formName: string,
    componentName: string
  ): string {
    const formControls = fields
      .filter((field) => field.type !== 'button') // Exclude buttons from form controls
      .map((field) => {
        const fieldName = this.generateFieldName(field.label);
        const validators = this.generateFieldValidators(field);
        return `      ${fieldName}: [null, ${validators}]`;
      })
      .join(',\n');

    const fieldProperties = fields
      .filter((field) => field.type !== 'button') // Exclude buttons from form properties
      .map((field) => {
        const fieldName = this.generateFieldName(field.label);
        return `  ${fieldName} = this.${formName}.get('${fieldName}');`;
      })
      .join('\n');

    const methods = fields
      .filter((field) => field.type === 'button')
      .map(
        (field) => `
  on${this.generateMethodName(field.label)}() {
    // Handle ${field.label} button click
    console.log('${field.label} button clicked');
    this.submitForm();
  }

  submitForm() {
    console.log('Form submitted:', this.${formName}.value);
    // Handle form submission logic here
  }`
      )
      .join('');

    const htmlTemplate = this.generateHTMLTemplate(fields, formName);

    return `import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-${componentName.toLowerCase().replace('component', '')}',
  template: \`${htmlTemplate}\`,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule
  ],
  standalone: true
})
export class ${componentName} implements OnInit {
  ${formName}: FormGroup;
  formTitle = '${formName.replace('Form', '')}';
  formDescription = 'Please fill out the form below';

${fieldProperties}

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.${formName} = this.fb.group({
${formControls}
    });
  }

  onSubmit() {
    if (this.${formName}.valid) {
      console.log('Form submitted:', this.${formName}.value);
      // Handle form submission
    } else {
      this.markFormGroupTouched();
    }
  }

  onReset() {
    this.${formName}.reset();
  }

  private markFormGroupTouched() {
    Object.keys(this.${formName}.controls).forEach(key => {
      const control = this.${formName}.get(key);
      control?.markAsTouched();
    });
  }${methods}
}`;
  }

  private generateFieldValidators(field: FormField): string {
    const validators: string[] = [];

    // Only add required validator if explicitly set
    if (field.required) {
      validators.push('Validators.required');
    }

    // Only add validation rules if they are explicitly configured
    if (field.validations && field.validations.length > 0) {
      field.validations.forEach((validation) => {
        switch (validation.type) {
          case 'minLength':
            if (validation.value) {
              validators.push(`Validators.minLength(${validation.value})`);
            }
            break;
          case 'maxLength':
            if (validation.value) {
              validators.push(`Validators.maxLength(${validation.value})`);
            }
            break;
          case 'pattern':
            if (validation.value) {
              validators.push(`Validators.pattern(${validation.value})`);
            }
            break;
          case 'min':
            if (validation.value) {
              validators.push(`Validators.min(${validation.value})`);
            }
            break;
          case 'max':
            if (validation.value) {
              validators.push(`Validators.max(${validation.value})`);
            }
            break;
          case 'email':
            validators.push('Validators.email');
            break;
        }
      });
    }

    // Only add email validator if field type is email AND no other email validation exists
    if (field.type === 'email' && !validators.includes('Validators.email')) {
      validators.push('Validators.email');
    }

    return validators.length > 0 ? validators.join(', ') : '[]';
  }

  private generateValidators(fields: FormField[]): string {
    const customValidators = fields
      .filter((field) => field.customValidation)
      .map((field) => {
        const fieldName = this.generateFieldName(field.label);
        return `
// Custom validator for ${fieldName}
${fieldName}Validator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    ${field.customValidation}
  };
}`;
      })
      .join('');

    return customValidators;
  }

  private generateCSSStyles(): string {
    return `/* Tailwind CSS classes are used in the template */`;
  }

  private generateFieldName(label: string): string {
    return label
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[0-9]/, '_$&');
  }

  private generateMethodName(label: string): string {
    return label
      .replace(/[^a-zA-Z0-9]/g, '')
      .replace(/^[a-z]/, (letter) => letter.toUpperCase());
  }

  downloadJSON(formDefinition: FormDefinition): void {
    const dataStr = JSON.stringify(formDefinition, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formDefinition.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  downloadAngularFiles(exportData: AngularFormExport): void {
    // Download single inline component file
    this.downloadFile(
      `${exportData.componentName}.component.ts`,
      exportData.typescriptCode
    );
  }

  private downloadFile(filename: string, content: string): void {
    const dataBlob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}
