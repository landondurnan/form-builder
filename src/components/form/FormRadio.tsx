import { useFieldContext } from "./hooks";
import { FormBase, type FormControlProps } from "./FormBase";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface RadioOption {
  value: string;
  label: string;
}

interface FormRadioProps extends FormControlProps {
  options: RadioOption[];
}

export function FormRadio(props: FormRadioProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props}>
      <RadioGroup
        id={field.name}
        name={field.name}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        aria-invalid={isInvalid}
      >
        {props.options.map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}> {option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </FormBase>
  );
}
