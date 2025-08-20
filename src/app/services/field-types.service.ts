import { Injectable } from '@angular/core';
import { FieldTypeDefinition } from '../models/field';
import { SelectFieldComponent } from '../components/field-types/select-field/select-field.component';
import { MultiselectFieldComponent } from '../components/field-types/multiselect-field/multiselect-field.component';
import { RadioFieldComponent } from '../components/field-types/radio-field/radio-field.component';
import { TextFieldComponent } from '../components/field-types/text-field/text-field.component';
import { TextareaFieldComponent } from '../components/field-types/textarea-field/textarea-field.component';
import { NumberFieldComponent } from '../components/field-types/number-field/number-field.component';
import { EmailFieldComponent } from '../components/field-types/email-field/email-field.component';
import { DateFieldComponent } from '../components/field-types/date-field/date-field.component';
import { FileFieldComponent } from '../components/field-types/file-field/file-field.component';
import { CheckboxFieldComponent } from '../components/field-types/checkbox-field/checkbox-field.component';
import { ButtonFieldComponent } from '../components/field-types/button-field/button-field.component';

const SELECT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'select',
  label: 'Dropdown',
  icon: 'arrow_drop_down',
  defaultConfig: {
    label: 'Dropdown',
    required: false,
    placeholder: 'Select an option',
    optionSource: 'actors',
    staticOptions: 'Option 1, Option 2, Option 3, Option 4',
    actorId: 'employees',
    customOptions: '',
    apiConfig: {
      url: '',
      method: 'GET',
      headers: {},
      params: {},
      dataPath: '',
      valueField: 'value',
      labelField: 'label',
      transformFunction: '',
    },
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    {
      type: 'select',
      label: 'Option Source',
      key: 'optionSource',
      options: [
        { label: 'Static Options', value: 'static' },
        { label: 'Company Actors', value: 'actors' },
        { label: 'External API', value: 'external' },
        { label: 'Custom Options', value: 'custom' },
      ],
    },
    {
      type: 'text',
      label: 'Static Options (comma-separated)',
      key: 'staticOptions',
    },
    {
      type: 'select',
      label: 'Company Actor',
      key: 'actorId',
      options: [
        { label: 'Employees', value: 'employees' },
        { label: 'Managers', value: 'managers' },
        { label: 'Departments', value: 'departments' },
        { label: 'Products', value: 'products' },
        { label: 'Customers', value: 'customers' },
        { label: 'Suppliers', value: 'suppliers' },
        { label: 'Locations', value: 'locations' },
      ],
    },
    { type: 'text', label: 'External API URL', key: 'apiConfig.url' },
    {
      type: 'select',
      label: 'HTTP Method',
      key: 'apiConfig.method',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
      ],
    },
    { type: 'text', label: 'Data Path (JSON path)', key: 'apiConfig.dataPath' },
    { type: 'text', label: 'Value Field', key: 'apiConfig.valueField' },
    { type: 'text', label: 'Label Field', key: 'apiConfig.labelField' },
    { type: 'text', label: 'Custom Options (JSON)', key: 'customOptions' },
  ],
  component: SelectFieldComponent,
};

const MULTISELECT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'multiselect',
  label: 'Multi Select',
  icon: 'checklist',
  defaultConfig: {
    label: 'Multi Select',
    required: false,
    placeholder: 'Choose options',
    optionSource: 'static',
    staticOptions: 'Option 1, Option 2, Option 3, Option 4',
    actorId: '',
    customOptions: '',
    maxSelections: 5,
    apiConfig: {
      url: '',
      method: 'GET',
      headers: {},
      params: {},
      dataPath: '',
      valueField: 'value',
      labelField: 'label',
      transformFunction: '',
    },
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    { type: 'number', label: 'Max Selections', key: 'maxSelections' },
    {
      type: 'select',
      label: 'Option Source',
      key: 'optionSource',
      options: [
        { label: 'Static Options', value: 'static' },
        { label: 'Company Actors', value: 'actors' },
        { label: 'External API', value: 'external' },
        { label: 'Custom Options', value: 'custom' },
      ],
    },
    {
      type: 'text',
      label: 'Static Options (comma-separated)',
      key: 'staticOptions',
    },
    {
      type: 'select',
      label: 'Company Actor',
      key: 'actorId',
      options: [
        { label: 'Employees', value: 'employees' },
        { label: 'Managers', value: 'managers' },
        { label: 'Departments', value: 'departments' },
        { label: 'Products', value: 'products' },
        { label: 'Customers', value: 'customers' },
        { label: 'Suppliers', value: 'suppliers' },
        { label: 'Locations', value: 'locations' },
      ],
    },
    { type: 'text', label: 'External API URL', key: 'apiConfig.url' },
    {
      type: 'select',
      label: 'HTTP Method',
      key: 'apiConfig.method',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
      ],
    },
    { type: 'text', label: 'Data Path (JSON path)', key: 'apiConfig.dataPath' },
    { type: 'text', label: 'Value Field', key: 'apiConfig.valueField' },
    { type: 'text', label: 'Label Field', key: 'apiConfig.labelField' },
    { type: 'text', label: 'Custom Options (JSON)', key: 'customOptions' },
  ],
  component: MultiselectFieldComponent,
};

const RADIO_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'radio',
  label: 'Radio Buttons',
  icon: 'radio_button_checked',
  defaultConfig: {
    label: 'Radio Buttons',
    required: false,
    optionSource: 'actors',
    staticOptions: 'Option 1, Option 2, Option 3, Option 4',
    actorId: 'employees',
    customOptions: '',
    allowMultiple: false,
    maxSelections: 3,
    minSelections: 1,
    apiConfig: {
      url: '',
      method: 'GET',
      headers: {},
      params: {},
      dataPath: '',
      valueField: 'value',
      labelField: 'label',
      transformFunction: '',
    },
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    {
      type: 'checkbox',
      label: 'Allow Multiple Selections',
      key: 'allowMultiple',
    },
    { type: 'number', label: 'Min Selections', key: 'minSelections' },
    { type: 'number', label: 'Max Selections', key: 'maxSelections' },
    {
      type: 'select',
      label: 'Option Source',
      key: 'optionSource',
      options: [
        { label: 'Static Options', value: 'static' },
        { label: 'Company Actors', value: 'actors' },
        { label: 'External API', value: 'external' },
        { label: 'Custom Options', value: 'custom' },
      ],
    },
    {
      type: 'text',
      label: 'Static Options (comma-separated)',
      key: 'staticOptions',
    },
    {
      type: 'select',
      label: 'Company Actor',
      key: 'actorId',
      options: [
        { label: 'Employees', value: 'employees' },
        { label: 'Managers', value: 'managers' },
        { label: 'Departments', value: 'departments' },
        { label: 'Products', value: 'products' },
        { label: 'Customers', value: 'customers' },
        { label: 'Suppliers', value: 'suppliers' },
        { label: 'Locations', value: 'locations' },
      ],
    },
    { type: 'text', label: 'External API URL', key: 'apiConfig.url' },
    {
      type: 'select',
      label: 'HTTP Method',
      key: 'apiConfig.method',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
      ],
    },
    { type: 'text', label: 'Data Path (JSON path)', key: 'apiConfig.dataPath' },
    { type: 'text', label: 'Value Field', key: 'apiConfig.valueField' },
    { type: 'text', label: 'Label Field', key: 'apiConfig.labelField' },
    { type: 'text', label: 'Custom Options (JSON)', key: 'customOptions' },
  ],
  component: RadioFieldComponent,
};

const TEXT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'text',
  label: 'Text Input',
  icon: 'input',
  defaultConfig: {
    label: 'Text Input',
    required: false,
    placeholder: 'Enter text',
    inputType: 'text',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    {
      type: 'select',
      label: 'Input Type',
      key: 'inputType',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Password', value: 'password' },
        { label: 'Tel', value: 'tel' },
        { label: 'URL', value: 'url' },
      ],
    },
  ],
  component: TextFieldComponent,
};

const TEXTAREA_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'textarea',
  label: 'Text Area',
  icon: 'subject',
  defaultConfig: {
    label: 'Text Area',
    required: false,
    placeholder: 'Enter text',
    rows: 4,
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    { type: 'number', label: 'Rows', key: 'rows' },
  ],
  component: TextareaFieldComponent,
};

const NUMBER_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'number',
  label: 'Number Input',
  icon: 'pin',
  defaultConfig: {
    label: 'Number Input',
    required: false,
    placeholder: 'Enter number',
    min: 0,
    max: 100,
    step: 1,
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    { type: 'number', label: 'Min Value', key: 'min' },
    { type: 'number', label: 'Max Value', key: 'max' },
    { type: 'number', label: 'Step', key: 'step' },
  ],
  component: NumberFieldComponent,
};

const EMAIL_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'email',
  label: 'Email Input',
  icon: 'email',
  defaultConfig: {
    label: 'Email Input',
    required: false,
    placeholder: 'Enter email',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: EmailFieldComponent,
};

const DATE_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'date',
  label: 'Date Picker',
  icon: 'calendar_today',
  defaultConfig: {
    label: 'Date Picker',
    required: false,
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: DateFieldComponent,
};

const FILE_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'file',
  label: 'File Upload',
  icon: 'attach_file',
  defaultConfig: {
    label: 'File Upload',
    required: false,
    accept: '*',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'checkbox', label: 'Required', key: 'required' },
    { type: 'text', label: 'Accept', key: 'accept' },
  ],
  component: FileFieldComponent,
};

const CHECKBOX_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'checkbox',
  label: 'Checkbox',
  icon: 'check_box',
  defaultConfig: {
    label: 'Checkbox',
    required: false,
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: CheckboxFieldComponent,
};

const BUTTON_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'button',
  label: 'Button',
  icon: 'smart_button',
  defaultConfig: {
    label: 'Submit',
    buttonText: 'Submit',
    showCancelButton: false,
    alignment: 'center',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Button Text', key: 'buttonText' },
    { type: 'checkbox', label: 'Show Cancel Button', key: 'showCancelButton' },
    {
      type: 'select',
      label: 'Alignment',
      key: 'alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
  component: ButtonFieldComponent,
};

@Injectable({
  providedIn: 'root',
})
export class FieldTypesService {
  private fieldTypes: FieldTypeDefinition[] = [
    SELECT_FIELD_DEFINITION,
    MULTISELECT_FIELD_DEFINITION,
    RADIO_FIELD_DEFINITION,
    TEXT_FIELD_DEFINITION,
    TEXTAREA_FIELD_DEFINITION,
    NUMBER_FIELD_DEFINITION,
    EMAIL_FIELD_DEFINITION,
    DATE_FIELD_DEFINITION,
    FILE_FIELD_DEFINITION,
    CHECKBOX_FIELD_DEFINITION,
    BUTTON_FIELD_DEFINITION,
  ];

  getFieldTypes(): FieldTypeDefinition[] {
    return this.fieldTypes;
  }

  getFieldType(type: string): FieldTypeDefinition | undefined {
    return this.fieldTypes.find((fieldType) => fieldType.type === type);
  }
}
