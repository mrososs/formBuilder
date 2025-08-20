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
  // Enhanced properties for dynamic options
  useApiOptions?: boolean;
  apiEndpoint?: string;
  // Actor-based data source (replaces API groups)
  actorId?: string; // ID of the actor to use for data
  staticOptions?: string; // JSON string of static options
  customOptions?: string; // JSON string of custom options
  optionSource?: 'static' | 'actors' | 'custom' | 'external';
  // External API configuration
  apiConfig?: {
    url?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    params?: Record<string, any>;
    dataPath?: string; // JSON path to extract options from response
    valueField?: string; // Field name for value (default: 'value')
    labelField?: string; // Field name for label (default: 'label')
    transformFunction?: string; // Custom transform function as string
  };
  // Multi-select properties for radio buttons
  allowMultiple?: boolean;
  maxSelections?: number;
  minSelections?: number;
  // Validation properties
  validations?: ValidationRule[];
  customValidation?: string; // Custom validation function as string
  // Export properties
  actorInfo?: {
    actorId: string;
    actorName: string;
    actorData: any;
  };
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
