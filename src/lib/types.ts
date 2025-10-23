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
}

// Complete form definition
export interface FormDefinition {
  title: string;
  fields: FormField[];
}

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
});

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  fields: z.array(formFieldSchema),
});

// Infer types from schema
export type FormFieldSchema = z.infer<typeof formFieldSchema>;
export type FormSchema = z.infer<typeof formSchema>;
