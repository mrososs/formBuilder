# Workflow Simulation Feature

## Overview

The Workflow Simulation feature allows users to preview and test their workflows before deploying them to production. This feature provides an interactive simulation environment where users can experience exactly what end users will see when the workflow is executed.

## Features

### 1. Interactive Step-by-Step Simulation

- **Form Steps**: Users can fill out forms with real form fields and validation
- **Condition Steps**: Users can choose between Yes/No options to test different workflow paths
- **Approval Steps**: Users can simulate approval/rejection decisions
- **Email Steps**: Users can preview email content and recipients
- **Other Steps**: Display step information and configuration

### 2. Progress Tracking

- Visual progress bar showing completion percentage
- Step counter (e.g., "Step 2 of 5")
- Timeline view of all workflow steps with status indicators

### 3. Navigation Controls

- **Previous/Next buttons**: Navigate between steps
- **Timeline navigation**: Click on any step to jump directly to it
- **Validation**: Prevents proceeding until required fields are completed

### 4. Real-time Feedback

- Step status indicators (pending, active, completed, skipped)
- Form validation in real-time
- Visual feedback for user interactions

## How to Use

### Starting a Simulation

1. **Open the Workflow Designer**

   - Navigate to the workflow designer page
   - Create or load an existing workflow

2. **Add Workflow Steps**

   - Add at least one workflow step (forms, conditions, approvals, etc.)
   - Connect the steps with transitions

3. **Start Simulation**
   - Click the "Simulate" button in the toolbar
   - Or use the keyboard shortcut `Ctrl+R`

### During Simulation

1. **Fill Out Forms**

   - Complete required fields
   - Optional fields can be left empty
   - Real-time validation prevents proceeding with incomplete required fields

2. **Make Decisions**

   - For condition steps: Choose Yes or No
   - For approval steps: Choose Approve or Reject
   - These choices determine the workflow path

3. **Navigate Steps**
   - Use Previous/Next buttons
   - Click on timeline steps to jump to specific steps
   - Review completed steps

### Simulation Results

When the simulation completes:

- A summary dialog shows:
  - Total steps processed
  - Number of completed steps
  - Duration of simulation
  - Success status

## Supported Step Types

### Form Steps

- **Text fields**: Single line text input
- **Email fields**: Email validation
- **Textarea**: Multi-line text input
- **Select dropdowns**: Choose from predefined options
- **Checkboxes**: Boolean selections
- **Radio buttons**: Single choice from multiple options

### Condition Steps

- **Yes/No decisions**: Simple binary choices
- **Custom conditions**: Based on field values
- **Multiple paths**: Different outcomes based on choices

### Approval Steps

- **Single approver**: One person approval
- **Multiple approvers**: Sequential or parallel approvals
- **Custom messages**: Approval request text

### Email Steps

- **Recipient preview**: See who will receive the email
- **Subject line**: Email subject preview
- **Content preview**: Email body content

### Other Steps

- **Delay steps**: Time-based delays
- **Webhook steps**: External API calls
- **Database steps**: Data operations
- **Notification steps**: System notifications

## Technical Implementation

### Components

1. **WorkflowSimulationDialogComponent**

   - Main simulation dialog
   - Handles step navigation and user interactions
   - Manages simulation state and progress

2. **SimulationStep Interface**

   ```typescript
   interface SimulationStep {
     node: WorkflowNode;
     status: "pending" | "active" | "completed" | "skipped";
     data?: any;
     timestamp?: Date;
     userInput?: any;
   }
   ```

3. **SimulationResult Interface**
   ```typescript
   interface SimulationResult {
     steps: SimulationStep[];
     totalSteps: number;
     completedSteps: number;
     duration: number;
     finalData: any;
   }
   ```

### Key Methods

- `initializeSimulation()`: Sets up simulation steps from workflow nodes
- `canProceed()`: Validates if user can move to next step
- `determineNextStep()`: Logic for workflow branching based on choices
- `handleConditionChoice()`: Processes condition decisions
- `handleApprovalChoice()`: Processes approval decisions

## Keyboard Shortcuts

- `Ctrl+R`: Start simulation
- `Ctrl+V`: Validate workflow
- `Ctrl+S`: Save workflow
- `Ctrl+E`: Export workflow

## Benefits

1. **Quality Assurance**: Test workflows before deployment
2. **User Experience**: Understand exactly what end users will see
3. **Debugging**: Identify issues in workflow logic
4. **Training**: Train users on new workflows
5. **Documentation**: Create step-by-step guides

## Future Enhancements

1. **Data Persistence**: Save simulation results
2. **Export Results**: Export simulation data for analysis
3. **Branch Testing**: Test all possible workflow paths
4. **Performance Metrics**: Track step completion times
5. **Error Simulation**: Test error handling scenarios
6. **Mobile Preview**: Simulate mobile device experience

## Troubleshooting

### Common Issues

1. **"Please add at least one workflow step"**

   - Solution: Add workflow steps before starting simulation

2. **Cannot proceed to next step**

   - Solution: Complete all required fields in current step

3. **Simulation not starting**

   - Solution: Ensure workflow has valid connections between steps

4. **Steps not appearing in timeline**
   - Solution: Check that steps are properly connected to the workflow

### Best Practices

1. **Test All Paths**: Simulate different condition outcomes
2. **Validate Forms**: Ensure all required fields work correctly
3. **Check Transitions**: Verify workflow connections are correct
4. **Review Messages**: Check approval and email content
5. **Test Edge Cases**: Try unusual inputs and scenarios
