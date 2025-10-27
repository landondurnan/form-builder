import type { BuilderState, BuilderAction } from "./BuilderContextConfig";

/**
 * Initial state for the builder
 */
export function getInitialBuilderState(): BuilderState {
  return {
    mode: "builder",
    fields: [],
    title: "",
    editingField: null,
    errors: {
      fieldsError: null,
      importError: null,
    },
    hasSavedForm: false,
  };
}

/**
 * Reducer function to handle all builder state transitions
 */
export function builderReducer(
  state: BuilderState,
  action: BuilderAction
): BuilderState {
  switch (action.type) {
    // ========================================================================
    // MODE MANAGEMENT
    // ========================================================================
    case "SET_MODE":
      return {
        ...state,
        mode: action.payload,
      };

    // ========================================================================
    // FIELD OPERATIONS
    // ========================================================================
    case "SET_FIELDS":
      return {
        ...state,
        fields: action.payload,
      };

    case "SET_TITLE":
      return {
        ...state,
        title: action.payload,
      };

    case "ADD_FIELD": {
      return {
        ...state,
        fields: [...state.fields, action.payload],
        errors: {
          ...state.errors,
          fieldsError: null,
        },
      };
    }

    case "DELETE_FIELD": {
      const index = action.payload;
      const updatedFields = state.fields.filter((_, i) => i !== index);

      // Clear editing state if the deleted field was being edited
      const editingField =
        state.editingField && state.editingField.index === index
          ? null
          : state.editingField;

      return {
        ...state,
        fields: updatedFields,
        editingField,
      };
    }

    case "MOVE_FIELD_UP": {
      const index = action.payload;
      if (index <= 0) return state;

      const fields = [...state.fields];
      [fields[index - 1], fields[index]] = [fields[index], fields[index - 1]];

      // Update editingField to track the moved field
      const editingField =
        state.editingField && state.editingField.index === index
          ? { field: fields[index - 1], index: index - 1 }
          : state.editingField;

      return {
        ...state,
        fields,
        editingField,
      };
    }

    case "MOVE_FIELD_DOWN": {
      const index = action.payload;
      if (index >= state.fields.length - 1) return state;

      const fields = [...state.fields];
      [fields[index], fields[index + 1]] = [fields[index + 1], fields[index]];

      // Update editingField to track the moved field
      const editingField =
        state.editingField && state.editingField.index === index
          ? { field: fields[index + 1], index: index + 1 }
          : state.editingField;

      return {
        ...state,
        fields,
        editingField,
      };
    }

    // ========================================================================
    // EDITING OPERATIONS
    // ========================================================================
    case "START_EDIT": {
      const index = action.payload;
      const field = state.fields[index];
      if (!field) return state;

      return {
        ...state,
        editingField: { field, index },
      };
    }

    case "CANCEL_EDIT":
      return {
        ...state,
        editingField: null,
      };

    case "UPDATE_FIELD": {
      const { index, field: updatedField } = action.payload;
      const updatedFields = state.fields.map((field, i) =>
        i === index ? updatedField : field
      );

      return {
        ...state,
        fields: updatedFields,
        editingField: null,
      };
    }

    // ========================================================================
    // ERROR MANAGEMENT
    // ========================================================================
    case "SET_FIELDS_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          fieldsError: action.payload,
        },
      };

    case "SET_IMPORT_ERROR":
      return {
        ...state,
        errors: {
          ...state.errors,
          importError: action.payload,
        },
      };

    // ========================================================================
    // SAVE STATE
    // ========================================================================
    case "SET_SAVED_FORM":
      return {
        ...state,
        hasSavedForm: action.payload,
      };

    // ========================================================================
    // RESET
    // ========================================================================
    case "RESET_FORM":
      return {
        ...getInitialBuilderState(),
        mode: "builder",
      };

    // ========================================================================
    // INITIALIZATION (from storage)
    // ========================================================================
    case "INITIALIZE_FROM_STORAGE":
      return action.payload;

    default:
      return state;
  }
}
