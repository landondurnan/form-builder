import type { FormField } from "./types";

/**
 * Constants for form field rendering
 */
export const INPUT_TYPES = ["text", "number", "date"];

export const FIELD_TYPE_COMPONENT_MAP = {
  text: "Input",
  number: "Input",
  date: "Input",
  textarea: "Textarea",
  select: "Select",
  radio: "Radio",
  checkbox: "Checkbox",
} as const;

/**
 * Build props for a form field component based on field definition
 * This centralizes the logic for converting FormField to component props
 * Used by both the builder and preview components
 */
export function buildFieldProps(formField: FormField) {
  const isInputType = INPUT_TYPES.includes(formField.type);

  const baseProps = {
    label: formField.label,
    ...(formField.placeholder && {
      placeholder: formField.placeholder,
    }),
    ...(formField.description && {
      description: formField.description,
    }),
    ...(formField.required && { required: formField.required }),
    ...(formField.validation && { validation: formField.validation }),
  };

  if (isInputType) {
    return { ...baseProps, type: formField.type };
  }

  if (formField.type === "radio" && formField.options) {
    return {
      ...baseProps,
      options: formField.options.map((opt) => ({
        value: opt,
        label: opt,
      })),
    };
  }

  if (formField.type === "checkbox" && formField.options) {
    return {
      ...baseProps,
      options: formField.options.map((opt) => ({
        value: opt,
        label: opt,
      })),
    };
  }

  return baseProps;
}

/**
 * Transform select options into array with value and label
 * Used by both builder and preview to prepare select options
 */
export function getSelectOptions(options: string[] | undefined) {
  if (!options) return [];
  return options.map((option) => ({
    key: option,
    value: option,
    label: option,
  }));
}
