export interface FormValidation {
    pattern?: string;
    message?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any, formValues: any) => boolean | string;
}

export interface FormFieldCondition {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'hasValue';
    value?: any;
}

export interface FormField {
    label: string;
    name: string;
    type: 'text' | 'date' | 'dropdown' | 'multiselect' | 'checkbox' | 'textarea' | 'number' | 'email';
    required?: boolean;
    validation?: FormValidation;
    options?: string[];
    placeholder?: string;
    defaultValue?: any;
    disabled?: boolean;
    readonly?: boolean;
    hidden?: boolean;
    className?: string;
    visibleWhen?: FormFieldCondition[];
    enabledWhen?: FormFieldCondition[];
    requiredWhen?: FormFieldCondition[];
    tooltip?: string;
}

export interface FormSchema {
    title: string;
    fields: FormField[];
    className?: string;
    validationMessages?: {
        [key: string]: string;
    };
}