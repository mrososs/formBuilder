import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {
  WorkflowNode,
  WorkflowConnection,
  FormConfig,
} from '../../services/workflow.service';

export interface SimulationStep {
  node: WorkflowNode;
  status: 'pending' | 'active' | 'completed' | 'skipped';
  data?: any;
  timestamp?: Date;
  userInput?: any;
}

export interface SimulationResult {
  steps: SimulationStep[];
  totalSteps: number;
  completedSteps: number;
  duration: number;
  finalData: any;
}

@Component({
  selector: 'app-workflow-simulation-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  template: `
    <div class="simulation-dialog-overlay" (click)="close()">
      <div class="simulation-dialog" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="simulation-header">
          <div class="header-content">
            <h2 class="simulation-title">
              <svg
                class="simulation-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              Workflow Simulation
            </h2>
            <p class="simulation-subtitle">
              Preview what end users will experience
            </p>
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

        <!-- Progress Bar -->
        <div class="simulation-progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              [style.width.%]="progressPercentage"
            ></div>
          </div>
          <div class="progress-text">
            Step {{ currentStepIndex + 1 }} of {{ simulationSteps.length }}
          </div>
        </div>

        <!-- Current Step Display -->
        <div class="current-step" *ngIf="currentStep">
          <div class="step-header">
            <div class="step-icon" [class]="currentStep.node.type">
              <svg
                *ngIf="currentStep.node.type === 'form'"
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
              <svg
                *ngIf="currentStep.node.type === 'email'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <svg
                *ngIf="currentStep.node.type === 'condition'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <svg
                *ngIf="currentStep.node.type === 'approval'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <svg
                *ngIf="currentStep.node.type === 'notification'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-5 5v-5zM4.83 2.83l4.24 4.24M14.83 2.83l-4.24 4.24M20.12 12.29l-4.24-4.24M3.88 12.29l4.24-4.24M14.83 21.17l-4.24-4.24M4.83 21.17l4.24-4.24"
                ></path>
              </svg>
              <svg
                *ngIf="currentStep.node.type === 'delay'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <svg
                *ngIf="currentStep.node.type === 'webhook'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
              <svg
                *ngIf="currentStep.node.type === 'database'"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                ></path>
              </svg>
            </div>
            <div class="step-info">
              <h3 class="step-title">{{ currentStep.node.title }}</h3>
              <p class="step-description">{{ currentStep.node.description }}</p>
            </div>
          </div>

          <!-- Step Content -->
          <div class="step-content">
            <!-- Form Step -->
            <div *ngIf="currentStep.node.type === 'form'" class="form-step">
              <div class="form-preview">
                <h4>Form Preview</h4>
                <div class="form-fields">
                  <div
                    *ngFor="let field of getFormFields(currentStep.node)"
                    class="form-field"
                  >
                    <label class="field-label">{{ field.label }}</label>
                    <div class="field-preview">
                      <input
                        *ngIf="field.type === 'text' || field.type === 'email'"
                        type="text"
                        [placeholder]="
                          field.placeholder ||
                          'Enter ' + field.label.toLowerCase()
                        "
                        class="field-input"
                        [(ngModel)]="currentStep.userInput[field.name]"
                      />
                      <textarea
                        *ngIf="field.type === 'textarea'"
                        [placeholder]="
                          field.placeholder ||
                          'Enter ' + field.label.toLowerCase()
                        "
                        class="field-textarea"
                        [(ngModel)]="currentStep.userInput[field.name]"
                      ></textarea>
                      <select
                        *ngIf="field.type === 'select'"
                        class="field-select"
                        [(ngModel)]="currentStep.userInput[field.name]"
                      >
                        <option value="">Select an option</option>
                        <option
                          *ngFor="let option of field.options"
                          [value]="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                      <div
                        *ngIf="field.type === 'checkbox'"
                        class="field-checkbox"
                      >
                        <input
                          type="checkbox"
                          [id]="field.name"
                          [(ngModel)]="currentStep.userInput[field.name]"
                        />
                        <label [for]="field.name">{{ field.label }}</label>
                      </div>
                      <div *ngIf="field.type === 'radio'" class="field-radio">
                        <div
                          *ngFor="let option of field.options"
                          class="radio-option"
                        >
                          <input
                            type="radio"
                            [name]="field.name"
                            [value]="option.value"
                            [(ngModel)]="currentStep.userInput[field.name]"
                          />
                          <label>{{ option.label }}</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Condition Step -->
            <div
              *ngIf="currentStep.node.type === 'condition'"
              class="condition-step"
            >
              <div class="condition-preview">
                <h4>
                  Condition:
                  {{ currentStep.node.config?.condition || 'Check condition' }}
                </h4>
                <div class="condition-options">
                  <button
                    class="condition-btn yes-btn"
                    (click)="handleConditionChoice('yes')"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Yes
                  </button>
                  <button
                    class="condition-btn no-btn"
                    (click)="handleConditionChoice('no')"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    No
                  </button>
                </div>
              </div>
            </div>

            <!-- Approval Step -->
            <div
              *ngIf="currentStep.node.type === 'approval'"
              class="approval-step"
            >
              <div class="approval-preview">
                <h4>Approval Required</h4>
                <p>
                  {{
                    currentStep.node.config?.approvalMessage ||
                      'Please review and approve this request.'
                  }}
                </p>
                <div class="approval-options">
                  <button
                    class="approval-btn approve-btn"
                    (click)="handleApprovalChoice('approved')"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Approve
                  </button>
                  <button
                    class="approval-btn reject-btn"
                    (click)="handleApprovalChoice('rejected')"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                    Reject
                  </button>
                </div>
              </div>
            </div>

            <!-- Email Step -->
            <div *ngIf="currentStep.node.type === 'email'" class="email-step">
              <div class="email-preview">
                <h4>Email Notification</h4>
                <div class="email-content">
                  <p>
                    <strong>To:</strong>
                    {{
                      currentStep.node.config?.recipient ||
                        'recipient@example.com'
                    }}
                  </p>
                  <p>
                    <strong>Subject:</strong>
                    {{ getEmailSubject(currentStep.node) }}
                  </p>
                  <div class="email-body">
                    {{
                      currentStep.node.config?.emailTemplate ||
                        'Email content will be sent here.'
                    }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Other Steps -->
            <div
              *ngIf="
                !['form', 'condition', 'approval', 'email'].includes(
                  currentStep.node.type
                )
              "
              class="other-step"
            >
              <div class="step-preview">
                <h4>{{ currentStep.node.title }}</h4>
                <p>{{ currentStep.node.description }}</p>
                <div class="step-config" *ngIf="currentStep.node.config">
                  <pre>{{
                    JSON.stringify(currentStep.node.config, null, 2)
                  }}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step Navigation -->
        <div class="step-navigation">
          <button
            class="nav-btn prev-btn"
            [disabled]="currentStepIndex === 0"
            (click)="previousStep()"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Previous
          </button>

          <button
            class="nav-btn next-btn"
            [disabled]="!canProceed()"
            (click)="nextStep()"
          >
            {{ isLastStep() ? 'Complete' : 'Next' }}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Step Timeline -->
        <div class="step-timeline">
          <h4>Workflow Steps</h4>
          <div class="timeline">
            <div
              *ngFor="let step of simulationSteps; let i = index"
              class="timeline-step"
              [class.active]="i === currentStepIndex"
              [class.completed]="step.status === 'completed'"
              [class.skipped]="step.status === 'skipped'"
              (click)="goToStep(i)"
            >
              <div class="timeline-icon">
                <svg
                  *ngIf="step.status === 'completed'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span *ngIf="step.status === 'pending'">{{ i + 1 }}</span>
                <span *ngIf="step.status === 'active'">{{ i + 1 }}</span>
                <span *ngIf="step.status === 'skipped'">-</span>
              </div>
              <div class="timeline-content">
                <div class="timeline-title">{{ step.node.title }}</div>
                <div class="timeline-status">{{ step.status }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .simulation-dialog-overlay {
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

      .simulation-dialog {
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

      .simulation-header {
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
        gap: 12px;
      }

      .simulation-title {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e293b;
      }

      .simulation-icon {
        width: 24px;
        height: 24px;
        color: #3b82f6;
      }

      .simulation-subtitle {
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
      }

      .simulation-progress {
        padding: 16px 32px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      }

      .progress-bar {
        width: 100%;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 8px;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #1d4ed8);
        transition: width 0.3s ease;
      }

      .progress-text {
        text-align: center;
        font-size: 0.875rem;
        color: #64748b;
        font-weight: 500;
      }

      .current-step {
        flex: 1;
        padding: 24px 32px;
        overflow-y: auto;
      }

      .step-header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;
      }

      .step-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        border-radius: 8px;
        color: #64748b;
      }

      .step-icon svg {
        width: 24px;
        height: 24px;
      }

      .step-info {
        flex: 1;
      }

      .step-title {
        margin: 0 0 4px 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
      }

      .step-description {
        margin: 0;
        color: #64748b;
        font-size: 0.875rem;
      }

      .step-content {
        background: #f8fafc;
        border-radius: 8px;
        padding: 20px;
        border: 1px solid #e2e8f0;
      }

      .form-step,
      .condition-step,
      .approval-step,
      .email-step,
      .other-step {
        min-height: 200px;
      }

      .form-fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .field-label {
        font-weight: 500;
        color: #374151;
        font-size: 0.875rem;
      }

      .field-input,
      .field-textarea,
      .field-select {
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.875rem;
        background: white;
      }

      .field-textarea {
        min-height: 80px;
        resize: vertical;
      }

      .field-checkbox,
      .field-radio {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .radio-option {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .condition-options,
      .approval-options {
        display: flex;
        gap: 16px;
        margin-top: 16px;
      }

      .condition-btn,
      .approval-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .yes-btn,
      .approve-btn {
        background: #10b981;
        color: white;
      }

      .yes-btn:hover,
      .approve-btn:hover {
        background: #059669;
      }

      .no-btn,
      .reject-btn {
        background: #ef4444;
        color: white;
      }

      .no-btn:hover,
      .reject-btn:hover {
        background: #dc2626;
      }

      .email-content {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 16px;
      }

      .email-body {
        margin-top: 12px;
        padding: 12px;
        background: #f8fafc;
        border-radius: 4px;
        white-space: pre-wrap;
      }

      .step-navigation {
        display: flex;
        justify-content: space-between;
        padding: 20px 32px;
        border-top: 1px solid #e2e8f0;
        background: #f8fafc;
      }

      .nav-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: white;
        color: #374151;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .nav-btn:hover:not(:disabled) {
        background: #f9fafb;
        border-color: #9ca3af;
      }

      .nav-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .next-btn {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
      }

      .next-btn:hover:not(:disabled) {
        background: #2563eb;
        border-color: #2563eb;
      }

      .step-timeline {
        padding: 20px 32px;
        border-top: 1px solid #e2e8f0;
        background: #f8fafc;
      }

      .step-timeline h4 {
        margin: 0 0 16px 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
      }

      .timeline {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 200px;
        overflow-y: auto;
      }

      .timeline-step {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .timeline-step:hover {
        background: rgba(59, 130, 246, 0.1);
      }

      .timeline-step.active {
        background: rgba(59, 130, 246, 0.1);
        border: 1px solid #3b82f6;
      }

      .timeline-step.completed {
        background: rgba(16, 185, 129, 0.1);
      }

      .timeline-step.skipped {
        opacity: 0.5;
      }

      .timeline-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e2e8f0;
        border-radius: 50%;
        font-size: 0.75rem;
        font-weight: 600;
        color: #64748b;
      }

      .timeline-step.completed .timeline-icon {
        background: #10b981;
        color: white;
      }

      .timeline-step.active .timeline-icon {
        background: #3b82f6;
        color: white;
      }

      .timeline-content {
        flex: 1;
      }

      .timeline-title {
        font-weight: 500;
        color: #1e293b;
        font-size: 0.875rem;
      }

      .timeline-status {
        font-size: 0.75rem;
        color: #64748b;
        text-transform: capitalize;
      }

      @media (max-width: 768px) {
        .simulation-dialog {
          max-width: 95vw;
          max-height: 95vh;
        }

        .simulation-header {
          padding: 20px 24px;
        }

        .current-step {
          padding: 20px 24px;
        }

        .step-navigation {
          padding: 16px 24px;
        }

        .step-timeline {
          padding: 16px 24px;
        }
      }
    `,
  ],
})
export class WorkflowSimulationDialogComponent implements OnInit {
  @Input() workflowNodes: WorkflowNode[] = [];
  @Input() workflowConnections: WorkflowConnection[] = [];
  @Output() simulationComplete = new EventEmitter<SimulationResult>();
  @Output() simulationClosed = new EventEmitter<void>();

  simulationSteps: SimulationStep[] = [];
  currentStepIndex = 0;
  simulationData: any = {};
  JSON = JSON; // Make JSON available in template

  get currentStep(): SimulationStep | null {
    return this.simulationSteps[this.currentStepIndex] || null;
  }

  get progressPercentage(): number {
    if (this.simulationSteps.length === 0) return 0;
    return ((this.currentStepIndex + 1) / this.simulationSteps.length) * 100;
  }

  ngOnInit() {
    this.initializeSimulation();
  }

  initializeSimulation() {
    // Create simulation steps from workflow nodes
    this.simulationSteps = this.workflowNodes
      .filter((node) => node.type !== 'start' && node.type !== 'finish')
      .map((node) => ({
        node,
        status: 'pending' as const,
        userInput: {},
        timestamp: undefined,
      }));

    // Set first step as active
    if (this.simulationSteps.length > 0) {
      this.simulationSteps[0].status = 'active';
    }
  }

  getFormFields(node: WorkflowNode): any[] {
    if (node.type === 'form' && node.config?.formData?.fields) {
      return node.config.formData.fields;
    }
    return [];
  }

  getEmailSubject(node: WorkflowNode): string {
    if (node.type === 'email' && node.config?.emailTemplate) {
      // Extract subject from email template or use default
      const lines = node.config.emailTemplate.split('\n');
      const subjectLine = lines.find((line: string) =>
        line.toLowerCase().includes('subject:')
      );
      if (subjectLine) {
        return subjectLine.replace(/subject:\s*/i, '').trim();
      }
    }
    return 'Workflow Notification';
  }

  handleConditionChoice(choice: 'yes' | 'no') {
    if (this.currentStep) {
      this.currentStep.userInput = { choice };
      this.currentStep.status = 'completed';
      this.currentStep.timestamp = new Date();

      // Determine next step based on condition choice
      this.determineNextStep(choice);
    }
  }

  handleApprovalChoice(choice: 'approved' | 'rejected') {
    if (this.currentStep) {
      this.currentStep.userInput = { choice };
      this.currentStep.status = 'completed';
      this.currentStep.timestamp = new Date();

      // Determine next step based on approval choice
      this.determineNextStep(choice);
    }
  }

  determineNextStep(choice: string) {
    // Find the next step based on connections and choice
    const currentConnections = this.workflowConnections.filter(
      (conn) => conn.from === this.currentStep?.node.id
    );

    if (currentConnections.length > 0) {
      // Find connection based on choice
      let nextConnection = currentConnections[0];

      if (currentConnections.length > 1) {
        // For condition nodes, look for connection with matching label
        if (this.currentStep?.node.type === 'condition') {
          const choiceConnection = currentConnections.find((conn) => {
            const label = conn.label?.toLowerCase() || '';
            const choiceLower = choice.toLowerCase();

            // Handle Yes/No conditions
            if (
              choiceLower === 'yes' &&
              (label.includes('yes') || label === '→')
            ) {
              return true;
            }
            if (choiceLower === 'no' && label.includes('no')) {
              return true;
            }

            // Handle approval conditions
            if (
              choiceLower === 'approved' &&
              (label.includes('approve') || label.includes('yes'))
            ) {
              return true;
            }
            if (
              choiceLower === 'rejected' &&
              (label.includes('reject') || label.includes('no'))
            ) {
              return true;
            }

            return false;
          });

          if (choiceConnection) {
            nextConnection = choiceConnection;
          }
        } else {
          // For non-condition nodes, just take the first connection
          nextConnection = currentConnections[0];
        }
      }

      // Find the next step
      const nextStepIndex = this.simulationSteps.findIndex(
        (step) => step.node.id === nextConnection.to
      );

      if (nextStepIndex !== -1) {
        this.currentStepIndex = nextStepIndex;
        this.simulationSteps[nextStepIndex].status = 'active';
      } else {
        // If next step not found in simulation steps, complete simulation
        this.completeSimulation();
      }
    } else {
      // No connections, move to next step
      this.nextStep();
    }
  }

  canProceed(): boolean {
    if (!this.currentStep) return false;

    switch (this.currentStep.node.type) {
      case 'form':
        // Check if required fields are filled
        const formFields = this.getFormFields(this.currentStep.node);
        const requiredFields = formFields.filter((field) => field.required);
        return requiredFields.every(
          (field) =>
            this.currentStep!.userInput[field.name] !== undefined &&
            this.currentStep!.userInput[field.name] !== ''
        );
      case 'condition':
      case 'approval':
        return this.currentStep!.userInput.choice !== undefined;
      default:
        return true;
    }
  }

  isLastStep(): boolean {
    return this.currentStepIndex === this.simulationSteps.length - 1;
  }

  nextStep() {
    if (this.currentStep) {
      this.currentStep.status = 'completed';
      this.currentStep.timestamp = new Date();
    }

    if (this.isLastStep()) {
      this.completeSimulation();
    } else {
      this.currentStepIndex++;
      this.simulationSteps[this.currentStepIndex].status = 'active';
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      if (this.currentStep) {
        this.currentStep.status = 'pending';
      }
      this.currentStepIndex--;
      this.simulationSteps[this.currentStepIndex].status = 'active';
    }
  }

  goToStep(stepIndex: number) {
    if (stepIndex >= 0 && stepIndex < this.simulationSteps.length) {
      // Mark current step as pending
      if (this.currentStep) {
        this.currentStep.status = 'pending';
      }

      this.currentStepIndex = stepIndex;
      this.simulationSteps[stepIndex].status = 'active';
    }
  }

  completeSimulation() {
    const result: SimulationResult = {
      steps: this.simulationSteps,
      totalSteps: this.simulationSteps.length,
      completedSteps: this.simulationSteps.filter(
        (s) => s.status === 'completed'
      ).length,
      duration:
        Date.now() -
        (this.simulationSteps[0]?.timestamp?.getTime() || Date.now()),
      finalData: this.simulationData,
    };

    this.simulationComplete.emit(result);
  }

  close() {
    this.simulationClosed.emit();
  }
}
