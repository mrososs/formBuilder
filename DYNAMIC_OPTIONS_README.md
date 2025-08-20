# Dynamic Options for Form Builder Components

This document describes the enhanced dynamic options functionality for select, multiselect, and radio field components in the form builder.

## Overview

The form builder now supports multiple ways to populate options for select, multiselect, and radio field components:

1. **Static Options** - Predefined options
2. **API Groups** - Using configurable data groups
3. **External API** - Using custom external APIs
4. **Custom Options** - JSON-formatted custom options

## Enhanced Field Properties

### New Properties Added to FormField Interface

```typescript
interface FormField {
  // ... existing properties ...

  // Enhanced properties for dynamic options
  useApiOptions?: boolean;
  apiEndpoint?: string;
  apiGroupId?: string;
  apiConfig?: {
    url?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    params?: Record<string, any>;
    dataPath?: string; // JSON path to extract options from response
    valueField?: string; // Field name for value (default: 'value')
    labelField?: string; // Field name for label (default: 'label')
    transformFunction?: string; // Custom transform function as string
  };
  staticOptions?: string; // JSON string of static options
  customOptions?: string; // JSON string of custom options
  optionSource?: "static" | "api" | "custom" | "external";

  // Multi-select properties for radio buttons
  allowMultiple?: boolean;
  maxSelections?: number;
  minSelections?: number;
}
```

## Field Settings Interface

### Radio Button Settings

Radio buttons now include comprehensive settings in the field properties panel:

- **Allow Multiple Selection** - Toggle between single and multi-select modes
- **Min/Max Selections** - Set selection limits for multi-select mode
- **Option Source** - Choose between Static, API Groups, External API, or Custom Options
- **Static Options** - Comma-separated values (shown when optionSource is 'static')
- **API Group** - Select from configured data groups (shown when optionSource is 'api')
- **External API Configuration** - Full API setup (shown when optionSource is 'external')
- **Custom Options** - Only shown when optionSource is 'custom'

### Select & Multi-Select Settings

Both select and multi-select fields now include:

- **Option Source** - Choose data source type
- **Static Options** - Comma-separated values
- **API Group** - Select from configured groups
- **External API Configuration** - Full API setup
- **Custom Options** - JSON-formatted options
- **Max Selections** - Limit selections (multi-select only)

## Option Sources

### 1. Static Options

Use predefined options with comma-separated values.

```typescript
const staticField: FormField = {
  id: "static-select",
  type: "select",
  label: "Static Select",
  required: true,
  optionSource: "static",
  staticOptions: "Option A, Option B, Option C, Option D",
};
```

### 2. API Groups (Configurable)

Use configurable data groups that users can set up through the data management interface.

```typescript
const apiField: FormField = {
  id: "api-select",
  type: "select",
  label: "API Select",
  required: true,
  optionSource: "api",
  apiGroupId: "users", // Configured through data management
};
```

### 3. External API

Connect to any external API with full configuration options.

```typescript
const externalField: FormField = {
  id: "external-select",
  type: "select",
  label: "External API Select",
  required: true,
  optionSource: "external",
  apiConfig: {
    url: "https://api.example.com/users",
    method: "GET",
    headers: {
      Authorization: "Bearer your-token",
      "Content-Type": "application/json",
    },
    dataPath: "data.users", // JSON path to extract array
    valueField: "id",
    labelField: "name",
    transformFunction: `
      return data.map(item => ({
        value: String(item[valueField]),
        label: item[labelField].toUpperCase()
      }));
    `,
  },
};
```

### 4. Custom Options

Use JSON-formatted custom options.

```typescript
const customField: FormField = {
  id: "custom-select",
  type: "select",
  label: "Custom Select",
  required: true,
  optionSource: "custom",
  customOptions: JSON.stringify([
    { value: "custom1", label: "Custom Option 1" },
    { value: "custom2", label: "Custom Option 2" },
  ]),
};
```

## Multi-Select Radio Buttons

Radio buttons now support multi-select functionality when `allowMultiple` is set to `true`.

```typescript
const multiSelectRadio: FormField = {
  id: "multi-radio",
  type: "radio",
  label: "Multi-Select Radio",
  required: true,
  optionSource: "api",
  apiGroupId: "departments",
  allowMultiple: true,
  maxSelections: 3,
  minSelections: 1,
};
```

### Multi-Select Features:

- **Checkbox Interface** - Uses checkboxes instead of radio buttons
- **Selection Limits** - Set min/max selections
- **Visual Feedback** - Shows selected values as chips
- **Validation** - Enforces selection limits

## Data Management

### Overview

The form builder now includes a data management interface that allows users to:

- Create and configure data groups
- Import/export data configurations
- Manage dynamic data sources
- Set up sample data for testing

### Data Management Features

1. **Create Data Groups** - Set up custom data sources
2. **Edit Group Data** - Modify existing data configurations
3. **Import/Export** - Backup and restore data configurations
4. **Sample Data** - Quick setup with predefined data
5. **Clear Data** - Remove all configured data

### Using Data Management

1. **Access Data Management** - Navigate to the data management interface
2. **Create Groups** - Add new data groups with custom IDs and names
3. **Configure Data** - Set up the actual data for each group
4. **Use in Forms** - Reference the group ID in your form fields

## API Configuration Options

### Basic Configuration

```typescript
apiConfig: {
  url: 'https://api.example.com/data',
  method: 'GET'
}
```

### Advanced Configuration

```typescript
apiConfig: {
  url: 'https://api.example.com/data',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
  },
  params: {
    limit: 50,
    category: 'electronics'
  },
  dataPath: 'response.items',
  valueField: 'productId',
  labelField: 'productName',
  transformFunction: `
    return data.filter(item => item.active).map(item => ({
      value: String(item[valueField]),
      label: item[labelField] + ' ($' + item.price + ')'
    }));
  `
}
```

## Field Settings Panel

### Dynamic Settings Display

The field settings panel now dynamically shows relevant options based on:

- **Field Type** - Different settings for different field types
- **Option Source** - Settings change based on selected data source
- **Multi-Select Mode** - Additional settings for multi-select fields

### Conditional Settings

Settings are shown/hidden based on the current configuration:

- **Static Options** - Only shown when optionSource is 'static'
- **API Group** - Only shown when optionSource is 'api'
- **External API Settings** - Only shown when optionSource is 'external'
- **Custom Options** - Only shown when optionSource is 'custom'
- **Multi-Select Settings** - Only shown for relevant field types

## Error Handling

All components now include comprehensive error handling:

- **Loading States** - Shows spinner while fetching data
- **Error States** - Displays error messages with icons
- **Empty States** - Shows message when no options are available
- **API Info** - Displays source URL for external APIs

## Usage Examples

### Radio Button with Dynamic Options

```typescript
const radioField: FormField = {
  id: "dynamic-radio",
  type: "radio",
  label: "Select Department",
  required: true,
  optionSource: "api",
  apiGroupId: "departments",
  allowMultiple: true,
  maxSelections: 3,
};
```

### Select with External API

```typescript
const selectField: FormField = {
  id: "external-select",
  type: "select",
  label: "Select User",
  required: true,
  optionSource: "external",
  apiConfig: {
    url: "https://jsonplaceholder.typicode.com/users",
    method: "GET",
    valueField: "id",
    labelField: "name",
  },
};
```

### Multi-Select with Custom Transform

```typescript
const multiSelectField: FormField = {
  id: "custom-multi",
  type: "multiselect",
  label: "Select Products",
  required: false,
  optionSource: "external",
  apiConfig: {
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    valueField: "id",
    labelField: "title",
    transformFunction: `
      return data.slice(0, 10).map(item => ({
        value: String(item[valueField]),
        label: item[labelField].substring(0, 30) + '...'
      }));
    `,
  },
  maxSelections: 5,
};
```

## Integration with Form Builder

To use these enhanced components in your form builder:

1. **Import Components** - Ensure all field type components are imported
2. **Configure HttpClient** - Add `provideHttpClient()` to your app config
3. **Set Up Data Management** - Configure data groups through the data management interface
4. **Define Fields** - Use the enhanced FormField interface
5. **Handle Responses** - Components automatically handle API responses

## Best Practices

1. **Data Management** - Use the data management interface to organize your data sources
2. **Error Handling** - Always provide fallback options for API failures
3. **Performance** - Use `dataPath` to extract only needed data from large responses
4. **Security** - Validate and sanitize external API responses
5. **User Experience** - Provide meaningful loading and error messages
6. **Validation** - Set appropriate min/max selections for multi-select fields

## Troubleshooting

### Common Issues:

1. **No Data Groups** - Use the data management interface to create groups
2. **CORS Errors** - Ensure external APIs allow cross-origin requests
3. **Authentication** - Include proper headers for authenticated APIs
4. **Data Format** - Verify API response structure matches expected format
5. **Transform Functions** - Test transform functions with sample data

### Debug Tips:

- Check browser console for API errors
- Verify API configuration in field definition
- Test API endpoints independently
- Use browser network tab to inspect requests
- Use data management interface to verify data groups

## Migration Guide

### From Static Options:

```typescript
// Old way
const field: FormField = {
  options: [{ value: "1", label: "Option 1" }],
};

// New way
const field: FormField = {
  optionSource: "static",
  staticOptions: "Option 1, Option 2, Option 3",
};
```

### From API Options:

```typescript
// Old way
const field: FormField = {
  useApiOptions: true,
  apiGroupId: "users",
};

// New way
const field: FormField = {
  optionSource: "api",
  apiGroupId: "users",
};
```

This enhanced functionality provides a flexible and powerful way to populate form field options from various sources while maintaining a consistent user experience and providing comprehensive data management capabilities.
