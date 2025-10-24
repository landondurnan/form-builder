import { useState } from "react";
import { useAppForm } from "../form/hooks";
import { buildFieldSchema } from "../../lib/formUtils";
import { FieldGroup } from "../ui/field";
import { Button } from "../ui/button";
import { SelectItem } from "../ui/select";
import { storageManager } from "../../lib/storageUtils";
import { FormInput } from "../form/FormInput";
import { FormTextarea } from "../form/FormTextarea";
import { FormSelect } from "../form/FormSelect";
import { FormCheckbox } from "../form/FormCheckbox";
import { FormRadio } from "../form/FormRadio";
import {
  buildFieldProps,
  FIELD_TYPE_COMPONENT_MAP,
  getSelectOptions,
} from "../../lib/fieldUtils";

export function FormPreview() {
  const [submittedData, setSubmittedData] = useState<Record<
    string,
    unknown
  > | null>(null);
  const savedForm = storageManager.getForm();

  // Initialize form hook first (always call hooks in same order)
  const form = useAppForm({
    defaultValues: {
      responses: {} as Record<string, unknown>,
    },
    onSubmit: async (values) => {
      // In preview mode, validate all fields before submitting
      let hasErrors = false;

      for (let index = 0; index < (savedForm?.fields?.length || 0); index++) {
        const field = savedForm!.fields[index];
        const fieldValue = values.value.responses[field.id];

        try {
          const fieldSchema = buildFieldSchema(field);
          await fieldSchema.parseAsync(fieldValue);
        } catch {
          hasErrors = true;
          // Mark field as touched so errors display
          form.setFieldMeta(`responses.${field.id}`, (prev) => ({
            ...prev,
            isTouched: true,
          }));
        }
      }

      // If there are errors, validation failed - don't submit
      if (hasErrors) {
        console.log("Form validation failed");
        return;
      }

      // Success - show preview of data that would be submitted
      console.log("Form Response Valid:", values.value);
      setSubmittedData(values.value.responses);
    },
  });

  // Show message if no form available
  if (!savedForm || !savedForm.fields || savedForm.fields.length === 0) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground border border-dashed border-border p-4 rounded-md text-center">
          No form available. Please build a form in builder mode first.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 p-8">
      {/* Form */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold mb-2">{savedForm.title}</h2>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="p-4 border rounded-md mb-4">
            {/* Form Fields */}
            <FieldGroup className="space-y-2">
              {savedForm.fields.map((formField, index) => {
                const fieldProps = buildFieldProps(formField);

                return (
                  <form.AppField
                    key={`${formField.id}-${index}`}
                    name={`responses.${formField.id}`}
                    validators={{
                      onBlur: ({ value }) => {
                        try {
                          const fieldSchema = buildFieldSchema(formField);
                          const result = fieldSchema.safeParse(value);
                          if (!result.success) {
                            return {
                              message: result.error.issues[0]?.message,
                            };
                          }
                          return undefined;
                        } catch {
                          return { message: "Invalid value" };
                        }
                      },
                    }}
                  >
                    {() => {
                      const componentName =
                        FIELD_TYPE_COMPONENT_MAP[formField.type];

                      // Use imported components directly - they use useFieldContext internally
                      switch (componentName) {
                        case "Input":
                          return <FormInput {...fieldProps} />;
                        case "Textarea":
                          return <FormTextarea {...fieldProps} />;
                        case "Select":
                          return (
                            <FormSelect {...fieldProps}>
                              {getSelectOptions(formField.options).map(
                                (option) => (
                                  <SelectItem
                                    key={option.key}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                )
                              )}
                            </FormSelect>
                          );
                        case "Checkbox":
                          return <FormCheckbox {...fieldProps} />;
                        case "Radio":
                          return (
                            <FormRadio
                              {...fieldProps}
                              options={
                                formField.options?.map((opt) => ({
                                  value: opt,
                                  label: opt,
                                })) || []
                              }
                            />
                          );
                        default:
                          return null;
                      }
                    }}
                  </form.AppField>
                );
              })}
            </FieldGroup>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>

      {/* Submission Preview Sidebar */}
      <div className="w-80 p-4 bg-slate-50 rounded-lg border">
        <h3 className="text-sm font-semibold mb-4">Preview: Data to Submit</h3>
        {submittedData ? (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mb-3">
              This is what would be sent to the server:
            </div>
            <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-96">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSubmittedData(null)}
            >
              Clear Preview
            </Button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Fill out the form and click "Validate Form" to see a preview of the
            data that would be submitted.
          </p>
        )}
      </div>
    </div>
  );
}
