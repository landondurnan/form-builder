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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  AsteriskIcon,
  Mail,
  Globe,
  Phone,
  MapPin,
  CreditCard,
  Regex,
} from "lucide-react";
import { VALIDATION_CONFIG, PATTERN_DEFINITIONS } from "../../lib/formUtils";
import type { FormType, FieldState } from "./types";

interface AddFieldValidationProps {
  form: FormType;
}

// Icon mapping for pattern types
const PATTERN_ICONS: Record<string, React.ReactNode> = {
  email: <Mail className="size-4" />,
  url: <Globe className="size-4" />,
  phone: <Phone className="size-4" />,
  postal: <MapPin className="size-4" />,
  creditCard: <CreditCard className="size-4" />,
  custom: <Regex className="size-4" />,
};

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
  const isDateInput = config.inputType === "date";

  // Format date value for date input (expects YYYY-MM-DD format)
  const displayValue = isDateInput && value ? value : (value ?? "");

  return (
    <Input
      type={config.inputType}
      placeholder={placeholder}
      value={displayValue}
      onChange={(e) => {
        const newValue = e.target.value;
        onChange(newValue === "" ? "" : newValue);
      }}
    />
  );
}

export function AddFieldValidation({ form }: AddFieldValidationProps) {
  return (
    <>
      <FieldSeparator className="my-1" />
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

        {/* Pattern Validation for Text Fields */}
        <form.Field name="type">
          {(typeField: FieldState) => {
            const fieldType = typeField.state.value as FieldType;
            const config = VALIDATION_CONFIG[fieldType];

            return config.showPattern ? (
              <form.Field name="validation.pattern">
                {(patternField: FieldState) => {
                  const selectedPattern = patternField.state.value as string;

                  return (
                    <div className="space-y-2">
                      <Field>
                        <FieldContent>
                          <FieldLabel htmlFor={patternField.name}>
                            Pattern Validation
                          </FieldLabel>
                        </FieldContent>
                        <Select
                          value={selectedPattern ?? ""}
                          onValueChange={(value) =>
                            patternField.handleChange(value)
                          }
                        >
                          <SelectTrigger id={patternField.name}>
                            <SelectValue placeholder="Select a validation pattern..." />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PATTERN_DEFINITIONS).map(
                              ([key, def]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    {PATTERN_ICONS[key]}
                                    {def.label}
                                  </div>
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </Field>

                      {/* Custom Pattern Input */}
                      {selectedPattern === "custom" && (
                        <form.Field name="validation.customPattern">
                          {(customPatternField: FieldState) => {
                            return (
                              <Field>
                                <FieldContent>
                                  <FieldLabel htmlFor={customPatternField.name}>
                                    Regular Expression
                                  </FieldLabel>
                                </FieldContent>
                                <Input
                                  id={customPatternField.name}
                                  placeholder="e.g., ^[a-z]+$"
                                  value={
                                    customPatternField.state.value as string
                                  }
                                  onChange={(e) =>
                                    customPatternField.handleChange(
                                      e.target.value
                                    )
                                  }
                                />
                              </Field>
                            );
                          }}
                        </form.Field>
                      )}
                    </div>
                  );
                }}
              </form.Field>
            ) : null;
          }}
        </form.Field>
      </FieldSet>
    </>
  );
}
