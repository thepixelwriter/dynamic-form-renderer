import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../components/dynamic-form.component';
import { FormSchema } from '../interfaces/form.interface';

@Component({
    selector: 'app-registration-form',
    standalone: true,
    imports: [CommonModule, DynamicFormComponent],
    template: `
        <div class="container">
            <div class="row">
                <div class="col-md-6">
                    <app-dynamic-form 
                        [schema]="registrationForm"
                        (formSubmit)="onFormSubmit($event)">
                    </app-dynamic-form>
                </div>
                <div class="col-md-6">
                    @if (submittedData) {
                        <div class="sticky-top" style="top: 1rem;">
                            <div class="card mb-4">
                                <div class="card-header text-white" style="background-color: #6b98d4;">
                                    <h5 class="mb-0">Form Submission Preview</h5>
                                </div>
                                <div class="card-body">
                                    <dl class="row mb-0">
                                        @if (submittedData.fullName) {
                                            <dt class="col-sm-4">Full Name:</dt>
                                            <dd class="col-sm-8">{{ submittedData.fullName }}</dd>
                                        }
                                        @if (submittedData.email) {
                                            <dt class="col-sm-4">Email Address:</dt>
                                            <dd class="col-sm-8">{{ submittedData.email }}</dd>
                                        }
                                        @if (submittedData.dob) {
                                            <dt class="col-sm-4">Date of Birth:</dt>
                                            <dd class="col-sm-8">{{ submittedData.dob | date:'mediumDate' }}</dd>
                                        }
                                        @if (submittedData.gender) {
                                            <dt class="col-sm-4">Gender:</dt>
                                            <dd class="col-sm-8">{{ submittedData.gender }}</dd>
                                        }
                                        @if (submittedData.hobbies?.length) {
                                            <dt class="col-sm-4">Hobbies:</dt>
                                            <dd class="col-sm-8">
                                                <ul class="list-unstyled mb-0">
                                                    @for (hobby of submittedData.hobbies; track hobby) {
                                                        <li>{{ hobby }}</li>
                                                    }
                                                </ul>
                                            </dd>
                                        }
                                        @if (submittedData.subscribe !== undefined) {
                                            <dt class="col-sm-4">Newsletter:</dt>
                                            <dd class="col-sm-8">{{ submittedData.subscribe ? 'Subscribed' : 'Not Subscribed' }}</dd>
                                        }
                                        @if (submittedData.about) {
                                            <dt class="col-sm-4">About:</dt>
                                            <dd class="col-sm-8">{{ submittedData.about }}</dd>
                                        }
                                    </dl>
                                </div>
                            </div>
                            <div class="card">
                                <div class="card-header text-white" style="background-color: #8898aa;">
                                    <h5 class="mb-0">JSON Output</h5>
                                </div>
                                <div class="card-body">
                                    <pre class="mb-0 bg-light p-3 rounded"><code>{{ submittedData | json }}</code></pre>
                                </div>
                            </div>
                        </div>
                    } @else {
                        <div class="alert alert-info">
                            <h5 class="alert-heading">Preview Pane</h5>
                            <p class="mb-0">No Form Submitted.</p>
                            <p class="mb-0">Submit the form to see the preview and JSON output here.</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    `,
    styles: [`
        .container {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .result-container {
            margin-top: 2rem;
            padding: 1rem;
            background-color: #f8f9fa;
            border-radius: 8px;
            
            h3 {
                margin-bottom: 1rem;
                color: #333;
            }

            pre {
                background-color: #e9ecef;
                padding: 1rem;
                border-radius: 4px;
                white-space: pre-wrap;
                word-break: break-all;
            }
        }
    `]
})
export class RegistrationFormComponent {
    submittedData: any = null;

    registrationForm: FormSchema = {
        "title": "User Registration",
        "fields": [
            {
                "label": "Full Name",
                "name": "fullName",
                "type": "text",
                "required": true,
                "placeholder": "Enter your full name"
            },
            {
                "label": "Email",
                "name": "email",
                "type": "text",
                "required": true,
                "placeholder": "Enter your email address",
                "validation": {
                    "pattern": "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
                    "message": "Invalid email address"
                }
            },
            {
                "label": "Date of Birth",
                "name": "dob",
                "type": "date"
            },
            {
                "label": "Gender",
                "name": "gender",
                "type": "dropdown",
                "options": ["Male", "Female", "Other"],
                "required": true
            },
            {
                "label": "Hobbies",
                "name": "hobbies",
                "type": "multiselect",
                "options": ["Reading", "Sports", "Music", "Travel"]
            },
            {
                "label": "Subscribe to newsletter",
                "name": "subscribe",
                "type": "checkbox"
            },
            {
                "label": "About Yourself",
                "name": "about",
                "type": "textarea"
            }
        ]
    };

    onFormSubmit(data: any) {
        this.submittedData = data;
        console.log('form submitted:', data);
    }
}