import type { FormField } from "../../lib/types";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import { AddFieldLabel } from "./AddFieldLabel";
import { AddFieldTypeSelector } from "./AddFieldTypeSelector";
import { AddFieldOptions } from "./AddFieldOptions";
import { AddFieldValidation } from "./AddFieldValidation";
import { addFieldSchema, buildFormField } from "../../lib/formUtils";

interface AddFieldFormProps {
  onAddField: (field: FormField) => void;
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

      const newField = buildFormField(validated.data);
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
      className="min-w-md mb-4 p-4 space-y-2"
    >
      <h3 className="font-medium">Add New Field</h3>

      {/* Basic Field Info */}
      <AddFieldLabel form={form} />

      {/* Field Type Selection */}
      <AddFieldTypeSelector form={form} />

      {/* Optional Field Properties */}
      <AddFieldOptions form={form} />

      {/* Validation */}
      <AddFieldValidation form={form} />

      <Button type="submit" className="w-full mt-6">
        Add Field
      </Button>
    </form>
  );
}
