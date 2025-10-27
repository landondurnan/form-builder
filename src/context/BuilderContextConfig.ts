import { createContext, useContext } from "react";
import type { FormField } from "@/lib/types";

// ============================================================================
// STATE DEFINITION
// ============================================================================

export interface BuilderState {
  mode: "builder" | "import" | "export" | "preview";
  fields: FormField[];
  title: string;
  editingField: { field: FormField; index: number } | null;
  errors: {
    fieldsError: string | null;
    importError: string | null;
  };
  hasSavedForm: boolean;
}

// ============================================================================
// ACTION DEFINITIONS
// ============================================================================

export type BuilderAction =
  | { type: "SET_MODE"; payload: "builder" | "import" | "export" | "preview" }
  | { type: "SET_TITLE"; payload: string }
  | { type: "SET_FIELDS"; payload: FormField[] }
  | { type: "ADD_FIELD"; payload: FormField }
  | { type: "DELETE_FIELD"; payload: number }
  | { type: "MOVE_FIELD_UP"; payload: number }
  | { type: "MOVE_FIELD_DOWN"; payload: number }
  | { type: "START_EDIT"; payload: number }
  | { type: "CANCEL_EDIT" }
  | { type: "UPDATE_FIELD"; payload: { index: number; field: FormField } }
  | { type: "SET_FIELDS_ERROR"; payload: string | null }
  | { type: "SET_IMPORT_ERROR"; payload: string | null }
  | { type: "SET_SAVED_FORM"; payload: boolean }
  | { type: "RESET_FORM" }
  | { type: "INITIALIZE_FROM_STORAGE"; payload: BuilderState };

// ============================================================================
// CONTEXT TYPE & CONTEXT
// ============================================================================

export interface BuilderContextType {
  state: BuilderState;
  dispatch: (action: BuilderAction) => void;
}

export const BuilderContext = createContext<BuilderContextType | undefined>(
  undefined
);

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export function useBuilderContext() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilderContext must be used within a BuilderProvider");
  }
  return context;
}
