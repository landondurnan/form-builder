import { useFieldContext } from "./hooks";
import { FormBase, type FormControlProps } from "./FormBase";
import { Checkbox } from "../ui/checkbox";

interface CheckboxOption {
  value: string;
  label: string;
}

interface FormCheckboxProps extends FormControlProps {
  options?: CheckboxOption[];
}

export function FormCheckbox(props: FormCheckboxProps) {
  const { options, ...baseProps } = props;
  const field = useFieldContext<boolean | string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Single checkbox mode (no options)
  if (!options) {
    return (
      <FormBase {...baseProps} controlFirst horizontal>
        <Checkbox
          id={field.name}
          name={field.name}
          checked={field.state.value as boolean}
          onBlur={field.handleBlur}
          onCheckedChange={(e) => field.handleChange(e === true)}
          aria-invalid={isInvalid}
        />
      </FormBase>
    );
  }

  // Multiple checkboxes mode
  const selectedValues = Array.isArray(field.state.value)
    ? field.state.value
    : [];

  const handleCheckboxChange = (checkboxValue: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, checkboxValue]
      : selectedValues.filter((v) => v !== checkboxValue);
    field.handleChange(newValues);
  };

  return (
    <FormBase {...baseProps}>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <Checkbox
              id={`${field.name}-${option.value}`}
              name={field.name}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) =>
                handleCheckboxChange(option.value, checked === true)
              }
              onBlur={field.handleBlur}
              aria-invalid={isInvalid}
            />
            <label
              htmlFor={`${field.name}-${option.value}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </FormBase>
  );
}
