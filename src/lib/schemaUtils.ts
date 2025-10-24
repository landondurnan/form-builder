import type { ValidationRules, FormField, FormDefinition } from "./types";
import { z } from "zod";

/**
 * Build a Zod schema from a single form field definition
 * This allows dynamic schema generation based on user-created fields
 */
export function buildFieldSchema(field: FormField): z.ZodTypeAny {
  let schema: z.ZodTypeAny;

  // Base schema by field type
  switch (field.type) {
    case "text":
    case "textarea":
      schema = z.string().catch("");
      break;
    case "number":
      schema = z.coerce.number().catch(0);
      break;
    case "date":
      schema = z.string().catch("");
      break;
    case "select":
    case "radio":
      schema = z.string().catch("");
      break;
    case "checkbox":
      schema = z.boolean().catch(false);
      break;
    default:
      schema = z.string().catch("");
  }

  // Apply validation rules
  if (field.validation) {
    const { minLength, maxLength, min, max, pattern, customPattern } =
      field.validation;

    if (field.type === "text" || field.type === "textarea") {
      if (minLength !== undefined) {
        schema = (schema as z.ZodString).min(minLength);
      }
      if (maxLength !== undefined) {
        schema = (schema as z.ZodString).max(maxLength);
      }
      if (customPattern) {
        schema = (schema as z.ZodString).regex(new RegExp(customPattern));
      }
    }

    if (field.type === "number") {
      if (min !== undefined) {
        schema = (schema as z.ZodNumber).min(Number(min));
      }
      if (max !== undefined) {
        schema = (schema as z.ZodNumber).max(Number(max));
      }
    }

    if (field.type === "date") {
      if (min !== undefined) {
        schema = (schema as z.ZodString).min(Number(min));
      }
      if (max !== undefined) {
        schema = (schema as z.ZodString).max(Number(max));
      }
    }

    // Pattern validation for text fields
    if (pattern && (field.type === "text" || field.type === "textarea")) {
      const patterns: Record<string, RegExp> = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        url: /^https?:\/\/.+/,
        phone: /^\d{10}$/,
        postal: /^\d{5}(?:-\d{4})?$/,
        creditCard: /^\d{13,19}$/,
      };
      const patternRegex = patterns[pattern];
      if (patternRegex) {
        schema = (schema as z.ZodString).regex(patternRegex);
      }
    }
  }

  // Apply required/optional
  if (!field.required) {
    schema = schema.optional();
  }

  return schema;
}

/**
 * Build a complete Zod schema from a form definition
 * This creates a schema that validates form submission data
 */
export function buildFormSchema(
  formDef: FormDefinition
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of formDef.fields) {
    shape[field.name] = buildFieldSchema(field);
  }

  return z.object(shape);
}

/**
 * Export only the validation schema (without form metadata like title)
 * This is the portable, language-agnostic JSON Schema representation
 * suitable for backend validation and API integration
 */
export function exportFormAsJSONSchema(
  fields: FormField[]
): Record<string, unknown> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    shape[field.name] = buildFieldSchema(field);
  }

  const zodSchema = z.object(shape);
  return z.toJSONSchema(zodSchema);
}

/**
 * Export the complete form definition (including title and fields)
 * This is useful for importing/exporting the entire form configuration
 */
export function exportFormDefinition(
  formDef: FormDefinition
): Record<string, unknown> {
  return {
    title: formDef.title,
    fields: formDef.fields,
  };
}

/**
 * Convert form field validation rules to JSON Schema format
 * This makes the validation schema portable and language-agnostic
 */
export function getFieldValidationJSONSchema(
  validation: ValidationRules | undefined
) {
  if (!validation) return {};

  const schema: Record<string, unknown> = {};

  // String constraints
  if (validation.minLength !== undefined) {
    schema.minLength = validation.minLength;
  }
  if (validation.maxLength !== undefined) {
    schema.maxLength = validation.maxLength;
  }

  // Number/Date constraints
  if (validation.min !== undefined) {
    schema.minimum = validation.min;
  }
  if (validation.max !== undefined) {
    schema.maximum = validation.max;
  }

  // Pattern constraints
  if (validation.pattern) {
    schema.pattern = validation.pattern;
  }
  if (validation.customPattern) {
    schema.customPattern = validation.customPattern;
  }

  return schema;
}

/**
 * Import a JSON Schema and convert it to form fields and title
 * Maps JSON Schema types to form field types and extracts metadata
 */
export function importJSONSchema(jsonString: string): {
  fields: FormField[];
  title: string;
} {
  const parsed = JSON.parse(jsonString) as Record<string, unknown>;

  // Validate it has the required structure
  if (!parsed.properties || typeof parsed.properties !== "object") {
    throw new Error("Invalid JSON Schema format: missing 'properties'");
  }

  // Extract title
  const title = (parsed.title as string) || "Imported Form";

  // Extract required fields list
  const requiredFields = Array.isArray(parsed.required)
    ? (parsed.required as string[])
    : [];

  // Map JSON Schema types to form field types
  const typeMap: Record<string, FormField["type"]> = {
    number: "number",
    integer: "number",
  };

  // Extract fields from properties
  const properties = parsed.properties as Record<
    string,
    Record<string, unknown>
  >;

  const fields: FormField[] = Object.entries(properties).map(
    ([key, schema], index: number) => {
      const schemaType = (schema.type as string) || "text";
      const fieldType = typeMap[schemaType] || "text";

      return {
        id: `imported-${index}-${Date.now()}`,
        name: key,
        label: (schema.title as string) || key,
        type: fieldType,
        required: requiredFields.includes(key),
      };
    }
  );

  return { fields, title };
}
