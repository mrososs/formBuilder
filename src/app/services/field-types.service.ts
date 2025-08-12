import { CheckboxFieldComponent } from '../components/field-types/checkbox-field/checkbox-field.component';
import { TextFieldComponent } from '../components/field-types/text-field/text-field.component';
import { DateFieldComponent } from '../components/field-types/date-field/date-field.component';
import { SelectFieldComponent } from '../components/field-types/select-field/select-field.component';
import { MultiselectFieldComponent } from '../components/field-types/multiselect-field/multiselect-field.component';
import { RadioFieldComponent } from '../components/field-types/radio-field/radio-field.component';
import { TextareaFieldComponent } from '../components/field-types/textarea-field/textarea-field.component';
import { EmailFieldComponent } from '../components/field-types/email-field/email-field.component';
import { NumberFieldComponent } from '../components/field-types/number-field/number-field.component';
import { FileFieldComponent } from '../components/field-types/file-field/file-field.component';
import { ButtonFieldComponent } from '../components/field-types/button-field/button-field.component';
import { FieldTypeDefinition } from './../models/field';
import { Injectable } from '@angular/core';

const TEXT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'text',
  label: 'Text Field',
  icon: 'text_fields',
  defaultConfig: {
    label: 'Text Field',
    placeholder: 'Enter text',
    required: false,
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
        { label: 'Number', value: 'number' },
        { label: 'Email', value: 'email' },
        { label: 'Password', value: 'password' },
        { label: 'Tel', value: 'tel' },
        { label: 'URL', value: 'url' },
      ],
    },
  ],
  component: TextFieldComponent,
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

const DATE_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'date',
  label: 'Date Picker',
  icon: 'calendar_today',
  defaultConfig: {
    label: 'Date',
    required: false,
    placeholder: 'Select date',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: DateFieldComponent,
};

const SELECT_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'select',
  label: 'Dropdown',
  icon: 'arrow_drop_down',
  defaultConfig: {
    label: 'Select Option',
    required: false,
    placeholder: 'Choose an option',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    optionSource: 'static',
    staticOptions: 'Option 1, Option 2, Option 3',
    apiEndpoint: '',
    apiGroupId: '',
    customOptions: '',
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
        { label: 'API Groups', value: 'api' },
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
      label: 'API Group',
      key: 'apiGroupId',
      options: [
        { label: 'Users', value: 'users' },
        { label: 'Products', value: 'products' },
        { label: 'Categories', value: 'categories' },
        { label: 'Countries', value: 'countries' },
        { label: 'Departments', value: 'departments' },
      ],
    },
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
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4' },
    ],
    optionSource: 'static',
    staticOptions: 'Option 1, Option 2, Option 3, Option 4',
    apiEndpoint: '',
    apiGroupId: '',
    customOptions: '',
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
        { label: 'API Groups', value: 'api' },
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
      label: 'API Group',
      key: 'apiGroupId',
      options: [
        { label: 'Users', value: 'users' },
        { label: 'Products', value: 'products' },
        { label: 'Categories', value: 'categories' },
        { label: 'Countries', value: 'countries' },
        { label: 'Departments', value: 'departments' },
      ],
    },
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
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: RadioFieldComponent,
};

const TEXTAREA_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'textarea',
  label: 'Text Area',
  icon: 'text_fields',
  defaultConfig: {
    label: 'Text Area',
    required: false,
    rows: 4,
    placeholder: 'Enter your text here...',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'number', label: 'Rows', key: 'rows' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: TextareaFieldComponent,
};

const EMAIL_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'email',
  label: 'Email',
  icon: 'email',
  defaultConfig: {
    label: 'Email Address',
    required: false,
    placeholder: 'Enter your email',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: EmailFieldComponent,
};

const NUMBER_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'number',
  label: 'Number',
  icon: 'dialpad',
  defaultConfig: {
    label: 'Number',
    required: false,
    min: 0,
    max: 100,
    step: 1,
    placeholder: 'Enter a number',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Placeholder', key: 'placeholder' },
    { type: 'number', label: 'Min Value', key: 'min' },
    { type: 'number', label: 'Max Value', key: 'max' },
    { type: 'number', label: 'Step', key: 'step' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: NumberFieldComponent,
};

const FILE_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'file',
  label: 'File Upload',
  icon: 'upload_file',
  defaultConfig: {
    label: 'File Upload',
    required: false,
    accept: '*',
  },
  settingsConfig: [
    { type: 'text', label: 'Label', key: 'label' },
    { type: 'text', label: 'Accept Types', key: 'accept' },
    { type: 'checkbox', label: 'Required', key: 'required' },
  ],
  component: FileFieldComponent,
};

const BUTTON_FIELD_DEFINITION: FieldTypeDefinition = {
  type: 'button',
  label: 'Submit Button',
  icon: 'send',
  defaultConfig: {
    label: 'Submit Button',
    buttonText: 'Submit',
    showCancelButton: false,
    alignment: 'right',
  },
  settingsConfig: [
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
  fieldTypes = new Map<string, FieldTypeDefinition>([
    ['text', TEXT_FIELD_DEFINITION],
    ['checkbox', CHECKBOX_FIELD_DEFINITION],
    ['date', DATE_FIELD_DEFINITION],
    ['select', SELECT_FIELD_DEFINITION],
    ['multiselect', MULTISELECT_FIELD_DEFINITION],
    ['radio', RADIO_FIELD_DEFINITION],
    ['textarea', TEXTAREA_FIELD_DEFINITION],
    ['email', EMAIL_FIELD_DEFINITION],
    ['number', NUMBER_FIELD_DEFINITION],
    ['file', FILE_FIELD_DEFINITION],
    ['button', BUTTON_FIELD_DEFINITION],
  ]);
  getFieldType(type: string): FieldTypeDefinition | undefined {
    return this.fieldTypes.get(type);
  }
  getAllFieldTypes(): FieldTypeDefinition[] {
    return Array.from(this.fieldTypes.values());
  }
}
