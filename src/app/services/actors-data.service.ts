import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface ActorData {
  id: string;
  name: string;
  description?: string;
  data: Array<{ value: string; label: string }>;
  category?: string;
  isActive?: boolean;
}

export interface ActorCategory {
  id: string;
  name: string;
  description?: string;
  actors: ActorData[];
}

@Injectable({
  providedIn: 'root',
})
export class ActorsDataService {
  // Predefined actors/data sources for the company
  private actorsData: ActorData[] = [
    {
      id: 'employees',
      name: 'Employees',
      description: 'List of all company employees',
      category: 'personnel',
      isActive: true,
      data: [
        { value: 'emp_001', label: 'John Smith - Sales Manager' },
        { value: 'emp_002', label: 'Sarah Johnson - Accountant' },
        { value: 'emp_003', label: 'Michael Brown - Software Developer' },
        { value: 'emp_004', label: 'Emily Davis - HR Manager' },
        { value: 'emp_005', label: 'David Wilson - Production Manager' },
      ],
    },
    {
      id: 'managers',
      name: 'Managers',
      description: 'List of all company managers',
      category: 'personnel',
      isActive: true,
      data: [
        { value: 'mgr_001', label: 'John Smith - Sales Manager' },
        { value: 'mgr_002', label: 'Emily Davis - HR Manager' },
        { value: 'mgr_003', label: 'David Wilson - Production Manager' },
        { value: 'mgr_004', label: 'Sarah Johnson - Finance Manager' },
      ],
    },
    {
      id: 'departments',
      name: 'Departments',
      description: 'List of all company departments',
      category: 'organization',
      isActive: true,
      data: [
        { value: 'dept_001', label: 'Sales Department' },
        { value: 'dept_002', label: 'Human Resources' },
        { value: 'dept_003', label: 'Information Technology' },
        { value: 'dept_004', label: 'Production Department' },
        { value: 'dept_005', label: 'Finance Department' },
        { value: 'dept_006', label: 'Marketing Department' },
      ],
    },
    {
      id: 'products',
      name: 'Products',
      description: 'List of all company products',
      category: 'business',
      isActive: true,
      data: [
        { value: 'prod_001', label: 'Product A - Electronics' },
        { value: 'prod_002', label: 'Product B - Clothing' },
        { value: 'prod_003', label: 'Product C - Furniture' },
        { value: 'prod_004', label: 'Product D - Home Appliances' },
      ],
    },
    {
      id: 'customers',
      name: 'Customers',
      description: 'List of all company customers',
      category: 'business',
      isActive: true,
      data: [
        { value: 'cust_001', label: 'Advanced Technology Corp' },
        { value: 'cust_002', label: 'Public Services Foundation' },
        { value: 'cust_003', label: 'Modern Manufacturing Co' },
        { value: 'cust_004', label: 'International Law Office' },
      ],
    },
    {
      id: 'suppliers',
      name: 'Suppliers',
      description: 'List of all company suppliers',
      category: 'business',
      isActive: true,
      data: [
        { value: 'sup_001', label: 'Global Supplies Inc' },
        { value: 'sup_002', label: 'Logistics Services Ltd' },
        { value: 'sup_003', label: 'Industrial Supply Co' },
      ],
    },
    {
      id: 'locations',
      name: 'Locations',
      description: 'List of all company locations',
      category: 'organization',
      isActive: true,
      data: [
        { value: 'loc_001', label: 'Headquarters - New York' },
        { value: 'loc_002', label: 'Los Angeles Branch' },
        { value: 'loc_003', label: 'Chicago Branch' },
        { value: 'loc_004', label: 'Houston Warehouse' },
      ],
    },
  ];

  private categories: ActorCategory[] = [
    {
      id: 'personnel',
      name: 'Personnel',
      description: 'All data related to employees and managers',
      actors: [],
    },
    {
      id: 'organization',
      name: 'Organization',
      description: 'Departments, locations, and organizational structure',
      actors: [],
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Products, customers, suppliers, and business data',
      actors: [],
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'Custom data sources created by users',
      actors: [],
    },
  ];

  constructor() {
    this.organizeActorsByCategory();
  }

  private organizeActorsByCategory(): void {
    this.categories.forEach((category) => {
      category.actors = this.actorsData.filter(
        (actor) => actor.category === category.id
      );
    });
  }

  // Get all actors
  getAllActors(): Observable<ActorData[]> {
    return of(this.actorsData.filter((actor) => actor.isActive)).pipe(
      delay(200)
    );
  }

  // Get actors by category
  getActorsByCategory(categoryId: string): Observable<ActorData[]> {
    const actors = this.actorsData.filter(
      (actor) => actor.category === categoryId && actor.isActive
    );
    return of(actors).pipe(delay(200));
  }

  // Get all categories
  getCategories(): Observable<ActorCategory[]> {
    return of(this.categories).pipe(delay(200));
  }

  // Get specific actor data
  getActorData(actorId: string): Observable<ActorData | null> {
    const actor = this.actorsData.find((a) => a.id === actorId && a.isActive);
    return of(actor || null).pipe(delay(200));
  }

  // Get actor options (for form fields)
  getActorOptions(
    actorId: string
  ): Observable<Array<{ value: string; label: string }>> {
    const actor = this.actorsData.find((a) => a.id === actorId && a.isActive);
    return of(actor?.data || []).pipe(delay(200));
  }

  // Add new actor
  addActor(actor: ActorData): void {
    this.actorsData.push(actor);
    this.organizeActorsByCategory();
  }

  // Update actor
  updateActor(actorId: string, updatedActor: Partial<ActorData>): void {
    const index = this.actorsData.findIndex((a) => a.id === actorId);
    if (index !== -1) {
      this.actorsData[index] = { ...this.actorsData[index], ...updatedActor };
      this.organizeActorsByCategory();
    }
  }

  // Delete actor
  deleteActor(actorId: string): void {
    this.actorsData = this.actorsData.filter((a) => a.id !== actorId);
    this.organizeActorsByCategory();
  }

  // Export actors data for JSON export
  exportActorsData(): any {
    return {
      actors: this.actorsData,
      categories: this.categories,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
  }

  // Import actors data
  importActorsData(data: any): void {
    if (data.actors && Array.isArray(data.actors)) {
      this.actorsData = data.actors;
      this.organizeActorsByCategory();
    }
  }

  // Get actors for form field configuration
  getActorsForFormFields(): Observable<
    Array<{ value: string; label: string }>
  > {
    const actors = this.actorsData
      .filter((actor) => actor.isActive)
      .map((actor) => ({
        value: actor.id,
        label: actor.name,
      }));
    return of(actors).pipe(delay(200));
  }

  // Search actors
  searchActors(query: string): Observable<ActorData[]> {
    const filtered = this.actorsData.filter(
      (actor) =>
        actor.isActive &&
        (actor.name.toLowerCase().includes(query.toLowerCase()) ||
          actor.description?.toLowerCase().includes(query.toLowerCase()))
    );
    return of(filtered).pipe(delay(200));
  }
}
