import { z } from "zod";

// Field types supported by the form builder
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "date";

// Pattern types for Zod schema validation
export type PatternType =
  | "email"
  | "url"
  | "phone"
  | "postal"
  | "creditCard"
  | "custom";

// Validation rules for different field types
export interface ValidationRules {
  minLength?: number; // For text, textarea
  maxLength?: number; // For text, textarea
  min?: number | string; // For number, date (as timestamp or ISO date string)
  max?: number | string; // For number, date (as timestamp or ISO date string)
  pattern?: PatternType; // For text fields with pattern validation
  customPattern?: string; // For custom regex patterns
}

// Form field definition
export interface FormField {
  id: string;
  label: string;
  name: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  required?: boolean;
  defaultValue?: string | number | boolean;
  options?: string[]; // For select, radio fields
  validation?: ValidationRules; // Nested validation rules
}

// Complete form definition
export interface FormDefinition {
  title: string;
  fields: FormField[];
}

// Zod schema for validation rules
const validationRulesSchema = z.object({
  minLength: z.number().min(0).optional(),
  maxLength: z.number().min(0).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
});

// Zod schema for form validation
export const formFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Field label is required"),
  name: z.string().min(1, "Field name is required"),
  type: z.enum([
    "text",
    "textarea",
    "number",
    "select",
    "radio",
    "checkbox",
    "date",
  ]),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  required: z.boolean().default(false),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  options: z.array(z.string()).optional(), // For select, radio fields
  validation: validationRulesSchema.optional(),
});

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fields: z.array(formFieldSchema),
});

// Infer types from schema
export type FormFieldSchema = z.infer<typeof formFieldSchema>;
export type FormSchema = z.infer<typeof formSchema>;
