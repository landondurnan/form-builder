import { SelectItem } from "../ui/select";
import { FieldGroup, FieldSeparator } from "../ui/field";
import { FieldError } from "../ui/field";
import type { FormField } from "../../lib/types";
import {
  buildFieldProps,
  FIELD_TYPE_COMPONENT_MAP,
  getSelectOptions,
} from "../../lib/fieldUtils";

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
                                getSelectOptions(formField.options).map(
                                  (option) => (
                                    <SelectItem
                                      key={option.key}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </SelectItem>
                                  )
                                )}
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
