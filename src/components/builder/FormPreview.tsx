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
import { toast } from "sonner";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FieldSeparator } from "../ui/field";

export function FormPreview() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [submittedData, setSubmittedData] = useState<Record<
    string,
    unknown
  > | null>(null);

  // Submission settings for testing
  const [simulateLatency, setSimulateLatency] = useState(false);
  const [latencyMs, setLatencyMs] = useState(1000);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [failureRate, setFailureRate] = useState(50);

  const savedForm = storageManager.getForm();

  // Initialize form hook first (always call hooks in same order)
  const form = useAppForm({
    defaultValues: {
      responses: {} as Record<string, unknown>,
    },
    onSubmit: async (values) => {
      setStatus("loading");

      // Check if form is valid by checking all field states
      let hasErrors = false;
      for (let index = 0; index < (savedForm?.fields?.length || 0); index++) {
        const field = savedForm!.fields[index];
        const fieldState = form.getFieldMeta(`responses.${field.name}`);

        // Mark field as touched so validators run
        form.setFieldMeta(`responses.${field.name}`, (prev) => ({
          ...prev,
          isTouched: true,
        }));

        // Check if field is invalid
        if (!fieldState?.isValid) {
          hasErrors = true;
        }
      }

      // If there are errors, validation failed - don't submit
      if (hasErrors) {
        console.log("Form validation failed");
        setStatus("error");
        toast.error("Please fix the validation errors");
        return;
      }

      // Simulate latency if enabled
      if (simulateLatency) {
        await new Promise((resolve) => setTimeout(resolve, latencyMs));
      }

      // Simulate failure if enabled
      if (simulateFailure) {
        const shouldFail = Math.random() * 100 < failureRate;
        if (shouldFail) {
          toast.error("Form submission failed due to a server error.");
          setStatus("error");
          return;
        }
      }

      // Success - show preview of data that would be submitted
      toast.success("Form submitted successfully!");
      setStatus("success");
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
                    name={`responses.${formField.name}`}
                    validators={{
                      onChange: ({ value }) => {
                        try {
                          const fieldSchema = buildFieldSchema(formField);
                          const result = fieldSchema.safeParse(value);
                          // Only return error if invalid, otherwise return undefined to clear
                          if (!result.success) {
                            return {
                              message: result.error.issues[0]?.message,
                            };
                          }
                          // Return undefined to clear the error
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
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
          >
            {status === "loading" && "Submitting..."}
            {status === "success" && "✓ Submitted"}
            {status !== "loading" && status !== "success" && "Submit"}
          </Button>
        </form>
      </div>

      {/* Sidebar with Settings and Preview */}
      <div className="w-96 space-y-4">
        {/* Submission Settings */}
        <div className="p-4 bg-slate-50 rounded-lg border">
          <h3 className="text-sm font-semibold mb-3">Submission Settings</h3>

          {/* Latency Settings */}
          <div className="space-y-2 mb-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="simulate-latency"
                checked={simulateLatency}
                onCheckedChange={(checked) =>
                  setSimulateLatency(checked === true)
                }
              />
              <Label
                htmlFor="simulate-latency"
                className="text-xs font-medium cursor-pointer"
              >
                Simulate Latency
              </Label>
            </div>
            {simulateLatency && (
              <div className="ml-6 space-y-1">
                <label className="text-xs text-muted-foreground">
                  Delay (ms): {latencyMs}
                </label>
                <Input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={latencyMs}
                  onChange={(e) => setLatencyMs(Number(e.target.value))}
                  className="w-full h-2"
                />
              </div>
            )}
          </div>

          <FieldSeparator className="my-1" />

          {/* Failure Settings */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="simulate-failure"
                checked={simulateFailure}
                onCheckedChange={(checked) =>
                  setSimulateFailure(checked === true)
                }
              />
              <Label
                htmlFor="simulate-failure"
                className="text-xs font-medium cursor-pointer"
              >
                Simulate Failures
              </Label>
            </div>
            {simulateFailure && (
              <div className="ml-6 space-y-1">
                <label className="text-xs text-muted-foreground">
                  Failure Rate: {failureRate}%
                </label>
                <Input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={failureRate}
                  onChange={(e) => setFailureRate(Number(e.target.value))}
                  className="w-full h-2"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submission Preview */}
        <div className="p-4 bg-slate-50 rounded-lg border">
          <h3 className="text-sm font-semibold mb-4">
            Preview: Data to Submit
          </h3>
          {status === "loading" && (
            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">
                Submitting form...
              </div>
              <div className="animate-pulse bg-gray-200 h-32 rounded" />
            </div>
          )}
          {status === "success" && submittedData && (
            <div className="space-y-3">
              <div className="text-xs font-medium text-green-600 bg-green-50 p-2 rounded">
                ✓ Form submitted successfully!
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                This is what was sent to the server:
              </div>
              <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-96">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubmittedData(null);
                  setStatus("idle");
                }}
              >
                Submit Another
              </Button>
            </div>
          )}
          {status === "error" && (
            <div className="space-y-3">
              <div className="text-xs font-medium text-red-600 bg-red-50 p-2 rounded">
                ✗ Submission failed. Please fix any errors and try again.
              </div>
            </div>
          )}
          {status === "idle" && !submittedData && (
            <p className="text-xs text-muted-foreground">
              Fill out the form and click Submit to see a preview of the data
              that would be submitted.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
