import { useCallback } from "react";
import { useAppForm } from "../form/hooks";
import { formSchema } from "../../lib/types";
import type { FormField } from "../../lib/types";
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
  radio: "Select",
  checkbox: "Checkbox",
} as const;

export function Builder() {
  const form = useAppForm({
    defaultValues: {
      title: "",
      fields: [] as FormField[],
    },
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
    },
    validators: {
      onChangeAsync: async ({ value }) => {
        try {
          await formSchema.parseAsync(value);
        } catch (err) {
          return err;
        }
      },
    },
  });

  const handleAddField = useCallback(
    (newField: FormField) => {
      form.setFieldValue("fields", [...form.state.values.fields, newField]);
    },
    [form]
  );

  return (
    <div>
      <h2 className="text-lg font-semibold">Form Builder</h2>
      <p className="text-muted-foreground mb-6">
        Build your own custom forms by adding and configuring fields below.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="p-4 border rounded-md"
      >
        {/* Form Title */}
        <FieldGroup>
          <form.AppField name="title">
            {(field) => (
              <field.Input label="Title" placeholder="Untitled Form" />
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
                      React.ComponentType<{
                        label: string;
                        placeholder?: string;
                        type?: string;
                        value: string | number | boolean | undefined;
                        children?: React.ReactNode;
                      }>
                    >
                  )[componentName];
                  if (!FieldComponent) return null;

                  const isInputType = INPUT_TYPES.includes(formField.type);
                  const needsOptions =
                    formField.type === "select" || formField.type === "radio";

                  const fieldProps = {
                    label: formField.label,
                    ...(formField.placeholder && {
                      placeholder: formField.placeholder,
                    }),
                    ...(formField.description && {
                      description: formField.description,
                    }),
                    ...(isInputType && { type: formField.type }),
                  };

                  return (
                    <form.AppField
                      key={`${formField.id}-${index}`}
                      name={`fields[${index}].defaultValue`}
                    >
                      {(subField) => (
                        <FieldComponent
                          {...fieldProps}
                          value={subField.state.value}
                        >
                          {needsOptions &&
                            formField.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                        </FieldComponent>
                      )}
                    </form.AppField>
                  );
                })}
              </div>
            )}
          </form.AppField>
        </FieldGroup>

        <FieldSeparator className="my-2" />

        {/* Add New Field Form */}
        <AddFieldForm onAddField={handleAddField} />

        <FieldSeparator className="my-2" />

        <Button type="submit">Save Form</Button>
      </form>
    </div>
  );
}
