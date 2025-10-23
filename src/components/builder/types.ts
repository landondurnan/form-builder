/**
 * Shared types for form builder components
 */

/**
 * Represents the state and handlers of a form field from TanStack Form's render function
 */
export interface FieldState {
  name: string;
  state: {
    value: string | boolean;
  };
  handleChange: (value: string | boolean) => void;
  handleBlur?: () => void;
}

/**
 * Extended field state with validation metadata
 */
export interface FieldStateWithValidation extends FieldState {
  state: FieldState["state"] & {
    meta: {
      isTouched: boolean;
      isValid: boolean;
      errors?: Array<{ message: string }>;
    };
  };
}

/**
 * Union type of all possible field states
 */
export type AnyFieldState = FieldState | FieldStateWithValidation;

/**
 * Form object passed to builder components
 * Represents the TanStack Form API
 * Using looser typing to accommodate TanStack's complex generic signatures
 */
export type FormType = any; // eslint-disable-line @typescript-eslint/no-explicit-any
