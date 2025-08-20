import { Injectable } from '@angular/core';
import { FormField, FormDefinition, AngularFormExport } from '../models/field';
import { ActorsDataService } from './actors-data.service';

@Injectable({
  providedIn: 'root',
})
export class FormExportService {
  constructor(private actorsDataService: ActorsDataService) {}

  exportToJson(form: FormDefinition): string {
    const exportData = {
      form: {
        id: form.id,
        name: form.name,
        description: form.description,
        fields: form.fields.map((field) => this.processFieldForExport(field)),
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
      },
      actors: this.actorsDataService.exportActorsData(),
      exportInfo: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        includesActors: true,
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  private processFieldForExport(field: FormField): any {
    const processedField = { ...field };

    // If field uses actors, include actor information
    if (field.optionSource === 'actors' && field.actorId) {
      processedField.actorInfo = {
        actorId: field.actorId,
        actorName: this.getActorDisplayName(field.actorId),
        actorData: this.getActorDataForExport(field.actorId),
      };
    }

    return processedField;
  }

  private getActorDisplayName(actorId: string): string {
    const actorNames: { [key: string]: string } = {
      employees: 'Employees',
      managers: 'Managers',
      departments: 'Departments',
      products: 'Products',
      customers: 'Customers',
      suppliers: 'Suppliers',
      locations: 'Locations',
    };
    return actorNames[actorId] || actorId;
  }

  private getActorDataForExport(actorId: string): any {
    // This would get the actual actor data for export
    // For now, return a placeholder
    return {
      actorId: actorId,
      dataSource: 'company-actors',
      lastUpdated: new Date().toISOString(),
    };
  }

  exportToAngular(form: FormDefinition): AngularFormExport {
    const componentName = this.generateComponentName(form.name);
    const formName = this.generateFormName(form.name);

    const htmlTemplate = this.generateHtmlTemplate(form);
    const typescriptCode = this.generateTypescriptCode(
      form,
      componentName,
      formName
    );
    const cssStyles = this.generateCssStyles();
    const validators = this.generateValidators(form);

    return {
      componentName,
      formName,
      htmlTemplate,
      typescriptCode,
      cssStyles,
      validators,
    };
  }

  private generateComponentName(name: string): string {
    return (
      name
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/^[a-z]/, (letter) => letter.toUpperCase()) + 'FormComponent'
    );
  }

  private generateFormName(name: string): string {
    return (
      name
        .replace(/[^a-zA-Z0-9]/g, '')
        .replace(/^[a-z]/, (letter) => letter.toUpperCase()) + 'Form'
    );
  }

  private generateHtmlTemplate(form: FormDefinition): string {
    let template = `<div class="form-container">\n`;
    template += `  <h2>${form.name}</h2>\n`;
    template += `  <form [formGroup]="${this.generateFormName(
      form.name
    )}" (ngSubmit)="onSubmit()">\n`;

    form.fields.forEach((field) => {
      template += this.generateFieldHtml(field);
    });

    template += `    <button type="submit" [disabled]="${this.generateFormName(
      form.name
    )}.invalid">Submit</button>\n`;
    template += `  </form>\n`;
    template += `</div>`;

    return template;
  }

  private generateFieldHtml(field: FormField): string {
    let html = '';

    switch (field.type) {
      case 'text':
        html += `    <mat-form-field>\n`;
        html += `      <mat-label>${field.label}</mat-label>\n`;
        html += `      <input matInput formControlName="${
          field.id
        }" placeholder="${field.placeholder || ''}">\n`;
        html += `    </mat-form-field>\n`;
        break;
      case 'select':
        html += `    <mat-form-field>\n`;
        html += `      <mat-label>${field.label}</mat-label>\n`;
        html += `      <mat-select formControlName="${field.id}">\n`;
        if (field.optionSource === 'actors' && field.actorId) {
          html += `        <mat-option *ngFor="let option of ${field.actorId}Options" [value]="option.value">\n`;
          html += `          {{option.label}}\n`;
          html += `        </mat-option>\n`;
        } else if (field.options) {
          field.options.forEach((option) => {
            html += `        <mat-option value="${option.value}">${option.label}</mat-option>\n`;
          });
        }
        html += `      </mat-select>\n`;
        html += `    </mat-form-field>\n`;
        break;
      case 'multiselect':
        html += `    <mat-form-field>\n`;
        html += `      <mat-label>${field.label}</mat-label>\n`;
        html += `      <mat-select formControlName="${field.id}" multiple>\n`;
        if (field.optionSource === 'actors' && field.actorId) {
          html += `        <mat-option *ngFor="let option of ${field.actorId}Options" [value]="option.value">\n`;
          html += `          {{option.label}}\n`;
          html += `        </mat-option>\n`;
        } else if (field.options) {
          field.options.forEach((option) => {
            html += `        <mat-option value="${option.value}">${option.label}</mat-option>\n`;
          });
        }
        html += `      </mat-select>\n`;
        html += `    </mat-form-field>\n`;
        break;
      case 'radio':
        html += `    <div class="radio-group">\n`;
        html += `      <label>${field.label}</label>\n`;
        if (field.optionSource === 'actors' && field.actorId) {
          html += `      <mat-radio-group formControlName="${field.id}">\n`;
          html += `        <mat-radio-button *ngFor="let option of ${field.actorId}Options" [value]="option.value">\n`;
          html += `          {{option.label}}\n`;
          html += `        </mat-radio-button>\n`;
          html += `      </mat-radio-group>\n`;
        } else if (field.options) {
          html += `      <mat-radio-group formControlName="${field.id}">\n`;
          field.options.forEach((option) => {
            html += `        <mat-radio-button value="${option.value}">${option.label}</mat-radio-button>\n`;
          });
          html += `      </mat-radio-group>\n`;
        }
        html += `    </div>\n`;
        break;
      case 'checkbox':
        html += `    <mat-checkbox formControlName="${field.id}">${field.label}</mat-checkbox>\n`;
        break;
      case 'textarea':
        html += `    <mat-form-field>\n`;
        html += `      <mat-label>${field.label}</mat-label>\n`;
        html += `      <textarea matInput formControlName="${field.id}" rows="${
          field.rows || 4
        }" placeholder="${field.placeholder || ''}"></textarea>\n`;
        html += `    </mat-form-field>\n`;
        break;
      case 'email':
        html += `    <mat-form-field>\n`;
        html += `      <mat-label>${field.label}</mat-label>\n`;
        html += `      <input matInput type="email" formControlName="${
          field.id
        }" placeholder="${field.placeholder || ''}">\n`;
        html += `    </mat-form-field>\n`;
        break;
      case 'number':
        html += `    <mat-form-field>\n`;
        html += `      <mat-label>${field.label}</mat-label>\n`;
        html += `      <input matInput type="number" formControlName="${
          field.id
        }" placeholder="${field.placeholder || ''}">\n`;
        html += `    </mat-form-field>\n`;
        break;
      case 'date':
        html += `    <mat-form-field>\n`;
        html += `      <mat-label>${field.label}</mat-label>\n`;
        html += `      <input matInput [matDatepicker]="picker" formControlName="${field.id}">\n`;
        html += `      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>\n`;
        html += `      <mat-datepicker #picker></mat-datepicker>\n`;
        html += `    </mat-form-field>\n`;
        break;
      case 'file':
        html += `    <div class="file-upload">\n`;
        html += `      <label>${field.label}</label>\n`;
        html += `      <input type="file" (change)="onFileSelected($event)" accept="${
          field.accept || '*'
        }">\n`;
        html += `    </div>\n`;
        break;
    }

    return html;
  }

  private generateTypescriptCode(
    form: FormDefinition,
    componentName: string,
    formName: string
  ): string {
    let code = `import { Component, OnInit } from '@angular/core';\n`;
    code += `import { FormBuilder, FormGroup, Validators } from '@angular/forms';\n\n`;
    code += `@Component({\n`;
    code += `  selector: 'app-${componentName.toLowerCase()}',\n`;
    code += `  templateUrl: './${componentName.toLowerCase()}.component.html',\n`;
    code += `  styleUrls: ['./${componentName.toLowerCase()}.component.css']\n`;
    code += `})\n`;
    code += `export class ${componentName} implements OnInit {\n`;
    code += `  ${formName}: FormGroup;\n\n`;

    // Add actor options properties
    form.fields.forEach((field) => {
      if (field.optionSource === 'actors' && field.actorId) {
        code += `  ${field.actorId}Options: Array<{value: string, label: string}> = [];\n`;
      }
    });

    code += `\n  constructor(private fb: FormBuilder) {}\n\n`;
    code += `  ngOnInit() {\n`;
    code += `    this.${formName} = this.fb.group({\n`;

    form.fields.forEach((field) => {
      const validators = this.generateFieldValidators(field);
      code += `      ${field.id}: ['', ${validators}],\n`;
    });

    code += `    });\n\n`;

    // Load actor data
    form.fields.forEach((field) => {
      if (field.optionSource === 'actors' && field.actorId) {
        code += `    this.load${
          field.actorId.charAt(0).toUpperCase() + field.actorId.slice(1)
        }Options();\n`;
      }
    });

    code += `  }\n\n`;

    // Add methods to load actor data
    form.fields.forEach((field) => {
      if (field.optionSource === 'actors' && field.actorId) {
        code += `  load${
          field.actorId.charAt(0).toUpperCase() + field.actorId.slice(1)
        }Options() {\n`;
        code += `    // Load ${field.actorId} options from service\n`;
        code += `    // this.${field.actorId}Options = this.actorsService.get${
          field.actorId.charAt(0).toUpperCase() + field.actorId.slice(1)
        }Options();\n`;
        code += `  }\n\n`;
      }
    });

    code += `  onSubmit() {\n`;
    code += `    if (this.${formName}.valid) {\n`;
    code += `      console.log(this.${formName}.value);\n`;
    code += `    }\n`;
    code += `  }\n\n`;

    code += `  onFileSelected(event: any) {\n`;
    code += `    const file = event.target.files[0];\n`;
    code += `    console.log('Selected file:', file);\n`;
    code += `  }\n`;
    code += `}\n`;

    return code;
  }

  private generateCssStyles(): string {
    return `.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

mat-form-field {
  width: 100%;
  margin-bottom: 16px;
}

.radio-group {
  margin-bottom: 16px;
}

.radio-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.file-upload {
  margin-bottom: 16px;
}

.file-upload label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

button[type="submit"] {
  margin-top: 16px;
}`;
  }

  private generateValidators(form: FormDefinition): string {
    let validators = '';

    form.fields.forEach((field) => {
      if (field.required) {
        validators += `Validators.required`;
      }
      if (field.validations) {
        field.validations.forEach((validation) => {
          switch (validation.type) {
            case 'minLength':
              validators += `, Validators.minLength(${validation.value})`;
              break;
            case 'maxLength':
              validators += `, Validators.maxLength(${validation.value})`;
              break;
            case 'pattern':
              validators += `, Validators.pattern(${validation.value})`;
              break;
            case 'email':
              validators += `, Validators.email`;
              break;
          }
        });
      }
    });

    return validators || '[]';
  }

  private generateFieldValidators(field: FormField): string {
    let validators = '[]';

    if (field.required) {
      validators = '[Validators.required]';
    }

    if (field.validations) {
      const fieldValidators: string[] = [];

      field.validations.forEach((validation) => {
        switch (validation.type) {
          case 'minLength':
            fieldValidators.push(`Validators.minLength(${validation.value})`);
            break;
          case 'maxLength':
            fieldValidators.push(`Validators.maxLength(${validation.value})`);
            break;
          case 'pattern':
            fieldValidators.push(`Validators.pattern(${validation.value})`);
            break;
          case 'email':
            fieldValidators.push('Validators.email');
            break;
        }
      });

      if (fieldValidators.length > 0) {
        if (field.required) {
          validators = `[Validators.required, ${fieldValidators.join(', ')}]`;
        } else {
          validators = `[${fieldValidators.join(', ')}]`;
        }
      }
    }

    return validators;
  }
}
