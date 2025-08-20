import {
  Component,
  input,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormField } from '../../../models/field';
import { CommonModule } from '@angular/common';
import { ApiDataService, ApiOption } from '../../../services/api-data.service';
import { ActorsDataService } from '../../../services/actors-data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multiselect-field',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>
        {{ field().label }}
        @if (field().required) {
        <span class="required-indicator">*</span>
        }
      </mat-label>
      <mat-select
        [required]="field().required"
        [placeholder]="field().placeholder || 'Choose options'"
        [disabled]="isLoading()"
        multiple
      >
        @if (isLoading()) {
        <mat-option disabled>
          <div class="loading-option">
            <mat-spinner diameter="16"></mat-spinner>
            <span>Loading options...</span>
          </div>
        </mat-option>
        } @else if (hasError()) {
        <mat-option disabled>
          <div class="error-option">
            <mat-icon>error</mat-icon>
            <span>{{ errorMessage() }}</span>
          </div>
        </mat-option>
        } @else if (currentOptions().length === 0) {
        <mat-option disabled>
          <div class="no-options">
            <mat-icon>info</mat-icon>
            <span>No options available</span>
          </div>
        </mat-option>
        } @else { @for (option of currentOptions(); track option.value) {
        <mat-option [value]="option.value">
          {{ option.label }}
        </mat-option>
        } }
      </mat-select>
      @if (field().optionSource === 'actors' && field().actorId) {
      <mat-hint>Loading from: {{ getActorName(field().actorId!) }}</mat-hint>
      } @if (field().optionSource === 'external' && field().apiConfig?.url) {
      <mat-hint>Loading from: {{ field().apiConfig?.url }}</mat-hint>
      } @if (field().maxSelections) {
      <mat-hint>Max selections: {{ field().maxSelections }}</mat-hint>
      }
    </mat-form-field>
  `,
  styles: `
    .required-indicator {
      color: #f44336;
      margin-left: 4px;
    }
    
    .loading-option,
    .error-option,
    .no-options {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
    }
    
    .loading-option {
      color: #1976d2;
    }
    
    .error-option {
      color: #f44336;
    }
    
    .no-options {
      color: #ff9800;
    }
  `,
})
export class MultiselectFieldComponent {
  field = input.required<FormField>();
  private apiDataService = inject(ApiDataService);
  private actorsDataService = inject(ActorsDataService);

  isLoading = signal(false);
  hasError = signal(false);
  errorMessage = signal('');
  apiOptions = signal<ApiOption[]>([]);
  actorOptions = signal<Array<{ value: string; label: string }>>([]);

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
      case 'actors':
        return this.actorOptions();
      case 'external':
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

    if (optionSource === 'actors' && field.actorId) {
      this.isLoading.set(true);
      this.hasError.set(false);
      this.errorMessage.set('');

      this.actorsDataService.getActorOptions(field.actorId).subscribe({
        next: (options) => {
          this.actorOptions.set(options);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading actor options:', error);
          this.hasError.set(true);
          this.errorMessage.set(error.message || 'Failed to load options');
          this.isLoading.set(false);
        },
      });
    } else if (optionSource === 'external' && field.apiConfig?.url) {
      this.isLoading.set(true);
      this.hasError.set(false);
      this.errorMessage.set('');

      this.apiDataService.getOptionsByGroup('', field.apiConfig).subscribe({
        next: (options) => {
          this.apiOptions.set(options);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading API options:', error);
          this.hasError.set(true);
          this.errorMessage.set(error.message || 'Failed to load options');
          this.isLoading.set(false);
        },
      });
    } else {
      // Clear options when not using API or actors
      this.apiOptions.set([]);
      this.actorOptions.set([]);
      this.hasError.set(false);
      this.errorMessage.set('');
    }
  }

  getActorName(actorId: string): string {
    // This would typically come from the actors service
    const actorNames: { [key: string]: string } = {
      employees: 'Employees',
      managers: 'Managers',
      departments: 'Departments',
      products: 'Products',
      customers: 'Customers',
      suppliers: 'Suppliers',
      locations: 'Locations',
    };
    return actorNames[actorId] || actorId;
  }

  private parseCustomOptions(customOptionsJson: string): ApiOption[] {
    return this.apiDataService.parseCustomOptions(customOptionsJson);
  }

  private parseStaticOptions(staticOptionsText: string): ApiOption[] {
    return this.apiDataService.parseStaticOptions(staticOptionsText);
  }
}
