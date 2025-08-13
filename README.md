# Form Builder

A modern, responsive Angular application for creating beautiful forms with a drag & drop interface. Built with Angular Material and Tailwind CSS.

## Features

### Form Builder

- **Drag & Drop Interface**: Intuitive form building with visual field placement
- **Multiple Field Types**: Text, email, number, select, checkbox, radio, date, file upload, and more
- **Field Properties**: Customize field labels, placeholders, validation, and styling
- **Form Validation**: Built-in validation rules with custom error messages
- **Responsive Design**: Mobile and tablet-friendly interface
- **Form Export**: Export forms as JSON or Angular components with validation

### Form Export

- **JSON Export**: Export form definitions for storage or sharing
- **Angular Component Export**: Generate standalone Angular components with:
  - Inline HTML template and CSS
  - Angular Material components
  - Reactive forms with validation
  - Tailwind CSS styling
  - Form submission handling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Angular CLI (v19 or higher)

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

The application will be available at `http://localhost:4200`

## Usage

### Form Builder

1. Navigate to the Form Builder
2. Drag fields from the left sidebar to the canvas
3. Select fields to configure their properties in the right sidebar
4. Add validation rules as needed
5. Preview your form in real-time
6. Export as JSON or Angular component

### Field Types Available

- **Text Field**: Single line text input
- **Textarea**: Multi-line text input
- **Email Field**: Email input with validation
- **Number Field**: Numeric input with min/max validation
- **Select Field**: Dropdown with custom options
- **Multi-select Field**: Multiple choice selection
- **Checkbox Field**: Boolean input
- **Radio Field**: Single choice from options
- **Date Field**: Date picker
- **File Field**: File upload
- **Button Field**: Action buttons

### Validation Features

- **Required Fields**: Mark fields as mandatory
- **Min/Max Length**: Set character limits
- **Min/Max Value**: Set numeric ranges
- **Pattern Validation**: Custom regex patterns
- **Custom Messages**: Personalized error messages

## Project Structure

### Pages

- **Form Builder Page**: Main form creation interface

### Components

- **Form Elements Menu**: Field type selection sidebar
- **Main Canvas**: Form editor and preview area
- **Field Settings**: Field properties configuration
- **Form Export**: Export dialog with options

### Services

- **FormService**: Manages form data and structure
- **FieldTypesService**: Handles field type definitions
- **FormExportService**: Handles form export functionality

### Models

- **FormField**: Field definition with properties and validation
- **FormDefinition**: Complete form structure
- **ValidationRule**: Validation configuration

## Technologies Used

- **Angular 19**: Modern Angular framework
- **Angular Material**: UI component library
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming

## Features

### Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Touch-friendly interface
- Adaptive layouts

### Export Capabilities

- **JSON Export**: Complete form definition
- **Angular Component**: Standalone component with:
  - Embedded HTML template
  - Inline CSS styles
  - TypeScript logic
  - Validation rules
  - Material Design components

### Validation System

- Real-time validation
- Custom error messages
- Multiple validation types
- Conditional validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
