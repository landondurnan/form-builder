import { useCallback, useEffect, useState } from "react";
import { useAppForm } from "../form/hooks";
import type { FormField, FormDefinition } from "../../lib/types";
import { FieldGroup, FieldSeparator } from "../ui/field";
import { Button } from "../ui/button";
import { SelectItem } from "../ui/select";
import { AddFieldForm } from "./AddFieldForm";
import { storageManager } from "../../lib/storageUtils";
import { FieldError } from "../ui/field";

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
  const [hasSavedForm, setHasSavedForm] = useState(false);
  const [fieldsError, setFieldsError] = useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      title: "",
      fields: [] as FormField[],
    },
    onSubmit: async (values) => {
      // Validate that at least one field exists
      if (!values.value.fields || values.value.fields.length === 0) {
        setFieldsError("Add at least one field to save the form");
        return;
      }

      // In builder mode, just save the form definition to localStorage without validation
      const formData: FormDefinition = {
        title: values.value.title,
        fields: values.value.fields,
      };

      storageManager.saveForm(formData);
      setHasSavedForm(true);
      setFieldsError(null);

      console.log("Form saved to localStorage:", formData);
    },
  });

  // Load saved form data on component mount
  useEffect(() => {
    const savedForm = storageManager.getForm();
    if (savedForm) {
      form.setFieldValue("title", savedForm.title);
      form.setFieldValue("fields", savedForm.fields);
      setHasSavedForm(true);
    }
  }, [form]);

  const handleAddField = useCallback(
    (newField: FormField) => {
      form.setFieldValue("fields", [...form.state.values.fields, newField]);
      setFieldsError(null);
    },
    [form]
  );

  const handleResetForm = useCallback(() => {
    storageManager.clearForm();
    setHasSavedForm(false);
    setFieldsError(null);
    form.reset();
  }, [form]);

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
    <div className="flex h-full">
      <div className="flex-1 p-4">
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

            {/* Empty state when no form fields */}
            {form.state.values.fields.length === 0 && (
              <p className="text-muted-foreground border border-dashed border-border p-4 rounded-md text-center">
                No fields added yet. Start by adding a field.
              </p>
            )}

            {/* Form Fields */}
            <FieldGroup className="mb-6">
              {fieldsError && <FieldError>{fieldsError}</FieldError>}
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
          <div className="flex justify-between">
            {hasSavedForm && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleResetForm}
              >
                Reset Form
              </Button>
            )}
            <Button type="submit" className="ml-auto">
              Save Form
            </Button>
          </div>
        </form>
      </div>

      {/* Add Field Form */}
      <div className="bg-sidebar">
        <AddFieldForm onAddField={handleAddField} />
      </div>
    </div>
  );
}
