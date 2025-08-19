import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface WorkflowNode {
  id: string;
  title: string;
  description: string;
  type:
    | 'start'
    | 'form'
    | 'email'
    | 'condition'
    | 'delay'
    | 'finish'
    | 'approval'
    | 'notification'
    | 'webhook'
    | 'database';
  x: number;
  y: number;
  config?: any;
  isDefault?: boolean;
}

export interface WorkflowConnection {
  id: string;
  from: string;
  to: string;
  fromPort?: string;
  toPort?: string;
  label?: string;
  transitionConfig?: any;
  fromPoint?: { x: number; y: number };
  toPoint?: { x: number; y: number };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  createdAt: string;
  updatedAt: string;
}

export interface FormConfig {
  formId: string;
  title: string;
  description?: string;
  fields: FormField[];
  steps?: FormStep[];
  responseObject?: FormResponseObject;
}

export interface FormResponseObject {
  [fieldName: string]: {
    type: 'string' | 'number' | 'boolean' | 'file';
    value: any;
    required: boolean;
    label: string;
    placeholder?: string;
    helpText?: string;
    options?: { value: string; label: string }[];
    accept?: string;
  };
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type:
    | 'text'
    | 'email'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'file';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: { value: string; label: string }[];
  accept?: string;
  validation?: any;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private workflowsSubject = new BehaviorSubject<Workflow[]>([]);
  private formsSubject = new BehaviorSubject<FormConfig[]>([]);
  private currentWorkflowSubject = new BehaviorSubject<Workflow | null>(null);

  public workflows$ = this.workflowsSubject.asObservable();
  public forms$ = this.formsSubject.asObservable();
  public currentWorkflow$ = this.currentWorkflowSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();
  }

  // Workflow Management
  createWorkflow(name: string, description?: string): Workflow {
    const workflow: Workflow = {
      id: `workflow_${Date.now()}`,
      name,
      description,
      nodes: [
        {
          id: 'start',
          title: 'Start',
          description: 'Workflow starting point',
          type: 'start',
          x: 50,
          y: 50,
        },
      ],
      connections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const workflows = [...this.workflowsSubject.value, workflow];
    this.workflowsSubject.next(workflows);
    this.saveToLocalStorage();
    return workflow;
  }

  updateWorkflow(
    workflowId: string,
    updates: Partial<Workflow>
  ): Workflow | null {
    const workflows = this.workflowsSubject.value;
    const index = workflows.findIndex((w) => w.id === workflowId);

    if (index === -1) return null;

    const updatedWorkflow = {
      ...workflows[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    workflows[index] = updatedWorkflow;
    this.workflowsSubject.next(workflows);
    this.saveToLocalStorage();
    return updatedWorkflow;
  }

  deleteWorkflow(workflowId: string): boolean {
    const workflows = this.workflowsSubject.value.filter(
      (w) => w.id !== workflowId
    );
    this.workflowsSubject.next(workflows);
    this.saveToLocalStorage();
    return true;
  }

  getWorkflow(workflowId: string): Workflow | null {
    return this.workflowsSubject.value.find((w) => w.id === workflowId) || null;
  }

  setCurrentWorkflow(workflow: Workflow | null) {
    this.currentWorkflowSubject.next(workflow);
  }

  // Node Management
  addNode(
    workflowId: string,
    node: Omit<WorkflowNode, 'id'>
  ): WorkflowNode | null {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return null;

    const newNode: WorkflowNode = {
      ...node,
      id: `node_${Date.now()}`,
    };

    workflow.nodes.push(newNode);
    this.updateWorkflow(workflowId, { nodes: workflow.nodes });
    return newNode;
  }

  updateNode(
    workflowId: string,
    nodeId: string,
    updates: Partial<WorkflowNode>
  ): WorkflowNode | null {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return null;

    const nodeIndex = workflow.nodes.findIndex((n) => n.id === nodeId);
    if (nodeIndex === -1) return null;

    workflow.nodes[nodeIndex] = { ...workflow.nodes[nodeIndex], ...updates };
    this.updateWorkflow(workflowId, { nodes: workflow.nodes });
    return workflow.nodes[nodeIndex];
  }

  deleteNode(workflowId: string, nodeId: string): boolean {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return false;

    workflow.nodes = workflow.nodes.filter((n) => n.id !== nodeId);
    workflow.connections = workflow.connections.filter(
      (c) => c.from !== nodeId && c.to !== nodeId
    );

    this.updateWorkflow(workflowId, {
      nodes: workflow.nodes,
      connections: workflow.connections,
    });
    return true;
  }

  // Connection Management
  addConnection(
    workflowId: string,
    connection: Omit<WorkflowConnection, 'id'>
  ): WorkflowConnection | null {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return null;

    const newConnection: WorkflowConnection = {
      ...connection,
      id: `conn_${Date.now()}`,
    };

    workflow.connections.push(newConnection);
    this.updateWorkflow(workflowId, { connections: workflow.connections });
    return newConnection;
  }

  deleteConnection(workflowId: string, connectionId: string): boolean {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) return false;

    workflow.connections = workflow.connections.filter(
      (c) => c.id !== connectionId
    );
    this.updateWorkflow(workflowId, { connections: workflow.connections });
    return true;
  }

  // Form Management
  createForm(config: Omit<FormConfig, 'formId'>): FormConfig {
    const form: FormConfig = {
      ...config,
      formId: `form_${Date.now()}`,
    };

    const forms = [...this.formsSubject.value, form];
    this.formsSubject.next(forms);
    this.saveToLocalStorage();
    return form;
  }

  updateForm(formId: string, updates: Partial<FormConfig>): FormConfig | null {
    const forms = this.formsSubject.value;
    const index = forms.findIndex((f) => f.formId === formId);

    if (index === -1) return null;

    const updatedForm = { ...forms[index], ...updates };
    forms[index] = updatedForm;
    this.formsSubject.next(forms);
    this.saveToLocalStorage();
    return updatedForm;
  }

  deleteForm(formId: string): boolean {
    const forms = this.formsSubject.value.filter((f) => f.formId !== formId);
    this.formsSubject.next(forms);
    this.saveToLocalStorage();
    return true;
  }

  getForm(formId: string): FormConfig | null {
    return this.formsSubject.value.find((f) => f.formId === formId) || null;
  }

  // Workflow Execution
  executeWorkflow(workflowId: string, inputData?: any): Observable<any> {
    return new Observable((observer) => {
      const workflow = this.getWorkflow(workflowId);
      if (!workflow) {
        observer.error('Workflow not found');
        return;
      }

      // Simple workflow execution logic
      // In a real application, this would be more sophisticated
      const executionResult = {
        workflowId,
        status: 'completed',
        data: inputData,
        executedAt: new Date().toISOString(),
      };

      observer.next(executionResult);
      observer.complete();
    });
  }

  // Local Storage Management
  private saveToLocalStorage() {
    localStorage.setItem(
      'workflows',
      JSON.stringify(this.workflowsSubject.value)
    );
    localStorage.setItem('forms', JSON.stringify(this.formsSubject.value));
  }

  private loadFromLocalStorage() {
    try {
      const workflows = localStorage.getItem('workflows');
      const forms = localStorage.getItem('forms');

      if (workflows) {
        this.workflowsSubject.next(JSON.parse(workflows));
      }

      if (forms) {
        this.formsSubject.next(JSON.parse(forms));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }

  // Export/Import
  exportWorkflow(workflowId: string): string {
    const workflow = this.getWorkflow(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    return JSON.stringify(workflow, null, 2);
  }

  importWorkflow(workflowData: string): Workflow {
    try {
      const workflow = JSON.parse(workflowData);
      workflow.id = `workflow_${Date.now()}`; // Generate new ID
      workflow.createdAt = new Date().toISOString();
      workflow.updatedAt = new Date().toISOString();

      const workflows = [...this.workflowsSubject.value, workflow];
      this.workflowsSubject.next(workflows);
      this.saveToLocalStorage();
      return workflow;
    } catch (error) {
      throw new Error('Invalid workflow data');
    }
  }
}
