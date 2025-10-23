import { Input } from "../ui/input";
import { FormBase } from "./FormBase";
import type { FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";
import { getValidationErrorMessage } from "../../lib/utils";

export function FormInput(props: FormControlProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Add validation handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    field.handleChange(newValue);

    // Validate on change if validation rules exist
    if (props.validation && props.label) {
      const error = getValidationErrorMessage(
        props.label,
        props.type || "text",
        props.validation,
        newValue
      );
      if (error && field.state.meta.errors?.length === 0) {
        // Error will be set by the form validator
      }
    }
  };

  return (
    <FormBase {...props}>
      <Input
        id={field.name}
        type={props.type || "text"}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={handleChange}
        aria-invalid={isInvalid}
        placeholder={props.placeholder}
        minLength={props.validation?.minLength}
        maxLength={props.validation?.maxLength}
        {...(props.type === "number" && {
          min: props.validation?.min,
          max: props.validation?.max,
        })}
        {...(props.type === "date" && {
          min: props.validation?.min
            ? new Date(props.validation.min).toISOString().split("T")[0]
            : undefined,
          max: props.validation?.max
            ? new Date(props.validation.max).toISOString().split("T")[0]
            : undefined,
        })}
      />
    </FormBase>
  );
}
