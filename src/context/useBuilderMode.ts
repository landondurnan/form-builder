import { useBuilderContext } from "./BuilderContextConfig";

export function useBuilderMode() {
  const { state, dispatch } = useBuilderContext();

  // For backward compatibility, expose mode and setMode
  // Map the state mode to the app-level mode (builder vs preview)
  const mode = state.mode === "preview" ? "preview" : "builder";

  const setMode = (newMode: "builder" | "preview") => {
    dispatch({ type: "SET_MODE", payload: newMode });
  };

  return { mode, setMode };
}
