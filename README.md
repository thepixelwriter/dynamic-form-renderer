# Dynamic Form Renderer

A reusable Angular component that dynamically renders forms based on JSON schema configuration.

## Features

- Dynamic form generation from JSON schema
- Support for multiple input types:
  - Text input
  - Email input
  - Number input
  - Date picker
  - Dropdown (single select)
  - Multi-select
  - Checkbox
  - Textarea
- Advanced Form Control:
  - Conditional rendering based on field values
  - Support for readonly and disabled states
  - Hidden field support
  - Custom CSS classes per field
  - Field tooltips
  - Placeholder text support
  - Default values
- Enhanced Validation:
  - Required field validation
  - Pattern validation
  - Min/Max length validation
  - Numeric range validation
  - Custom validation functions
  - Configuration-driven error messages
  - Field-specific validation messages
- Real-time form output display
- Comprehensive test coverage
- Bootstrap 5 integration
- Responsive design
- Reusable across different form types
- Accessibility features

## Steps to Run the Application

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
4. Open browser and navigate to `http://localhost:4200`
5. Access the registration form at: `/registration`

## JSON Schema Format

The form schema follows this structure:

```typescript
interface FormSchema {
    title: string;
    fields: FormField[];
}

interface FormField {
    label: string;
    name: string;
    type: 'text' | 'email' | 'number' | 'date' | 'dropdown' | 'multiselect' | 'checkbox' | 'textarea';
    required?: boolean;
    validation?: {
        pattern?: string;
        message?: string;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        custom?: (value: any, formValues: any) => boolean | string;
    };
    options?: string[];
    placeholder?: string;
    defaultValue?: any;
    disabled?: boolean;
    readonly?: boolean;
    hidden?: boolean;
    className?: string;
    tooltip?: string;
    visibleWhen?: Array<{
        field: string;
        operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'hasValue';
        value?: any;
    }>;
    enabledWhen?: Array<{
        field: string;
        operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'hasValue';
        value?: any;
    }>;
    requiredWhen?: Array<{
        field: string;
        operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan' | 'hasValue';
        value?: any;
    }>;
}
```

### Registration Form Schema

```json
{
    "title": "user registration",
    "fields": [
        {
            "label": "full name",
            "name": "fullName",
            "type": "text",
            "required": true
        },
        {
            "label": "email",
            "name": "email",
            "type": "text",
            "required": true,
            "validation": {
                "pattern": "^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$",
                "message": "please enter a valid email address"
            }
        },
        {
            "label": "date of birth",
            "name": "dob",
            "type": "date"
        },
        {
            "label": "gender",
            "name": "gender",
            "type": "dropdown",
            "options": ["male", "female", "other"],
            "required": true
        },
        {
            "label": "hobbies",
            "name": "hobbies",
            "type": "multiselect",
            "options": ["reading", "sports", "music", "travel"]
        }
    ]
}
```

## Form Output Format

When a form is submitted, it generates output in the following format:

```json
{
    "fullName": "john doe",
    "email": "user@domain.com",
    "dob": "1990-01-01",
    "gender": "male",
    "hobbies": ["reading", "sports"],
    "subscribe": true,
    "about": "brief description about the user..."
}
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── dynamic-form.component.ts     # Main form component
│   │   └── dynamic-form.component.spec.ts # Unit tests
│   ├── interfaces/
│   │   └── form.interface.ts            # TypeScript interfaces
│   ├── services/
│   │   ├── form-condition.service.ts    # Conditional logic service
│   │   └── form-validation.service.ts   # Advanced validation service
│   ├── pages/
│   │   └── registration-form.component.ts # Example implementation
│   ├── app.ts                           # Main app component
│   └── app.routes.ts                    # Routing configuration
```

## Tech Stack

- Angular 18
- TypeScript
- Bootstrap 5
- SCSS for styling
- Angular Forms (Reactive Forms)
- Angular Router
- Jasmine/Karma for testing

## Development Features

- Comprehensive unit tests
- TypeScript strict mode enabled
- ESLint configuration
- Prettier code formatting
- Git hooks for code quality
- Responsive design
- Cross-browser compatibility
- Accessibility compliance

## Building for Production

To create a production build, run:
```bash
ng build --prod
```

The build artifacts will be stored in the `dist/` directory.