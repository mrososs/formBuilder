import { Component, inject } from '@angular/core';
import { FieldTypesService } from '../../services/field-types.service';
import { FieldButtonComponent } from './field-button/field-button.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-form-elements-menu',
  imports: [FieldButtonComponent, DragDropModule, CommonModule],
  template: `
    <div
      class="p-4 bg-white rounded-lg h-[calc(100vh-150px)] overflow-y-auto border-gray-200 shadow-sm elements-menu "
    >
      <h3 class="text-xl font-medium">Form Elements</h3>
      <div
        class="flex flex-col gap-4"
        cdkDropList
        cdkDropListSortingDisabled="true"
        [cdkDropListData]="'field-selector'"
      >
        @for (type of fieldTypes; track type.type) {
        <app-field-button [field]="type" />
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class FormElementsMenuComponent {
  fieldTypesService = inject(FieldTypesService);
  fieldTypes = this.fieldTypesService.getAllFieldTypes();
}
