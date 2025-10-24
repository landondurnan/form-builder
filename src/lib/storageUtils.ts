import type { FormDefinition } from "./types";

const FORM_BUILDER_KEY = "form-builder-data";
const BUILDER_MODE_KEY = "form-builder-mode";

export type BuilderMode = "builder" | "preview";

export interface StorageManager {
  saveForm: (form: FormDefinition) => void;
  getForm: () => FormDefinition | null;
  clearForm: () => void;
  saveMode: (mode: BuilderMode) => void;
  getMode: () => BuilderMode;
}

export const storageManager: StorageManager = {
  saveForm: (form: FormDefinition) => {
    try {
      localStorage.setItem(FORM_BUILDER_KEY, JSON.stringify(form));
    } catch (err) {
      console.error("Failed to save form to localStorage:", err);
    }
  },

  getForm: () => {
    try {
      const stored = localStorage.getItem(FORM_BUILDER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error("Failed to retrieve form from localStorage:", err);
      return null;
    }
  },

  clearForm: () => {
    try {
      localStorage.removeItem(FORM_BUILDER_KEY);
    } catch (err) {
      console.error("Failed to clear form from localStorage:", err);
    }
  },

  saveMode: (mode: BuilderMode) => {
    try {
      localStorage.setItem(BUILDER_MODE_KEY, mode);
    } catch (err) {
      console.error("Failed to save mode to localStorage:", err);
    }
  },

  getMode: (): BuilderMode => {
    try {
      const stored = localStorage.getItem(BUILDER_MODE_KEY);
      return (stored as BuilderMode) || "builder";
    } catch (err) {
      console.error("Failed to retrieve mode from localStorage:", err);
      return "builder";
    }
  },
};
