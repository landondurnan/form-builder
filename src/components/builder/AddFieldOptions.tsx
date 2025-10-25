import type { FieldType } from "@/lib/types";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DEFAULT_VALUE_INPUT_TYPES,
  shouldShowPlaceholder,
  shouldUseOptionsForDefault,
  parseOptionsFromTextarea,
} from "@/lib/formUtils";
import type { FormType, FieldState } from "./types";

interface AddFieldOptionsProps {
  form: FormType;
}

export function AddFieldOptions({ form }: AddFieldOptionsProps) {
  return (
    <>
      <FieldSeparator className="my-1" />
      <FieldSet>
        <FieldLegend>Optional Properties</FieldLegend>
        <form.Field name="type">
          {(typeField: FieldState) => {
            return shouldShowPlaceholder(typeField.state.value as FieldType) ? (
              <form.Field name="placeholder">
                {(field: FieldState) => {
                  return (
                    <Field>
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>
                          Placeholder
                        </FieldLabel>
                      </FieldContent>
                      <Input
                        id={field.name}
                        type="text"
                        placeholder="e.g., Enter your name"
                        value={field.state.value as string}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </Field>
                  );
                }}
              </form.Field>
            ) : null;
          }}
        </form.Field>

        <form.Field name="defaultValue">
          {(field: FieldState) => {
            return (
              <form.Field name="type">
                {(typeField: FieldState) => {
                  return (
                    <Field>
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>
                          Default Value
                        </FieldLabel>
                      </FieldContent>
                      {shouldUseOptionsForDefault(
                        typeField.state.value as FieldType
                      ) ? (
                        <form.Field name="options">
                          {(optionsField: FieldState) => {
                            const options = parseOptionsFromTextarea(
                              optionsField.state.value as string
                            );
                            return (
                              <Select
                                value={field.state.value as string}
                                onValueChange={(value) =>
                                  field.handleChange(value)
                                }
                              >
                                <SelectTrigger
                                  className="w-full"
                                  id={field.name}
                                >
                                  <SelectValue placeholder="Select a default value" />
                                </SelectTrigger>
                                <SelectContent>
                                  {options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            );
                          }}
                        </form.Field>
                      ) : (
                        <Input
                          id={field.name}
                          type={
                            DEFAULT_VALUE_INPUT_TYPES[
                              typeField.state.value as FieldType
                            ] || "text"
                          }
                          placeholder="e.g., Default text"
                          value={field.state.value as string}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            );
          }}
        </form.Field>

        <form.Field name="description">
          {(field: FieldState) => {
            return (
              <Field>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Help Text</FieldLabel>
                </FieldContent>
                <Input
                  id={field.name}
                  type="text"
                  placeholder="e.g., Choose a unique username"
                  value={field.state.value as string}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </Field>
            );
          }}
        </form.Field>
      </FieldSet>
    </>
  );
}
