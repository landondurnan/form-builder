import { useCallback, useEffect, useState } from "react";
import { useAppForm } from "@/components/form/hooks";
import type { FormField, FormDefinition } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AddFieldForm } from "./AddFieldForm";
import { FormBuilderFields } from "./FormBuilderFields";
import { FormImportMode } from "./FormImportMode";
import { FormExportMode } from "./FormExportMode";
import { storageManager } from "@/lib/storageUtils";
import { importJSONSchema } from "@/lib/schemaUtils";
import { Toggle } from "@/components/ui/toggle";
import { FileUp, FileDown, SquarePen } from "lucide-react";

export function Builder() {
  const [hasSavedForm, setHasSavedForm] = useState(false);
  const [fieldsError, setFieldsError] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [builderMode, setBuilderMode] = useState<
    "builder" | "import" | "export"
  >("builder");
  const [editingField, setEditingField] = useState<{
    field: FormField;
    index: number;
  } | null>(null);

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

  const handleDeleteField = useCallback(
    (index: number) => {
      const updatedFields = form.state.values.fields.filter(
        (_: FormField, i: number) => i !== index
      );
      form.setFieldValue("fields", updatedFields);

      // Clear editing state when field is deleted
      if (editingField && editingField.index === index) {
        setEditingField(null);
      }
    },
    [form, editingField]
  );

  const handleMoveFieldUp = useCallback(
    (index: number) => {
      if (index <= 0) return;

      const fields = [...form.state.values.fields];
      [fields[index - 1], fields[index]] = [fields[index], fields[index - 1]];
      form.setFieldValue("fields", fields);

      // Update editingField to track the moved field
      if (editingField && editingField.index === index) {
        setEditingField({ field: fields[index - 1], index: index - 1 });
      }
    },
    [form, editingField]
  );

  const handleMoveFieldDown = useCallback(
    (index: number) => {
      if (index >= form.state.values.fields.length - 1) return;
      const fields = [...form.state.values.fields];
      [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];
      form.setFieldValue("fields", fields);

      // Update editingField to track the moved field
      if (editingField && editingField.index === index) {
        setEditingField({ field: fields[index + 1], index: index + 1 });
      }
    },
    [form, editingField]
  );

  const handleEditField = useCallback(
    (index: number) => {
      const field = form.state.values.fields[index];
      setEditingField({ field, index });
    },
    [form]
  );

  const handleUpdateField = useCallback(
    (index: number, updatedField: FormField) => {
      const updatedFields = form.state.values.fields.map((field, i) =>
        i === index ? updatedField : field
      );
      form.setFieldValue("fields", updatedFields);
      setEditingField(null);
    },
    [form]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingField(null);
  }, []);

  const handleResetForm = useCallback(() => {
    storageManager.clearForm();
    setHasSavedForm(false);
    setFieldsError(null);
    form.reset();
  }, [form]);

  const handleImportSchema = useCallback(
    (jsonString: string) => {
      try {
        const { fields, title } = importJSONSchema(jsonString);

        // Update form values
        form.setFieldValue("title", title);
        form.setFieldValue("fields", fields);

        setImportError(null);
        setFieldsError(null);
        setBuilderMode("builder");
      } catch (error) {
        setImportError(
          error instanceof Error ? error.message : "Failed to parse JSON"
        );
      }
    },
    [form]
  );

  const handleModeToggle = useCallback(
    (mode: "import" | "export" | "builder") => {
      setBuilderMode(mode);
    },
    []
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Toggle
                pressed={builderMode === "import"}
                onPressedChange={() => handleModeToggle("import")}
                className={`data-[state=on]:bg-accent data-[state=on]:border-2 data-[state=on]:border-slate-700 ${
                  builderMode === "import" ? "text-slate-700" : ""
                }`}
              >
                <FileDown />
                Import
              </Toggle>
              {hasSavedForm && (
                <Toggle
                  pressed={builderMode === "export"}
                  onPressedChange={() => handleModeToggle("export")}
                  className={`data-[state=on]:bg-accent data-[state=on]:border-2 data-[state=on]:border-slate-700 ${
                    builderMode === "export" ? "text-slate-700" : ""
                  }`}
                >
                  <FileUp />
                  Export
                </Toggle>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Hide this toggle when already in builder mode */}
              {builderMode !== "builder" && (
                <Toggle
                  pressed={false}
                  onPressedChange={() => handleModeToggle("builder")}
                  className="data-[state=on]:bg-accent data-[state=on]:border-2 data-[state=on]:border-slate-700"
                >
                  <SquarePen />
                  Builder
                </Toggle>
              )}
              {builderMode === "builder" && (
                <>
                  {hasSavedForm && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleResetForm}
                    >
                      Reset
                    </Button>
                  )}
                  <Button type="button" onClick={() => form.handleSubmit()}>
                    Save Form
                  </Button>
                </>
              )}
            </div>
          </div>

          {builderMode === "builder" && (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FormBuilderFields
                form={form}
                fieldsError={fieldsError}
                onImportClick={() => handleModeToggle("import")}
                onEditField={handleEditField}
                editingFieldIndex={editingField?.index ?? null}
              />
            </form>
          )}

          {/* Builder/Import/Export Mode Content */}
          <div className="mt-6 space-y-4">
            {/* Export Mode */}
            {builderMode === "export" && (
              <FormExportMode
                title={form.state.values.title}
                fields={form.state.values.fields}
              />
            )}

            {/* Import Mode */}
            {builderMode === "import" && (
              <FormImportMode
                importError={importError}
                onImportSchema={handleImportSchema}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Field Form - Disabled with opacity when not in builder mode */}
      <div
        className={`bg-sidebar transition-opacity duration-200 ${
          builderMode === "builder"
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <AddFieldForm
          onAddField={handleAddField}
          onUpdateField={handleUpdateField}
          onCancel={handleCancelEdit}
          onDeleteField={handleDeleteField}
          onMoveFieldUp={handleMoveFieldUp}
          onMoveFieldDown={handleMoveFieldDown}
          editingField={editingField}
          totalFields={form.state.values.fields.length}
        />
      </div>
    </div>
  );
}
