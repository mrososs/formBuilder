import { Component, input } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { FormField } from '../../../models/field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-radio-field',
  imports: [MatRadioModule, CommonModule],
  template: `
    <div class="radio-field-container">
      <label class="radio-label">{{ field().label }}</label>
      <mat-radio-group [required]="field().required">
        <mat-radio-button
          *ngFor="let option of field().options || defaultOptions"
          [value]="option.value"
          class="radio-option"
        >
          {{ option.label }}
        </mat-radio-button>
      </mat-radio-group>
    </div>
  `,
  styles: `
    .radio-field-container {
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background-color: #fafafa;
    }
    
    .radio-label {
      display: block;
      margin-bottom: 12px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .radio-option {
      display: block;
      margin-bottom: 8px;
    }
  `,
})
export class RadioFieldComponent {
  field = input.required<FormField>();

  defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];
}
