import type { ReactNode } from "react";
import { useFieldContext } from "./hooks";
import type { ValidationRules } from "@/lib/types";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

export type FormControlProps = {
  label: string;
  description?: string;
  placeholder?: string;
  type?: string;
  value?: string | number | boolean;
  options?: { label: string; value: string }[];
  required?: boolean;
  validation?: ValidationRules;
  readOnly?: boolean;
};

type FormBaseProps = FormControlProps & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
  externalError?: string; // For form-level validation errors
};

export function FormBase({
  children,
  label,
  description,
  controlFirst,
  horizontal,
  required,
  externalError,
}: FormBaseProps) {
  const field = useFieldContext();
  const isInvalid =
    (field.state.meta.isTouched && !field.state.meta.isValid) ||
    !!externalError;

  const labelElement = (
    <>
      <FieldLabel htmlFor={field.name} required={required}>
        {label}
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  );

  // Use external error from form-level validation if provided, otherwise extract from field
  const errorObj = field.state.meta.errors?.[0];
  const errorMessage =
    externalError ||
    (typeof errorObj === "string"
      ? errorObj
      : (errorObj as { message: string })?.message);

  const errorElem = isInvalid && errorMessage && (
    <FieldError errors={[{ message: errorMessage }]} />
  );

  return (
    <Field
      data-invalid={isInvalid}
      orientation={horizontal ? "horizontal" : undefined}
    >
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            {labelElement}
            {errorElem}
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>{labelElement}</FieldContent>
          {children}
          {errorElem}
        </>
      )}
    </Field>
  );
}
