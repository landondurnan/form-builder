import { z } from "zod";
import type { FormField, FieldType } from "../../lib/types";
import { useAppForm } from "../form/hooks";
import { Field, FieldContent, FieldError, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddFieldFormProps {
  onAddField: (field: FormField) => void;
}

// Constants
const FIELD_TYPES: FieldType[] = [
  "text",
  "textarea",
  "number",
  "select",
  "radio",
  "checkbox",
  "date",
];

// Validation Schema
const addFieldSchema = z.object({
  label: z.string().min(1, "Label is required"),
  type: z.enum(FIELD_TYPES),
  placeholder: z.string().optional().default(""),
  description: z.string().optional().default(""),
  required: z.boolean().default(false),
  defaultValue: z.string().optional().default(""),
});

// Utility functions
const generateId = () =>
  `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const labelToFieldName = (label: string) =>
  label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

const getDefaultValue = (type: FieldType) => (type === "checkbox" ? false : "");

export function AddFieldForm({ onAddField }: AddFieldFormProps) {
  const form = useAppForm({
    defaultValues: {
      label: "",
      type: "text",
      placeholder: "",
      description: "",
      required: false,
      defaultValue: "",
    },
    onSubmit: async (formData) => {
      const validated = addFieldSchema.safeParse(formData.value);
      if (!validated.success) {
        return;
      }

      const newField: FormField = {
        id: generateId(),
        label: validated.data.label,
        name: labelToFieldName(validated.data.label),
        type: validated.data.type as FieldType,
        required: validated.data.required,
        defaultValue:
          validated.data.defaultValue ||
          getDefaultValue(validated.data.type as FieldType),
        ...(validated.data.placeholder && {
          placeholder: validated.data.placeholder,
        }),
        ...(validated.data.description && {
          description: validated.data.description,
        }),
      };

      onAddField(newField);
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="min-w-md mb-4 p-4 space-y-4"
    >
      <h3 className="font-medium">Add New Field</h3>

      {/* Basic Field Info */}
      <form.Field
        name="label"
        validators={{
          onChange: ({ value }) => {
            if (!value || value.trim().length === 0) {
              return {
                message: "Label is required",
              };
            }
            return undefined;
          },
        }}
      >
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Label</FieldLabel>
              <Input
                id={field.name}
                type="text"
                placeholder="Enter field label"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
              {isInvalid && field.state.meta.errors && (
                <FieldError>{field.state.meta.errors?.[0]?.message}</FieldError>
              )}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="type">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Type</FieldLabel>
            </FieldContent>
            <Select
              value={field.state.value}
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
        )}
      </form.Field>

      {/* Optional Field Properties */}

      <form.Field name="placeholder">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Placeholder</FieldLabel>
            </FieldContent>
            <Input
              id={field.name}
              type="text"
              placeholder="e.g., Enter your name"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="defaultValue">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Default Value</FieldLabel>
            </FieldContent>
            <Input
              id={field.name}
              type="text"
              placeholder="e.g., Default text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      {/* Help Text and Required */}

      <form.Field name="description">
        {(field) => (
          <Field>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Help Text</FieldLabel>
            </FieldContent>
            <Input
              id={field.name}
              type="text"
              placeholder="e.g., This field is required"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </Field>
        )}
      </form.Field>

      <form.Field name="required">
        {(field) => (
          <Field>
            <div className="flex items-center gap-2">
              <Checkbox
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(!!checked)}
              />
              <FieldLabel htmlFor={field.name}>Required</FieldLabel>
            </div>
          </Field>
        )}
      </form.Field>

      <Button type="submit" className="w-full">
        Add Field
      </Button>
    </form>
  );
}
