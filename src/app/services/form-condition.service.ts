import { Injectable } from '@angular/core';
import { FormFieldCondition } from '../interfaces/form.interface';

@Injectable({
    providedIn: 'root'
})
export class FormConditionService {
    evaluateCondition(condition: FormFieldCondition, formValues: any): boolean {
        const fieldValue = formValues[condition.field];

        switch (condition.operator) {
            case 'equals':
                return fieldValue === condition.value;
            case 'notEquals':
                return fieldValue !== condition.value;
            case 'contains':
                return Array.isArray(fieldValue) ? 
                    fieldValue.includes(condition.value) : 
                    String(fieldValue).includes(String(condition.value));
            case 'greaterThan':
                return Number(fieldValue) > Number(condition.value);
            case 'lessThan':
                return Number(fieldValue) < Number(condition.value);
            case 'hasValue':
                return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
            default:
                return true;
        }
    }

    evaluateConditions(conditions: FormFieldCondition[] | undefined, formValues: any): boolean {
        if (!conditions || conditions.length === 0) {
            return true;
        }

        return conditions.every(condition => this.evaluateCondition(condition, formValues));
    }
}