import { Injectable } from '@angular/core';
import { Observable, of, delay, from } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

export interface ApiOption {
  value: string;
  label: string;
}

export interface ApiConfig {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  params?: Record<string, any>;
  dataPath?: string;
  valueField?: string;
  labelField?: string;
  transformFunction?: string;
  minSelections?: number;
  maxSelections?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiDataService {
  constructor(private http: HttpClient) {}

  // Dynamic API data storage - users can configure their own data
  private dynamicApiData: { [key: string]: ApiOption[] } = {};

  // Enhanced method to get options with dynamic API support
  getOptionsByGroup(
    groupId: string,
    apiConfig?: ApiConfig
  ): Observable<ApiOption[]> {
    // If external API config is provided, use it
    if (apiConfig?.url) {
      return this.fetchFromExternalApi(apiConfig);
    }

    // Check if dynamic data exists for this group
    if (this.dynamicApiData[groupId]) {
      return of(this.dynamicApiData[groupId]).pipe(delay(200));
    }

    // Return empty array if no data is configured
    return of([]).pipe(delay(200));
  }

  // Method to set dynamic data for a group
  setDynamicData(groupId: string, data: ApiOption[]): void {
    this.dynamicApiData[groupId] = data;
  }

  // Method to get dynamic data for a group
  getDynamicData(groupId: string): ApiOption[] {
    return this.dynamicApiData[groupId] || [];
  }

  // Method to remove dynamic data for a group
  removeDynamicData(groupId: string): void {
    delete this.dynamicApiData[groupId];
  }

  // New method to fetch from external API
  private fetchFromExternalApi(config: ApiConfig): Observable<ApiOption[]> {
    const url = config.url!;
    const method = config.method || 'GET';
    const headers = new HttpHeaders(config.headers);
    const params = config.params || {};

    let request: Observable<any>;

    switch (method.toUpperCase()) {
      case 'POST':
        request = this.http.post(url, params, { headers });
        break;
      case 'PUT':
        request = this.http.put(url, params, { headers });
        break;
      case 'DELETE':
        request = this.http.delete(url, { headers, params });
        break;
      default:
        request = this.http.get(url, { headers, params });
    }

    return request.pipe(
      map((response) => this.transformApiResponse(response, config)),
      catchError((error) => {
        console.error('Error fetching from external API:', error);
        return of([]);
      })
    );
  }

  // Transform API response to ApiOption format
  private transformApiResponse(response: any, config: ApiConfig): ApiOption[] {
    try {
      // Extract data using dataPath if provided
      let data = response;
      if (config.dataPath) {
        data = this.getNestedValue(response, config.dataPath);
      }

      if (!Array.isArray(data)) {
        console.warn('API response is not an array:', data);
        return [];
      }

      const valueField = config.valueField || 'value';
      const labelField = config.labelField || 'label';

      // Apply custom transform function if provided
      if (config.transformFunction) {
        try {
          const transformFn = new Function(
            'data',
            'valueField',
            'labelField',
            config.transformFunction
          );
          return transformFn(data, valueField, labelField);
        } catch (error) {
          console.error('Error executing transform function:', error);
        }
      }

      // Default transformation
      return data.map((item: any) => ({
        value: String(item[valueField] || item.id || item.value || ''),
        label: String(item[labelField] || item.name || item.label || ''),
      }));
    } catch (error) {
      console.error('Error transforming API response:', error);
      return [];
    }
  }

  // Helper method to get nested object values using dot notation
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Get all available groups (dynamic data)
  getAvailableGroups(): Observable<string[]> {
    return of(Object.keys(this.dynamicApiData)).pipe(delay(200));
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

  // Validate API configuration
  validateApiConfig(config: ApiConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.url) {
      errors.push('URL is required');
    }

    if (
      config.method &&
      !['GET', 'POST', 'PUT', 'DELETE'].includes(config.method.toUpperCase())
    ) {
      errors.push('Invalid HTTP method');
    }

    if (
      config.maxSelections &&
      config.minSelections &&
      config.maxSelections < config.minSelections
    ) {
      errors.push('Max selections cannot be less than min selections');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Method to create sample data for testing
  createSampleData(): void {
    this.setDynamicData('users', [
      { value: 'user1', label: 'John Doe' },
      { value: 'user2', label: 'Jane Smith' },
      { value: 'user3', label: 'Mike Johnson' },
      { value: 'user4', label: 'Sarah Wilson' },
    ]);

    this.setDynamicData('products', [
      { value: 'prod1', label: 'Laptop' },
      { value: 'prod2', label: 'Smartphone' },
      { value: 'prod3', label: 'Tablet' },
      { value: 'prod4', label: 'Headphones' },
    ]);

    this.setDynamicData('categories', [
      { value: 'cat1', label: 'Electronics' },
      { value: 'cat2', label: 'Clothing' },
      { value: 'cat3', label: 'Books' },
      { value: 'cat4', label: 'Home & Garden' },
    ]);

    this.setDynamicData('countries', [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia' },
    ]);

    this.setDynamicData('departments', [
      { value: 'hr', label: 'Human Resources' },
      { value: 'it', label: 'Information Technology' },
      { value: 'sales', label: 'Sales' },
      { value: 'marketing', label: 'Marketing' },
    ]);
  }

  // Method to clear all dynamic data
  clearAllDynamicData(): void {
    this.dynamicApiData = {};
  }
}
