import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ValidationRules } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generate a user-friendly validation error message based on the validation rule that was violated
 */
export function getValidationErrorMessage(
  fieldName: string,
  fieldType: string,
  validationRule: ValidationRules,
  value: string | number | undefined
): string | null {
  // Check minLength
  if (validationRule.minLength && value) {
    const valueLength = String(value).length;
    if (valueLength < validationRule.minLength) {
      return `${fieldName} must be at least ${validationRule.minLength} characters`;
    }
  }

  // Check maxLength
  if (validationRule.maxLength && value) {
    const valueLength = String(value).length;
    if (valueLength > validationRule.maxLength) {
      return `${fieldName} cannot exceed ${validationRule.maxLength} characters`;
    }
  }

  // Check min (for numbers and dates)
  if (validationRule.min !== undefined && value !== undefined && value !== "") {
    const numValue = Number(value);
    if (fieldType === "date") {
      const minDate = new Date(validationRule.min).toLocaleDateString();
      return `${fieldName} must be on or after ${minDate}`;
    }
    if (!isNaN(numValue) && numValue < validationRule.min) {
      return `${fieldName} must be at least ${validationRule.min}`;
    }
  }

  // Check max (for numbers and dates)
  if (validationRule.max !== undefined && value !== undefined && value !== "") {
    const numValue = Number(value);
    if (fieldType === "date") {
      const maxDate = new Date(validationRule.max).toLocaleDateString();
      return `${fieldName} must be on or before ${maxDate}`;
    }
    if (!isNaN(numValue) && numValue > validationRule.max) {
      return `${fieldName} cannot exceed ${validationRule.max}`;
    }
  }

  return null;
}
