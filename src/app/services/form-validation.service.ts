import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormValidation } from '../interfaces/form.interface';

@Injectable({
    providedIn: 'root'
})
export class FormValidationService {
    private defaultMessages: { [key: string]: string } = {
        required: 'This field is required',
        email: 'Please enter a valid email address',
        pattern: 'Please enter a valid value',
        minlength: 'Value is too short',
        maxlength: 'Value is too long',
        min: 'Value is too small',
        max: 'Value is too large'
    };

    createValidators(validation: FormValidation, customMessages?: { [key: string]: string }): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        const messages = { ...this.defaultMessages, ...customMessages };

        if (validation.required) {
            validators.push((control: AbstractControl): ValidationErrors | null => {
                const isValid = control.value !== null && control.value !== undefined && control.value !== '';
                return isValid ? null : { required: messages['required'] };
            });
        }

        if (validation.pattern) {
            validators.push((control: AbstractControl): ValidationErrors | null => {
                if (!control.value) return null;
                const regex = new RegExp(validation.pattern!);
                const isValid = regex.test(control.value);
                return isValid ? null : { pattern: validation.message || messages['pattern'] };
            });
        }

        if (validation.minLength) {
            validators.push((control: AbstractControl): ValidationErrors | null => {
                if (!control.value) return null;
                const isValid = control.value.length >= validation.minLength!;
                return isValid ? null : { minlength: messages['minlength'] };
            });
        }

        if (validation.maxLength) {
            validators.push((control: AbstractControl): ValidationErrors | null => {
                if (!control.value) return null;
                const isValid = control.value.length <= validation.maxLength!;
                return isValid ? null : { maxlength: messages['maxlength'] };
            });
        }

        if (validation.min) {
            validators.push((control: AbstractControl): ValidationErrors | null => {
                if (!control.value) return null;
                const isValid = Number(control.value) >= validation.min!;
                return isValid ? null : { min: messages['min'] };
            });
        }

        if (validation.max) {
            validators.push((control: AbstractControl): ValidationErrors | null => {
                if (!control.value) return null;
                const isValid = Number(control.value) <= validation.max!;
                return isValid ? null : { max: messages['max'] };
            });
        }

        if (validation.custom) {
            validators.push((control: AbstractControl): ValidationErrors | null => {
                const result = validation.custom!(control.value, control.parent?.value);
                return typeof result === 'boolean' ? 
                    (result ? null : { custom: 'Invalid value' }) : 
                    { custom: result };
            });
        }

        return validators;
    }
}