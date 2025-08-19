import { Component, inject } from '@angular/core';
import { FieldTypesService } from '../../services/field-types.service';
import { FieldButtonComponent } from './field-button/field-button.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-form-elements-menu',
  imports: [FieldButtonComponent, DragDropModule, CommonModule],
  template: `
    <div class="elements-menu-container">
      <div class="elements-header">
        <h3 class="elements-title">
          <svg
            class="title-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
          Form Elements
        </h3>
        <p class="elements-subtitle">Drag elements to build your form</p>
      </div>
      <div class="elements-content">
        <div
          class="elements-list"
          cdkDropList
          cdkDropListSortingDisabled="true"
          [cdkDropListData]="'field-selector'"
        >
          @for (type of fieldTypes; track type.type) {
          <app-field-button [field]="type" />
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .elements-menu-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: white;
      overflow: hidden;
    }

    .elements-header {
      padding: 20px 20px 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      flex-shrink: 0;
    }

    .elements-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 4px 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
    }

    .title-icon {
      width: 20px;
      height: 20px;
      color: #3b82f6;
    }

    .elements-subtitle {
      margin: 0;
      font-size: 0.875rem;
      color: #64748b;
      font-weight: 400;
    }

    .elements-content {
      flex: 1;
      overflow: hidden;
      padding: 16px;
    }

    .elements-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 100%;
      overflow-y: auto;
      padding-right: 4px;
    }

    .elements-list::-webkit-scrollbar {
      width: 6px;
    }

    .elements-list::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 3px;
    }

    .elements-list::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }

    .elements-list::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Responsive adjustments */
    @media (max-width: 1024px) {
      .elements-header {
        padding: 16px 16px 12px 16px;
      }

      .elements-content {
        padding: 12px;
      }

      .elements-title {
        font-size: 1rem;
      }

      .elements-subtitle {
        font-size: 0.8rem;
      }
    }

    @media (max-width: 768px) {
      .elements-header {
        padding: 12px 12px 8px 12px;
      }

      .elements-content {
        padding: 8px;
      }
    }
  `,
})
export class FormElementsMenuComponent {
  fieldTypesService = inject(FieldTypesService);
  fieldTypes = this.fieldTypesService.getAllFieldTypes();
}
