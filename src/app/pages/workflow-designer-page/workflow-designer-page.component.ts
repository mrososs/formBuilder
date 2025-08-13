import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  WorkflowService,
  Workflow,
  WorkflowNode,
  WorkflowConnection,
} from '../../services/workflow.service';
import { FormBuilderModalComponent } from '../../components/form-builder-modal/form-builder-modal.component';

@Component({
  selector: 'app-workflow-designer-page',
  imports: [CommonModule, FormsModule, FormBuilderModalComponent],
  template: `
    <div class="workflow-designer-container">
      <!-- Mobile Header -->
      <div class="lg:hidden bg-white border-b border-gray-200 p-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              Workflow Designer
            </h2>
            <p class="text-sm text-gray-600">
              Design and manage your workflows
            </p>
          </div>
          <button
            class="lg:hidden p-2 rounded-md bg-blue-600 text-white"
            (click)="toggleMobileSidebar()"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>

        <!-- Mobile Search -->
        <div class="relative">
          <input
            type="text"
            placeholder="Search activities..."
            [(ngModel)]="searchTerm"
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      <!-- Desktop Header -->
      <div class="hidden lg:block workflow-header">
        <div class="header-left">
          <h2 class="workflow-title">Workflow Designer</h2>
          <p class="workflow-subtitle">Design and manage your workflows</p>

          <!-- Workflow Metadata -->
          <div class="workflow-metadata">
            <div class="metadata-row">
              <div class="metadata-field">
                <label>Workflow Title:</label>
                <input
                  type="text"
                  [(ngModel)]="workflowTitle"
                  placeholder="Enter workflow title..."
                  class="metadata-input"
                />
              </div>
              <div class="metadata-field">
                <label>Category:</label>
                <select [(ngModel)]="workflowCategory" class="metadata-select">
                  <option
                    *ngFor="let category of workflowCategories"
                    [value]="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>
            <div class="metadata-row">
              <div class="metadata-field full-width">
                <label>Description:</label>
                <textarea
                  [(ngModel)]="workflowDescription"
                  placeholder="Enter workflow description..."
                  class="metadata-textarea"
                  rows="2"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="header-center">
          <div class="search-container">
            <input
              type="text"
              placeholder="Search activities..."
              [(ngModel)]="searchTerm"
              class="search-input"
            />
            <svg
              class="search-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>
        <div class="header-right">
          <div class="workflow-toolbar">
            <!-- Undo/Redo -->
            <button
              class="btn btn-outline"
              [disabled]="!canUndo"
              (click)="undo()"
              title="Undo (Ctrl+Z)"
            >
              <svg
                class="btn-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                ></path>
              </svg>
            </button>
            <button
              class="btn btn-outline"
              [disabled]="!canRedo"
              (click)="redo()"
              title="Redo (Ctrl+Y)"
            >
              <svg
                class="btn-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"
                ></path>
              </svg>
            </button>

            <!-- Templates -->
            <button
              class="btn btn-outline"
              (click)="showTemplates = !showTemplates"
              title="Load Template"
            >
              <svg
                class="btn-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                ></path>
              </svg>
              Templates
            </button>

            <button
              class="btn btn-outline"
              (click)="clearCanvas()"
              title="Clear Canvas (Ctrl+Shift+C)"
            >
              <svg
                class="btn-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
              Clear
            </button>
            <button
              class="btn btn-outline"
              (click)="autoLayout()"
              title="Auto Layout (Ctrl+L)"
            >
              <svg
                class="btn-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                ></path>
              </svg>
              Auto Layout
            </button>
            <button
              class="btn btn-outline"
              (click)="validateWorkflow()"
              title="Validate Workflow (Ctrl+V)"
            >
              <svg
                class="btn-icon"
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
              Validate
            </button>
            <button
              class="btn btn-primary"
              (click)="saveWorkflow()"
              title="Save Workflow (Ctrl+S)"
            >
              <svg
                class="btn-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                ></path>
              </svg>
              Save Workflow
            </button>
            <button
              class="btn btn-secondary"
              (click)="exportWorkflow()"
              title="Export Workflow (Ctrl+E)"
            >
              <svg
                class="btn-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      <!-- Templates Dropdown -->
      <div class="templates-dropdown" *ngIf="showTemplates">
        <div class="templates-header">
          <h4>Workflow Templates</h4>
          <div class="template-controls">
            <select
              [(ngModel)]="selectedTemplateCategory"
              class="template-filter"
            >
              <option value="">All Categories</option>
              <option
                *ngFor="let category of workflowCategories"
                [value]="category"
              >
                {{ category }}
              </option>
            </select>
            <button class="btn btn-sm" (click)="showTemplates = false">
              ×
            </button>
          </div>
        </div>
        <div class="templates-list">
          <div
            *ngFor="let template of filteredTemplates"
            class="template-item"
            (click)="loadTemplate(template)"
          >
            <div class="template-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                ></path>
              </svg>
            </div>
            <div class="template-info">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-category">{{ template.category }}</div>
              <div class="template-description">{{ template.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Bar -->
      <div class="status-bar">
        <div class="status-left">
          <span class="status-item">
            <span class="status-label">Nodes:</span>
            <span class="status-value">{{ workflowNodes.length }}</span>
          </span>
          <span class="status-item">
            <span class="status-label">Connections:</span>
            <span class="status-value">{{ workflowConnections.length }}</span>
          </span>
          <span class="status-item" *ngIf="validationErrors.length > 0">
            <span class="status-label">Errors:</span>
            <span class="status-value error">{{
              validationErrors.length
            }}</span>
          </span>
        </div>
        <div class="status-right">
          <span class="status-item">
            <span class="status-label">Zoom:</span>
            <span class="status-value">{{ Math.round(zoomLevel * 100) }}%</span>
          </span>
          <span class="status-item">
            <span class="status-label">Position:</span>
            <span class="status-value"
              >{{ Math.round(canvasOffset.x) }},
              {{ Math.round(canvasOffset.y) }}</span
            >
          </span>
        </div>
      </div>

      <div class="workflow-content">
        <!-- Mobile Sidebar Overlay -->
        <div
          *ngIf="showMobileSidebar"
          class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          (click)="toggleMobileSidebar()"
        ></div>

        <!-- Mobile Sidebar -->
        <div
          *ngIf="showMobileSidebar"
          class="lg:hidden fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300"
        >
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Activities</h3>
              <button
                class="p-1 rounded-md hover:bg-gray-100"
                (click)="toggleMobileSidebar()"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="overflow-y-auto h-full">
            <div class="p-4">
              <div class="activity-list">
                <div
                  *ngFor="let activity of filteredActivities"
                  class="activity-item"
                  draggable="true"
                  (dragstart)="onDragStart($event, activity)"
                  (dragend)="onDragEnd($event)"
                  (click)="addActivity(activity); toggleMobileSidebar()"
                >
                  <div class="activity-icon" [class]="activity.icon">
                    <svg
                      *ngIf="activity.icon === 'form'"
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
                      *ngIf="activity.icon === 'email'"
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
                      *ngIf="activity.icon === 'condition'"
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
                      *ngIf="activity.icon === 'delay'"
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
                      *ngIf="activity.icon === 'approval'"
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
                      *ngIf="activity.icon === 'notification'"
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
                      *ngIf="activity.icon === 'webhook'"
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
                      *ngIf="activity.icon === 'database'"
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
                    <svg
                      *ngIf="activity.icon === 'finish'"
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
                  </div>
                  <div class="activity-info">
                    <div class="activity-name">{{ activity.name }}</div>
                    <div class="activity-description">
                      {{ activity.description }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop Sidebar -->
        <div class="hidden lg:block workflow-sidebar">
          <div class="sidebar-section">
            <h3 class="section-title">Workflow Activities</h3>
            <div class="activity-list">
              <div
                *ngFor="let activity of filteredActivities"
                class="activity-item"
                draggable="true"
                (dragstart)="onDragStart($event, activity)"
                (dragend)="onDragEnd($event)"
                (click)="addActivity(activity)"
              >
                <div class="activity-icon" [class]="activity.icon">
                  <svg
                    *ngIf="activity.icon === 'form'"
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
                    *ngIf="activity.icon === 'email'"
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
                    *ngIf="activity.icon === 'condition'"
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
                    *ngIf="activity.icon === 'delay'"
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
                    *ngIf="activity.icon === 'approval'"
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
                    *ngIf="activity.icon === 'notification'"
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
                    *ngIf="activity.icon === 'webhook'"
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
                    *ngIf="activity.icon === 'database'"
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
                  <svg
                    *ngIf="activity.icon === 'finish'"
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
                </div>
                <div class="activity-info">
                  <div class="activity-name">{{ activity.name }}</div>
                  <div class="activity-description">
                    {{ activity.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="workflow-canvas" #workflowCanvas>
          <!-- Mobile Canvas Header -->
          <div class="lg:hidden bg-white border-b border-gray-200 p-3">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Canvas</h3>
              <div class="flex space-x-2">
                <button
                  class="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                  (click)="zoomIn()"
                  title="Zoom In"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </button>
                <button
                  class="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                  (click)="zoomOut()"
                  title="Zoom Out"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18 12H6"
                    ></path>
                  </svg>
                </button>
                <button
                  class="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                  (click)="resetZoom()"
                  title="Reset Zoom"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    ></path>
                  </svg>
                </button>
                <button
                  class="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                  (click)="centerCanvas()"
                  title="Center Canvas"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div class="mt-2 text-sm text-gray-600">
              Zoom: {{ Math.round(zoomLevel * 100) }}% | Nodes:
              {{ workflowNodes.length }} | Connections:
              {{ workflowConnections.length }}
            </div>
          </div>

          <!-- Desktop Canvas Header -->
          <div class="hidden lg:block canvas-header">
            <h3>Workflow Canvas</h3>
            <div class="canvas-controls">
              <button
                class="btn btn-sm"
                (click)="zoomIn()"
                title="Zoom In (Ctrl++)"
              >
                +
              </button>
              <button
                class="btn btn-sm"
                (click)="zoomOut()"
                title="Zoom Out (Ctrl+-)"
              >
                -
              </button>
              <button
                class="btn btn-sm"
                (click)="resetZoom()"
                title="Reset Zoom (Ctrl+0)"
              >
                Reset
              </button>
              <button
                class="btn btn-sm"
                (click)="centerCanvas()"
                title="Center Canvas"
              >
                ⌂
              </button>
            </div>
          </div>

          <div
            class="canvas-content"
            [class.drawing-connection]="isDrawingConnection"
            [class.panning]="isPanning"
            (dragover)="onDragOver($event)"
            (drop)="onDrop($event)"
            (click)="onCanvasClick($event)"
            (mousemove)="onMouseMove($event); onNodeDrag($event)"
            (mouseup)="cancelConnection(); endNodeDrag(); endPanning()"
            (mousedown)="startPanning($event)"
            (wheel)="onWheel($event)"
            (touchstart)="onTouchStart($event)"
            (touchmove)="onTouchMove($event)"
          >
            <div
              *ngFor="let node of workflowNodes"
              class="workflow-node"
              [style.left.px]="node.x"
              [style.top.px]="node.y"
              [class.selected]="selectedNode === node"
              [class.connection-target]="
                isDrawingConnection && connectionStartNode?.id !== node.id
              "
              [class.dragging]="isDraggingNode && draggedNode?.id === node.id"
              (click)="selectNode(node, $event)"
              (mouseup)="endConnection(node, $event)"
              (mousedown)="startNodeDrag(node, $event)"
            >
              <div class="node-header">
                <div class="node-icon" [class]="node.type">
                  <svg
                    *ngIf="node.type === 'form'"
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
                    *ngIf="node.type === 'email'"
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
                    *ngIf="node.type === 'condition'"
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
                    *ngIf="node.type === 'delay'"
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
                    *ngIf="node.type === 'approval'"
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
                    *ngIf="node.type === 'notification'"
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
                    *ngIf="node.type === 'webhook'"
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
                    *ngIf="node.type === 'database'"
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
                  <svg
                    *ngIf="node.type === 'finish'"
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
                </div>
                <div class="node-title">{{ node.title }}</div>
                <button class="node-delete" (click)="deleteNode(node, $event)">
                  ×
                </button>
              </div>
              <div class="node-content">
                <div class="node-description">{{ node.description }}</div>
                <div class="node-actions">
                  <button
                    *ngIf="node.type === 'form'"
                    class="btn btn-sm btn-primary"
                    (click)="openFormBuilder(node)"
                  >
                    Configure Form
                  </button>
                  <button
                    *ngIf="node.type === 'condition'"
                    class="btn btn-sm btn-secondary"
                    (click)="configureCondition(node)"
                  >
                    Configure Condition
                  </button>
                  <button
                    class="btn btn-sm btn-outline"
                    (mousedown)="startConnection(node, $event)"
                    title="Start connection from this node"
                  >
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Connection lines -->
            <svg class="connections-layer">
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="12"
                  markerHeight="8"
                  refX="10"
                  refY="4"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 12 4, 0 8"
                    fill="#3b82f6"
                    stroke="#2563eb"
                    stroke-width="1"
                  />
                </marker>
                <marker
                  id="arrowhead-drawing"
                  markerWidth="12"
                  markerHeight="8"
                  refX="10"
                  refY="4"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 12 4, 0 8"
                    fill="#ef4444"
                    stroke="#dc2626"
                    stroke-width="1"
                  />
                </marker>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <!-- Existing connections -->
              <g *ngFor="let connection of workflowConnections">
                <!-- Connection path with curve -->
                <path
                  [attr.d]="getConnectionPath(connection)"
                  stroke="#3b82f6"
                  stroke-width="3"
                  fill="none"
                  marker-end="url(#arrowhead)"
                  class="connection-line"
                  filter="url(#glow)"
                  (click)="deleteConnection(connection, $event)"
                />

                <!-- Connection label -->
                <text
                  [attr.x]="getConnectionLabelPosition(connection).x"
                  [attr.y]="getConnectionLabelPosition(connection).y"
                  class="connection-label"
                  text-anchor="middle"
                  dominant-baseline="middle"
                >
                  {{ connection.label || '→' }}
                </text>

                <!-- Connection points -->
                <circle
                  [attr.cx]="connection.fromPoint?.x || connection.from.x"
                  [attr.cy]="connection.fromPoint?.y || connection.from.y"
                  r="4"
                  fill="#3b82f6"
                  stroke="#2563eb"
                  stroke-width="2"
                  class="connection-point"
                />
                <circle
                  [attr.cx]="connection.toPoint?.x || connection.to.x"
                  [attr.cy]="connection.toPoint?.y || connection.to.y"
                  r="4"
                  fill="#3b82f6"
                  stroke="#2563eb"
                  stroke-width="2"
                  class="connection-point"
                />
              </g>

              <!-- Drawing connection -->
              <path
                *ngIf="isDrawingConnection"
                [attr.d]="getDrawingConnectionPath()"
                stroke="#ef4444"
                stroke-width="3"
                stroke-dasharray="8,4"
                fill="none"
                marker-end="url(#arrowhead-drawing)"
                filter="url(#glow)"
              />
            </svg>
          </div>

          <!-- Mini-map -->
        </div>

        <!-- Mobile Properties Panel -->
        <div
          *ngIf="selectedNode"
          class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 max-h-96 overflow-y-auto"
        >
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">Properties</h3>
              <button
                class="p-1 rounded-md hover:bg-gray-100"
                (click)="selectedNode = null"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
          <div class="p-4">
            <div class="property-group">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Title</label
              >
              <input
                type="text"
                [(ngModel)]="selectedNode.title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div class="property-group mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Description</label
              >
              <textarea
                [(ngModel)]="selectedNode.description"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Desktop Properties Panel -->
        <div class="hidden lg:block workflow-properties" *ngIf="selectedNode">
          <div class="properties-header">
            <h3>Properties</h3>
            <button class="btn btn-sm" (click)="selectedNode = null">×</button>
          </div>
          <div class="properties-content">
            <div class="property-group">
              <label>Title</label>
              <input
                type="text"
                [(ngModel)]="selectedNode.title"
                class="form-input"
              />
            </div>
            <div class="property-group">
              <label>Description</label>
              <textarea
                [(ngModel)]="selectedNode.description"
                class="form-textarea"
              ></textarea>
            </div>

            <!-- Form Configuration -->
            <div class="property-group" *ngIf="selectedNode.type === 'form'">
              <label>Form Configuration</label>
              <button
                class="btn btn-primary"
                (click)="openFormBuilder(selectedNode)"
              >
                Open Form Builder
              </button>
            </div>

            <!-- Condition Configuration -->
            <div
              class="property-group"
              *ngIf="selectedNode.type === 'condition'"
            >
              <label>Condition Type</label>
              <select
                [(ngModel)]="selectedNode.config.conditionType"
                class="form-select"
              >
                <option value="yes_no">Yes/No Decision</option>
                <option value="field_value">Field Value Check</option>
                <option value="custom">Custom Condition</option>
              </select>

              <div
                *ngIf="selectedNode.config.conditionType === 'yes_no'"
                class="mt-3"
              >
                <label>Condition Question</label>
                <input
                  type="text"
                  [(ngModel)]="selectedNode.config.condition"
                  placeholder="e.g., Is the user approved?"
                  class="form-input"
                />
                <div class="condition-paths mt-2">
                  <div class="path-item">
                    <label>Yes Path:</label>
                    <input
                      type="text"
                      [(ngModel)]="selectedNode.config.yesPath"
                      placeholder="Next step for Yes"
                      class="form-input"
                    />
                  </div>
                  <div class="path-item">
                    <label>No Path:</label>
                    <input
                      type="text"
                      [(ngModel)]="selectedNode.config.noPath"
                      placeholder="Next step for No"
                      class="form-input"
                    />
                  </div>
                </div>
              </div>

              <div
                *ngIf="selectedNode.config.conditionType === 'field_value'"
                class="mt-3"
              >
                <label>Field to Check</label>
                <input
                  type="text"
                  [(ngModel)]="selectedNode.config.fieldName"
                  placeholder="e.g., userType"
                  class="form-input"
                />
                <label>Expected Value</label>
                <input
                  type="text"
                  [(ngModel)]="selectedNode.config.expectedValue"
                  placeholder="e.g., admin"
                  class="form-input"
                />
              </div>

              <div
                *ngIf="selectedNode.config.conditionType === 'custom'"
                class="mt-3"
              >
                <label>Custom Condition</label>
                <textarea
                  [(ngModel)]="selectedNode.config.customCondition"
                  placeholder="Enter custom condition logic..."
                  class="form-textarea"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <!-- Email Configuration -->
            <div class="property-group" *ngIf="selectedNode.type === 'email'">
              <label>Email Template</label>
              <textarea
                [(ngModel)]="selectedNode.config.emailTemplate"
                placeholder="Enter email template..."
                class="form-textarea"
                rows="4"
              ></textarea>
              <label>Recipient</label>
              <input
                type="email"
                [(ngModel)]="selectedNode.config.recipient"
                placeholder="recipient@example.com"
                class="form-input"
              />
            </div>

            <!-- Delay Configuration -->
            <div class="property-group" *ngIf="selectedNode.type === 'delay'">
              <label>Delay Duration (seconds)</label>
              <input
                type="number"
                [(ngModel)]="selectedNode.config.delaySeconds"
                min="1"
                class="form-input"
              />
            </div>

            <!-- Approval Configuration -->
            <div
              class="property-group"
              *ngIf="selectedNode.type === 'approval'"
            >
              <label>Approval Type</label>
              <select
                [(ngModel)]="selectedNode.config.approvalType"
                class="form-select"
              >
                <option value="single">Single Approver</option>
                <option value="multiple">Multiple Approvers</option>
                <option value="group">Group Approval</option>
              </select>
              <label>Approver(s)</label>
              <input
                type="text"
                [(ngModel)]="selectedNode.config.approvers"
                placeholder="Enter approver emails (comma separated)"
                class="form-input"
              />
              <label>Approval Message</label>
              <textarea
                [(ngModel)]="selectedNode.config.approvalMessage"
                placeholder="Message to show to approvers..."
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>

            <!-- Notification Configuration -->
            <div
              class="property-group"
              *ngIf="selectedNode.type === 'notification'"
            >
              <label>Notification Type</label>
              <select
                [(ngModel)]="selectedNode.config.notificationType"
                class="form-select"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="push">Push Notification</option>
                <option value="in_app">In-App</option>
              </select>
              <label>Recipients</label>
              <input
                type="text"
                [(ngModel)]="selectedNode.config.recipients"
                placeholder="Enter recipient emails/phones"
                class="form-input"
              />
              <label>Message</label>
              <textarea
                [(ngModel)]="selectedNode.config.message"
                placeholder="Notification message..."
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>

            <!-- Webhook Configuration -->
            <div class="property-group" *ngIf="selectedNode.type === 'webhook'">
              <label>Webhook URL</label>
              <input
                type="url"
                [(ngModel)]="selectedNode.config.webhookUrl"
                placeholder="https://api.example.com/webhook"
                class="form-input"
              />
              <label>HTTP Method</label>
              <select
                [(ngModel)]="selectedNode.config.httpMethod"
                class="form-select"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <label>Headers (JSON)</label>
              <textarea
                [(ngModel)]="selectedNode.config.headers"
                placeholder='{"Content-Type": "application/json"}'
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>

            <!-- Database Configuration -->
            <div
              class="property-group"
              *ngIf="selectedNode.type === 'database'"
            >
              <label>Operation Type</label>
              <select
                [(ngModel)]="selectedNode.config.operationType"
                class="form-select"
              >
                <option value="insert">Insert</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="select">Select</option>
              </select>
              <label>Table Name</label>
              <input
                type="text"
                [(ngModel)]="selectedNode.config.tableName"
                placeholder="Enter table name"
                class="form-input"
              />
              <label>Query/Data (JSON)</label>
              <textarea
                [(ngModel)]="selectedNode.config.queryData"
                placeholder='{"column": "value"} or SQL query'
                class="form-textarea"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Validation Errors Panel -->
      <div class="validation-panel" *ngIf="validationErrors.length > 0">
        <div class="validation-header">
          <h4>Validation Errors</h4>
          <button class="btn btn-sm" (click)="validationErrors = []">×</button>
        </div>
        <div class="validation-list">
          <div *ngFor="let error of validationErrors" class="validation-error">
            <svg
              class="error-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>{{ error.message }}</span>
          </div>
        </div>
      </div>

      <!-- Form Builder Modal -->
      <app-form-builder-modal
        *ngIf="showFormBuilderModal"
        [workflowNode]="selectedFormNode"
        (formSaved)="onFormSaved($event)"
        (modalClosed)="closeFormBuilderModal()"
      />
    </div>
  `,
  styles: [
    `
      .workflow-designer-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background: #f8fafc;
        overflow: hidden;
      }

      /* Mobile responsive adjustments */
      @media (max-width: 1024px) {
        .workflow-designer-container {
          height: 100vh;
        }

        .workflow-content {
          flex: 1;
          overflow: auto;
          display: flex;
        }

        .canvas-content {
          min-width: auto;
          min-height: auto;
          width: 100%;
          height: 100%;
        }
      }

      .workflow-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px;
        background: white;
        border-bottom: 1px solid #e2e8f0;
        flex-shrink: 0;
      }

      .header-left h2 {
        margin: 0 0 4px 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e293b;
      }

      .header-left p {
        margin: 0;
        color: #64748b;
        font-size: 0.875rem;
      }

      /* Workflow Metadata Styles */
      .workflow-metadata {
        margin-top: 16px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }

      .metadata-row {
        display: flex;
        gap: 16px;
        margin-bottom: 12px;
      }

      .metadata-row:last-child {
        margin-bottom: 0;
      }

      .metadata-field {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .metadata-field.full-width {
        flex: 1;
      }

      .metadata-field label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #374151;
        margin-bottom: 4px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .metadata-input,
      .metadata-select,
      .metadata-textarea {
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.875rem;
        background: white;
        transition: all 0.2s;
      }

      .metadata-input:focus,
      .metadata-select:focus,
      .metadata-textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .metadata-textarea {
        resize: vertical;
        min-height: 60px;
        font-family: inherit;
      }

      .header-center {
        flex: 1;
        display: flex;
        justify-content: center;
        max-width: 400px;
        margin: 0 20px;
      }

      .search-container {
        position: relative;
        width: 100%;
      }

      .search-input {
        width: 100%;
        padding: 8px 12px 8px 40px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        font-size: 0.875rem;
        background: white;
        transition: all 0.2s;
      }

      .search-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .search-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 16px;
        height: 16px;
        color: #64748b;
      }

      .header-right {
        display: flex;
        gap: 12px;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
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

      .btn:hover {
        background: #f9fafb;
        border-color: #9ca3af;
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
        background: #6b7280;
        color: white;
        border-color: #6b7280;
      }

      .btn-secondary:hover {
        background: #4b5563;
        border-color: #4b5563;
      }

      .btn-sm {
        padding: 4px 8px;
        font-size: 0.75rem;
      }

      .btn-icon {
        width: 16px;
        height: 16px;
      }

      .workflow-content {
        display: flex;
        flex: 1;
        overflow: auto;
        position: relative;
      }

      /* Mobile layout adjustments */
      @media (max-width: 1024px) {
        .workflow-content {
          flex-direction: column;
        }

        .workflow-canvas {
          flex: 1;
          min-height: 0;
        }
      }

      .workflow-sidebar {
        width: 300px;
        background: white;
        border-right: 1px solid #e2e8f0;
        overflow-y: auto;
      }

      .sidebar-section {
        padding: 20px;
      }

      .section-title {
        margin: 0 0 16px 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
      }

      .activity-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .activity-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
      }

      /* Mobile activity item adjustments */
      @media (max-width: 1024px) {
        .activity-item {
          padding: 10px;
          gap: 10px;
        }

        .activity-icon {
          width: 28px;
          height: 28px;
        }

        .activity-icon svg {
          width: 16px;
          height: 16px;
        }

        .activity-name {
          font-size: 0.875rem;
        }

        .activity-description {
          font-size: 0.75rem;
        }
      }

      .activity-item:hover {
        background: #f8fafc;
        border-color: #3b82f6;
      }

      .activity-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        border-radius: 6px;
        color: #64748b;
      }

      .activity-icon svg {
        width: 20px;
        height: 20px;
      }

      .activity-info {
        flex: 1;
      }

      .activity-name {
        font-weight: 500;
        color: #1e293b;
        font-size: 0.875rem;
      }

      .activity-description {
        color: #64748b;
        font-size: 0.75rem;
        margin-top: 2px;
      }

      .workflow-canvas {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #f8fafc;
        overflow: auto;
      }

      .canvas-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        background: white;
        border-bottom: 1px solid #e2e8f0;
      }

      .canvas-header h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
      }

      .canvas-controls {
        display: flex;
        gap: 8px;
      }

      .canvas-content {
        flex: 1;
        position: relative;
        overflow: auto;
        padding: 20px;
        min-width: 1200px;
        min-height: 1000px;
        background: linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px);
        background-size: 20px 20px;
        transition: transform 0.2s ease-out;
      }

      .workflow-node {
        position: absolute;
        width: 200px;
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        cursor: move;
        transition: all 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        /* Improve rendering quality during zoom */
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
        transform-origin: center center;
      }

      /* Mobile node adjustments */
      @media (max-width: 1024px) {
        .workflow-node {
          width: 160px;
          font-size: 0.875rem;
        }

        .workflow-node .node-header {
          padding: 8px;
        }

        .workflow-node .node-content {
          padding: 8px;
        }

        .workflow-node .node-title {
          font-size: 0.875rem;
        }

        .workflow-node .node-description {
          font-size: 0.75rem;
        }
      }

      .workflow-node:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .workflow-node.selected {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .node-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px;
        border-bottom: 1px solid #f1f5f9;
      }

      .node-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        border-radius: 4px;
        color: #64748b;
      }

      .node-icon svg {
        width: 16px;
        height: 16px;
      }

      .node-title {
        flex: 1;
        font-weight: 500;
        color: #1e293b;
        font-size: 0.875rem;
      }

      .node-delete {
        width: 20px;
        height: 20px;
        border: none;
        background: none;
        color: #ef4444;
        cursor: pointer;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
      }

      .node-delete:hover {
        background: #fef2f2;
      }

      .node-content {
        padding: 12px;
      }

      .node-description {
        color: #64748b;
        font-size: 0.75rem;
        margin-bottom: 8px;
      }

      .connections-layer {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }

      .workflow-properties {
        width: 300px;
        background: white;
        border-left: 1px solid #e2e8f0;
        overflow-y: auto;
      }

      .properties-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid #e2e8f0;
      }

      .properties-header h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1e293b;
      }

      .properties-content {
        padding: 20px;
      }

      .property-group {
        margin-bottom: 16px;
      }

      .property-group label {
        display: block;
        margin-bottom: 4px;
        font-weight: 500;
        color: #374151;
        font-size: 0.875rem;
      }

      .form-input,
      .form-textarea {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 0.875rem;
        transition: border-color 0.2s;
      }

      .form-input:focus,
      .form-textarea:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .form-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .form-select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 0.875rem;
        background: white;
        transition: border-color 0.2s;
      }

      .form-select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      .mt-2 {
        margin-top: 8px;
      }

      .mt-3 {
        margin-top: 12px;
      }

      .condition-paths {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .path-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .path-item label {
        font-size: 0.75rem;
        font-weight: 500;
        color: #374151;
      }

      .node-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
      }

      .btn-outline {
        background: transparent;
        border: 1px solid #d1d5db;
        color: #64748b;
      }

      .btn-outline:hover {
        background: #f8fafc;
        border-color: #3b82f6;
        color: #3b82f6;
      }

      .connection-line {
        cursor: pointer;
        transition: stroke-width 0.2s;
        /* Improve rendering quality during zoom */
        shape-rendering: geometricPrecision;
        text-rendering: optimizeLegibility;
      }

      .connection-line:hover {
        stroke-width: 3;
      }

      .connection-point {
        cursor: pointer;
        transition: r 0.2s;
      }

      .connection-point:hover {
        r: 5;
      }

      .workflow-node.connection-target {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      }

      .workflow-toolbar {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .workflow-toolbar .btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        font-size: 0.875rem;
      }

      .workflow-toolbar .btn-icon {
        width: 16px;
        height: 16px;
      }

      .workflow-node.dragging {
        opacity: 0.8;
        transform: scale(1.05);
        z-index: 1000;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .workflow-node.dragging .node-header {
        cursor: grabbing;
      }

      .workflow-node .node-header {
        cursor: grab;
      }

      .workflow-node .node-header:active {
        cursor: grabbing;
      }

      .activity-item {
        cursor: grab;
        user-select: none;
      }

      .activity-item:active {
        cursor: grabbing;
      }

      .activity-item.dragging {
        opacity: 0.5;
        transform: rotate(5deg);
      }

      .connection-line {
        pointer-events: all;
      }

      .connection-line:hover {
        stroke-width: 4;
        stroke: #ef4444;
      }

      .connection-point {
        pointer-events: all;
        cursor: pointer;
      }

      .connection-point:hover {
        r: 6;
        fill: #ef4444;
      }

      .canvas-content {
        cursor: default;
      }

      .canvas-content.drawing-connection {
        cursor: crosshair;
      }

      .connection-label {
        font-size: 12px;
        font-weight: 600;
        fill: #374151;
        text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
        pointer-events: none;
      }

      .workflow-node.finish {
        border-color: #10b981;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
      }

      .workflow-node.finish .node-header {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }

      .workflow-node.finish .node-title {
        color: white;
      }

      .workflow-node.finish .node-description {
        color: rgba(255, 255, 255, 0.8);
      }

      .workflow-node.start {
        border-color: #3b82f6;
        background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        color: white;
      }

      .workflow-node.start .node-header {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }

      .workflow-node.start .node-title {
        color: white;
      }

      .workflow-node.start .node-description {
        color: rgba(255, 255, 255, 0.8);
      }

      .workflow-node.condition {
        border-color: #f59e0b;
        background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        color: white;
      }

      .workflow-node.condition .node-header {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }

      .workflow-node.condition .node-title {
        color: white;
      }

      .workflow-node.condition .node-description {
        color: rgba(255, 255, 255, 0.8);
      }

      .workflow-node.approval {
        border-color: #8b5cf6;
        background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        color: white;
      }

      .workflow-node.approval .node-header {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }

      .workflow-node.approval .node-title {
        color: white;
      }

      .workflow-node.approval .node-description {
        color: rgba(255, 255, 255, 0.8);
      }

      .workflow-node.webhook {
        border-color: #06b6d4;
        background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
        color: white;
      }

      .workflow-node.webhook .node-header {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }

      .workflow-node.webhook .node-title {
        color: white;
      }

      .workflow-node.webhook .node-description {
        color: rgba(255, 255, 255, 0.8);
      }

      .workflow-node.database {
        border-color: #84cc16;
        background: linear-gradient(135deg, #84cc16 0%, #65a30d 100%);
        color: white;
      }

      .workflow-node.database .node-header {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }

      .workflow-node.database .node-title {
        color: white;
      }

      .workflow-node.database .node-description {
        color: rgba(255, 255, 255, 0.8);
      }

      .workflow-node.notification {
        border-color: #f97316;
        background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        color: white;
      }

      .workflow-node.notification .node-header {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }

      .workflow-node.notification .node-title {
        color: white;
      }

      .workflow-node.notification .node-description {
        color: rgba(255, 255, 255, 0.8);
      }

      .workflow-node.email {
        border-color: #ec4899;
        background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
        color: white;
      }

      .workflow-node.email .node-header {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }

      .workflow-node.email .node-title {
        color: white;
      }

      .workflow-node.email .node-description {
        color: rgba(255, 255, 255, 0.8);
      }

      .workflow-node.delay {
        border-color: #6b7280;
        background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
        color: white;
      }

      .workflow-node.delay .node-header {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }

      .workflow-node.delay .node-title {
        color: white;
      }

      .workflow-node.delay .node-description {
        color: rgba(255, 255, 255, 0.8);
      }

      .workflow-node.form {
        border-color: #6366f1;
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        color: white;
      }

      .workflow-node.form .node-header {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: rgba(255, 255, 255, 0.2);
      }

      .workflow-node.form .node-title {
        color: white;
      }

      .workflow-node.form .node-description {
        color: rgba(255, 255, 255, 0.8);
      }

      /* Templates Dropdown */
      .templates-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        width: 300px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        margin-top: 4px;
      }

      .templates-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #e2e8f0;
      }

      .templates-header h4 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: #1e293b;
      }

      .template-controls {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .template-filter {
        padding: 4px 8px;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 0.75rem;
        background: white;
        color: #374151;
      }

      .template-filter:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
      }

      .templates-list {
        max-height: 300px;
        overflow-y: auto;
      }

      .template-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .template-item:hover {
        background: #f8fafc;
      }

      .template-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        border-radius: 6px;
        color: #64748b;
      }

      .template-icon svg {
        width: 20px;
        height: 20px;
      }

      .template-info {
        flex: 1;
      }

      .template-name {
        font-weight: 500;
        color: #1e293b;
        font-size: 0.875rem;
      }

      .template-category {
        color: #3b82f6;
        font-size: 0.625rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 2px;
      }

      .template-description {
        color: #64748b;
        font-size: 0.75rem;
        margin-top: 4px;
      }

      /* Status Bar */
      .status-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 16px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        font-size: 0.75rem;
        color: #64748b;
      }

      .status-left,
      .status-right {
        display: flex;
        gap: 16px;
      }

      .status-item {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .status-label {
        font-weight: 500;
      }

      .status-value {
        color: #374151;
      }

      .status-value.error {
        color: #ef4444;
      }

      /* Mini-map */
      .mini-map {
        position: absolute;
        bottom: 16px;
        right: 16px;
        width: 200px;
        height: 150px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        overflow: hidden;
        z-index: 10;
      }

      .mini-map-content {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .mini-node {
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #3b82f6;
        transform: translate(-50%, -50%);
      }

      .mini-viewport {
        position: absolute;
        border: 2px solid #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        pointer-events: none;
      }

      /* Validation Panel */
      .validation-panel {
        position: absolute;
        bottom: 16px;
        left: 16px;
        width: 300px;
        max-height: 200px;
        background: white;
        border: 1px solid #ef4444;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
      }

      .validation-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #fef2f2;
        border-bottom: 1px solid #ef4444;
        border-radius: 8px 8px 0 0;
      }

      .validation-header h4 {
        margin: 0;
        font-size: 0.875rem;
        font-weight: 600;
        color: #dc2626;
      }

      .validation-list {
        max-height: 150px;
        overflow-y: auto;
        padding: 8px 0;
      }

      .validation-error {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        font-size: 0.75rem;
        color: #dc2626;
      }

      .error-icon {
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      /* Enhanced Canvas Controls */
      .canvas-content.panning {
        cursor: grab;
      }

      .canvas-content.panning:active {
        cursor: grabbing;
      }

      /* Keyboard Shortcuts Tooltip */
      .btn[title]:hover::after {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #1e293b;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        white-space: nowrap;
        z-index: 1000;
        margin-bottom: 4px;
      }

      /* Enhanced Animations */
      .workflow-node {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .workflow-node:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .connection-line {
        transition: all 0.2s ease;
      }

      .connection-line:hover {
        stroke-width: 4;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      }
    `,
  ],
})
export class WorkflowDesignerPageComponent implements OnInit {
  @ViewChild('workflowCanvas') workflowCanvas!: ElementRef;

  showFormBuilderModal = false;
  selectedFormNode: any = null;
  currentWorkflow: Workflow | null = null;

  availableActivities = [
    {
      id: 'form',
      name: 'Form Builder',
      description: 'Create and display a custom form',
      icon: 'form',
      type: 'form',
    },
    {
      id: 'email',
      name: 'Send Email',
      description: 'Send an email notification',
      icon: 'email',
      type: 'email',
    },
    {
      id: 'condition',
      name: 'Condition',
      description: 'Add conditional logic to workflow',
      icon: 'condition',
      type: 'condition',
    },
    {
      id: 'delay',
      name: 'Delay',
      description: 'Add a time delay to workflow',
      icon: 'delay',
      type: 'delay',
    },
    {
      id: 'approval',
      name: 'Approval',
      description: 'Require approval from user or group',
      icon: 'approval',
      type: 'approval',
    },
    {
      id: 'notification',
      name: 'Notification',
      description: 'Send notification to users',
      icon: 'notification',
      type: 'notification',
    },
    {
      id: 'webhook',
      name: 'Webhook',
      description: 'Call external API endpoint',
      icon: 'webhook',
      type: 'webhook',
    },
    {
      id: 'database',
      name: 'Database',
      description: 'Save or retrieve data from database',
      icon: 'database',
      type: 'database',
    },
    {
      id: 'finish',
      name: 'Finish',
      description: 'End the workflow execution',
      icon: 'finish',
      type: 'finish',
    },
  ];

  workflowNodes: any[] = [];
  workflowConnections: any[] = [];
  selectedNode: any = null;
  zoomLevel = 1;
  isDragging = false;
  dragOffset = { x: 0, y: 0 };

  // Connection drawing
  isDrawingConnection = false;
  connectionStartNode: any = null;
  connectionStartPoint = { x: 0, y: 0 };
  mousePosition = { x: 0, y: 0 };

  // Node dragging
  isDraggingNode = false;
  draggedNode: any = null;
  dragStartPosition = { x: 0, y: 0 };
  panStartPosition = { x: 0, y: 0 };

  // New properties for enhanced functionality
  searchTerm = '';
  showTemplates = false;
  showMiniMap = true;
  showMobileSidebar = false;
  validationErrors: any[] = [];
  canUndo = false;
  canRedo = false;
  isPanning = false;
  canvasOffset = { x: 0, y: 0 };
  canvasWidth = 1000;
  canvasHeight = 800;
  initialPinchDistance: number | null = null;
  Math = Math; // Make Math available in template

  // Workflow metadata
  workflowTitle = 'My Workflow';
  workflowCategory = 'General';
  workflowDescription =
    'A custom workflow created with the Form Builder & Workflow Designer';

  // Workflow categories
  workflowCategories = [
    'General',
    'Approval',
    'Onboarding',
    'Support',
    'Sales',
    'Marketing',
    'HR',
    'Finance',
    'IT',
    'Custom',
  ];

  // Template filtering
  selectedTemplateCategory = '';

  // Undo/Redo history
  private history: any[] = [];
  private historyIndex = -1;
  private maxHistorySize = 50;

  // Workflow templates
  workflowTemplates = [
    {
      name: 'Simple Approval',
      description: 'Basic approval workflow with form and email',
      category: 'Approval',
      nodes: [
        { id: 'start', title: 'Start', type: 'start', x: 50, y: 50 },
        { id: 'form1', title: 'Submit Form', type: 'form', x: 250, y: 50 },
        {
          id: 'approval1',
          title: 'Manager Approval',
          type: 'approval',
          x: 450,
          y: 50,
        },
        {
          id: 'email1',
          title: 'Send Confirmation',
          type: 'email',
          x: 650,
          y: 50,
        },
        { id: 'finish1', title: 'End', type: 'finish', x: 850, y: 50 },
      ],
      connections: [
        { from: 'start', to: 'form1' },
        { from: 'form1', to: 'approval1' },
        { from: 'approval1', to: 'email1' },
        { from: 'email1', to: 'finish1' },
      ],
    },
    {
      name: 'Conditional Flow',
      description: 'Workflow with conditional branching',
      category: 'General',
      nodes: [
        { id: 'start', title: 'Start', type: 'start', x: 50, y: 100 },
        { id: 'form1', title: 'Input Data', type: 'form', x: 250, y: 100 },
        {
          id: 'condition1',
          title: 'Check Status',
          type: 'condition',
          x: 450,
          y: 100,
        },
        {
          id: 'approval1',
          title: 'Approval Required',
          type: 'approval',
          x: 650,
          y: 50,
        },
        { id: 'email1', title: 'Send Email', type: 'email', x: 650, y: 150 },
        { id: 'finish1', title: 'End', type: 'finish', x: 850, y: 100 },
      ],
      connections: [
        { from: 'start', to: 'form1' },
        { from: 'form1', to: 'condition1' },
        { from: 'condition1', to: 'approval1', label: 'Yes' },
        { from: 'condition1', to: 'email1', label: 'No' },
        { from: 'approval1', to: 'finish1' },
        { from: 'email1', to: 'finish1' },
      ],
    },
    {
      name: 'Employee Onboarding',
      description: 'Complete employee onboarding process',
      category: 'HR',
      nodes: [
        { id: 'start', title: 'Start', type: 'start', x: 50, y: 50 },
        { id: 'form1', title: 'Employee Info', type: 'form', x: 250, y: 50 },
        {
          id: 'approval1',
          title: 'HR Approval',
          type: 'approval',
          x: 450,
          y: 50,
        },
        {
          id: 'notification1',
          title: 'IT Setup',
          type: 'notification',
          x: 650,
          y: 50,
        },
        {
          id: 'webhook1',
          title: 'Create Account',
          type: 'webhook',
          x: 850,
          y: 50,
        },
        { id: 'email1', title: 'Welcome Email', type: 'email', x: 1050, y: 50 },
        { id: 'finish1', title: 'End', type: 'finish', x: 1250, y: 50 },
      ],
      connections: [
        { from: 'start', to: 'form1' },
        { from: 'form1', to: 'approval1' },
        { from: 'approval1', to: 'notification1' },
        { from: 'notification1', to: 'webhook1' },
        { from: 'webhook1', to: 'email1' },
        { from: 'email1', to: 'finish1' },
      ],
    },
    {
      name: 'Support Ticket',
      description: 'Customer support ticket workflow',
      category: 'Support',
      nodes: [
        { id: 'start', title: 'Start', type: 'start', x: 50, y: 100 },
        { id: 'form1', title: 'Submit Ticket', type: 'form', x: 250, y: 100 },
        {
          id: 'notification1',
          title: 'Auto Response',
          type: 'notification',
          x: 450,
          y: 100,
        },
        {
          id: 'condition1',
          title: 'Priority Check',
          type: 'condition',
          x: 650,
          y: 100,
        },
        {
          id: 'approval1',
          title: 'Manager Review',
          type: 'approval',
          x: 850,
          y: 50,
        },
        {
          id: 'email1',
          title: 'Resolution Email',
          type: 'email',
          x: 850,
          y: 150,
        },
        {
          id: 'database1',
          title: 'Update Records',
          type: 'database',
          x: 1050,
          y: 100,
        },
        { id: 'finish1', title: 'End', type: 'finish', x: 1250, y: 100 },
      ],
      connections: [
        { from: 'start', to: 'form1' },
        { from: 'form1', to: 'notification1' },
        { from: 'notification1', to: 'condition1' },
        { from: 'condition1', to: 'approval1', label: 'High Priority' },
        { from: 'condition1', to: 'email1', label: 'Low Priority' },
        { from: 'approval1', to: 'database1' },
        { from: 'email1', to: 'database1' },
        { from: 'database1', to: 'finish1' },
      ],
    },
    {
      name: 'Sales Lead',
      description: 'Sales lead qualification and follow-up',
      category: 'Sales',
      nodes: [
        { id: 'start', title: 'Start', type: 'start', x: 50, y: 100 },
        { id: 'form1', title: 'Lead Capture', type: 'form', x: 250, y: 100 },
        {
          id: 'condition1',
          title: 'Qualify Lead',
          type: 'condition',
          x: 450,
          y: 100,
        },
        {
          id: 'notification1',
          title: 'Assign Sales Rep',
          type: 'notification',
          x: 650,
          y: 50,
        },
        {
          id: 'delay1',
          title: 'Follow-up Delay',
          type: 'delay',
          x: 650,
          y: 150,
        },
        {
          id: 'email1',
          title: 'Follow-up Email',
          type: 'email',
          x: 850,
          y: 150,
        },
        {
          id: 'webhook1',
          title: 'Update CRM',
          type: 'webhook',
          x: 1050,
          y: 100,
        },
        { id: 'finish1', title: 'End', type: 'finish', x: 1250, y: 100 },
      ],
      connections: [
        { from: 'start', to: 'form1' },
        { from: 'form1', to: 'condition1' },
        { from: 'condition1', to: 'notification1', label: 'Qualified' },
        { from: 'condition1', to: 'delay1', label: 'Not Qualified' },
        { from: 'notification1', to: 'webhook1' },
        { from: 'delay1', to: 'email1' },
        { from: 'email1', to: 'webhook1' },
        { from: 'webhook1', to: 'finish1' },
      ],
    },
    {
      name: 'Marketing Campaign',
      description: 'Automated marketing campaign workflow',
      category: 'Marketing',
      nodes: [
        { id: 'start', title: 'Start', type: 'start', x: 50, y: 100 },
        { id: 'form1', title: 'Campaign Setup', type: 'form', x: 250, y: 100 },
        {
          id: 'approval1',
          title: 'Marketing Approval',
          type: 'approval',
          x: 450,
          y: 100,
        },
        {
          id: 'notification1',
          title: 'Send Campaign',
          type: 'notification',
          x: 650,
          y: 100,
        },
        { id: 'delay1', title: 'Wait Period', type: 'delay', x: 850, y: 100 },
        {
          id: 'condition1',
          title: 'Check Results',
          type: 'condition',
          x: 1050,
          y: 100,
        },
        {
          id: 'email1',
          title: 'Success Report',
          type: 'email',
          x: 1250,
          y: 50,
        },
        {
          id: 'webhook1',
          title: 'Optimize Campaign',
          type: 'webhook',
          x: 1250,
          y: 150,
        },
        { id: 'finish1', title: 'End', type: 'finish', x: 1450, y: 100 },
      ],
      connections: [
        { from: 'start', to: 'form1' },
        { from: 'form1', to: 'approval1' },
        { from: 'approval1', to: 'notification1' },
        { from: 'notification1', to: 'delay1' },
        { from: 'delay1', to: 'condition1' },
        { from: 'condition1', to: 'email1', label: 'Success' },
        { from: 'condition1', to: 'webhook1', label: 'Needs Optimization' },
        { from: 'email1', to: 'finish1' },
        { from: 'webhook1', to: 'finish1' },
      ],
    },
    {
      name: 'IT Request',
      description: 'IT service request workflow',
      category: 'IT',
      nodes: [
        { id: 'start', title: 'Start', type: 'start', x: 50, y: 100 },
        { id: 'form1', title: 'Service Request', type: 'form', x: 250, y: 100 },
        {
          id: 'condition1',
          title: 'Request Type',
          type: 'condition',
          x: 450,
          y: 100,
        },
        {
          id: 'approval1',
          title: 'Manager Approval',
          type: 'approval',
          x: 650,
          y: 50,
        },
        {
          id: 'notification1',
          title: 'Auto Assignment',
          type: 'notification',
          x: 650,
          y: 150,
        },
        {
          id: 'webhook1',
          title: 'Create Ticket',
          type: 'webhook',
          x: 850,
          y: 100,
        },
        {
          id: 'email1',
          title: 'Status Update',
          type: 'email',
          x: 1050,
          y: 100,
        },
        { id: 'finish1', title: 'End', type: 'finish', x: 1250, y: 100 },
      ],
      connections: [
        { from: 'start', to: 'form1' },
        { from: 'form1', to: 'condition1' },
        { from: 'condition1', to: 'approval1', label: 'Hardware/Software' },
        { from: 'condition1', to: 'notification1', label: 'Access Request' },
        { from: 'approval1', to: 'webhook1' },
        { from: 'notification1', to: 'webhook1' },
        { from: 'webhook1', to: 'email1' },
        { from: 'email1', to: 'finish1' },
      ],
    },
    {
      name: 'Finance Approval',
      description: 'Financial approval workflow',
      category: 'Finance',
      nodes: [
        { id: 'start', title: 'Start', type: 'start', x: 50, y: 100 },
        { id: 'form1', title: 'Expense Report', type: 'form', x: 250, y: 100 },
        {
          id: 'condition1',
          title: 'Amount Check',
          type: 'condition',
          x: 450,
          y: 100,
        },
        {
          id: 'approval1',
          title: 'Manager Approval',
          type: 'approval',
          x: 650,
          y: 50,
        },
        {
          id: 'approval2',
          title: 'Finance Approval',
          type: 'approval',
          x: 650,
          y: 150,
        },
        {
          id: 'database1',
          title: 'Update Records',
          type: 'database',
          x: 850,
          y: 100,
        },
        {
          id: 'email1',
          title: 'Approval Email',
          type: 'email',
          x: 1050,
          y: 100,
        },
        { id: 'finish1', title: 'End', type: 'finish', x: 1250, y: 100 },
      ],
      connections: [
        { from: 'start', to: 'form1' },
        { from: 'form1', to: 'condition1' },
        { from: 'condition1', to: 'approval1', label: 'Under $1000' },
        { from: 'condition1', to: 'approval2', label: 'Over $1000' },
        { from: 'approval1', to: 'database1' },
        { from: 'approval2', to: 'database1' },
        { from: 'database1', to: 'email1' },
        { from: 'email1', to: 'finish1' },
      ],
    },
  ];

  // Computed property for filtered activities
  get filteredActivities() {
    if (!this.searchTerm) return this.availableActivities;
    return this.availableActivities.filter(
      (activity) =>
        activity.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        activity.description
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
    );
  }

  // Computed property for filtered templates
  get filteredTemplates() {
    if (!this.selectedTemplateCategory) return this.workflowTemplates;
    return this.workflowTemplates.filter(
      (template) => template.category === this.selectedTemplateCategory
    );
  }

  constructor(private workflowService: WorkflowService) {
    // Don't add start node here - wait for ngOnInit
  }

  ngOnInit() {
    this.addStartNode();
    this.saveToHistory();

    // Initialize zoom after view is ready
    setTimeout(() => {
      this.applyZoom();
      this.centerCanvas();
    }, 100);
  }

  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent) {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'z':
          event.preventDefault();
          if (event.shiftKey) {
            this.redo();
          } else {
            this.undo();
          }
          break;
        case 'y':
          event.preventDefault();
          this.redo();
          break;
        case 's':
          event.preventDefault();
          this.saveWorkflow();
          break;
        case 'e':
          event.preventDefault();
          this.exportWorkflow();
          break;
        case 'l':
          event.preventDefault();
          this.autoLayout();
          break;
        case 'v':
          event.preventDefault();
          this.validateWorkflow();
          break;
        case '=':
        case '+':
          event.preventDefault();
          this.zoomIn();
          break;
        case '-':
          event.preventDefault();
          this.zoomOut();
          break;
        case '0':
          event.preventDefault();
          this.resetZoom();
          break;
      }
    }

    // Delete key for selected node
    if (event.key === 'Delete' && this.selectedNode) {
      event.preventDefault();
      this.deleteNode(this.selectedNode, event);
    }

    // Escape key to cancel operations
    if (event.key === 'Escape') {
      this.cancelConnection();
      this.selectedNode = null;
    }
  }

  addStartNode() {
    // Check if start node already exists
    const existingStartNode = this.workflowNodes.find(
      (node) => node.type === 'start'
    );
    if (existingStartNode) {
      return; // Don't add another start node
    }

    const startNode = {
      id: 'start',
      title: 'Start',
      description: 'Workflow starting point',
      type: 'start',
      x: 50,
      y: 50,
    };
    this.workflowNodes.push(startNode);
  }

  addActivity(activity: any) {
    const newNode = {
      id: `node_${Date.now()}`,
      title: activity.name,
      description: activity.description,
      type: activity.type,
      x: 200 + Math.random() * 100,
      y: 100 + Math.random() * 100,
      config: {},
    };
    this.workflowNodes.push(newNode);
    this.selectedNode = newNode;
    this.saveToHistory();
  }

  selectNode(node: any, event: Event) {
    event.stopPropagation();
    this.selectedNode = node;
  }

  deleteNode(node: any, event: Event) {
    event.stopPropagation();
    const index = this.workflowNodes.indexOf(node);
    if (index > -1) {
      this.workflowNodes.splice(index, 1);
    }
    if (this.selectedNode === node) {
      this.selectedNode = null;
    }
    this.saveToHistory();
  }

  onDragStart(event: DragEvent, activity: any) {
    event.dataTransfer!.setData('text/plain', JSON.stringify(activity));
    // Add visual feedback
    const target = event.target as HTMLElement;
    target.classList.add('dragging');
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const activityData = event.dataTransfer!.getData('text/plain');
    const activity = JSON.parse(activityData);

    const rect = this.workflowCanvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newNode = {
      id: `node_${Date.now()}`,
      title: activity.name,
      description: activity.description,
      type: activity.type,
      x: x - 100,
      y: y - 50,
      config: {},
    };

    this.workflowNodes.push(newNode);
    this.selectedNode = newNode;

    // Remove dragging class from all activity items
    document.querySelectorAll('.activity-item.dragging').forEach((item) => {
      item.classList.remove('dragging');
    });

    this.saveToHistory();
  }

  onDragEnd(event: DragEvent) {
    // Remove dragging class from all activity items
    document.querySelectorAll('.activity-item.dragging').forEach((item) => {
      item.classList.remove('dragging');
    });
  }

  onCanvasClick(event: Event) {
    this.selectedNode = null;
  }

  openFormBuilder(node: any) {
    this.selectedFormNode = node;
    this.showFormBuilderModal = true;
  }

  onFormSaved(event: any) {
    const { node, formData } = event;
    node.config = {
      formId: formData.formId,
      formData: formData,
    };
    this.showFormBuilderModal = false;
    this.selectedFormNode = null;
  }

  closeFormBuilderModal() {
    this.showFormBuilderModal = false;
    this.selectedFormNode = null;
  }

  saveWorkflow() {
    const workflow = {
      id: `workflow_${Date.now()}`,
      name: this.workflowTitle,
      category: this.workflowCategory,
      description: this.workflowDescription,
      nodes: this.workflowNodes,
      connections: this.workflowConnections,
      createdAt: new Date().toISOString(),
    };

    console.log('Saving workflow:', workflow);
    // Here you would typically save to a backend service
    localStorage.setItem('currentWorkflow', JSON.stringify(workflow));
    alert('Workflow saved successfully!');
  }

  zoomIn() {
    this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
    this.applyZoom();
  }

  zoomOut() {
    this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5);
    this.applyZoom();
  }

  resetZoom() {
    this.zoomLevel = 1;
    this.applyZoom();
  }

  private applyZoom() {
    const canvas = this.workflowCanvas.nativeElement;
    const canvasContent = canvas.querySelector('.canvas-content');

    if (canvasContent) {
      // Apply zoom to the canvas content instead of the entire canvas
      canvasContent.style.transform = `scale(${this.zoomLevel})`;
      canvasContent.style.transformOrigin = 'top left';

      // Adjust canvas size to accommodate zoom
      const originalWidth = 1000; // Base canvas width
      const originalHeight = 800; // Base canvas height

      canvasContent.style.width = `${originalWidth * this.zoomLevel}px`;
      canvasContent.style.height = `${originalHeight * this.zoomLevel}px`;

      // Update canvas offset for panning
      this.updateCanvasOffset();
    }
  }

  private updateCanvasOffset() {
    // Update the canvas offset display
    const canvas = this.workflowCanvas.nativeElement;
    const canvasContent = canvas.querySelector('.canvas-content');

    if (canvasContent) {
      const rect = canvasContent.getBoundingClientRect();
      this.canvasOffset = {
        x: rect.left,
        y: rect.top,
      };
    }
  }

  // Connection drawing methods
  startConnection(node: any, event: MouseEvent) {
    event.stopPropagation();
    this.isDrawingConnection = true;
    this.connectionStartNode = node;

    const rect = this.workflowCanvas.nativeElement.getBoundingClientRect();
    this.connectionStartPoint = {
      x: node.x + 100, // Right side of node
      y: node.y + 25, // Middle of node
    };
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDrawingConnection) {
      const rect = this.workflowCanvas.nativeElement.getBoundingClientRect();
      this.mousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
  }

  endConnection(targetNode: any, event: MouseEvent) {
    if (this.isDrawingConnection && this.connectionStartNode && targetNode) {
      event.stopPropagation();

      // Don't connect to the same node
      if (this.connectionStartNode.id === targetNode.id) {
        this.cancelConnection();
        return;
      }

      // Create connection
      const connection = {
        id: `conn_${Date.now()}`,
        from: this.connectionStartNode.id,
        to: targetNode.id,
        fromPoint: { ...this.connectionStartPoint },
        toPoint: {
          x: targetNode.x,
          y: targetNode.y + 25,
        },
      };

      this.workflowConnections.push(connection);
      this.cancelConnection();
      this.saveToHistory();
    }
  }

  cancelConnection() {
    this.isDrawingConnection = false;
    this.connectionStartNode = null;
    this.connectionStartPoint = { x: 0, y: 0 };
  }

  deleteConnection(connection: any, event: Event) {
    event.stopPropagation();
    const index = this.workflowConnections.indexOf(connection);
    if (index > -1) {
      this.workflowConnections.splice(index, 1);
    }
    this.saveToHistory();
  }

  // Enhanced condition logic
  configureCondition(node: any) {
    if (node.type === 'condition') {
      node.config = node.config || {};
      node.config.conditionType = node.config.conditionType || 'yes_no';
      node.config.condition = node.config.condition || '';
      node.config.yesPath = node.config.yesPath || '';
      node.config.noPath = node.config.noPath || '';
    }
  }

  // Canvas management
  clearCanvas() {
    if (confirm('Are you sure you want to clear the entire workflow?')) {
      this.workflowNodes = [];
      this.workflowConnections = [];
      this.selectedNode = null;
      this.addStartNode();
    }
  }

  autoLayout() {
    // Simple auto-layout algorithm
    const startX = 50;
    const startY = 50;
    const nodeWidth = 200;
    const nodeHeight = 100;
    const spacing = 50;

    this.workflowNodes.forEach((node, index) => {
      if (index === 0) {
        // Keep start node at top
        node.x = startX;
        node.y = startY;
      } else {
        // Arrange other nodes in a grid
        const row = Math.floor((index - 1) / 3);
        const col = (index - 1) % 3;
        node.x = startX + col * (nodeWidth + spacing);
        node.y = startY + (row + 1) * (nodeHeight + spacing);
      }
    });
  }

  // Node dragging methods
  startNodeDrag(node: any, event: MouseEvent) {
    if (this.isDrawingConnection) return; // Don't drag while drawing connection

    event.stopPropagation();
    this.isDraggingNode = true;
    this.draggedNode = node;

    const rect = this.workflowCanvas.nativeElement.getBoundingClientRect();
    this.dragStartPosition = {
      x: event.clientX - rect.left - node.x,
      y: event.clientY - rect.top - node.y,
    };
  }

  onNodeDrag(event: MouseEvent) {
    if (!this.isDraggingNode || !this.draggedNode) return;

    const rect = this.workflowCanvas.nativeElement.getBoundingClientRect();
    this.draggedNode.x = event.clientX - rect.left - this.dragStartPosition.x;
    this.draggedNode.y = event.clientY - rect.top - this.dragStartPosition.y;

    // Update connection positions
    this.updateConnectionPositions();
  }

  endNodeDrag() {
    this.isDraggingNode = false;
    this.draggedNode = null;
  }

  updateConnectionPositions() {
    this.workflowConnections.forEach((connection) => {
      const fromNode = this.workflowNodes.find((n) => n.id === connection.from);
      const toNode = this.workflowNodes.find((n) => n.id === connection.to);

      if (fromNode) {
        connection.fromPoint = {
          x: fromNode.x + 200, // Right side of node
          y: fromNode.y + 25, // Middle of node
        };
      }

      if (toNode) {
        connection.toPoint = {
          x: toNode.x, // Left side of node
          y: toNode.y + 25, // Middle of node
        };
      }
    });
  }

  // Enhanced connection path methods
  getConnectionPath(connection: any): string {
    const fromX = connection.fromPoint?.x || connection.from.x;
    const fromY = connection.fromPoint?.y || connection.from.y;
    const toX = connection.toPoint?.x || connection.to.x;
    const toY = connection.toPoint?.y || connection.to.y;

    // Calculate control points for smooth curve
    const distance = Math.abs(toX - fromX);
    const controlOffset = Math.min(distance * 0.3, 100);

    const cp1x = fromX + controlOffset;
    const cp1y = fromY;
    const cp2x = toX - controlOffset;
    const cp2y = toY;

    return `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`;
  }

  getDrawingConnectionPath(): string {
    const fromX = this.connectionStartPoint.x;
    const fromY = this.connectionStartPoint.y;
    const toX = this.mousePosition.x;
    const toY = this.mousePosition.y;

    // Calculate control points for smooth curve
    const distance = Math.abs(toX - fromX);
    const controlOffset = Math.min(distance * 0.3, 100);

    const cp1x = fromX + controlOffset;
    const cp1y = fromY;
    const cp2x = toX - controlOffset;
    const cp2y = toY;

    return `M ${fromX} ${fromY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${toX} ${toY}`;
  }

  getConnectionLabelPosition(connection: any): { x: number; y: number } {
    const fromX = connection.fromPoint?.x || connection.from.x;
    const fromY = connection.fromPoint?.y || connection.from.y;
    const toX = connection.toPoint?.x || connection.to.x;
    const toY = connection.toPoint?.y || connection.to.y;

    // Position label at the middle of the connection
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;

    // Add some offset to avoid overlapping with the line
    const offset = 15;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    const labelX = midX + Math.cos(angle + Math.PI / 2) * offset;
    const labelY = midY + Math.sin(angle + Math.PI / 2) * offset;

    return { x: labelX, y: labelY };
  }

  // Enhanced export with Elsa-compatible format
  exportWorkflow() {
    // Convert to Elsa workflow format
    const elsaWorkflow = {
      definitionId: `workflow_${Date.now()}`,
      definitionVersionId: `version_${Date.now()}`,
      version: 1,
      isLatest: true,
      isPublished: false,
      name: this.workflowTitle,
      displayName: this.workflowTitle,
      description: this.workflowDescription,
      category: this.workflowCategory,
      persistenceBehavior: 'WorkflowContained',
      deleteCompletedInstances: false,
      isSingleton: false,
      isEnabled: true,
      isSystem: false,
      activities: this.workflowNodes.map((node) => ({
        activityId: node.id,
        type: this.getElsaActivityType(node.type),
        name: node.title,
        displayName: node.title,
        description: node.description,
        x: node.x,
        y: node.y,
        properties: this.convertConfigToElsaProperties(node.config || {}),
        outcomes: this.getNodeOutcomes(node),
        persistWorkflow: false,
        loadWorkflowContext: false,
        saveWorkflowContext: false,
        attributes: {
          x: node.x,
          y: node.y,
          width: 200,
          height: 100,
        },
      })),
      connections: this.workflowConnections.map((conn) => ({
        sourceActivityId: conn.from,
        targetActivityId: conn.to,
        outcome: conn.label || 'Done',
        attributes: {
          x1: conn.fromPoint?.x || 0,
          y1: conn.fromPoint?.y || 0,
          x2: conn.toPoint?.x || 0,
          y2: conn.toPoint?.y || 0,
        },
      })),
      variables: [],
      customAttributes: [],
      contextOptions: {
        contextType: 'WorkflowExecutionContext',
        contextFidelity: 'Burst',
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: null,
      metadata: {
        totalNodes: this.workflowNodes.length,
        totalConnections: this.workflowConnections.length,
        exportedAt: new Date().toISOString(),
      },
    };

    const dataStr = JSON.stringify(elsaWorkflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `elsa_workflow_${
      new Date().toISOString().split('T')[0]
    }.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  // Helper methods for Elsa format conversion
  getElsaActivityType(nodeType: string): string {
    const typeMap: { [key: string]: string } = {
      start: 'Start',
      form: 'FormBuilder',
      email: 'SendEmail',
      condition: 'If',
      delay: 'Delay',
      approval: 'UserTask',
      notification: 'SendNotification',
      webhook: 'HttpEndpoint',
      database: 'Sql',
      finish: 'Finish',
    };
    return typeMap[nodeType] || 'Activity';
  }

  convertConfigToElsaProperties(config: any): any[] {
    const properties: any[] = [];

    Object.keys(config).forEach((key) => {
      properties.push({
        name: key,
        syntax: 'Literal',
        expressions: {
          Literal: config[key],
        },
      });
    });

    return properties;
  }

  getNodeOutcomes(node: any): string[] {
    const outcomesMap: { [key: string]: string[] } = {
      start: ['Done'],
      form: ['Done'],
      email: ['Done'],
      condition: ['Yes', 'No'],
      delay: ['Done'],
      approval: ['Approved', 'Rejected'],
      notification: ['Done'],
      webhook: ['Done'],
      database: ['Done'],
      finish: [],
    };

    return outcomesMap[node.type] || ['Done'];
  }

  // Enhanced canvas controls
  startPanning(event: MouseEvent) {
    if (event.button === 1 || (event.button === 0 && event.altKey)) {
      // Middle click or Alt+Left click
      event.preventDefault();
      this.isPanning = true;
      this.panStartPosition = { x: event.clientX, y: event.clientY };
    }
  }

  // Handle canvas resize
  @HostListener('window:resize')
  onResize() {
    // Reapply zoom and center after window resize
    setTimeout(() => {
      this.applyZoom();
      this.centerCanvas();
    }, 100);
  }

  toggleMobileSidebar() {
    this.showMobileSidebar = !this.showMobileSidebar;
  }

  // Mobile touch gesture handling
  onTouchStart(event: TouchEvent) {
    if (event.touches.length === 2) {
      // Two finger touch - handle pinch zoom
      event.preventDefault();
      this.handlePinchStart(event);
    }
  }

  onTouchMove(event: TouchEvent) {
    if (event.touches.length === 2) {
      // Two finger touch - handle pinch zoom
      event.preventDefault();
      this.handlePinchMove(event);
    }
  }

  private handlePinchStart(event: TouchEvent) {
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    this.initialPinchDistance = distance;
  }

  private handlePinchMove(event: TouchEvent) {
    if (!this.initialPinchDistance) return;

    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    const scale = distance / this.initialPinchDistance;

    // Apply zoom based on pinch scale
    const newZoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel * scale));
    if (Math.abs(newZoomLevel - this.zoomLevel) > 0.1) {
      this.zoomLevel = newZoomLevel;
      this.applyZoom();
    }
  }

  endPanning() {
    this.isPanning = false;
  }

  onWheel(event: WheelEvent) {
    if (event.ctrlKey) {
      event.preventDefault();

      // Get mouse position relative to canvas
      const canvas = this.workflowCanvas.nativeElement;
      const canvasContent = canvas.querySelector('.canvas-content');
      const rect = canvasContent.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Calculate zoom center
      const zoomCenterX = mouseX / this.zoomLevel;
      const zoomCenterY = mouseY / this.zoomLevel;

      // Apply zoom
      if (event.deltaY < 0) {
        this.zoomIn();
      } else {
        this.zoomOut();
      }

      // Adjust canvas position to zoom towards mouse
      if (canvasContent) {
        const newRect = canvasContent.getBoundingClientRect();
        const newMouseX = event.clientX - newRect.left;
        const newMouseY = event.clientY - newRect.top;

        const deltaX = (mouseX - newMouseX) / this.zoomLevel;
        const deltaY = (mouseY - newMouseY) / this.zoomLevel;

        canvasContent.scrollLeft += deltaX;
        canvasContent.scrollTop += deltaY;
      }
    } else {
      // Pan with mouse wheel (horizontal scroll)
      const canvas = this.workflowCanvas.nativeElement;
      const canvasContent = canvas.querySelector('.canvas-content');
      if (canvasContent) {
        canvasContent.scrollLeft += event.deltaX;
        canvasContent.scrollTop += event.deltaY;
      }
    }
  }

  centerCanvas() {
    if (this.workflowNodes.length > 0) {
      const bounds = this.getWorkflowBounds();
      const canvas = this.workflowCanvas.nativeElement;
      const canvasContent = canvas.querySelector('.canvas-content');
      const canvasRect = canvas.getBoundingClientRect();

      if (canvasContent) {
        // Calculate center position
        const centerX =
          (canvasRect.width - bounds.width * this.zoomLevel) / 2 -
          bounds.x * this.zoomLevel;
        const centerY =
          (canvasRect.height - bounds.height * this.zoomLevel) / 2 -
          bounds.y * this.zoomLevel;

        // Apply centering
        canvasContent.scrollLeft = Math.max(0, -centerX);
        canvasContent.scrollTop = Math.max(0, -centerY);

        this.updateCanvasOffset();
      }
    }
  }

  getWorkflowBounds() {
    if (this.workflowNodes.length === 0) {
      return { x: 0, y: 0, width: 0, height: 0 };
    }

    const xs = this.workflowNodes.map((n) => n.x);
    const ys = this.workflowNodes.map((n) => n.y);

    return {
      x: Math.min(...xs),
      y: Math.min(...ys),
      width: Math.max(...xs) - Math.min(...xs) + 200,
      height: Math.max(...ys) - Math.min(...ys) + 100,
    };
  }

  getMiniMapViewportTransform() {
    const bounds = this.getWorkflowBounds();
    const scaleX = 200 / Math.max(bounds.width, 1000);
    const scaleY = 150 / Math.max(bounds.height, 800);

    return `translate(${-bounds.x * scaleX}px, ${
      -bounds.y * scaleY
    }px) scale(${scaleX}, ${scaleY})`;
  }

  // Template loading
  loadTemplate(template: any) {
    if (
      confirm('Load this template? This will replace your current workflow.')
    ) {
      // Set workflow metadata from template
      this.workflowTitle = template.name;
      this.workflowCategory = template.category || 'General';
      this.workflowDescription = template.description;

      this.workflowNodes = template.nodes.map((node: any) => ({
        ...node,
        id: `${node.id}_${Date.now()}`,
        config: {},
      }));

      this.workflowConnections = template.connections.map((conn: any) => ({
        id: `conn_${Date.now()}_${Math.random()}`,
        from: `${conn.from}_${Date.now()}`,
        to: `${conn.to}_${Date.now()}`,
        label: conn.label || '→',
      }));

      this.showTemplates = false;
      this.saveToHistory();
      this.autoLayout();
    }
  }

  // Workflow validation
  validateWorkflow() {
    this.validationErrors = [];

    // Check for disconnected nodes
    const connectedNodes = new Set();
    this.workflowConnections.forEach((conn) => {
      connectedNodes.add(conn.from);
      connectedNodes.add(conn.to);
    });

    this.workflowNodes.forEach((node) => {
      if (
        node.type !== 'start' &&
        node.type !== 'finish' &&
        !connectedNodes.has(node.id)
      ) {
        this.validationErrors.push({
          type: 'disconnected',
          nodeId: node.id,
          message: `Node "${node.title}" is not connected to the workflow`,
        });
      }
    });

    // Check for multiple start nodes
    const startNodes = this.workflowNodes.filter((n) => n.type === 'start');
    if (startNodes.length > 1) {
      this.validationErrors.push({
        type: 'multiple_starts',
        message: 'Multiple start nodes found. Only one start node is allowed.',
      });
    }

    // Check for cycles
    if (this.hasCycles()) {
      this.validationErrors.push({
        type: 'cycle',
        message: 'Workflow contains cycles which may cause infinite loops.',
      });
    }

    // Check for unreachable nodes
    const reachableNodes = this.getReachableNodes();
    this.workflowNodes.forEach((node) => {
      if (node.type !== 'start' && !reachableNodes.has(node.id)) {
        this.validationErrors.push({
          type: 'unreachable',
          nodeId: node.id,
          message: `Node "${node.title}" is not reachable from the start node`,
        });
      }
    });

    if (this.validationErrors.length === 0) {
      alert('Workflow validation passed! ✅');
    }
  }

  hasCycles(): boolean {
    const visited = new Set();
    const recStack = new Set();

    const hasCycleUtil = (nodeId: string): boolean => {
      if (recStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recStack.add(nodeId);

      const outgoingConnections = this.workflowConnections.filter(
        (conn) => conn.from === nodeId
      );
      for (const conn of outgoingConnections) {
        if (hasCycleUtil(conn.to)) return true;
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of this.workflowNodes) {
      if (!visited.has(node.id) && hasCycleUtil(node.id)) {
        return true;
      }
    }

    return false;
  }

  getReachableNodes(): Set<string> {
    const reachable = new Set<string>();
    const startNodes = this.workflowNodes.filter((n) => n.type === 'start');

    if (startNodes.length === 0) return reachable;

    const queue = [startNodes[0].id];
    reachable.add(startNodes[0].id);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const outgoingConnections = this.workflowConnections.filter(
        (conn) => conn.from === current
      );

      for (const conn of outgoingConnections) {
        if (!reachable.has(conn.to)) {
          reachable.add(conn.to);
          queue.push(conn.to);
        }
      }
    }

    return reachable;
  }

  // Undo/Redo functionality
  saveToHistory() {
    const state = {
      nodes: JSON.parse(JSON.stringify(this.workflowNodes)),
      connections: JSON.parse(JSON.stringify(this.workflowConnections)),
    };

    // Remove any states after current index
    this.history = this.history.slice(0, this.historyIndex + 1);

    // Add new state
    this.history.push(state);

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }

    this.updateUndoRedoState();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const state = this.history[this.historyIndex];
      this.workflowNodes = JSON.parse(JSON.stringify(state.nodes));
      this.workflowConnections = JSON.parse(JSON.stringify(state.connections));
      this.updateUndoRedoState();
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      const state = this.history[this.historyIndex];
      this.workflowNodes = JSON.parse(JSON.stringify(state.nodes));
      this.workflowConnections = JSON.parse(JSON.stringify(state.connections));
      this.updateUndoRedoState();
    }
  }

  updateUndoRedoState() {
    this.canUndo = this.historyIndex > 0;
    this.canRedo = this.historyIndex < this.history.length - 1;
  }
}
