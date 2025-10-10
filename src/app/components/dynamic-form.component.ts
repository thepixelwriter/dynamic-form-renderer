import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormSchema, FormField } from '../interfaces/form.interface';

@Component({
    selector: 'app-dynamic-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div class="container py-4">
            <h2 class="mb-4">{{ schema.title }}</h2>
            
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="needs-validation">
                <div class="row g-4">
                    @for (field of schema.fields; track field.name) {
                        @if (evaluateFieldVisibility(field)) {
                            <div class="col-12" [class.col-md-6]="field.type !== 'textarea'">
                                <div class="form-group">
                                @if (field.type !== 'checkbox') {
                                    <label [for]="field.name" class="form-label">
                                        {{ field.label }}
                                        @if (field.required) {
                                            <span class="text-danger">*</span>
                                        }
                                    </label>
                                }

                                @switch (field.type) {
                                    @case ('text') {
                                        <input
                                            [id]="field.name"
                                            type="text"
                                            [formControlName]="field.name"
                                            class="form-control"
                                            [class.is-invalid]="hasError(field.name)"
                                            [placeholder]="'Enter ' + field.label"
                                        />
                                    }
                                    @case ('date') {
                                        <input
                                            [id]="field.name"
                                            type="date"
                                            [formControlName]="field.name"
                                            class="form-control"
                                            [class.is-invalid]="hasError(field.name)"
                                        />
                                    }
                                    @case ('textarea') {
                                        <textarea
                                            [id]="field.name"
                                            [formControlName]="field.name"
                                            class="form-control"
                                            [class.is-invalid]="hasError(field.name)"
                                            [placeholder]="'Enter ' + field.label"
                                            rows="4"
                                        ></textarea>
                                    }
                                    @case ('dropdown') {
                                        <select 
                                            [id]="field.name"
                                            [formControlName]="field.name"
                                            class="form-select"
                                            [class.is-invalid]="hasError(field.name)"
                                        >
                                            <option value="">Select {{ field.label }}</option>
                                            @for (option of field.options; track option) {
                                                <option [value]="option">{{ option }}</option>
                                            }
                                        </select>
                                    }
                                    @case ('multiselect') {
                                        <select
                                            [id]="field.name"
                                            [formControlName]="field.name"
                                            class="form-select"
                                            [class.is-invalid]="hasError(field.name)"
                                            multiple
                                            size="4"
                                        >
                                            @for (option of field.options; track option) {
                                                <option [value]="option">{{ option }}</option>
                                            }
                                        </select>
                                        <small class="form-text text-muted">
                                            Hold Ctrl/Cmd to select multiple options
                                        </small>
                                    }
                                    @case ('checkbox') {
                                        <div class="form-check">
                                            <input
                                                [id]="field.name"
                                                type="checkbox"
                                                [formControlName]="field.name"
                                                class="form-check-input"
                                                [class.is-invalid]="hasError(field.name)"
                                            />
                                            <label [for]="field.name" class="form-check-label">
                                                {{ field.label }}
                                            </label>
                                        </div>
                                    }
                                }

                                @if (hasError(field.name)) {
                                    <div class="invalid-feedback">
                                        @if (field.validation?.message) {
                                            {{ field.validation?.message }}
                                        } @else {
                                            @if (form.get(field.name)?.errors?.['required']) {
                                                {{ field.label }} is required
                                            } @else {
                                                Invalid {{ field.label }}
                                            }
                                        }
                                    </div>
                                }
                                </div>
                            </div>
                        }
                    }
                </div>

                <div class="mt-4">
                    <button type="submit" class="btn btn-primary" [disabled]="form.invalid">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            margin-bottom: 2rem;
        }
        
        .form-select[multiple] {
            height: auto;
        }

        .invalid-feedback {
            display: block;
        }
    `]
})
export class DynamicFormComponent {
    @Input() schema!: FormSchema;
    @Output() formSubmit = new EventEmitter<any>();

    form!: FormGroup;

    // Added for testing purposes
    evaluateFieldVisibility(field: FormField): boolean {
        if (!field.visibleWhen || field.visibleWhen.length === 0) {
            return true;
        }

        return field.visibleWhen.every(condition => {
            const controlValue = this.form.get(condition.field)?.value;
            return controlValue === condition.value;
        });
    }

    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.createForm();
    }

    // create form group based on schema
    private createForm() {
        const group: { [key: string]: any } = {};
        
        this.schema.fields.forEach(field => {
            const validators = [];
            
            if (field.required) {
                validators.push(Validators.required);
            }
            
            if (field.validation?.pattern) {
                validators.push(Validators.pattern(field.validation.pattern));
            }
            
            group[field.name] = ['', validators];
        });
        
        this.form = this.fb.group(group);
    }

    // check if a field has validation errors
    hasError(fieldName: string): boolean {
        const control = this.form.get(fieldName);
        return control ? control.invalid && (control.dirty || control.touched) : false;
    }

    // get validation error message for a field
    getErrorMessage(field: FormField): string {
        const control = this.form.get(field.name);
        
        if (control?.errors) {
            if (control.errors['required']) {
                return `${field.label} is required`;
            }
            if (control.errors['pattern']) {
                return field.validation?.message || `${field.label} is invalid`;
            }
        }
        
        return '';
    }

    // submit form if valid
    onSubmit() {
        if (this.form.valid) {
            this.formSubmit.emit(this.form.value);
        } else {
            this.markFormGroupTouched(this.form);
        }
    }

    // helper method to mark all fields as touched
    private markFormGroupTouched(formGroup: FormGroup) {
        Object.values(formGroup.controls).forEach(control => {
            control.markAsTouched();
        });
    }
}