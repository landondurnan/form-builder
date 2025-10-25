import { Input } from "@/components/ui/input";
import { FormBase } from "./FormBase";
import type { FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

/**
 * Map pattern types to HTML input types for better UX and browser validation
 */
const PATTERN_TO_INPUT_TYPE: Record<string, string> = {
  email: "email",
  url: "url",
  phone: "tel",
  postal: "text",
  creditCard: "text",
};

const getInputTypeFromPattern = (
  fieldType: string | undefined,
  pattern: string | undefined
): string => {
  return (pattern && PATTERN_TO_INPUT_TYPE[pattern]) || fieldType || "text";
};

export function FormInput(props: FormControlProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Determine the HTML input type based on field type and pattern
  const htmlInputType = getInputTypeFromPattern(
    props.type,
    props.validation?.pattern
  );

  return (
    <FormBase {...props}>
      <Input
        id={field.name}
        type={htmlInputType}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
        placeholder={props.placeholder}
      />
    </FormBase>
  );
}
