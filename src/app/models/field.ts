import { Type } from '@angular/core';

export interface FieldTypeDefinition {
  type: string;
  label: string;
  icon: string;
  defaultConfig: any;
  settingsConfig: fieldSettingsDefinition[];
  component: Type<unknown>;
}

export interface fieldSettingsDefinition {
  type:
    | 'text'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'textarea'
    | 'number'
    | 'date'
    | 'file'
    | 'email'
    | 'password'
    | 'tel'
    | 'url';
  key: string;
  label: string;
  options?: OptionItem[];
}

export interface OptionItem {
  label: string;
  value: string;
}

export interface ValidationRule {
  type:
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'min'
    | 'max'
    | 'email'
    | 'custom';
  value?: any;
  message: string;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  inputType?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  buttonText?: string;
  showCancelButton?: boolean;
  alignment?: 'left' | 'center' | 'right';
  // New properties for dynamic options
  useApiOptions?: boolean;
  apiEndpoint?: string;
  apiGroupId?: string;
  staticOptions?: string; // JSON string of static options
  customOptions?: string; // JSON string of custom options
  optionSource?: 'static' | 'api' | 'custom';
  // Validation properties
  validations?: ValidationRule[];
  customValidation?: string; // Custom validation function as string
}

export interface FormDefinition {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AngularFormExport {
  componentName: string;
  formName: string;
  htmlTemplate: string;
  typescriptCode: string;
  cssStyles: string;
  validators: string;
}
