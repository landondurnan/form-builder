import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Asterisk } from "lucide-react";
import type { FormType, AnyFieldState } from "./types";

interface AddFieldLabelProps {
  form: FormType;
}

export function AddFieldLabel({ form }: AddFieldLabelProps) {
  return (
    <form.Field
      name="label"
      validators={{
        onChange: ({ value }: { value: string }) => {
          if (!value || value.trim().length === 0) {
            return {
              message: "Label is required",
            };
          }
          return undefined;
        },
      }}
    >
      {(field: AnyFieldState) => {
        // Type guard to check if field has validation meta
        const isInvalid =
          "meta" in field.state
            ? field.state.meta.isTouched && !field.state.meta.isValid
            : false;
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>
              Label <Asterisk className="size-4" />
            </FieldLabel>
            <Input
              id={field.name}
              type="text"
              placeholder="Enter field label"
              value={field.state.value as string}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            {isInvalid && "meta" in field.state && field.state.meta.errors && (
              <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
            )}
          </Field>
        );
      }}
    </form.Field>
  );
}
