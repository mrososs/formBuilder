import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface TransitionConfig {
  id: string;
  label: string;
  description?: string;
  assignUsers: string[];
  assignRoles: string[];
  conditions: TransitionCondition[];
  actions: TransitionAction[];
  priority: number;
  isDefault: boolean;
  timeout?: number;
  notifications: NotificationConfig[];
}

export interface TransitionCondition {
  id: string;
  type: 'field_value' | 'user_role' | 'custom' | 'time_based';
  field?: string;
  operator?: string;
  value?: any;
  customExpression?: string;
  timeCondition?: string;
}

export interface TransitionAction {
  id: string;
  type:
    | 'assign_task'
    | 'send_notification'
    | 'update_field'
    | 'call_webhook'
    | 'custom';
  target?: string;
  value?: any;
  customAction?: string;
}

export interface NotificationConfig {
  id: string;
  type: 'email' | 'sms' | 'push' | 'in_app';
  recipients: string[];
  template: string;
  subject?: string;
}

@Component({
  selector: 'app-transition-dialog',
  imports: [CommonModule, FormsModule, MatSlideToggleModule],
  template: `
    <div class="transition-dialog-overlay" (click)="close()">
      <div class="transition-dialog" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                ></path>
              </svg>
            </div>
            <div class="header-text">
              <h2 class="dialog-title">Configure Transition</h2>
              <p class="dialog-subtitle">
                From {{ fromNode?.title }} to {{ toNode?.title }}
              </p>
            </div>
          </div>
          <button class="close-button" (click)="close()">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="dialog-content">
          <!-- Basic Settings -->
          <div class="section">
            <h3 class="section-title">Basic Settings</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>Transition Label</label>
                <input
                  type="text"
                  [(ngModel)]="config.label"
                  placeholder="e.g., Approve, Reject, Continue"
                  class="form-input"
                />
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea
                  [(ngModel)]="config.description"
                  placeholder="Optional description for this transition"
                  class="form-textarea"
                  rows="2"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Assignment Settings -->
          <div class="section">
            <h3 class="section-title">Assignment Settings</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>Assign to Users</label>
                <div class="multi-select-container">
                  <div class="selected-items">
                    <span
                      *ngFor="let user of config.assignUsers"
                      class="selected-item"
                    >
                      {{ user }}
                      <button
                        class="remove-item"
                        (click)="removeUser(user)"
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                  <div class="add-item">
                    <input
                      type="text"
                      [(ngModel)]="newUser"
                      placeholder="Enter user email or username"
                      class="form-input"
                      (keyup.enter)="addUser()"
                    />
                    <button
                      class="add-button"
                      (click)="addUser()"
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Assign to Roles</label>
                <div class="multi-select-container">
                  <div class="selected-items">
                    <span
                      *ngFor="let role of config.assignRoles"
                      class="selected-item"
                    >
                      {{ role }}
                      <button
                        class="remove-item"
                        (click)="removeRole(role)"
                        type="button"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                  <div class="add-item">
                    <select [(ngModel)]="newRole" class="form-select">
                      <option value="">Select a role</option>
                      <option
                        *ngFor="let role of availableRoles"
                        [value]="role"
                      >
                        {{ role }}
                      </option>
                    </select>
                    <button
                      class="add-button"
                      (click)="addRole()"
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Conditions -->
          <div class="section">
            <h3 class="section-title">
              Conditions
              <button
                class="add-condition-btn"
                (click)="addCondition()"
                type="button"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Condition
              </button>
            </h3>
            <div class="conditions-list">
              <div
                *ngFor="let condition of config.conditions; let i = index"
                class="condition-item"
              >
                <div class="condition-header">
                  <span class="condition-number">Condition {{ i + 1 }}</span>
                  <button
                    class="remove-condition"
                    (click)="removeCondition(i)"
                    type="button"
                  >
                    ×
                  </button>
                </div>
                <div class="condition-content">
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Type</label>
                      <select [(ngModel)]="condition.type" class="form-select">
                        <option value="field_value">Field Value</option>
                        <option value="user_role">User Role</option>
                        <option value="custom">Custom Expression</option>
                        <option value="time_based">Time Based</option>
                      </select>
                    </div>

                    <!-- Field Value Condition -->
                    <div
                      *ngIf="condition.type === 'field_value'"
                      class="form-group"
                    >
                      <label>Field</label>
                      <input
                        type="text"
                        [(ngModel)]="condition.field"
                        placeholder="e.g., status, amount, priority"
                        class="form-input"
                      />
                    </div>

                    <div
                      *ngIf="condition.type === 'field_value'"
                      class="form-group"
                    >
                      <label>Operator</label>
                      <select
                        [(ngModel)]="condition.operator"
                        class="form-select"
                      >
                        <option value="equals">Equals</option>
                        <option value="not_equals">Not Equals</option>
                        <option value="greater_than">Greater Than</option>
                        <option value="less_than">Less Than</option>
                        <option value="contains">Contains</option>
                        <option value="starts_with">Starts With</option>
                        <option value="ends_with">Ends With</option>
                      </select>
                    </div>

                    <div
                      *ngIf="condition.type === 'field_value'"
                      class="form-group"
                    >
                      <label>Value</label>
                      <input
                        type="text"
                        [(ngModel)]="condition.value"
                        placeholder="Enter value"
                        class="form-input"
                      />
                    </div>

                    <!-- Custom Expression -->
                    <div
                      *ngIf="condition.type === 'custom'"
                      class="form-group full-width"
                    >
                      <label>Custom Expression</label>
                      <textarea
                        [(ngModel)]="condition.customExpression"
                        placeholder="Enter custom condition expression..."
                        class="form-textarea"
                        rows="3"
                      ></textarea>
                    </div>

                    <!-- Time Based -->
                    <div
                      *ngIf="condition.type === 'time_based'"
                      class="form-group full-width"
                    >
                      <label>Time Condition</label>
                      <select
                        [(ngModel)]="condition.timeCondition"
                        class="form-select"
                      >
                        <option value="business_hours">
                          During Business Hours
                        </option>
                        <option value="after_hours">
                          After Business Hours
                        </option>
                        <option value="weekend">Weekend</option>
                        <option value="custom_time">Custom Time Range</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="section">
            <h3 class="section-title">
              Actions
              <button
                class="add-action-btn"
                (click)="addAction()"
                type="button"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Action
              </button>
            </h3>
            <div class="actions-list">
              <div
                *ngFor="let action of config.actions; let i = index"
                class="action-item"
              >
                <div class="action-header">
                  <span class="action-number">Action {{ i + 1 }}</span>
                  <button
                    class="remove-action"
                    (click)="removeAction(i)"
                    type="button"
                  >
                    ×
                  </button>
                </div>
                <div class="action-content">
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Type</label>
                      <select [(ngModel)]="action.type" class="form-select">
                        <option value="assign_task">Assign Task</option>
                        <option value="send_notification">
                          Send Notification
                        </option>
                        <option value="update_field">Update Field</option>
                        <option value="call_webhook">Call Webhook</option>
                        <option value="custom">Custom Action</option>
                      </select>
                    </div>

                    <div
                      *ngIf="action.type === 'assign_task'"
                      class="form-group"
                    >
                      <label>Target User/Role</label>
                      <input
                        type="text"
                        [(ngModel)]="action.target"
                        placeholder="Enter user or role"
                        class="form-input"
                      />
                    </div>

                    <div
                      *ngIf="action.type === 'update_field'"
                      class="form-group"
                    >
                      <label>Field</label>
                      <input
                        type="text"
                        [(ngModel)]="action.target"
                        placeholder="e.g., status, priority"
                        class="form-input"
                      />
                    </div>

                    <div
                      *ngIf="action.type === 'update_field'"
                      class="form-group"
                    >
                      <label>Value</label>
                      <input
                        type="text"
                        [(ngModel)]="action.value"
                        placeholder="Enter new value"
                        class="form-input"
                      />
                    </div>

                    <div
                      *ngIf="action.type === 'call_webhook'"
                      class="form-group"
                    >
                      <label>Webhook URL</label>
                      <input
                        type="url"
                        [(ngModel)]="action.target"
                        placeholder="https://api.example.com/webhook"
                        class="form-input"
                      />
                    </div>

                    <div
                      *ngIf="action.type === 'custom'"
                      class="form-group full-width"
                    >
                      <label>Custom Action</label>
                      <textarea
                        [(ngModel)]="action.customAction"
                        placeholder="Enter custom action code..."
                        class="form-textarea"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Notifications -->
          <div class="section">
            <h3 class="section-title">
              Notifications
              <button
                class="add-notification-btn"
                (click)="addNotification()"
                type="button"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Notification
              </button>
            </h3>
            <div class="notifications-list">
              <div
                *ngFor="let notification of config.notifications; let i = index"
                class="notification-item"
              >
                <div class="notification-header">
                  <span class="notification-number"
                    >Notification {{ i + 1 }}</span
                  >
                  <button
                    class="remove-notification"
                    (click)="removeNotification(i)"
                    type="button"
                  >
                    ×
                  </button>
                </div>
                <div class="notification-content">
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Type</label>
                      <select
                        [(ngModel)]="notification.type"
                        class="form-select"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                        <option value="push">Push Notification</option>
                        <option value="in_app">In-App</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label>Recipients</label>
                      <input
                        type="text"
                        [ngModel]="notification.recipients.join(', ')"
                        placeholder="Enter recipients (comma separated)"
                        class="form-input"
                        (blur)="updateRecipients(notification, $event)"
                      />
                    </div>

                    <div
                      *ngIf="notification.type === 'email'"
                      class="form-group"
                    >
                      <label>Subject</label>
                      <input
                        type="text"
                        [(ngModel)]="notification.subject"
                        placeholder="Email subject"
                        class="form-input"
                      />
                    </div>

                    <div class="form-group full-width">
                      <label>Message Template</label>
                      <textarea
                        [(ngModel)]="notification.template"
                        placeholder="Enter notification message template..."
                        class="form-textarea"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Advanced Settings -->
          <div class="section">
            <h3 class="section-title">Advanced Settings</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>Priority</label>
                <select [(ngModel)]="config.priority" class="form-select">
                  <option value="1">Low</option>
                  <option value="2">Normal</option>
                  <option value="3">High</option>
                  <option value="4">Critical</option>
                </select>
              </div>
              <div class="form-group">
                <label>Timeout (minutes)</label>
                <input
                  type="number"
                  [(ngModel)]="config.timeout"
                  placeholder="0 = no timeout"
                  class="form-input"
                  min="0"
                />
              </div>
              <div class="form-group">
                <mat-slide-toggle [(ngModel)]="config.isDefault">
                  Default transition
                </mat-slide-toggle>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="dialog-footer">
          <button class="btn btn-secondary" (click)="close()">Cancel</button>
          <button class="btn btn-primary" (click)="save()">
            Save Transition
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .transition-dialog-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .transition-dialog {
        background: white;
        border-radius: 12px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        width: 100%;
        max-width: 800px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideIn 0.3s ease-out;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: scale(0.95) translateY(-20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px 32px;
        border-bottom: 1px solid #e2e8f0;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      }

      .header-content {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .header-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #3b82f6;
        border-radius: 12px;
        color: white;
      }

      .header-icon svg {
        width: 24px;
        height: 24px;
      }

      .dialog-title {
        margin: 0 0 4px 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e293b;
      }

      .dialog-subtitle {
        margin: 0;
        color: #64748b;
        font-size: 0.875rem;
      }

      .close-button {
        width: 40px;
        height: 40px;
        border: none;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
      }

      .close-button:hover {
        background: rgba(255, 255, 255, 0.9);
        color: #374151;
        transform: scale(1.05);
      }

      .close-button svg {
        width: 20px;
        height: 20px;
      }

      .dialog-content {
        flex: 1;
        overflow-y: auto;
        padding: 24px 32px;
      }

      .section {
        margin-bottom: 32px;
      }

      .section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 0 16px 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: #1e293b;
      }

      .form-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }

      .form-group {
        display: flex;
        flex-direction: column;
      }

      .form-group.full-width {
        grid-column: 1 / -1;
      }

      .form-group label {
        margin-bottom: 6px;
        font-weight: 500;
        color: #374151;
        font-size: 0.875rem;
      }

      .form-input,
      .form-textarea,
      .form-select {
        padding: 10px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.875rem;
        background: white;
        transition: all 0.2s;
      }

      .form-input:focus,
      .form-textarea:focus,
      .form-select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .form-textarea {
        resize: vertical;
        min-height: 80px;
        font-family: inherit;
      }

      .multi-select-container {
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: white;
      }

      .selected-items {
        padding: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        min-height: 40px;
      }

      .selected-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        background: #e0e7ff;
        color: #3730a3;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      .remove-item {
        width: 16px;
        height: 16px;
        border: none;
        background: none;
        color: #6366f1;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 2px;
      }

      .remove-item:hover {
        background: rgba(99, 102, 241, 0.1);
      }

      .add-item {
        display: flex;
        gap: 8px;
        padding: 8px;
        border-top: 1px solid #f1f5f9;
      }

      .add-item .form-input {
        flex: 1;
        margin: 0;
      }

      .add-button {
        padding: 8px 16px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .add-button:hover {
        background: #2563eb;
      }

      .add-condition-btn,
      .add-action-btn,
      .add-notification-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background: #10b981;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .add-condition-btn:hover,
      .add-action-btn:hover,
      .add-notification-btn:hover {
        background: #059669;
      }

      .add-condition-btn svg,
      .add-action-btn svg,
      .add-notification-btn svg {
        width: 14px;
        height: 14px;
      }

      .conditions-list,
      .actions-list,
      .notifications-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .condition-item,
      .action-item,
      .notification-item {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        overflow: hidden;
      }

      .condition-header,
      .action-header,
      .notification-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      }

      .condition-number,
      .action-number,
      .notification-number {
        font-weight: 600;
        color: #374151;
        font-size: 0.875rem;
      }

      .remove-condition,
      .remove-action,
      .remove-notification {
        width: 24px;
        height: 24px;
        border: none;
        background: #ef4444;
        color: white;
        cursor: pointer;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        transition: all 0.2s;
      }

      .remove-condition:hover,
      .remove-action:hover,
      .remove-notification:hover {
        background: #dc2626;
      }

      .condition-content,
      .action-content,
      .notification-content {
        padding: 16px;
      }

      .checkbox-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 0.875rem;
      }

      .checkbox {
        display: none;
      }

      .checkmark {
        width: 18px;
        height: 18px;
        border: 2px solid #d1d5db;
        border-radius: 4px;
        position: relative;
        transition: all 0.2s;
      }

      .checkbox:checked + .checkmark {
        background: #3b82f6;
        border-color: #3b82f6;
      }

      .checkbox:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
      }

      .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        padding: 24px 32px;
        border-top: 1px solid #e2e8f0;
        background: #f8fafc;
      }

      .btn {
        padding: 10px 20px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .btn-primary {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
      }

      .btn-primary:hover {
        background: #2563eb;
        border-color: #2563eb;
      }

      .btn-secondary {
        background: white;
        color: #374151;
      }

      .btn-secondary:hover {
        background: #f9fafb;
        border-color: #9ca3af;
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .transition-dialog {
          max-width: 95vw;
          max-height: 95vh;
        }

        .dialog-header {
          padding: 20px 24px;
        }

        .dialog-content {
          padding: 20px 24px;
        }

        .dialog-footer {
          padding: 20px 24px;
        }

        .form-grid {
          grid-template-columns: 1fr;
        }

        .header-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }

        .dialog-title {
          font-size: 1.25rem;
        }
      }
    `,
  ],
})
export class TransitionDialogComponent {
  @Input() fromNode: any = null;
  @Input() toNode: any = null;
  @Input() connection: any = null;
  @Output() saveTransition = new EventEmitter<TransitionConfig>();
  @Output() closeDialog = new EventEmitter<void>();

  config: TransitionConfig = {
    id: '',
    label: '',
    description: '',
    assignUsers: [],
    assignRoles: [],
    conditions: [],
    actions: [],
    priority: 2,
    isDefault: false,
    timeout: undefined,
    notifications: [],
  };

  newUser = '';
  newRole = '';
  availableRoles = [
    'Admin',
    'Manager',
    'Supervisor',
    'Employee',
    'Approver',
    'Reviewer',
    'User',
    'Guest',
  ];

  ngOnInit() {
    if (this.connection) {
      this.config.id = this.connection.id;
      this.config.label = this.connection.label || '';
    } else {
      this.config.id = `transition_${Date.now()}`;
    }
  }

  addUser() {
    if (
      this.newUser.trim() &&
      !this.config.assignUsers.includes(this.newUser.trim())
    ) {
      this.config.assignUsers.push(this.newUser.trim());
      this.newUser = '';
    }
  }

  removeUser(user: string) {
    const index = this.config.assignUsers.indexOf(user);
    if (index > -1) {
      this.config.assignUsers.splice(index, 1);
    }
  }

  addRole() {
    if (this.newRole && !this.config.assignRoles.includes(this.newRole)) {
      this.config.assignRoles.push(this.newRole);
      this.newRole = '';
    }
  }

  removeRole(role: string) {
    const index = this.config.assignRoles.indexOf(role);
    if (index > -1) {
      this.config.assignRoles.splice(index, 1);
    }
  }

  addCondition() {
    this.config.conditions.push({
      id: `condition_${Date.now()}`,
      type: 'field_value',
      field: '',
      operator: 'equals',
      value: '',
    });
  }

  removeCondition(index: number) {
    this.config.conditions.splice(index, 1);
  }

  addAction() {
    this.config.actions.push({
      id: `action_${Date.now()}`,
      type: 'assign_task',
      target: '',
      value: '',
    });
  }

  removeAction(index: number) {
    this.config.actions.splice(index, 1);
  }

  addNotification() {
    this.config.notifications.push({
      id: `notification_${Date.now()}`,
      type: 'email',
      recipients: [],
      template: '',
      subject: '',
    });
  }

  removeNotification(index: number) {
    this.config.notifications.splice(index, 1);
  }

  updateRecipients(notification: NotificationConfig, event: any) {
    const value = event.target.value;
    notification.recipients = value
      .split(',')
      .map((r: string) => r.trim())
      .filter((r: string) => r);
  }

  save() {
    this.saveTransition.emit(this.config);
  }

  close() {
    this.closeDialog.emit();
  }
}
