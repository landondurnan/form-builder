import { useCallback, useState } from "react";
import { z } from "zod";
import { useAppForm } from "../form/hooks";
import type { FormField } from "../../lib/types";
import { buildFieldSchema } from "../../lib/formUtils";
import { FieldGroup, FieldSeparator } from "../ui/field";
import { Button } from "../ui/button";
import { SelectItem } from "../ui/select";
import { AddFieldForm } from "./AddFieldForm";

const INPUT_TYPES = ["text", "number", "date"];

const FIELD_TYPE_COMPONENT_MAP = {
  text: "Input",
  number: "Input",
  date: "Input",
  textarea: "Textarea",
  select: "Select",
  radio: "Radio",
  checkbox: "Checkbox",
} as const;

export function Builder() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const form = useAppForm({
    defaultValues: {
      title: "",
      fields: [] as FormField[],
    },
    onSubmit: async (values) => {
      // Validate all fields on submit
      const errors: Record<string, string> = {};

      for (let index = 0; index < values.value.fields.length; index++) {
        const field = values.value.fields[index];
        const fieldValue = field.defaultValue;

        try {
          const fieldSchema = buildFieldSchema(field);
          await fieldSchema.parseAsync(fieldValue);
        } catch (err) {
          if (err instanceof z.ZodError) {
            const errorMessage = err.issues[0]?.message;
            errors[`fields[${index}].defaultValue`] =
              errorMessage || "Invalid value";
          } else {
            errors[`fields[${index}].defaultValue`] = "Invalid value";
          }
        }
      }

      // If there are errors, store them and don't submit
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      // Clear errors on successful submit
      setFieldErrors({});
      console.log("Form Submitted:", values.value);
    },
  });

  const handleAddField = useCallback(
    (newField: FormField) => {
      form.setFieldValue("fields", [...form.state.values.fields, newField]);
    },
    [form]
  );

  const buildFieldProps = (formField: FormField) => {
    const isInputType = INPUT_TYPES.includes(formField.type);

    const baseProps = {
      label: formField.label,
      ...(formField.placeholder && {
        placeholder: formField.placeholder,
      }),
      ...(formField.description && {
        description: formField.description,
      }),
      ...(formField.required && { required: formField.required }),
      ...(formField.validation && { validation: formField.validation }),
    };

    if (isInputType) {
      return { ...baseProps, type: formField.type };
    }

    // FormRadio expects options prop
    if (formField.type === "radio" && formField.options) {
      return {
        ...baseProps,
        options: formField.options.map((opt) => ({
          value: opt,
          label: opt,
        })),
      };
    }

    // FormCheckbox expects options prop when multiple checkboxes
    if (formField.type === "checkbox" && formField.options) {
      return {
        ...baseProps,
        options: formField.options.map((opt) => ({
          value: opt,
          label: opt,
        })),
      };
    }

    return baseProps;
  };

  const renderSelectOptions = (options: string[] | undefined) => {
    if (!options) return null;
    return options.map((option) => (
      <SelectItem key={option} value={option}>
        {option}
      </SelectItem>
    ));
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 p-8">
        <h2 className="text-lg font-semibold">Form Builder</h2>
        <p className="text-muted-foreground mb-6">
          Build your own custom forms by adding and configuring fields below.
        </p>

        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="p-4 border rounded-md mb-4">
            {/* Form Title */}
            <FieldGroup>
              <form.AppField
                name="title"
                validators={{
                  onChange: ({ value }) => {
                    if (!value || value.trim().length === 0) {
                      return {
                        message: "Form title is required",
                      };
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <field.Input
                    label="Title"
                    placeholder="Untitled Form"
                    required
                  />
                )}
              </form.AppField>
            </FieldGroup>

            <FieldSeparator className="my-2" />

            {/* Form Fields */}
            <FieldGroup className="mb-6">
              <form.AppField name="fields" mode="array">
                {(arrayField) => (
                  <div className="space-y-4">
                    {arrayField.state.value.map((formField, index) => {
                      const componentName =
                        FIELD_TYPE_COMPONENT_MAP[formField.type];
                      const FieldComponent = (
                        arrayField as unknown as Record<
                          string,
                          React.ComponentType<Record<string, unknown>>
                        >
                      )[componentName];
                      if (!FieldComponent) return null;

                      const fieldProps = buildFieldProps(formField);

                      return (
                        <form.AppField
                          key={`${formField.id}-${index}`}
                          name={`fields[${index}].defaultValue`}
                        >
                          {(subField) => (
                            <FieldComponent
                              {...fieldProps}
                              value={subField.state.value}
                              externalError={
                                fieldErrors[`fields[${index}].defaultValue`]
                              }
                            >
                              {formField.type === "select" &&
                                renderSelectOptions(formField.options)}
                            </FieldComponent>
                          )}
                        </form.AppField>
                      );
                    })}
                  </div>
                )}
              </form.AppField>
            </FieldGroup>
          </div>
          <Button type="submit">Save Form</Button>
        </form>
      </div>

      {/* Add Field Form */}
      <div className="bg-sidebar">
        <AddFieldForm onAddField={handleAddField} />
      </div>
    </div>
  );
}
