import { computed, Injectable, signal } from '@angular/core';
import { FormRow } from '../models/form';
import { FormField } from '../models/field';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private _rows = signal<FormRow[]>([]);
  private _selectFieldId = signal<string | null>(null);
  public readonly rows = this._rows.asReadonly();
  public readonly selectField = computed(() =>
    this._rows()
      .flatMap((row) => row.fields)
      .find((field) => field.id === this._selectFieldId())
  );

  constructor() {
    this._rows.set([
      {
        id: crypto.randomUUID(),
        fields: [],
      },
    ]);
  }
  addField(field: FormField, rowId: string, index?: number) {
    const rows = this._rows();
    const newRows = rows.map((rows) => {
      if (rows.id === rowId) {
        const updateFields = [...rows.fields];
        if (index !== undefined) {
          updateFields.splice(index, 0, field);
        } else {
          updateFields.push(field);
        }
        return { ...rows, fields: updateFields };
      }
      return rows;
    });
    this._rows.set(newRows);
  }
  deleteField(fieldId: string) {
    const rows = this._rows();
    const newRows = rows.map((row) => ({
      ...row,
      fields: row.fields.filter((f) => f.id !== fieldId),
    }));
    this._rows.set(newRows);
  }
  addRow() {
    const newRow: FormRow = {
      id: crypto.randomUUID(),
      fields: [],
    };
    const rows = this._rows();
    this._rows.set([...rows, newRow]);
  }
  deleteRow(rowId: string) {
    if (this._rows().length === 1) {
      return;
    }
    const rows = this._rows();
    const newRows = rows.filter((row) => row.id !== rowId);
    this._rows.set(newRows);
  }
  moveField(
    fieldId: string,
    sourceRowId: string,
    targetRowId: string,
    targetIndex: number = -1
  ) {
    const rows = this._rows();
    let fieldToMove: FormField | undefined;
    let sourceRowIndex = -1;
    let sourceFieldIndex = -1;
    rows.forEach((row, rowIndex) => {
      if (row.id === sourceRowId) {
        sourceRowIndex = rowIndex;
        sourceFieldIndex = row.fields.findIndex(
          (field) => field.id === fieldId
        );
        if (sourceFieldIndex >= 0) {
          fieldToMove = row.fields[sourceFieldIndex];
        }
      }
    });
    if (!fieldToMove) {
      return;
    }
    const newRows = [...rows];
    const fieldsWithRemovedField = newRows[sourceRowIndex].fields.filter(
      (f) => f.id !== fieldId
    );
    newRows[sourceRowIndex].fields = fieldsWithRemovedField;
    const targeRowIndex = newRows.findIndex((r) => r.id === targetRowId);
    if (targeRowIndex >= 0) {
      const targetFields = [...newRows[targeRowIndex].fields];
      targetFields.splice(targetIndex, 0, fieldToMove);
      newRows[targeRowIndex].fields = targetFields;
    }
    this._rows.set(newRows);
  }
  setSelectedField(fieldId: string) {
    this._selectFieldId.set(fieldId);
  }

  updateField(fieldId: string, key: string, value: any) {
    const rows = this._rows();
    const newRows = rows.map((row) => ({
      ...row,
      fields: row.fields.map((field) => {
        if (field.id === fieldId) {
          return { ...field, [key]: value };
        }
        return field;
      }),
    }));
    this._rows.set(newRows);
  }
}
