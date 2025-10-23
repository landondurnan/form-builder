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
    if (fieldType === "date") {
      // Compare date strings directly (yyyy-mm-dd format compares chronologically)
      if (typeof value === "string" && value < (validationRule.min as string)) {
        return `${fieldName} must be on or after ${validationRule.min}`;
      }
    } else {
      const numValue = Number(value);
      const minNum = Number(validationRule.min);
      if (!isNaN(numValue) && !isNaN(minNum) && numValue < minNum) {
        return `${fieldName} must be at least ${validationRule.min}`;
      }
    }
  }

  // Check max (for numbers and dates)
  if (validationRule.max !== undefined && value !== undefined && value !== "") {
    if (fieldType === "date") {
      // Compare date strings directly (yyyy-mm-dd format compares chronologically)
      if (typeof value === "string" && value > (validationRule.max as string)) {
        return `${fieldName} must be on or before ${validationRule.max}`;
      }
    } else {
      const numValue = Number(value);
      const maxNum = Number(validationRule.max);
      if (!isNaN(numValue) && !isNaN(maxNum) && numValue > maxNum) {
        return `${fieldName} cannot exceed ${validationRule.max}`;
      }
    }
  }

  return null;
}
