import { useFieldContext } from "./hooks";
import { FormBase, type FormControlProps } from "./FormBase";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

interface CheckboxOption {
  value: string;
  label: string;
}

interface FormCheckboxGroupProps extends FormControlProps {
  options: CheckboxOption[];
}

export function FormCheckboxGroup(props: FormCheckboxGroupProps) {
  const { options, ...baseProps } = props;
  const field = useFieldContext<string[]>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  // Initialize array mode
  useEffect(() => {
    if (!Array.isArray(field.state.value)) {
      const initialValue = field.state.value ? [String(field.state.value)] : [];
      field.handleChange(initialValue);
    }
  }, [field]);

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
      <div className="space-y-1.5">
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
