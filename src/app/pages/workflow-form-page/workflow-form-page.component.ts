import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-workflow-form-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="workflow-form-container">
      <div class="form-header">
        <div class="header-content">
          <h1 class="form-title">
            {{ workflowForm?.title || 'Workflow Form' }}
          </h1>
          <p class="form-description">
            {{ workflowForm?.description || 'Please fill out the form below' }}
          </p>
        </div>
      </div>

      <div class="form-content">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="workflow-form">
          <div class="form-progress" *ngIf="workflowSteps.length > 1">
            <div class="progress-bar">
              <div
                class="progress-fill"
                [style.width.%]="progressPercentage"
              ></div>
            </div>
            <div class="progress-text">
              Step {{ currentStepIndex + 1 }} of {{ workflowSteps.length }}
            </div>
          </div>

          <div class="form-step" *ngIf="currentStep">
            <div class="step-header">
              <h2 class="step-title">{{ currentStep.title }}</h2>
              <p class="step-description">{{ currentStep.description }}</p>
            </div>

            <div class="form-fields">
              <div
                *ngFor="let field of currentStep.fields"
                class="form-field"
                [class.field-error]="isFieldInvalid(field.name)"
              >
                <label [for]="field.name" class="field-label">
                  {{ field.label }}
                  <span class="required" *ngIf="field.required">*</span>
                </label>

                <!-- Text Input -->
                <input
                  *ngIf="
                    field.type === 'text' ||
                    field.type === 'email' ||
                    field.type === 'number'
                  "
                  [type]="field.type"
                  [id]="field.name"
                  [formControlName]="field.name"
                  [placeholder]="field.placeholder"
                  class="form-input"
                  [class.input-error]="isFieldInvalid(field.name)"
                />

                <!-- Textarea -->
                <textarea
                  *ngIf="field.type === 'textarea'"
                  [id]="field.name"
                  [formControlName]="field.name"
                  [placeholder]="field.placeholder"
                  class="form-textarea"
                  [class.input-error]="isFieldInvalid(field.name)"
                  rows="4"
                ></textarea>

                <!-- Select -->
                <select
                  *ngIf="field.type === 'select'"
                  [id]="field.name"
                  [formControlName]="field.name"
                  class="form-select"
                  [class.input-error]="isFieldInvalid(field.name)"
                >
                  <option value="">Select an option</option>
                  <option
                    *ngFor="let option of field.options"
                    [value]="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>

                <!-- Checkbox -->
                <div *ngIf="field.type === 'checkbox'" class="checkbox-group">
                  <label class="checkbox-label">
                    <input
                      type="checkbox"
                      [formControlName]="field.name"
                      class="form-checkbox"
                    />
                    <span class="checkbox-text">{{ field.label }}</span>
                  </label>
                </div>

                <!-- Radio Group -->
                <div *ngIf="field.type === 'radio'" class="radio-group">
                  <label
                    *ngFor="let option of field.options"
                    class="radio-label"
                  >
                    <input
                      type="radio"
                      [name]="field.name"
                      [value]="option.value"
                      [formControlName]="field.name"
                      class="form-radio"
                    />
                    <span class="radio-text">{{ option.label }}</span>
                  </label>
                </div>

                <!-- File Upload -->
                <div *ngIf="field.type === 'file'" class="file-upload">
                  <input
                    type="file"
                    [id]="field.name"
                    (change)="onFileSelected($event, field.name)"
                    class="form-file"
                    [accept]="field.accept"
                  />
                  <label [for]="field.name" class="file-label">
                    <svg
                      class="file-icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    Choose file
                  </label>
                </div>

                <!-- Error Message -->
                <div
                  *ngIf="isFieldInvalid(field.name)"
                  class="field-error-message"
                >
                  {{ getFieldErrorMessage(field.name) }}
                </div>

                <!-- Help Text -->
                <div *ngIf="field.helpText" class="field-help">
                  {{ field.helpText }}
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button
                type="button"
                class="btn btn-secondary"
                (click)="previousStep()"
                *ngIf="currentStepIndex > 0"
              >
                Previous
              </button>

              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="form.invalid || isSubmitting"
              >
                <span *ngIf="!isSubmitting">
                  {{
                    currentStepIndex === workflowSteps.length - 1
                      ? 'Submit'
                      : 'Next'
                  }}
                </span>
                <span *ngIf="isSubmitting">Submitting...</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .workflow-form-container {
        min-height: 100vh;
        background: #f8fafc;
        display: flex;
        flex-direction: column;
      }

      .form-header {
        background: white;
        border-bottom: 1px solid #e2e8f0;
        padding: 40px 24px;
        text-align: center;
      }

      .form-title {
        margin: 0 0 8px 0;
        font-size: 2rem;
        font-weight: 700;
        color: #1e293b;
      }

      .form-description {
        margin: 0;
        color: #64748b;
        font-size: 1.125rem;
      }

      .form-content {
        flex: 1;
        max-width: 800px;
        margin: 0 auto;
        width: 100%;
        padding: 40px 24px;
      }

      .workflow-form {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        padding: 32px;
      }

      .form-progress {
        margin-bottom: 32px;
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
        background: #3b82f6;
        transition: width 0.3s ease;
      }

      .progress-text {
        text-align: center;
        color: #64748b;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .step-header {
        margin-bottom: 32px;
        text-align: center;
      }

      .step-title {
        margin: 0 0 8px 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e293b;
      }

      .step-description {
        margin: 0;
        color: #64748b;
        font-size: 1rem;
      }

      .form-fields {
        display: flex;
        flex-direction: column;
        gap: 24px;
        margin-bottom: 32px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
      }

      .field-label {
        margin-bottom: 8px;
        font-weight: 500;
        color: #374151;
        font-size: 0.875rem;
      }

      .required {
        color: #ef4444;
      }

      .form-input,
      .form-textarea,
      .form-select {
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 1rem;
        transition: all 0.2s;
        background: white;
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
        min-height: 100px;
      }

      .checkbox-group,
      .radio-group {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .checkbox-label,
      .radio-label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        font-size: 0.875rem;
        color: #374151;
      }

      .form-checkbox,
      .form-radio {
        width: 16px;
        height: 16px;
        accent-color: #3b82f6;
      }

      .file-upload {
        position: relative;
      }

      .form-file {
        position: absolute;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }

      .file-label {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border: 2px dashed #d1d5db;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        color: #64748b;
        font-size: 0.875rem;
      }

      .file-label:hover {
        border-color: #3b82f6;
        color: #3b82f6;
      }

      .file-icon {
        width: 20px;
        height: 20px;
      }

      .field-error-message {
        margin-top: 4px;
        color: #ef4444;
        font-size: 0.75rem;
      }

      .field-help {
        margin-top: 4px;
        color: #64748b;
        font-size: 0.75rem;
      }

      .input-error {
        border-color: #ef4444;
      }

      .input-error:focus {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }

      .form-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: white;
        color: #374151;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;
      }

      .btn:hover:not(:disabled) {
        background: #f9fafb;
        border-color: #9ca3af;
      }

      .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .btn-primary {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
      }

      .btn-primary:hover:not(:disabled) {
        background: #2563eb;
        border-color: #2563eb;
      }

      .btn-secondary {
        background: #6b7280;
        color: white;
        border-color: #6b7280;
      }

      .btn-secondary:hover:not(:disabled) {
        background: #4b5563;
        border-color: #4b5563;
      }

      @media (max-width: 768px) {
        .form-content {
          padding: 20px 16px;
        }

        .workflow-form {
          padding: 24px;
        }

        .form-actions {
          flex-direction: column;
        }

        .btn {
          width: 100%;
          justify-content: center;
        }
      }
    `,
  ],
})
export class WorkflowFormPageComponent implements OnInit {
  workflowForm: any = null;
  workflowSteps: any[] = [];
  currentStepIndex = 0;
  currentStep: any = null;
  form: FormGroup;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    const workflowId = this.route.snapshot.paramMap.get('workflowId');
    this.loadWorkflowForm(workflowId);
  }

  loadWorkflowForm(workflowId: string | null) {
    // In a real application, this would fetch from a backend service
    // For now, we'll create a sample workflow form
    this.workflowForm = {
      id: workflowId,
      title: 'Customer Registration Form',
      description:
        'Please provide your information to complete the registration process.',
      steps: [
        {
          id: 'step1',
          title: 'Personal Information',
          description: 'Enter your basic personal details',
          fields: [
            {
              name: 'firstName',
              label: 'First Name',
              type: 'text',
              required: true,
              placeholder: 'Enter your first name',
            },
            {
              name: 'lastName',
              label: 'Last Name',
              type: 'text',
              required: true,
              placeholder: 'Enter your last name',
            },
            {
              name: 'email',
              label: 'Email Address',
              type: 'email',
              required: true,
              placeholder: 'Enter your email address',
            },
            {
              name: 'phone',
              label: 'Phone Number',
              type: 'text',
              required: false,
              placeholder: 'Enter your phone number',
            },
          ],
        },
        {
          id: 'step2',
          title: 'Company Information',
          description: 'Tell us about your company',
          fields: [
            {
              name: 'companyName',
              label: 'Company Name',
              type: 'text',
              required: true,
              placeholder: 'Enter your company name',
            },
            {
              name: 'jobTitle',
              label: 'Job Title',
              type: 'text',
              required: false,
              placeholder: 'Enter your job title',
            },
            {
              name: 'industry',
              label: 'Industry',
              type: 'select',
              required: true,
              options: [
                { value: 'technology', label: 'Technology' },
                { value: 'healthcare', label: 'Healthcare' },
                { value: 'finance', label: 'Finance' },
                { value: 'education', label: 'Education' },
                { value: 'other', label: 'Other' },
              ],
            },
            {
              name: 'companySize',
              label: 'Company Size',
              type: 'radio',
              required: true,
              options: [
                { value: '1-10', label: '1-10 employees' },
                { value: '11-50', label: '11-50 employees' },
                { value: '51-200', label: '51-200 employees' },
                { value: '200+', label: '200+ employees' },
              ],
            },
          ],
        },
        {
          id: 'step3',
          title: 'Additional Information',
          description: "Any additional details you'd like to share",
          fields: [
            {
              name: 'message',
              label: 'Message',
              type: 'textarea',
              required: false,
              placeholder: 'Tell us about your needs...',
              helpText:
                'Optional: Share any additional information about your requirements',
            },
            {
              name: 'newsletter',
              label: 'Subscribe to newsletter',
              type: 'checkbox',
              required: false,
            },
            {
              name: 'resume',
              label: 'Upload Resume',
              type: 'file',
              required: false,
              accept: '.pdf,.doc,.docx',
            },
          ],
        },
      ],
    };

    this.workflowSteps = this.workflowForm.steps;
    this.currentStep = this.workflowSteps[0];
    this.buildForm();
  }

  buildForm() {
    const group: any = {};

    this.currentStep.fields.forEach((field: any) => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      group[field.name] = ['', validators];
    });

    this.form = this.fb.group(group);
  }

  get progressPercentage(): number {
    return ((this.currentStepIndex + 1) / this.workflowSteps.length) * 100;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'This field is required';
    }
    if (field.hasError('email')) {
      return 'Please enter a valid email address';
    }

    return 'Invalid input';
  }

  onFileSelected(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ [fieldName]: file });
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.currentStep = this.workflowSteps[this.currentStepIndex];
      this.buildForm();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.currentStepIndex < this.workflowSteps.length - 1) {
        // Move to next step
        this.currentStepIndex++;
        this.currentStep = this.workflowSteps[this.currentStepIndex];
        this.buildForm();
      } else {
        // Submit the form
        this.submitForm();
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  submitForm() {
    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      const formData = this.form.value;
      console.log('Form submitted:', formData);

      // In a real application, you would send this to your backend
      alert('Form submitted successfully!');

      this.isSubmitting = false;
      // Redirect or show success message
    }, 2000);
  }

  private markFormGroupTouched() {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }
}
