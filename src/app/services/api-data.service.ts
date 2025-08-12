import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface ApiOption {
  value: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiDataService {
  // Fake API data for different groups
  private fakeApiData: { [key: string]: ApiOption[] } = {
    users: [
      { value: 'user1', label: 'John Doe' },
      { value: 'user2', label: 'Jane Smith' },
      { value: 'user3', label: 'Mike Johnson' },
      { value: 'user4', label: 'Sarah Wilson' },
      { value: 'user5', label: 'David Brown' },
      { value: 'user6', label: 'Emily Davis' },
      { value: 'user7', label: 'Robert Miller' },
      { value: 'user8', label: 'Lisa Garcia' },
    ],
    products: [
      { value: 'prod1', label: 'Laptop' },
      { value: 'prod2', label: 'Smartphone' },
      { value: 'prod3', label: 'Tablet' },
      { value: 'prod4', label: 'Headphones' },
      { value: 'prod5', label: 'Keyboard' },
      { value: 'prod6', label: 'Mouse' },
      { value: 'prod7', label: 'Monitor' },
      { value: 'prod8', label: 'Printer' },
    ],
    categories: [
      { value: 'cat1', label: 'Electronics' },
      { value: 'cat2', label: 'Clothing' },
      { value: 'cat3', label: 'Books' },
      { value: 'cat4', label: 'Home & Garden' },
      { value: 'cat5', label: 'Sports' },
      { value: 'cat6', label: 'Automotive' },
      { value: 'cat7', label: 'Health & Beauty' },
      { value: 'cat8', label: 'Toys & Games' },
    ],
    countries: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia' },
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
      { value: 'jp', label: 'Japan' },
      { value: 'br', label: 'Brazil' },
      { value: 'in', label: 'India' },
      { value: 'cn', label: 'China' },
    ],
    departments: [
      { value: 'hr', label: 'Human Resources' },
      { value: 'it', label: 'Information Technology' },
      { value: 'sales', label: 'Sales' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'finance', label: 'Finance' },
      { value: 'operations', label: 'Operations' },
      { value: 'legal', label: 'Legal' },
      { value: 'customer_support', label: 'Customer Support' },
    ],
  };

  constructor() {}

  // Simulate API call to get options for a specific group
  getOptionsByGroup(groupId: string): Observable<ApiOption[]> {
    const options = this.fakeApiData[groupId] || [];
    // Simulate network delay
    return of(options).pipe(delay(500));
  }

  // Get all available groups
  getAvailableGroups(): Observable<string[]> {
    return of(Object.keys(this.fakeApiData)).pipe(delay(200));
  }

  // Parse custom JSON options
  parseCustomOptions(customOptionsJson: string): ApiOption[] {
    try {
      if (!customOptionsJson || customOptionsJson.trim() === '') {
        return [];
      }
      const parsed = JSON.parse(customOptionsJson);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          value: item.value || item.id || String(item),
          label: item.label || item.name || String(item),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error parsing custom options:', error);
      return [];
    }
  }

  // Parse static options from comma-separated text
  parseStaticOptions(staticOptionsText: string): ApiOption[] {
    if (!staticOptionsText || staticOptionsText.trim() === '') {
      return [];
    }

    return staticOptionsText
      .split(',')
      .map((option) => option.trim())
      .filter((option) => option.length > 0)
      .map((option, index) => ({
        value: `option${index + 1}`,
        label: option,
      }));
  }
}
