import { Textarea } from "@/components/ui/textarea";
import { FormBase, type FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";
import { getValidationErrorMessage } from "@/lib/utils";

export function FormTextarea(props: FormControlProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Add validation handlers
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    field.handleChange(newValue);

    // Validate on change if validation rules exist
    if (props.validation && props.label) {
      const error = getValidationErrorMessage(
        props.label,
        "textarea",
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
      <Textarea
        id={field.name}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={handleChange}
        aria-invalid={isInvalid}
        minLength={props.validation?.minLength}
        maxLength={props.validation?.maxLength}
      />
    </FormBase>
  );
}
