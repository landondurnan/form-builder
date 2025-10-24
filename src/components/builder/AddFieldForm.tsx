import type { FormField } from "../../lib/types";
import { useAppForm } from "../form/hooks";
import { Button } from "../ui/button";
import { AddFieldLabel } from "./AddFieldLabel";
import { AddFieldTypeSelector } from "./AddFieldTypeSelector";
import { AddFieldOptions } from "./AddFieldOptions";
import { AddFieldValidation } from "./AddFieldValidation";
import {
  addFieldSchema,
  buildFormField,
  fieldToFormData,
} from "../../lib/formUtils";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { FieldSeparator } from "../ui/field";

interface AddFieldFormProps {
  onAddField: (field: FormField) => void;
  onUpdateField?: (index: number, field: FormField) => void;
  onCancel?: () => void;
  onDeleteField?: (index: number) => void;
  onMoveFieldUp?: (index: number) => void;
  onMoveFieldDown?: (index: number) => void;
  editingField?: { field: FormField; index: number } | null;
  totalFields?: number;
}

export function AddFieldForm({
  onAddField,
  onUpdateField,
  onCancel,
  onDeleteField,
  onMoveFieldUp,
  onMoveFieldDown,
  editingField,
  totalFields = 0,
}: AddFieldFormProps) {
  const isEditing = !!editingField;
  const canMoveUp = isEditing && editingField.index > 0;
  const canMoveDown = isEditing && editingField.index < (totalFields ?? 0) - 1;

  const form = useAppForm({
    defaultValues: isEditing
      ? fieldToFormData(editingField.field)
      : {
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

      if (isEditing) {
        const updatedField = buildFormField(
          validated.data,
          editingField.field.id
        );
        onUpdateField?.(editingField.index, updatedField);
      } else {
        const newField = buildFormField(validated.data);
        onAddField(newField);
      }
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="min-w-md mb-4 p-6 space-y-2"
    >
      <h3 className="font-medium">
        {isEditing ? "Edit Field" : "Add New Field"}
      </h3>

      {/* Basic Field Info */}
      <AddFieldLabel form={form} />

      {/* Field Type Selection */}
      <AddFieldTypeSelector form={form} />

      {/* Optional Field Properties */}
      <AddFieldOptions form={form} />

      {/* Validation */}
      <AddFieldValidation form={form} />

      {/* Field Actions - Only show when editing */}
      {isEditing && (
        <div className="mt-6 space-y-3 pt-4 border-t">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canMoveUp}
              onClick={() => onMoveFieldUp?.(editingField.index)}
              className="flex-1 gap-2"
            >
              <ChevronUp className="size-4" />
              Move Up
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canMoveDown}
              onClick={() => onMoveFieldDown?.(editingField.index)}
              className="flex-1 gap-2"
            >
              <ChevronDown className="size-4" />
              Move Down
            </Button>
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              onDeleteField?.(editingField.index);
              onCancel?.();
            }}
            className="w-full gap-2"
          >
            <Trash2 className="size-4" />
            Delete Field
          </Button>
          <FieldSeparator />
        </div>
      )}

      <div className="flex gap-2 mt-6">
        <Button type="submit" className="flex-1">
          {isEditing ? "Update Field" : "Add Field"}
        </Button>
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onCancel?.();
            }}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
