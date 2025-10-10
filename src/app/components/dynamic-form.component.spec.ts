import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from './dynamic-form.component';
import { FormConditionService } from '../services/form-condition.service';
import { FormValidationService } from '../services/form-validation.service';
import { FormSchema, FormField, FormFieldCondition } from '../interfaces/form.interface';

describe('DynamicFormComponent', () => {
    let component: DynamicFormComponent;
    let fixture: ComponentFixture<DynamicFormComponent>;
    let conditionService: FormConditionService;
    let validationService: FormValidationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [DynamicFormComponent],
            providers: [FormConditionService, FormValidationService]
        }).compileComponents();

        fixture = TestBed.createComponent(DynamicFormComponent);
        component = fixture.componentInstance;
        conditionService = TestBed.inject(FormConditionService);
        validationService = TestBed.inject(FormValidationService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should create form controls based on schema', () => {
        const schema: FormSchema = {
            title: 'Test Form',
            fields: [
                {
                    label: 'Name',
                    name: 'name',
                    type: 'text' as const,
                    required: true
                },
                {
                    label: 'Email',
                    name: 'email',
                    type: 'email' as const,
                    validation: {
                        pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
                        message: 'Invalid email'
                    }
                }
            ]
        };

        component.schema = schema;
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.form.get('name')).toBeTruthy();
        expect(component.form.get('email')).toBeTruthy();
    });

    it('should handle conditional visibility', () => {
        const schema: FormSchema = {
            title: 'Test Form',
            fields: [
                {
                    label: 'Type',
                    name: 'type',
                    type: 'dropdown' as const,
                    options: ['personal', 'business']
                },
                {
                    label: 'Company',
                    name: 'company',
                    type: 'text' as const,
                    visibleWhen: [
                        { field: 'type', operator: 'equals', value: 'business' } as FormFieldCondition
                    ]
                }
            ]
        };

        component.schema = schema;
        component.ngOnInit();
        fixture.detectChanges();

        // Initially company field should be hidden
        expect(component.evaluateFieldVisibility(schema.fields[1])).toBeFalsy();

        // Set type to business
        component.form.get('type')?.setValue('business');
        fixture.detectChanges();

        // Company field should now be visible
        expect(component.evaluateFieldVisibility(schema.fields[1])).toBeTruthy();
    });

    it('should validate required fields', () => {
        const schema: FormSchema = {
            title: 'Test Form',
            fields: [
                {
                    label: 'Name',
                    name: 'name',
                    type: 'text' as const,
                    required: true
                }
            ]
        };

        component.schema = schema;
        component.ngOnInit();
        fixture.detectChanges();

        const nameControl = component.form.get('name');
        expect(nameControl?.valid).toBeFalsy();
        expect(nameControl?.errors?.['required']).toBeTruthy();

        nameControl?.setValue('John');
        expect(nameControl?.valid).toBeTruthy();
        expect(nameControl?.errors).toBeNull();
    });

    it('should handle custom validation', () => {
        const schema: FormSchema = {
            title: 'Test Form',
            fields: [
                {
                    label: 'Password',
                    name: 'password',
                    type: 'text' as const,
                    validation: {
                        custom: (value: string) => {
                            return value && value.length >= 8 ? true : 'Password must be at least 8 characters';
                        }
                    }
                }
            ]
        };

        component.schema = schema;
        component.ngOnInit();
        fixture.detectChanges();

        const passwordControl = component.form.get('password');
        passwordControl?.setValue('123');
        expect(passwordControl?.errors?.['custom']).toBe('Password must be at least 8 characters');

        passwordControl?.setValue('12345678');
        expect(passwordControl?.valid).toBeTruthy();
        expect(passwordControl?.errors).toBeNull();
    });
});