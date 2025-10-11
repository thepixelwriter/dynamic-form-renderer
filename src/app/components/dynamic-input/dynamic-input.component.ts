import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormField } from '../../interfaces/form.interface';

@Component({
  selector: 'app-dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class DynamicInputComponent {
  @Input() field!: FormField;
  @Input() form!: FormGroup;
  @Input() controlErrors: { [key: string]: any } = {};

  get isFieldValid() {
    const control = this.form.get(this.field.name);
    return control?.valid || !control?.touched;
  }

  get errorMessage() {
    const control = this.form.get(this.field.name);
    if (control?.errors && control.touched) {
      const firstError = Object.keys(control.errors)[0];
      return this.controlErrors[firstError] || 'This field is invalid';
    }
    return '';
  }

  get placeholder(): string {
    return this.field.placeholder || `Enter ${this.field.label}`;
  }
}