import { SelectItem } from "@/components/ui/select";
import { FieldGroup, FieldSeparator } from "@/components/ui/field";
import { FieldError } from "@/components/ui/field";
import type { FormField } from "@/lib/types";
import {
  buildFieldProps,
  FIELD_TYPE_COMPONENT_MAP,
  getSelectOptions,
} from "@/lib/fieldUtils";

interface FormBuilderFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: any; // Using any due to FormApi complex generics
  fieldsError: string | null;
  onImportClick: () => void;
  onEditField?: (index: number) => void;
  editingFieldIndex?: number | null;
}

export function FormBuilderFields({
  form,
  fieldsError,
  onImportClick,
  onEditField = () => {},
  editingFieldIndex = null,
}: FormBuilderFieldsProps) {
  return (
    <div className="p-2 border rounded-md mb-4">
      {/* Form Title */}
      <FieldGroup className="p-2">
        <form.AppField
          name="title"
          validators={{
            onBlur: ({ value }: { value: string }) => {
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

      <FieldSeparator className="my-2 mx-2" />

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
                <div className="space-y-1">
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
                        <button
                          key={`${formField.id}-${index}`}
                          onClick={() => onEditField(index)}
                          className={`group w-full px-2 py-2 text-left cursor-pointer transition-colors rounded-md ${
                            editingFieldIndex === index
                              ? "bg-blue-50/70 outline-2 outline-blue-300 outline-dashed"
                              : "hover:bg-blue-50/50"
                          }`}
                          title="Click to edit this field"
                          type="button"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <form.AppField
                              name={`fields[${index}].defaultValue`}
                            >
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              {(subField: any) => (
                                <FieldComponent
                                  {...fieldProps}
                                  value={subField.state.value}
                                  disabled={editingFieldIndex !== index}
                                  readOnly
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
                          </div>
                        </button>
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
