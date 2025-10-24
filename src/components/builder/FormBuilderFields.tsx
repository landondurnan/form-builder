import { SelectItem } from "../ui/select";
import { FieldGroup, FieldSeparator } from "../ui/field";
import { FieldError } from "../ui/field";
import type { FormField } from "../../lib/types";

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

interface FormBuilderFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any; // Using any due to FormApi complex generics
  fieldsError: string | null;
  onImportClick: () => void;
}

export function FormBuilderFields({
  form,
  fieldsError,
  onImportClick,
}: FormBuilderFieldsProps) {
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

    if (formField.type === "radio" && formField.options) {
      return {
        ...baseProps,
        options: formField.options.map((opt) => ({
          value: opt,
          label: opt,
        })),
      };
    }

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
    <div className="p-4 border rounded-md mb-4">
      {/* Form Title */}
      <FieldGroup>
        <form.AppField
          name="title"
          validators={{
            onChange: ({ value }: { value: string }) => {
              if (!value || value.trim().length === 0) {
                return {
                  message: "Form title is required",
                };
              }
              return undefined;
            },
          }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(field: any) => (
            <field.Input label="Title" placeholder="Untitled Form" required />
          )}
        </form.AppField>
      </FieldGroup>

      <FieldSeparator className="my-2" />

      {/* Form Fields */}
      <FieldGroup className="mb-6">
        {fieldsError && <FieldError>{fieldsError}</FieldError>}
        <form.AppField name="fields" mode="array">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(arrayField: any) => (
            <>
              {/* Empty state when no form fields */}
              {arrayField.state.value.length === 0 && (
                <p className="text-muted-foreground border border-dashed border-border p-4 rounded-md text-center">
                  No fields added yet. Start by adding a field or{" "}
                  <a
                    className="text-blue-500 hover:underline cursor-pointer"
                    onClick={onImportClick}
                  >
                    importing
                  </a>{" "}
                  a schema.
                </p>
              )}

              {/* Render fields if any exist */}
              {arrayField.state.value.length > 0 && (
                <div className="space-y-4">
                  {arrayField.state.value.map(
                    (formField: FormField, index: number) => {
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
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(subField: any) => (
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
                    }
                  )}
                </div>
              )}
            </>
          )}
        </form.AppField>
      </FieldGroup>
    </div>
  );
}
