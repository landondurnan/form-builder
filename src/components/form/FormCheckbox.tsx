import { useFieldContext } from "./hooks";
import { FormBase, type FormControlProps } from "./FormBase";
import { Checkbox } from "@/components/ui/checkbox";
import { FormCheckboxGroup } from "./FormCheckboxGroup";

interface CheckboxOption {
  value: string;
  label: string;
}

interface FormCheckboxProps extends FormControlProps {
  options?: CheckboxOption[];
}

export function FormCheckbox(props: FormCheckboxProps) {
  const { options, ...baseProps } = props;
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // If options are provided, render the checkbox group instead
  if (options) {
    return <FormCheckboxGroup {...baseProps} options={options} />;
  }

  // Single checkbox mode
  return (
    <FormBase {...baseProps} controlFirst horizontal>
      <Checkbox
        id={field.name}
        name={field.name}
        checked={field.state.value}
        onBlur={field.handleBlur}
        onCheckedChange={(e) => field.handleChange(e === true)}
        aria-invalid={isInvalid}
      />
    </FormBase>
  );
}
