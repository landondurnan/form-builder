import { z } from "zod";
import type { FormField, FieldType } from "../../lib/types";
import { useAppForm } from "../form/hooks";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "../ui/field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Asterisk, AsteriskIcon } from "lucide-react";
import { Toggle } from "../ui/toggle";

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
  options: z.string().optional().default(""),
  validation: z
    .object({
      minLength: z.coerce.number().min(0).optional().or(z.literal("")),
      maxLength: z.coerce.number().min(0).optional().or(z.literal("")),
      min: z.coerce.number().optional().or(z.literal("")),
      max: z.coerce.number().optional().or(z.literal("")),
    })
    .optional(),
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

const parseOptionsFromTextarea = (input: string): string[] => {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

const shouldShowOptionsField = (type: FieldType): boolean => {
  return ["select", "checkbox", "radio"].includes(type);
};

const shouldShowPlaceholder = (type: FieldType): boolean => {
  return !["checkbox", "radio"].includes(type);
};

const shouldUseOptionsForDefault = (type: FieldType): boolean => {
  return ["select", "checkbox", "radio"].includes(type);
};

const DEFAULT_VALUE_INPUT_TYPES: Partial<Record<FieldType, string>> = {
  number: "number",
  date: "date",
};

// Validation configuration per field type
const VALIDATION_CONFIG: Record<
  FieldType,
  {
    showValidation: boolean;
    inputType: "number" | "date";
    labels: { min: string; max: string };
  }
> = {
  text: {
    showValidation: true,
    inputType: "number",
    labels: { min: "Min Length", max: "Max Length" },
  },
  textarea: {
    showValidation: true,
    inputType: "number",
    labels: { min: "Min Length", max: "Max Length" },
  },
  number: {
    showValidation: true,
    inputType: "number",
    labels: { min: "Min Value", max: "Max Value" },
  },
  date: {
    showValidation: true,
    inputType: "date",
    labels: { min: "Min Date", max: "Max Date" },
  },
  select: {
    showValidation: false,
    inputType: "number",
    labels: { min: "", max: "" },
  },
  radio: {
    showValidation: false,
    inputType: "number",
    labels: { min: "", max: "" },
  },
  checkbox: {
    showValidation: false,
    inputType: "number",
    labels: { min: "", max: "" },
  },
};

// Validation input component
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

export function AddFieldForm({ onAddField }: AddFieldFormProps) {
  const form = useAppForm({
    defaultValues: {
      label: "",
      type: "text",
      placeholder: "",
      description: "",
      required: false,
      defaultValue: "",
      options: "Option 1\nOption 2",
      validation: {
        minLength: "",
        maxLength: "",
        min: "",
        max: "",
      },
    },
    onSubmit: async (formData) => {
      const validated = addFieldSchema.safeParse(formData.value);
      if (!validated.success) {
        return;
      }

      // Build validation object, only including non-empty values
      const validationRules: Record<string, number> = {};
      if (validated.data.validation?.minLength) {
        validationRules.minLength = validated.data.validation.minLength;
      }
      if (validated.data.validation?.maxLength) {
        validationRules.maxLength = validated.data.validation.maxLength;
      }
      if (validated.data.validation?.min) {
        validationRules.min = validated.data.validation.min;
      }
      if (validated.data.validation?.max) {
        validationRules.max = validated.data.validation.max;
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
        ...(validated.data.options &&
          shouldShowOptionsField(validated.data.type as FieldType) && {
            options: parseOptionsFromTextarea(validated.data.options),
          }),
        ...(Object.keys(validationRules).length > 0 && {
          validation: validationRules,
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
      className="min-w-md mb-4 p-6 space-y-4"
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
              <FieldLabel htmlFor={field.name}>
                Label <Asterisk className="size-4" />
              </FieldLabel>
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

      <form.Field name="type">
        {(typeField) =>
          shouldShowOptionsField(typeField.state.value as FieldType) ? (
            <form.Field name="options">
              {(field) => (
                <Field>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      Options <Asterisk className="size-4" />
                    </FieldLabel>
                  </FieldContent>
                  <Textarea
                    id={field.name}
                    placeholder="Enter one option per line"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="min-h-24"
                  />
                </Field>
              )}
            </form.Field>
          ) : null
        }
      </form.Field>

      {/* Optional Field Properties */}
      <FieldSeparator className="my-2" />
      <FieldSet>
        <FieldLegend>Optional Properties</FieldLegend>
        <form.Field name="type">
          {(typeField) =>
            shouldShowPlaceholder(typeField.state.value as FieldType) ? (
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
            ) : null
          }
        </form.Field>

        <form.Field name="defaultValue">
          {(field) => (
            <form.Field name="type">
              {(typeField) => (
                <Field>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Default Value</FieldLabel>
                  </FieldContent>
                  {shouldUseOptionsForDefault(
                    typeField.state.value as FieldType
                  ) ? (
                    <form.Field name="options">
                      {(optionsField) => {
                        const options = parseOptionsFromTextarea(
                          optionsField.state.value
                        );
                        return (
                          <Select
                            value={field.state.value}
                            onValueChange={(value) => field.handleChange(value)}
                          >
                            <SelectTrigger className="w-full" id={field.name}>
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
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  )}
                </Field>
              )}
            </form.Field>
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
                placeholder="e.g., Choose a unique username"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        </form.Field>
      </FieldSet>

      <FieldSeparator className="my-2" />

      <FieldSet>
        <FieldLegend>Validation</FieldLegend>
        <form.Field name="required">
          {(field) => (
            <Field>
              <Toggle
                aria-label="Toggle Required"
                variant="outline"
                id={field.name}
                pressed={field.state.value}
                onPressedChange={(pressed) => field.handleChange(pressed)}
                className="data-[state=on]:border-red-500 data-[state=on]:text-red-500 data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-red-500 data-[state=on]:*:[svg]:stroke-red-500"
              >
                <AsteriskIcon /> Required
              </Toggle>
            </Field>
          )}
        </form.Field>

        {/* Validation Rules - Min/Max */}
        <form.Field name="type">
          {(typeField) => {
            const fieldType = typeField.state.value as FieldType;
            const config = VALIDATION_CONFIG[fieldType];

            return config.showValidation ? (
              <div className="grid grid-cols-2 gap-4">
                {(["min", "max"] as const).map((minOrMax) => (
                  <form.Field key={minOrMax} name={`validation.${minOrMax}`}>
                    {(field) => (
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
                          onChange={field.handleChange}
                        />
                      </Field>
                    )}
                  </form.Field>
                ))}
              </div>
            ) : null;
          }}
        </form.Field>
      </FieldSet>

      <Button type="submit" className="w-full">
        Add Field
      </Button>
    </form>
  );
}
