import { useReducer, type ReactNode } from "react";
import { storageManager } from "@/lib/storageUtils";
import { BuilderContext } from "./BuilderContextConfig";
import { builderReducer, getInitialBuilderState } from "./builderReducer";
import type { BuilderAction } from "./BuilderContextConfig";

export function BuilderProvider({ children }: { children: ReactNode }) {
  // Initialize state from storage or get default state
  const [state, dispatch] = useReducer(builderReducer, undefined, () => {
    const savedForm = storageManager.getForm();
    const savedMode = storageManager.getMode();

    const initialState = getInitialBuilderState();

    if (savedForm) {
      initialState.title = savedForm.title;
      initialState.fields = savedForm.fields;
      initialState.hasSavedForm = true;
    }

    // Restore saved mode (builder or preview)
    if (savedMode === "preview") {
      initialState.mode = "preview";
    } else {
      // Default to "builder" mode (not "import" or "export" since those are temporary)
      initialState.mode = "builder";
    }

    return initialState;
  });

  // Override dispatch to intercept certain actions for side effects (like persisting mode)
  const persistingDispatch = (action: BuilderAction) => {
    // Persist mode changes to storage
    if (action.type === "SET_MODE") {
      if (action.payload === "builder" || action.payload === "preview") {
        storageManager.saveMode(action.payload);
      }
      // "import" and "export" are temporary UI states, not persisted
    }

    dispatch(action);
  };

  return (
    <BuilderContext.Provider value={{ state, dispatch: persistingDispatch }}>
      {children}
    </BuilderContext.Provider>
  );
}
