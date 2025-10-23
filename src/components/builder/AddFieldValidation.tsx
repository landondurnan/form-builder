import type { FieldType } from "../../lib/types";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";
import { Toggle } from "../ui/toggle";
import { AsteriskIcon } from "lucide-react";
import { VALIDATION_CONFIG } from "../../lib/formUtils";
import type { FormType, FieldState } from "./types";

interface AddFieldValidationProps {
  form: FormType;
}

function ValidationInput({
  fieldType,
  minOrMax,
  value,
  onChange,
}: {
  fieldType: FieldType;
  minOrMax: "min" | "max";
  value: string;
  onChange: (value: string) => void;
}) {
  const config = VALIDATION_CONFIG[fieldType];
  const placeholder = minOrMax === "min" ? "e.g., 5" : "e.g., 100";

  return (
    <Input
      type={config.inputType}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? "" : e.target.value)}
    />
  );
}

export function AddFieldValidation({ form }: AddFieldValidationProps) {
  return (
    <>
      <FieldSeparator className="my-2" />
      <FieldSet>
        <FieldLegend>Validation</FieldLegend>
        <form.Field name="required">
          {(field: FieldState) => {
            return (
              <Field>
                <Toggle
                  aria-label="Toggle Required"
                  variant="outline"
                  id={field.name}
                  pressed={field.state.value as boolean}
                  onPressedChange={(pressed) => field.handleChange(pressed)}
                  className="data-[state=on]:border-red-500 data-[state=on]:text-red-500 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
                >
                  <AsteriskIcon /> Required
                </Toggle>
              </Field>
            );
          }}
        </form.Field>

        {/* Validation Rules - Min/Max */}
        <form.Field name="type">
          {(typeField: FieldState) => {
            const fieldType = typeField.state.value as FieldType;
            const config = VALIDATION_CONFIG[fieldType];

            return config.showValidation ? (
              <div className="grid grid-cols-2 gap-4">
                {(["min", "max"] as const).map((minOrMax) => (
                  <form.Field key={minOrMax} name={`validation.${minOrMax}`}>
                    {(field: FieldState) => {
                      return (
                        <Field>
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>
                              {config.labels[minOrMax]}
                            </FieldLabel>
                          </FieldContent>
                          <ValidationInput
                            fieldType={fieldType}
                            minOrMax={minOrMax}
                            value={field.state.value as string}
                            onChange={(v) => field.handleChange(v)}
                          />
                        </Field>
                      );
                    }}
                  </form.Field>
                ))}
              </div>
            ) : null;
          }}
        </form.Field>
      </FieldSet>
    </>
  );
}
