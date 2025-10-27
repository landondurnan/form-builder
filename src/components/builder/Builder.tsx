import { useCallback, useEffect } from "react";
import { useAppForm } from "@/components/form/hooks";
import type { FormDefinition, FormField } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { AddFieldForm } from "./AddFieldForm";
import { FormBuilderFields } from "./FormBuilderFields";
import { FormImportMode } from "./FormImportMode";
import { FormExportMode } from "./FormExportMode";
import { storageManager } from "@/lib/storageUtils";
import { importJSONSchema } from "@/lib/schemaUtils";
import { Toggle } from "@/components/ui/toggle";
import { FileUp, FileDown, SquarePen } from "lucide-react";
import { useBuilderContext } from "@/context/BuilderContextConfig";

export function Builder() {
  const { state, dispatch } = useBuilderContext();
  const form = useAppForm({
    defaultValues: {
      title: state.title,
      fields: state.fields,
    },
    onSubmit: async (values) => {
      // Validate that at least one field exists
      if (!values.value.fields || values.value.fields.length === 0) {
        dispatch({
          type: "SET_FIELDS_ERROR",
          payload: "Add at least one field to save the form",
        });
        return;
      }

      // In builder mode, just save the form definition to localStorage without validation
      const formData: FormDefinition = {
        title: values.value.title,
        fields: values.value.fields,
      };

      storageManager.saveForm(formData);
      dispatch({ type: "SET_SAVED_FORM", payload: true });
      dispatch({ type: "SET_FIELDS_ERROR", payload: null });

      console.log("Form saved to localStorage:", formData);
    },
  });

  // Sync form state with context state
  useEffect(() => {
    form.setFieldValue("title", state.title);
    form.setFieldValue("fields", state.fields);
  }, [state.title, state.fields, form]);

  const handleAddField = useCallback(
    (newField: FormField) => {
      dispatch({ type: "ADD_FIELD", payload: newField });
      form.setFieldValue("fields", [...state.fields, newField]);
    },
    [dispatch, state.fields, form]
  );

  const handleDeleteField = (index: number) => {
    dispatch({ type: "DELETE_FIELD", payload: index });
  };

  const handleMoveFieldUp = (index: number) => {
    dispatch({ type: "MOVE_FIELD_UP", payload: index });
  };

  const handleMoveFieldDown = (index: number) => {
    dispatch({ type: "MOVE_FIELD_DOWN", payload: index });
  };

  const handleEditField = (index: number) => {
    dispatch({ type: "START_EDIT", payload: index });
  };

  const handleUpdateField = (index: number, updatedField: FormField) => {
    dispatch({
      type: "UPDATE_FIELD",
      payload: { index, field: updatedField },
    });
  };

  const handleCancelEdit = () => {
    dispatch({ type: "CANCEL_EDIT" });
  };

  const handleResetForm = useCallback(() => {
    storageManager.clearForm();
    dispatch({ type: "RESET_FORM" });
    form.reset();
  }, [dispatch, form]);

  const handleImportSchema = (jsonString: string) => {
    try {
      const { fields, title } = importJSONSchema(jsonString);

      dispatch({ type: "SET_TITLE", payload: title });
      dispatch({ type: "SET_FIELDS", payload: fields });
      dispatch({ type: "SET_IMPORT_ERROR", payload: null });
      dispatch({ type: "SET_FIELDS_ERROR", payload: null });
      dispatch({ type: "SET_MODE", payload: "builder" });
    } catch (error) {
      dispatch({
        type: "SET_IMPORT_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to parse JSON",
      });
    }
  };

  const handleModeToggle = (mode: "import" | "export" | "builder") => {
    dispatch({ type: "SET_MODE", payload: mode });
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Toggle
                pressed={state.mode === "import"}
                onPressedChange={() => handleModeToggle("import")}
                className={`data-[state=on]:bg-accent data-[state=on]:border-2 data-[state=on]:border-slate-700 ${
                  state.mode === "import" ? "text-slate-700" : ""
                }`}
              >
                <FileDown />
                Import
              </Toggle>
              {state.hasSavedForm && (
                <Toggle
                  pressed={state.mode === "export"}
                  onPressedChange={() => handleModeToggle("export")}
                  className={`data-[state=on]:bg-accent data-[state=on]:border-2 data-[state=on]:border-slate-700 ${
                    state.mode === "export" ? "text-slate-700" : ""
                  }`}
                >
                  <FileUp />
                  Export
                </Toggle>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Hide this toggle when already in builder mode */}
              {state.mode !== "builder" && (
                <Toggle
                  pressed={false}
                  onPressedChange={() => handleModeToggle("builder")}
                  className="data-[state=on]:bg-accent data-[state=on]:border-2 data-[state=on]:border-slate-700"
                >
                  <SquarePen />
                  Builder
                </Toggle>
              )}
              {state.mode === "builder" && (
                <>
                  {state.hasSavedForm && (
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

          {state.mode === "builder" && (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FormBuilderFields
                form={form}
                fieldsError={state.errors.fieldsError}
                onImportClick={() => handleModeToggle("import")}
                onEditField={handleEditField}
                editingFieldIndex={state.editingField?.index ?? null}
              />
            </form>
          )}

          {/* Builder/Import/Export Mode Content */}
          <div className="mt-6 space-y-4">
            {/* Export Mode */}
            {state.mode === "export" && (
              <FormExportMode title={state.title} fields={state.fields} />
            )}

            {/* Import Mode */}
            {state.mode === "import" && (
              <FormImportMode
                importError={state.errors.importError}
                onImportSchema={handleImportSchema}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add Field Form - Disabled with opacity when not in builder mode */}
      <div
        className={`bg-sidebar transition-opacity duration-200 ${
          state.mode === "builder"
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
          editingField={state.editingField}
          totalFields={state.fields.length}
        />
      </div>
    </div>
  );
}
