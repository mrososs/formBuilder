import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { FormField } from '../models/field';
import { SelectFieldComponent } from '../components/field-types/select-field/select-field.component';
import { MultiselectFieldComponent } from '../components/field-types/multiselect-field/multiselect-field.component';
import { RadioFieldComponent } from '../components/field-types/radio-field/radio-field.component';

@Component({
  selector: 'app-dynamic-options-example',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    SelectFieldComponent,
    MultiselectFieldComponent,
    RadioFieldComponent,
  ],
  template: `
    <div class="example-container">
      <h2>Dynamic Options Examples</h2>

      <mat-tab-group>
        <!-- Static Options Tab -->
        <mat-tab label="Static Options">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Static Options Example</mat-card-title>
                <mat-card-subtitle>Using predefined options</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <app-select-field [field]="staticSelectField" />
                <app-multiselect-field [field]="staticMultiField" />
                <app-radio-field [field]="staticRadioField" />
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- API Options Tab -->
        <mat-tab label="API Options">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>API Options Example</mat-card-title>
                <mat-card-subtitle>Using built-in API groups</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <app-select-field [field]="apiSelectField" />
                <app-multiselect-field [field]="apiMultiField" />
                <app-radio-field [field]="apiRadioField" />
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- External API Tab -->
        <mat-tab label="External API">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>External API Example</mat-card-title>
                <mat-card-subtitle
                  >Using custom external APIs</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <app-select-field [field]="externalSelectField" />
                <app-multiselect-field [field]="externalMultiField" />
                <app-radio-field [field]="externalRadioField" />
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <!-- Multi-Select Radio Tab -->
        <mat-tab label="Multi-Select Radio">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Multi-Select Radio Example</mat-card-title>
                <mat-card-subtitle
                  >Radio buttons with multi-select capability</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <app-radio-field [field]="multiSelectRadioField" />
                <app-radio-field [field]="limitedMultiSelectRadioField" />
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    .example-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .tab-content {
      padding: 20px 0;
    }
    
    mat-card {
      margin-bottom: 20px;
    }
    
    mat-card-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    h2 {
      color: #1976d2;
      margin-bottom: 20px;
    }
  `,
})
export class DynamicOptionsExampleComponent {
  // Static Options Examples
  staticSelectField: FormField = {
    id: 'static-select',
    type: 'select',
    label: 'Static Select Field',
    required: true,
    placeholder: 'Choose from static options',
    optionSource: 'static',
    staticOptions: 'Option A, Option B, Option C, Option D',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  };

  staticMultiField: FormField = {
    id: 'static-multi',
    type: 'multiselect',
    label: 'Static Multi-Select Field',
    required: false,
    placeholder: 'Choose multiple options',
    optionSource: 'static',
    staticOptions: 'Red, Green, Blue, Yellow, Purple, Orange',
    maxSelections: 3,
  };

  staticRadioField: FormField = {
    id: 'static-radio',
    type: 'radio',
    label: 'Static Radio Field',
    required: true,
    optionSource: 'static',
    staticOptions: 'Yes, No, Maybe',
    allowMultiple: false,
  };

  // API Options Examples
  apiSelectField: FormField = {
    id: 'api-select',
    type: 'select',
    label: 'API Select Field (Users)',
    required: true,
    placeholder: 'Select a user',
    optionSource: 'api',
    apiGroupId: 'users',
  };

  apiMultiField: FormField = {
    id: 'api-multi',
    type: 'multiselect',
    label: 'API Multi-Select Field (Products)',
    required: false,
    placeholder: 'Select products',
    optionSource: 'api',
    apiGroupId: 'products',
    maxSelections: 4,
  };

  apiRadioField: FormField = {
    id: 'api-radio',
    type: 'radio',
    label: 'API Radio Field (Countries)',
    required: true,
    optionSource: 'api',
    apiGroupId: 'countries',
    allowMultiple: false,
  };

  // External API Examples
  externalSelectField: FormField = {
    id: 'external-select',
    type: 'select',
    label: 'External API Select Field',
    required: true,
    placeholder: 'Select from external API',
    optionSource: 'external',
    apiConfig: {
      url: 'https://jsonplaceholder.typicode.com/users',
      method: 'GET',
      dataPath: '', // Root level array
      valueField: 'id',
      labelField: 'name',
    },
  };

  externalMultiField: FormField = {
    id: 'external-multi',
    type: 'multiselect',
    label: 'External API Multi-Select Field',
    required: false,
    placeholder: 'Select multiple items',
    optionSource: 'external',
    apiConfig: {
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
      dataPath: '',
      valueField: 'id',
      labelField: 'title',
      transformFunction: `
        return data.slice(0, 10).map(item => ({
          value: String(item[valueField]),
          label: item[labelField].substring(0, 30) + '...'
        }));
      `,
    },
    maxSelections: 5,
  };

  externalRadioField: FormField = {
    id: 'external-radio',
    type: 'radio',
    label: 'External API Radio Field',
    required: true,
    optionSource: 'external',
    apiConfig: {
      url: 'https://jsonplaceholder.typicode.com/albums',
      method: 'GET',
      dataPath: '',
      valueField: 'id',
      labelField: 'title',
    },
    allowMultiple: false,
  };

  // Multi-Select Radio Examples
  multiSelectRadioField: FormField = {
    id: 'multi-radio',
    type: 'radio',
    label: 'Multi-Select Radio Field',
    required: true,
    optionSource: 'api',
    apiGroupId: 'departments',
    allowMultiple: true,
    maxSelections: 3,
  };

  limitedMultiSelectRadioField: FormField = {
    id: 'limited-multi-radio',
    type: 'radio',
    label: 'Limited Multi-Select Radio Field',
    required: false,
    optionSource: 'static',
    staticOptions: 'Option 1, Option 2, Option 3, Option 4, Option 5',
    allowMultiple: true,
    minSelections: 1,
    maxSelections: 2,
  };
}
