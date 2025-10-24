import { z } from "zod";
import type {
  FieldType,
  FormField,
  ValidationRules,
  PatternType,
} from "./types";

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
      // min/max can be numbers (for number fields) or ISO date strings (for date fields)
      // Keep as strings and only coerce numbers when needed
      min: z.string().optional().or(z.literal("")),
      max: z.string().optional().or(z.literal("")),
      pattern: z
        .enum(["email", "url", "phone", "postal", "creditCard", "custom"])
        .optional(),
      customPattern: z.string().optional().default(""),
    })
    .optional(),
});

export type AddFieldFormData = z.infer<typeof addFieldSchema>;

/**
 * Pattern definitions for Zod schema validation
 * Maps pattern types to their regex patterns and display labels
 */
export const PATTERN_DEFINITIONS: Record<
  string,
  {
    label: string;
    pattern: string;
    description: string;
  }
> = {
  email: {
    label: "Email",
    pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    description: "Valid email address format",
  },
  url: {
    label: "URL",
    pattern: "^https?://[^\\s]+$",
    description: "Valid HTTP or HTTPS URL",
  },
  phone: {
    label: "Phone Number (US)",
    pattern: "^\\(?\\d{3}\\)?[-.]?\\d{3}[-.]?\\d{4}$",
    description: "US phone number (optional parentheses and dashes)",
  },
  postal: {
    label: "Postal Code",
    pattern: "^\\d{5}(-\\d{4})?$",
    description: "US postal code (ZIP or ZIP+4)",
  },
  creditCard: {
    label: "Credit Card",
    pattern: "^[0-9]{13,19}$",
    description: "Credit card number (13-19 digits)",
  },
  custom: {
    label: "Custom",
    pattern: "",
    description: "Define your own regex pattern",
  },
};

/**
 * Validation configuration per field type
 * Determines which validation rules are shown and their input types
 */
export const VALIDATION_CONFIG: Record<
  FieldType,
  {
    showValidation: boolean;
    showPattern: boolean;
    inputType: "number" | "date";
    labels: { min: string; max: string };
  }
> = {
  text: {
    showValidation: true,
    showPattern: true,
    inputType: "number",
    labels: { min: "Min Length", max: "Max Length" },
  },
  textarea: {
    showValidation: true,
    showPattern: false,
    inputType: "number",
    labels: { min: "Min Length", max: "Max Length" },
  },
  number: {
    showValidation: true,
    showPattern: false,
    inputType: "number",
    labels: { min: "Min Value", max: "Max Value" },
  },
  date: {
    showValidation: true,
    showPattern: false,
    inputType: "date",
    labels: { min: "Min Date", max: "Max Date" },
  },
  select: {
    showValidation: false,
    showPattern: false,
    inputType: "number",
    labels: { min: "", max: "" },
  },
  radio: {
    showValidation: false,
    showPattern: false,
    inputType: "number",
    labels: { min: "", max: "" },
  },
  checkbox: {
    showValidation: false,
    showPattern: false,
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
export const buildFormField = (
  validatedData: AddFieldFormData,
  fieldId?: string
): FormField => {
  // Build validation object, only including non-empty values
  const validationRules: ValidationRules = {};
  if (
    validatedData.validation?.minLength !== undefined &&
    validatedData.validation?.minLength !== "" &&
    validatedData.validation?.minLength !== 0
  ) {
    validationRules.minLength = validatedData.validation.minLength as number;
  }
  if (
    validatedData.validation?.maxLength !== undefined &&
    validatedData.validation?.maxLength !== "" &&
    validatedData.validation?.maxLength !== 0
  ) {
    validationRules.maxLength = validatedData.validation.maxLength as number;
  }
  if (
    validatedData.validation?.min !== undefined &&
    validatedData.validation?.min !== ""
  ) {
    validationRules.min = validatedData.validation.min;
  }
  if (
    validatedData.validation?.max !== undefined &&
    validatedData.validation?.max !== ""
  ) {
    validationRules.max = validatedData.validation.max;
  }
  if (validatedData.validation?.pattern) {
    validationRules.pattern = validatedData.validation.pattern as PatternType;
  }
  if (
    validatedData.validation?.customPattern &&
    validatedData.validation.pattern === "custom"
  ) {
    validationRules.customPattern = validatedData.validation.customPattern;
  }

  const newField: FormField = {
    id: fieldId || generateId(),
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

/**
 * Convert a FormField back to AddFieldFormData for editing
 */
export const fieldToFormData = (field: FormField): AddFieldFormData => {
  return {
    label: field.label,
    type: field.type,
    placeholder: field.placeholder || "",
    description: field.description || "",
    required: field.required || false,
    defaultValue: field.defaultValue ? String(field.defaultValue) : "",
    options: field.options ? field.options.join("\n") : "",
    validation: {
      minLength: field.validation?.minLength || "",
      maxLength: field.validation?.maxLength || "",
      min: field.validation?.min ? String(field.validation.min) : "",
      max: field.validation?.max ? String(field.validation.max) : "",
      pattern: field.validation?.pattern,
      customPattern: field.validation?.customPattern || "",
    },
  };
};

/**
 * Build a Zod schema for a field based on its validation rules
 * This enables comprehensive schema-based validation with TanStack Form
 */
export const buildFieldSchema = (field: FormField): z.ZodType => {
  let schema: z.ZodType;

  const validation = field.validation;

  if (field.type === "text" || field.type === "textarea") {
    // Start with a string schema that catches non-string values and treats as empty
    // This gives us a human-friendly error message when required fields are empty
    let stringSchema = z.string().catch(() => "");

    if (validation?.minLength) {
      stringSchema = stringSchema.refine(
        (val) => val.length >= validation.minLength!,
        {
          message: `Must be at least ${validation.minLength} characters`,
        }
      );
    }
    if (validation?.maxLength) {
      stringSchema = stringSchema.refine(
        (val) => val.length <= validation.maxLength!,
        {
          message: `Cannot exceed ${validation.maxLength} characters`,
        }
      );
    }
    if (validation?.pattern) {
      let pattern: string | undefined;
      if (validation.pattern === "custom" && validation.customPattern) {
        pattern = validation.customPattern;
      } else {
        pattern = PATTERN_DEFINITIONS[validation.pattern]?.pattern;
      }
      if (pattern) {
        stringSchema = stringSchema.refine(
          (val) => new RegExp(pattern).test(val),
          {
            message: `Invalid format for ${validation.pattern}`,
          }
        );
      }
    }

    schema = stringSchema;
  } else if (field.type === "number") {
    let numberSchema = z.coerce.number();

    if (validation?.min !== undefined && validation.min !== "") {
      const minNum = Number(validation.min);
      if (!isNaN(minNum)) {
        numberSchema = numberSchema.min(minNum, `Must be at least ${minNum}`);
      }
    }
    if (validation?.max !== undefined && validation.max !== "") {
      const maxNum = Number(validation.max);
      if (!isNaN(maxNum)) {
        numberSchema = numberSchema.max(maxNum, `Cannot exceed ${maxNum}`);
      }
    }

    schema = numberSchema;
  } else if (field.type === "date") {
    let dateSchema = z.coerce.date();

    if (validation?.min !== undefined && validation.min !== "") {
      const minDate = new Date(validation.min);
      dateSchema = dateSchema.refine((val) => val >= minDate, {
        message: `Must be on or after ${validation.min}`,
      });
    }
    if (validation?.max !== undefined && validation.max !== "") {
      const maxDate = new Date(validation.max);
      dateSchema = dateSchema.refine((val) => val <= maxDate, {
        message: `Must be on or before ${validation.max}`,
      });
    }

    schema = dateSchema;
  } else {
    // For select, radio, checkbox
    schema = z.string();
  }

  // Apply required constraint LAST
  if (field.required) {
    if (field.type === "text" || field.type === "textarea") {
      schema = (schema as z.ZodString).refine((val) => val.length > 0, {
        message: `${field.label} is required`,
      });
    } else if (field.type === "number") {
      schema = (schema as z.ZodNumber).refine(
        (val) => val !== undefined && val !== null && !isNaN(val),
        { message: `${field.label} is required` }
      );
    } else if (field.type === "date") {
      schema = (schema as z.ZodDate).refine(
        (val) => val !== undefined && val !== null,
        { message: `${field.label} is required` }
      );
    } else {
      // select, radio, checkbox
      schema = (schema as z.ZodString).refine((val) => val.length > 0, {
        message: `${field.label} is required`,
      });
    }
  } else {
    // For optional fields, make them nullable/optional
    if (field.type === "number") {
      schema = (schema as z.ZodNumber).nullable().optional();
    } else if (field.type === "date") {
      schema = (schema as z.ZodDate).nullable().optional();
    } else {
      schema = (schema as z.ZodString).nullable().optional();
    }
  }

  return schema;
};
