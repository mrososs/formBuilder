import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { SelectFieldComponent } from '../components/field-types/select-field/select-field.component';
import { MultiselectFieldComponent } from '../components/field-types/multiselect-field/multiselect-field.component';
import { RadioFieldComponent } from '../components/field-types/radio-field/radio-field.component';
import { FormField } from '../models/field';

@Component({
  selector: 'app-actors-example',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    SelectFieldComponent,
    MultiselectFieldComponent,
    RadioFieldComponent,
  ],
  template: `
    <div class="actors-example-container">
      <div class="header-section">
        <h2>Actors System Examples</h2>
        <p class="subtitle">
          Demonstrating dynamic data sources for form fields
        </p>
      </div>

      <mat-tab-group>
        <mat-tab label="Dropdown with Actors">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Employee Selection</mat-card-title>
                <mat-card-subtitle
                  >Dropdown using employee data from Actors</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <app-select-field [field]="employeeSelectField" />
              </mat-card-content>
            </mat-card>

            <mat-card class="mt-4">
              <mat-card-header>
                <mat-card-title>Department Selection</mat-card-title>
                <mat-card-subtitle
                  >Dropdown using department data from Actors</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <app-select-field [field]="departmentSelectField" />
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Multi-Select with Actors">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Product Selection</mat-card-title>
                <mat-card-subtitle
                  >Multi-Select using product data from
                  Actors</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <app-multiselect-field [field]="productsMultiField" />
              </mat-card-content>
            </mat-card>

            <mat-card class="mt-4">
              <mat-card-header>
                <mat-card-title>Customer Selection</mat-card-title>
                <mat-card-subtitle
                  >Multi-Select using customer data from
                  Actors</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <app-multiselect-field [field]="customersMultiField" />
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Radio Buttons with Actors">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Location Selection</mat-card-title>
                <mat-card-subtitle
                  >Radio buttons using location data from
                  Actors</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <app-radio-field [field]="locationRadioField" />
              </mat-card-content>
            </mat-card>

            <mat-card class="mt-4">
              <mat-card-header>
                <mat-card-title
                  >Manager Selection (Multi-Select)</mat-card-title
                >
                <mat-card-subtitle
                  >Radio buttons with multiple selection for
                  managers</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <app-radio-field [field]="managersMultiRadioField" />
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Comparison with Static Options">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Static Options</mat-card-title>
                <mat-card-subtitle
                  >Manually defined static options</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <app-select-field [field]="staticSelectField" />
              </mat-card-content>
            </mat-card>

            <mat-card class="mt-4">
              <mat-card-header>
                <mat-card-title>Actors Options</mat-card-title>
                <mat-card-subtitle
                  >Dynamic options from Actors</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <app-select-field [field]="actorsSelectField" />
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Information about Actors">
          <div class="tab-content">
            <mat-card>
              <mat-card-header>
                <mat-card-title>Available Actors Data</mat-card-title>
                <mat-card-subtitle
                  >Overview of predefined company data
                  sources</mat-card-subtitle
                >
              </mat-card-header>
              <mat-card-content>
                <div class="actors-info-grid">
                  <div class="actor-info-card">
                    <h4>Employees</h4>
                    <p>Company employees with roles and departments</p>
                    <div class="data-preview">
                      <mat-chip size="small"
                        >John Smith - Sales Manager</mat-chip
                      >
                      <mat-chip size="small"
                        >Sarah Johnson - Accountant</mat-chip
                      >
                      <mat-chip size="small"
                        >Michael Brown - Developer</mat-chip
                      >
                    </div>
                  </div>

                  <div class="actor-info-card">
                    <h4>Managers</h4>
                    <p>Company managers and supervisors</p>
                    <div class="data-preview">
                      <mat-chip size="small"
                        >John Smith - Sales Manager</mat-chip
                      >
                      <mat-chip size="small">Emily Davis - HR Manager</mat-chip>
                      <mat-chip size="small"
                        >David Wilson - Production Manager</mat-chip
                      >
                    </div>
                  </div>

                  <div class="actor-info-card">
                    <h4>Departments</h4>
                    <p>Company organizational structure</p>
                    <div class="data-preview">
                      <mat-chip size="small">Sales Department</mat-chip>
                      <mat-chip size="small">Human Resources</mat-chip>
                      <mat-chip size="small">Information Technology</mat-chip>
                    </div>
                  </div>

                  <div class="actor-info-card">
                    <h4>Products</h4>
                    <p>Company products and services</p>
                    <div class="data-preview">
                      <mat-chip size="small">Product A - Electronics</mat-chip>
                      <mat-chip size="small">Product B - Clothing</mat-chip>
                      <mat-chip size="small">Product C - Furniture</mat-chip>
                    </div>
                  </div>

                  <div class="actor-info-card">
                    <h4>Customers</h4>
                    <p>Company customers and clients</p>
                    <div class="data-preview">
                      <mat-chip size="small">Advanced Technology Corp</mat-chip>
                      <mat-chip size="small"
                        >Public Services Foundation</mat-chip
                      >
                      <mat-chip size="small">Modern Manufacturing Co</mat-chip>
                    </div>
                  </div>

                  <div class="actor-info-card">
                    <h4>Suppliers</h4>
                    <p>Company suppliers and vendors</p>
                    <div class="data-preview">
                      <mat-chip size="small">Global Supplies Inc</mat-chip>
                      <mat-chip size="small">Logistics Services Ltd</mat-chip>
                      <mat-chip size="small">Industrial Supply Co</mat-chip>
                    </div>
                  </div>

                  <div class="actor-info-card">
                    <h4>Locations</h4>
                    <p>Company offices and facilities</p>
                    <div class="data-preview">
                      <mat-chip size="small">Headquarters - New York</mat-chip>
                      <mat-chip size="small">Los Angeles Branch</mat-chip>
                      <mat-chip size="small">Chicago Branch</mat-chip>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    .actors-example-container {
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

    .tab-content {
      padding: 20px;
      flex: 1;
      overflow-y: auto;
    }

    .actors-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .actor-info-card {
      background: white;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #e0e0e0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .actor-info-card h4 {
      color: #1976d2;
      margin: 0 0 8px 0;
      font-weight: 600;
    }

    .actor-info-card p {
      color: #666;
      margin: 0 0 12px 0;
      font-size: 0.9rem;
    }

    .data-preview {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .mt-4 {
      margin-top: 16px;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-section {
        padding: 16px;
      }

      .header-section h2 {
        font-size: 1.5rem;
      }

      .tab-content {
        padding: 12px;
      }

      .actors-info-grid {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class ActorsExampleComponent {
  // Select Fields with Actors
  employeeSelectField: FormField = {
    id: 'employee-select',
    type: 'select',
    label: 'Select Employee',
    required: true,
    placeholder: 'Choose an employee from the list',
    optionSource: 'actors',
    actorId: 'employees',
  };

  departmentSelectField: FormField = {
    id: 'department-select',
    type: 'select',
    label: 'Select Department',
    required: true,
    placeholder: 'Choose a department from the list',
    optionSource: 'actors',
    actorId: 'departments',
  };

  // Multi-Select Fields with Actors
  productsMultiField: FormField = {
    id: 'products-multi',
    type: 'multiselect',
    label: 'Select Products',
    required: false,
    placeholder: 'Choose products from the list',
    optionSource: 'actors',
    actorId: 'products',
    maxSelections: 3,
  };

  customersMultiField: FormField = {
    id: 'customers-multi',
    type: 'multiselect',
    label: 'Select Customers',
    required: false,
    placeholder: 'Choose customers from the list',
    optionSource: 'actors',
    actorId: 'customers',
    maxSelections: 5,
  };

  // Radio Fields with Actors
  locationRadioField: FormField = {
    id: 'location-radio',
    type: 'radio',
    label: 'Select Location',
    required: true,
    optionSource: 'actors',
    actorId: 'locations',
    allowMultiple: false,
  };

  managersMultiRadioField: FormField = {
    id: 'managers-multi-radio',
    type: 'radio',
    label: 'Select Managers',
    required: false,
    optionSource: 'actors',
    actorId: 'managers',
    allowMultiple: true,
    maxSelections: 2,
    minSelections: 1,
  };

  // Comparison Fields
  staticSelectField: FormField = {
    id: 'static-select',
    type: 'select',
    label: 'Static Options',
    required: true,
    placeholder: 'Choose from static options',
    optionSource: 'static',
    staticOptions: 'Option 1, Option 2, Option 3, Option 4',
  };

  actorsSelectField: FormField = {
    id: 'actors-select',
    type: 'select',
    label: 'Actors Options',
    required: true,
    placeholder: 'Choose from actors data',
    optionSource: 'actors',
    actorId: 'employees',
  };
}
