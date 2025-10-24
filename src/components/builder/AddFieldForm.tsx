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
import { EditFieldActions } from "./EditFieldActions";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

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
      className="min-w-md mb-4 p-6 space-y-4"
    >
      <h3 className="font-medium">
        {isEditing ? "Edit Field" : "Add New Field"}
      </h3>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          {/* Basic Field Info */}
          <AddFieldLabel form={form} />

          {/* Field Type Selection */}
          <AddFieldTypeSelector form={form} />
        </TabsContent>

        <TabsContent value="options" className="space-y-4 mt-4">
          {/* Optional Field Properties */}
          <AddFieldOptions form={form} />
        </TabsContent>

        <TabsContent value="validation" className="space-y-4 mt-4">
          {/* Validation */}
          <AddFieldValidation form={form} />
        </TabsContent>
      </Tabs>

      {/* Field Actions - Only show when editing */}
      {isEditing && (
        <EditFieldActions
          index={editingField.index}
          totalFields={totalFields}
          onMoveUp={() => onMoveFieldUp?.(editingField.index)}
          onMoveDown={() => onMoveFieldDown?.(editingField.index)}
          onDelete={() => {
            onDeleteField?.(editingField.index);
            onCancel?.();
          }}
        />
      )}

      <div className="flex gap-2 mt-6">
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
        <Button type="submit" className="flex-1">
          {isEditing ? "Update Field" : "Add Field"}
        </Button>
      </div>
    </form>
  );
}
