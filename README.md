# Form Builder & Workflow Designer

A comprehensive Angular application that combines form building capabilities with workflow design functionality, inspired by Elsa Workflows.

## Features

### Form Builder

- **Drag & Drop Interface**: Intuitive form building with drag-and-drop functionality
- **Multiple Field Types**: Support for text, email, number, textarea, select, checkbox, radio, and file upload fields
- **Real-time Preview**: See your form as you build it
- **Field Settings**: Customize field properties, validation, and styling
- **Responsive Design**: Forms work seamlessly across all devices

### Workflow Designer

- **Visual Workflow Builder**: Create complex workflows with a visual drag-and-drop interface
- **Form Integration**: Embed custom forms directly into workflows
- **Multiple Activity Types**:
  - Form Builder: Create and display custom forms
  - Email: Send email notifications
  - Condition: Add conditional logic
  - Delay: Add time delays
- **Workflow Management**: Save, export, and import workflows
- **Real-time Execution**: Monitor workflow execution

### Workflow Form Execution

- **Multi-step Forms**: Support for complex multi-step form workflows
- **Progress Tracking**: Visual progress indicators for multi-step processes
- **Form Validation**: Comprehensive client-side validation
- **Responsive Design**: Optimized for all screen sizes

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd formBuilder-custom
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Usage

### Form Builder

1. Navigate to the "Form Builder" tab
2. Drag field types from the left sidebar to the main canvas
3. Select fields to configure their properties in the right sidebar
4. Preview your form in real-time
5. Save your form configuration

### Workflow Designer

1. Navigate to the "Workflow Designer" tab
2. Drag activities from the left sidebar to the canvas
3. Connect activities by drawing connections between them
4. Configure form activities by clicking "Configure Form"
5. Save and export your workflows

### Workflow Forms

1. Access workflow forms via `/workflow-form/:workflowId`
2. Fill out multi-step forms with progress tracking
3. Submit forms to trigger workflow execution

## Architecture

### Components

- **Form Builder Page**: Main form building interface
- **Workflow Designer Page**: Visual workflow creation interface
- **Workflow Form Page**: End-user form execution interface
- **Form Builder Modal**: Modal for configuring forms within workflows

### Services

- **WorkflowService**: Manages workflow data, forms, and execution
- **FormService**: Handles form configuration and validation
- **FieldTypesService**: Manages available field types

### Models

- **Workflow**: Workflow definition with nodes and connections
- **FormConfig**: Form configuration with fields and steps
- **Field**: Individual form field configuration

## Key Features

### Form Builder Integration

- Seamless integration between form builder and workflow designer
- Modal-based form configuration within workflows
- Real-time form preview and validation

### Workflow Activities

- **Form Builder Activity**: Create and display custom forms
- **Email Activity**: Send notifications and communications
- **Condition Activity**: Add business logic and branching
- **Delay Activity**: Add time-based delays

### Data Management

- Local storage for persistence
- Export/import functionality for workflows
- Form data collection and processing

## Development

### Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── services/           # Business logic services
│   └── models/             # Data models and interfaces
├── styles.scss             # Global styles
└── main.ts                 # Application entry point
```

### Adding New Field Types

1. Create a new field component in `src/app/components/field-types/`
2. Add the field type to the `FieldTypesService`
3. Update the form builder interface

### Adding New Workflow Activities

1. Define the activity in the workflow designer
2. Implement the activity logic in the workflow service
3. Add UI components for activity configuration

## Technologies Used

- **Angular 19**: Modern Angular framework with standalone components
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Angular Material**: Material Design components
- **RxJS**: Reactive programming library

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by Elsa Workflows for workflow design concepts
- Built with modern Angular best practices
- Uses Tailwind CSS for responsive design
