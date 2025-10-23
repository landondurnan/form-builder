import { z } from "zod";
import type { FieldType, FormField } from "./types";

/**
 * All supported field types
 */
export const FIELD_TYPES: FieldType[] = [
  "text",
  "textarea",
  "number",
  "select",
  "radio",
  "checkbox",
  "date",
];

/**
 * Zod schema for validating add field form data
 */
export const addFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: z.enum(FIELD_TYPES),
  placeholder: z.string().optional().default(""),
  description: z.string().optional().default(""),
  required: z.boolean().default(false),
  defaultValue: z.string().optional().default(""),
  options: z.string().optional().default(""),
  validation: z
    .object({
      minLength: z.coerce.number().min(0).optional().or(z.literal("")),
      maxLength: z.coerce.number().min(0).optional().or(z.literal("")),
      min: z.coerce.number().optional().or(z.literal("")),
      max: z.coerce.number().optional().or(z.literal("")),
    })
    .optional(),
});

export type AddFieldFormData = z.infer<typeof addFieldSchema>;

/**
 * Validation configuration per field type
 * Determines which validation rules are shown and their input types
 */
export const VALIDATION_CONFIG: Record<
  FieldType,
  {
    showValidation: boolean;
    inputType: "number" | "date";
    labels: { min: string; max: string };
  }
> = {
  text: {
    showValidation: true,
    inputType: "number",
    labels: { min: "Min Length", max: "Max Length" },
  },
  textarea: {
    showValidation: true,
    inputType: "number",
    labels: { min: "Min Length", max: "Max Length" },
  },
  number: {
    showValidation: true,
    inputType: "number",
    labels: { min: "Min Value", max: "Max Value" },
  },
  date: {
    showValidation: true,
    inputType: "date",
    labels: { min: "Min Date", max: "Max Date" },
  },
  select: {
    showValidation: false,
    inputType: "number",
    labels: { min: "", max: "" },
  },
  radio: {
    showValidation: false,
    inputType: "number",
    labels: { min: "", max: "" },
  },
  checkbox: {
    showValidation: false,
    inputType: "number",
    labels: { min: "", max: "" },
  },
};

/**
 * Input types for default value fields based on field type
 */
export const DEFAULT_VALUE_INPUT_TYPES: Partial<Record<FieldType, string>> = {
  number: "number",
  date: "date",
};

/**
 * Generate a unique field ID
 */
export const generateId = () =>
  `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Convert a label to a valid field name
 * Converts to lowercase, replaces spaces with underscores, removes special characters
 */
export const labelToFieldName = (label: string) =>
  label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

/**
 * Get default value for a field type
 */
export const getDefaultValue = (type: FieldType) =>
  type === "checkbox" ? false : "";

/**
 * Parse options from textarea input (one per line)
 */
export const parseOptionsFromTextarea = (input: string): string[] => {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

/**
 * Determine if a field type should show an options textarea
 */
export const shouldShowOptionsField = (type: FieldType): boolean => {
  return ["select", "checkbox", "radio"].includes(type);
};

/**
 * Determine if a field type should show a placeholder input
 */
export const shouldShowPlaceholder = (type: FieldType): boolean => {
  return !["checkbox", "radio"].includes(type);
};

/**
 * Determine if a field type should use options for default value selection
 */
export const shouldUseOptionsForDefault = (type: FieldType): boolean => {
  return ["select", "checkbox", "radio"].includes(type);
};

/**
 * Build a FormField from validated form data
 * This is the core logic for creating a new field from the add field form
 */
export const buildFormField = (validatedData: AddFieldFormData): FormField => {
  // Build validation object, only including non-empty values
  const validationRules: Record<string, number> = {};
  if (validatedData.validation?.minLength) {
    validationRules.minLength = validatedData.validation.minLength;
  }
  if (validatedData.validation?.maxLength) {
    validationRules.maxLength = validatedData.validation.maxLength;
  }
  if (validatedData.validation?.min) {
    validationRules.min = validatedData.validation.min;
  }
  if (validatedData.validation?.max) {
    validationRules.max = validatedData.validation.max;
  }

  const newField: FormField = {
    id: generateId(),
    label: validatedData.label,
    name: labelToFieldName(validatedData.label),
    type: validatedData.type as FieldType,
    required: validatedData.required,
    defaultValue:
      validatedData.defaultValue ||
      getDefaultValue(validatedData.type as FieldType),
    ...(validatedData.placeholder && {
      placeholder: validatedData.placeholder,
    }),
    ...(validatedData.description && {
      description: validatedData.description,
    }),
    ...(validatedData.options &&
      shouldShowOptionsField(validatedData.type as FieldType) && {
        options: parseOptionsFromTextarea(validatedData.options),
      }),
    ...(Object.keys(validationRules).length > 0 && {
      validation: validationRules,
    }),
  };

  return newField;
};
