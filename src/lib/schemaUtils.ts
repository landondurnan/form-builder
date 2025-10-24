import type { ValidationRules } from "./types";
import { z } from "zod";
import { formFieldSchema, formSchema } from "./types";

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
 * Get the JSON Schema representation of the form field schema using Zod's toJSONSchema
 */
export function getFormFieldSchema() {
  return z.toJSONSchema(formFieldSchema);
}

/**
 * Get the JSON Schema representation of the entire form schema using Zod's toJSONSchema
 */
export function getFormDefinitionSchema() {
  return z.toJSONSchema(formSchema);
}
