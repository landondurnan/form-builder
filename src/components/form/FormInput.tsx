import { Input } from "../ui/input";
import { FormBase } from "./FormBase";
import type { FormControlProps } from "./FormBase";
import { useFieldContext } from "./hooks";

export function FormInput(props: FormControlProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <Input
        id={field.name}
        type={props.type || "text"}
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
