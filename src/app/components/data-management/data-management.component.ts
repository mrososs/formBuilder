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
import { FormsModule } from '@angular/forms';
import { ApiDataService, ApiOption } from '../../services/api-data.service';

@Component({
  selector: 'app-data-management',
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
    FormsModule,
  ],
  template: `
    <div class="data-management-container">
      <h2>Data Management</h2>

      <mat-card class="mb-4">
        <mat-card-header>
          <mat-card-title>Configure Dynamic Data Groups</mat-card-title>
          <mat-card-subtitle
            >Set up data sources for your form fields</mat-card-subtitle
          >
        </mat-card-header>
        <mat-card-content>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Group ID</mat-label>
              <input
                matInput
                [(ngModel)]="newGroupId"
                placeholder="e.g., users, products, categories"
              />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Group Name</mat-label>
              <input
                matInput
                [(ngModel)]="newGroupName"
                placeholder="e.g., Users, Products, Categories"
              />
            </mat-form-field>
          </div>

          <div class="mt-4">
            <button
              mat-raised-button
              color="primary"
              (click)="addNewGroup()"
              [disabled]="!newGroupId || !newGroupName"
            >
              <mat-icon>add</mat-icon>
              Add Group
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="mb-4">
        <mat-card-header>
          <mat-card-title>Manage Data Groups</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (dataGroups().length === 0) {
          <div class="text-center py-8">
            <mat-icon class="text-gray-400 text-6xl mb-4">data_usage</mat-icon>
            <p class="text-gray-600">No data groups configured yet.</p>
            <p class="text-gray-500 text-sm">
              Add a group above to get started.
            </p>
          </div>
          } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (group of dataGroups(); track group.id) {
            <mat-card class="group-card">
              <mat-card-header>
                <mat-card-title>{{ group.name }}</mat-card-title>
                <mat-card-subtitle>ID: {{ group.id }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p class="text-sm text-gray-600">
                  {{ group.data.length }} items configured
                </p>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button color="primary" (click)="editGroup(group)">
                  <mat-icon>edit</mat-icon>
                  Edit
                </button>
                <button mat-button color="warn" (click)="deleteGroup(group.id)">
                  <mat-icon>delete</mat-icon>
                  Delete
                </button>
              </mat-card-actions>
            </mat-card>
            }
          </div>
          }
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="flex flex-wrap gap-4">
            <button mat-stroked-button (click)="createSampleData()">
              <mat-icon>data_array</mat-icon>
              Create Sample Data
            </button>
            <button mat-stroked-button color="warn" (click)="clearAllData()">
              <mat-icon>clear_all</mat-icon>
              Clear All Data
            </button>
            <button mat-stroked-button (click)="exportData()">
              <mat-icon>download</mat-icon>
              Export Data
            </button>
            <button mat-stroked-button (click)="importData()">
              <mat-icon>upload</mat-icon>
              Import Data
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .data-management-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .group-card {
      transition: transform 0.2s ease-in-out;
    }
    
    .group-card:hover {
      transform: translateY(-2px);
    }
    
    h2 {
      color: #1976d2;
      margin-bottom: 20px;
    }
  `,
})
export class DataManagementComponent {
  private apiDataService = inject(ApiDataService);
  private dialog = inject(MatDialog);

  newGroupId = '';
  newGroupName = '';

  dataGroups = signal<Array<{ id: string; name: string; data: ApiOption[] }>>(
    []
  );

  constructor() {
    this.loadDataGroups();
  }

  private loadDataGroups(): void {
    this.apiDataService.getAvailableGroups().subscribe((groups) => {
      const groupData = groups.map((groupId) => ({
        id: groupId,
        name: this.getGroupDisplayName(groupId),
        data: this.apiDataService.getDynamicData(groupId),
      }));
      this.dataGroups.set(groupData);
    });
  }

  private getGroupDisplayName(groupId: string): string {
    // Convert group ID to display name (e.g., "users" -> "Users")
    return groupId.charAt(0).toUpperCase() + groupId.slice(1);
  }

  addNewGroup(): void {
    if (!this.newGroupId || !this.newGroupName) return;

    // Initialize with empty data
    this.apiDataService.setDynamicData(this.newGroupId, []);

    // Update the groups list
    this.loadDataGroups();

    // Clear the form
    this.newGroupId = '';
    this.newGroupName = '';
  }

  editGroup(group: { id: string; name: string; data: ApiOption[] }): void {
    // Open dialog to edit group data
    this.openEditDialog(group);
  }

  deleteGroup(groupId: string): void {
    if (confirm(`Are you sure you want to delete the group "${groupId}"?`)) {
      this.apiDataService.removeDynamicData(groupId);
      this.loadDataGroups();
    }
  }

  createSampleData(): void {
    this.apiDataService.createSampleData();
    this.loadDataGroups();
  }

  clearAllData(): void {
    if (
      confirm(
        'Are you sure you want to clear all data? This action cannot be undone.'
      )
    ) {
      this.apiDataService.clearAllDynamicData();
      this.loadDataGroups();
    }
  }

  exportData(): void {
    this.apiDataService.getAvailableGroups().subscribe((groups) => {
      const exportData: { [key: string]: ApiOption[] } = {};
      groups.forEach((groupId) => {
        exportData[groupId] = this.apiDataService.getDynamicData(groupId);
      });

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'form-builder-data.json';
      link.click();

      URL.revokeObjectURL(url);
    });
  }

  importData(): void {
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
            Object.keys(data).forEach((groupId) => {
              this.apiDataService.setDynamicData(groupId, data[groupId]);
            });
            this.loadDataGroups();
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

  private openEditDialog(group: {
    id: string;
    name: string;
    data: ApiOption[];
  }): void {
    // This would open a dialog to edit the group data
    // For now, we'll just show an alert
    alert(
      `Edit functionality for group "${group.name}" would be implemented here.`
    );
  }
}
