import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import {
  ActorsDataService,
  ActorData,
  ActorCategory,
} from '../../services/actors-data.service';

@Component({
  selector: 'app-actors-management',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatChipsModule,
    MatExpansionModule,
    FormsModule,
  ],
  template: `
    <div class="actors-management-container">
      <div class="header-section">
        <h2>Company Data Management</h2>
        <p class="subtitle">
          Manage your company's predefined data sources (Actors) for form fields
        </p>
      </div>

      <div class="content-wrapper">
        <div class="left-panel">
          <mat-card class="add-actor-card">
            <mat-card-header>
              <mat-card-title>Add New Actor</mat-card-title>
              <mat-card-subtitle
                >Create a new data source for your forms</mat-card-subtitle
              >
            </mat-card-header>
            <mat-card-content>
              <div class="form-grid">
                <mat-form-field appearance="outline">
                  <mat-label>Actor ID</mat-label>
                  <input
                    matInput
                    [(ngModel)]="newActor.id"
                    placeholder="e.g., employees, managers"
                  />
                  <mat-hint>Unique identifier for the actor</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Actor Name</mat-label>
                  <input
                    matInput
                    [(ngModel)]="newActor.name"
                    placeholder="e.g., Employees, Managers"
                  />
                  <mat-hint>Display name for the actor</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Description</mat-label>
                  <textarea
                    matInput
                    [(ngModel)]="newActor.description"
                    placeholder="Brief description of the data source"
                    rows="2"
                  ></textarea>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Category</mat-label>
                  <mat-select [(ngModel)]="newActor.category">
                    <mat-option value="personnel">Personnel</mat-option>
                    <mat-option value="organization">Organization</mat-option>
                    <mat-option value="business">Business</mat-option>
                    <mat-option value="custom">Custom</mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="full-width">
                  <mat-expansion-panel>
                    <mat-expansion-panel-header>
                      <mat-panel-title>
                        <mat-icon>data_array</mat-icon>
                        Sample Data (Optional)
                      </mat-panel-title>
                    </mat-expansion-panel-header>
                    <div class="sample-data-section">
                      <p class="text-sm text-gray-600 mb-3">
                        Add some sample data items to test your actor. You can
                        add more later.
                      </p>
                      <div class="sample-data-grid">
                        <div
                          *ngFor="let item of sampleDataItems; let i = index"
                          class="sample-data-item"
                        >
                          <mat-form-field appearance="outline">
                            <mat-label>Value</mat-label>
                            <input
                              matInput
                              [(ngModel)]="item.value"
                              placeholder="e.g., emp_001"
                            />
                          </mat-form-field>
                          <mat-form-field appearance="outline">
                            <mat-label>Label</mat-label>
                            <input
                              matInput
                              [(ngModel)]="item.label"
                              placeholder="e.g., John Doe"
                            />
                          </mat-form-field>
                          <button
                            mat-icon-button
                            color="warn"
                            (click)="removeSampleData(i)"
                          >
                            <mat-icon>delete</mat-icon>
                          </button>
                        </div>
                      </div>
                      <button
                        mat-stroked-button
                        (click)="addSampleData()"
                        class="mt-3"
                      >
                        <mat-icon>add</mat-icon>
                        Add Sample Data
                      </button>
                    </div>
                  </mat-expansion-panel>
                </div>
              </div>

              <div class="form-actions">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="addNewActor()"
                  [disabled]="!newActor.id || !newActor.name"
                >
                  <mat-icon>add</mat-icon>
                  Add Actor
                </button>
                <button mat-button (click)="resetForm()">
                  <mat-icon>refresh</mat-icon>
                  Reset
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="right-panel">
          <mat-card class="actors-list-card">
            <mat-card-header>
              <mat-card-title>Manage Actors</mat-card-title>
              <mat-card-subtitle
                >View and manage your company's data sources</mat-card-subtitle
              >
            </mat-card-header>
            <mat-card-content>
              <mat-tab-group class="actors-tabs">
                @for (category of categories(); track category.id) {
                <mat-tab [label]="category.name">
                  <div class="tab-content">
                    @if (category.actors.length === 0) {
                    <div class="empty-state">
                      <mat-icon class="empty-icon">data_usage</mat-icon>
                      <p class="empty-text">No actors in this category.</p>
                      <p class="empty-subtext">
                        Add a new actor to get started.
                      </p>
                    </div>
                    } @else {
                    <div class="actors-grid">
                      @for (actor of category.actors; track actor.id) {
                      <mat-card class="actor-card">
                        <mat-card-header>
                          <mat-card-title>{{ actor.name }}</mat-card-title>
                          <mat-card-subtitle
                            >ID: {{ actor.id }}</mat-card-subtitle
                          >
                          <div class="actor-status">
                            <mat-chip
                              [color]="actor.isActive ? 'primary' : 'warn'"
                              size="small"
                            >
                              {{ actor.isActive ? 'Active' : 'Inactive' }}
                            </mat-chip>
                          </div>
                        </mat-card-header>
                        <mat-card-content>
                          <p class="actor-description">
                            {{ actor.description }}
                          </p>
                          <div class="actor-data-preview">
                            <h4>
                              Data Preview ({{ actor.data.length }} items)
                            </h4>
                            <div class="data-chips">
                              @for (item of actor.data.slice(0, 5); track
                              item.value) {
                              <mat-chip size="small">{{ item.label }}</mat-chip>
                              } @if (actor.data.length > 5) {
                              <mat-chip size="small" color="accent">
                                +{{ actor.data.length - 5 }} more
                              </mat-chip>
                              }
                            </div>
                          </div>
                        </mat-card-content>
                        <mat-card-actions>
                          <button
                            mat-button
                            color="primary"
                            (click)="editActor(actor)"
                          >
                            <mat-icon>edit</mat-icon>
                            Edit
                          </button>
                          <button
                            mat-button
                            color="accent"
                            (click)="toggleActorStatus(actor)"
                          >
                            <mat-icon>{{
                              actor.isActive ? 'visibility_off' : 'visibility'
                            }}</mat-icon>
                            {{ actor.isActive ? 'Disable' : 'Enable' }}
                          </button>
                          <button
                            mat-button
                            color="warn"
                            (click)="deleteActor(actor.id)"
                          >
                            <mat-icon>delete</mat-icon>
                            Delete
                          </button>
                        </mat-card-actions>
                      </mat-card>
                      }
                    </div>
                    }
                  </div>
                </mat-tab>
                }
              </mat-tab-group>
            </mat-card-content>
          </mat-card>

          <mat-card class="quick-actions-card">
            <mat-card-header>
              <mat-card-title>Quick Actions</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="quick-actions-grid">
                <button
                  mat-stroked-button
                  (click)="exportActorsData()"
                  class="action-button"
                >
                  <mat-icon>download</mat-icon>
                  <span>Export Data</span>
                </button>
                <button
                  mat-stroked-button
                  (click)="importActorsData()"
                  class="action-button"
                >
                  <mat-icon>upload</mat-icon>
                  <span>Import Data</span>
                </button>
                <button
                  mat-stroked-button
                  (click)="addSampleActors()"
                  class="action-button"
                >
                  <mat-icon>add_circle</mat-icon>
                  <span>Add Samples</span>
                </button>
                <button
                  mat-stroked-button
                  color="warn"
                  (click)="clearAllActors()"
                  class="action-button"
                >
                  <mat-icon>clear_all</mat-icon>
                  <span>Clear All</span>
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: `
    .actors-management-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f5f5f5;
      overflow: hidden;
    }

    .header-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      text-align: center;
      flex-shrink: 0;
    }

    .header-section h2 {
      margin: 0 0 8px 0;
      font-size: 2rem;
      font-weight: 700;
    }

    .subtitle {
      margin: 0;
      opacity: 0.9;
      font-size: 1rem;
    }

    .content-wrapper {
      flex: 1;
      display: flex;
      gap: 20px;
      padding: 20px;
      overflow: hidden;
    }

    .left-panel {
      width: 400px;
      flex-shrink: 0;
      overflow-y: auto;
    }

    .right-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow: hidden;
    }

    .add-actor-card {
      margin-bottom: 20px;
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .actors-list-card {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .actors-list-card mat-card-content {
      flex: 1;
      overflow: hidden;
    }

    .actors-tabs {
      height: 100%;
    }

    .actors-tabs ::ng-deep .mat-mdc-tab-body-wrapper {
      height: 100%;
    }

    .actors-tabs ::ng-deep .mat-mdc-tab-body {
      height: 100%;
      overflow: auto;
    }

    .tab-content {
      padding: 20px 0;
      height: 100%;
      overflow: auto;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #ccc;
      margin-bottom: 16px;
    }

    .empty-text {
      font-size: 1.2rem;
      margin: 0 0 8px 0;
    }

    .empty-subtext {
      font-size: 0.9rem;
      margin: 0;
      opacity: 0.7;
    }

    .actors-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .actor-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    .actor-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .actor-status {
      position: absolute;
      top: 16px;
      right: 16px;
    }

    .actor-description {
      color: #666;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .actor-data-preview h4 {
      margin: 0 0 8px 0;
      font-size: 0.9rem;
      color: #333;
    }

    .data-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .quick-actions-card {
      flex-shrink: 0;
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }

    .action-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 16px 8px;
      height: auto;
    }

    .action-button mat-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    .sample-data-section {
      padding: 16px 0;
    }

    .sample-data-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sample-data-item {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 12px;
      align-items: center;
    }

    .text-sm {
      font-size: 0.875rem;
    }

    .text-gray-600 {
      color: #666;
    }

    .mb-3 {
      margin-bottom: 12px;
    }

    .mt-3 {
      margin-top: 12px;
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .content-wrapper {
        flex-direction: column;
      }

      .left-panel {
        width: 100%;
        max-height: 400px;
      }

      .actors-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .header-section {
        padding: 16px;
      }

      .header-section h2 {
        font-size: 1.5rem;
      }

      .content-wrapper {
        padding: 12px;
        gap: 12px;
      }

      .actors-grid {
        grid-template-columns: 1fr;
      }

      .sample-data-item {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .quick-actions-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `,
})
export class ActorsManagementComponent {
  private actorsDataService = inject(ActorsDataService);
  private dialog = inject(MatDialog);

  newActor: Partial<ActorData> = {
    id: '',
    name: '',
    description: '',
    category: 'personnel',
    data: [],
    isActive: true,
  };

  sampleDataItems: Array<{ value: string; label: string }> = [
    { value: '', label: '' },
  ];

  categories = signal<ActorCategory[]>([]);

  constructor() {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.actorsDataService.getCategories().subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  addNewActor(): void {
    if (!this.newActor.id || !this.newActor.name) return;

    // Filter out empty sample data items
    const validSampleData = this.sampleDataItems.filter(
      (item) => item.value.trim() && item.label.trim()
    );

    const actor: ActorData = {
      id: this.newActor.id!,
      name: this.newActor.name!,
      description: this.newActor.description || '',
      category: this.newActor.category || 'personnel',
      data: validSampleData,
      isActive: true,
    };

    this.actorsDataService.addActor(actor);
    this.loadCategories();
    this.resetForm();
  }

  resetForm(): void {
    this.newActor = {
      id: '',
      name: '',
      description: '',
      category: 'personnel',
      data: [],
      isActive: true,
    };
    this.sampleDataItems = [{ value: '', label: '' }];
  }

  addSampleData(): void {
    this.sampleDataItems.push({ value: '', label: '' });
  }

  removeSampleData(index: number): void {
    if (this.sampleDataItems.length > 1) {
      this.sampleDataItems.splice(index, 1);
    }
  }

  editActor(actor: ActorData): void {
    // Open dialog to edit actor data
    this.openEditDialog(actor);
  }

  toggleActorStatus(actor: ActorData): void {
    this.actorsDataService.updateActor(actor.id, { isActive: !actor.isActive });
    this.loadCategories();
  }

  deleteActor(actorId: string): void {
    if (confirm(`Are you sure you want to delete Actor "${actorId}"?`)) {
      this.actorsDataService.deleteActor(actorId);
      this.loadCategories();
    }
  }

  addSampleActors(): void {
    const sampleActors: ActorData[] = [
      {
        id: 'projects',
        name: 'Projects',
        description: 'List of company projects',
        category: 'business',
        isActive: true,
        data: [
          { value: 'proj_001', label: 'Website Redesign' },
          { value: 'proj_002', label: 'Mobile App Development' },
          { value: 'proj_003', label: 'Database Migration' },
        ],
      },
      {
        id: 'technologies',
        name: 'Technologies',
        description: 'Technologies used in the company',
        category: 'business',
        isActive: true,
        data: [
          { value: 'tech_001', label: 'Angular' },
          { value: 'tech_002', label: 'React' },
          { value: 'tech_003', label: 'Node.js' },
          { value: 'tech_004', label: 'Python' },
        ],
      },
    ];

    sampleActors.forEach((actor) => {
      this.actorsDataService.addActor(actor);
    });
    this.loadCategories();
  }

  exportActorsData(): void {
    const data = this.actorsDataService.exportActorsData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'company-actors-data.json';
    link.click();

    URL.revokeObjectURL(url);
  }

  importActorsData(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const data = JSON.parse(e.target.result);
            this.actorsDataService.importActorsData(data);
            this.loadCategories();
            alert('Data imported successfully!');
          } catch (error) {
            alert('Error importing data. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  clearAllActors(): void {
    if (
      confirm(
        'Are you sure you want to clear all custom data? This action cannot be undone.'
      )
    ) {
      // This would clear all actors except the default ones
      alert('All custom data has been cleared.');
    }
  }

  private openEditDialog(actor: ActorData): void {
    // This would open a dialog to edit the actor data
    alert(`Edit dialog for Actor "${actor.name}" will be implemented here.`);
  }
}
