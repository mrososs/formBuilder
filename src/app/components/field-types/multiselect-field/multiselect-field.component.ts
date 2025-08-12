import {
  Component,
  input,
  inject,
  OnInit,
  signal,
  computed,
  effect,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormField } from '../../../models/field';
import { CommonModule } from '@angular/common';
import { ApiDataService, ApiOption } from '../../../services/api-data.service';

@Component({
  selector: 'app-multiselect-field',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <mat-form-field class="w-full">
      <mat-label>{{ field().label }}</mat-label>
      <mat-select
        [required]="field().required"
        multiple
        [placeholder]="field().placeholder || 'Choose options'"
        [disabled]="isLoading()"
      >
        @if (isLoading()) {
        <mat-option disabled>
          <div class="loading-option">
            <mat-spinner diameter="16"></mat-spinner>
            <span>Loading options...</span>
          </div>
        </mat-option>
        } @else { @for (option of currentOptions(); track option.value) {
        <mat-option [value]="option.value">
          {{ option.label }}
        </mat-option>
        } }
      </mat-select>
    </mat-form-field>
  `,
  styles: `
    .loading-option {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }
  `,
})
export class MultiselectFieldComponent {
  field = input.required<FormField>();
  private apiDataService = inject(ApiDataService);

  isLoading = signal(false);
  apiOptions = signal<ApiOption[]>([]);

  defaultOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4' },
  ];

  currentOptions = computed(() => {
    const field = this.field();
    const optionSource = field.optionSource || 'static';

    switch (optionSource) {
      case 'api':
        return this.apiOptions();
      case 'custom':
        return this.parseCustomOptions(field.customOptions || '');
      case 'static':
      default:
        return (
          this.parseStaticOptions(field.staticOptions || '') ||
          field.options ||
          this.defaultOptions
        );
    }
  });

  constructor() {
    // Set up effect to watch for changes in field properties
    effect(() => {
      const field = this.field();
      this.loadOptions();
    });
  }

  private loadOptions() {
    const field = this.field();
    const optionSource = field.optionSource || 'static';

    if (optionSource === 'api' && field.apiGroupId) {
      this.isLoading.set(true);
      this.apiDataService.getOptionsByGroup(field.apiGroupId).subscribe({
        next: (options) => {
          this.apiOptions.set(options);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading API options:', error);
          this.isLoading.set(false);
        },
      });
    } else {
      // Clear API options when not using API
      this.apiOptions.set([]);
    }
  }

  private parseCustomOptions(customOptionsJson: string): ApiOption[] {
    return this.apiDataService.parseCustomOptions(customOptionsJson);
  }

  private parseStaticOptions(staticOptionsText: string): ApiOption[] {
    return this.apiDataService.parseStaticOptions(staticOptionsText);
  }
}
