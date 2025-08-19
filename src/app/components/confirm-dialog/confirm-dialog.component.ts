import { Component, inject } from '@angular/core';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <div class="dialog-container">
      <h2 class="dialog-title">{{ data.title || 'Please confirm' }}</h2>
      <div class="dialog-message">{{ data.message }}</div>
      <div class="dialog-actions">
        <button class="btn btn-secondary" (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button class="btn btn-primary" (click)="onConfirm()">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: `
    .dialog-container { padding: 20px; max-width: 420px; }
    .dialog-title { margin: 0 0 8px; font-size: 18px; font-weight: 600; }
    .dialog-message { color: #374151; margin-bottom: 16px; }
    .dialog-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .btn { padding: 8px 16px; border-radius: 6px; border: 1px solid #d1d5db; cursor: pointer; }
    .btn-secondary { background: #f3f4f6; }
    .btn-primary { background: #2563eb; color: white; border-color: #2563eb; }
  `,
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  public data: ConfirmDialogData = inject(MAT_DIALOG_DATA);

  onConfirm() {
    this.dialogRef.close(true);
  }
  onCancel() {
    this.dialogRef.close(false);
  }
}
