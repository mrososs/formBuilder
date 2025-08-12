import { FormService } from './../../../services/form.service';
import { Component, inject } from '@angular/core';
import { FieldPreviewComponent } from '../field-preview/field-preview.component';

@Component({
  selector: 'app-form-preview',
  imports: [FieldPreviewComponent],
  template: `
    <div class="form-preview-container">
      <div class="form-preview-content">
        @for (row of formService.rows(); track row.id) {
        <div class="form-row-preview">
          @for (field of row.fields; track field.id) {
          <div class="field-preview-wrapper">
            <app-field-preview [field]="field" />
          </div>
          }
        </div>
        } @empty {
        <div class="empty-form">
          <div class="empty-icon">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
              ></path>
              <polyline points="14,2 14,8 20,8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10,9 9,9 8,9"></polyline>
            </svg>
          </div>
          <h3 class="empty-title">No Form Fields</h3>
          <p class="empty-text">
            Drag and drop form elements from the left panel to start building
            your form
          </p>
        </div>
        }
      </div>
    </div>
  `,
  styles: `
    .form-preview-container {
      height: 100%;
      overflow-y: auto;
      padding: 20px;
    }

    .form-preview-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      padding: 32px;
      min-height: 400px;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-row-preview {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .form-row-preview:last-child {
      margin-bottom: 0;
    }

    .field-preview-wrapper {
      flex: 1;
      min-width: 250px;
    }

    .empty-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
    }

    .empty-icon {
      color: #d1d5db;
      margin-bottom: 16px;
    }

    .empty-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #374151;
    }

    .empty-text {
      font-size: 14px;
      margin: 0;
      color: #6b7280;
      max-width: 300px;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .form-preview-container {
        padding: 12px;
      }

      .form-preview-content {
        padding: 20px;
        border-radius: 12px;
      }

      .form-row-preview {
        gap: 16px;
        margin-bottom: 20px;
      }

      .field-preview-wrapper {
        min-width: 200px;
      }
    }
  `,
})
export class FormPreviewComponent {
  formService = inject(FormService);
}
