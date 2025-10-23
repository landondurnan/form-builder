import { Field, FieldContent, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Asterisk } from "lucide-react";
import { FIELD_TYPES, shouldShowOptionsField } from "../../lib/formUtils";
import type { FieldType } from "../../lib/types";
import type { FormType, FieldState } from "./types";

interface AddFieldTypeSelectorProps {
  form: FormType;
}

export function AddFieldTypeSelector({ form }: AddFieldTypeSelectorProps) {
  return (
    <>
      <form.Field name="type">
        {(field: FieldState) => {
          return (
            <Field>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Type</FieldLabel>
              </FieldContent>
              <Select
                value={field.state.value as string}
                onValueChange={(value) => field.handleChange(value)}
              >
                <SelectTrigger className="w-full" id={field.name}>
                  <SelectValue placeholder="Select field type" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((fieldType) => (
                    <SelectItem key={fieldType} value={fieldType}>
                      {fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="type">
        {(typeField: FieldState) => {
          if (!shouldShowOptionsField(typeField.state.value as FieldType)) {
            return null;
          }

          return (
            <form.Field name="options">
              {(field: FieldState) => {
                return (
                  <Field>
                    <FieldContent>
                      <FieldLabel htmlFor={field.name}>
                        Options <Asterisk className="size-4" />
                      </FieldLabel>
                    </FieldContent>
                    <Textarea
                      id={field.name}
                      placeholder="Enter one option per line"
                      value={field.state.value as string}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="min-h-24"
                    />
                  </Field>
                );
              }}
            </form.Field>
          );
        }}
      </form.Field>
    </>
  );
}
