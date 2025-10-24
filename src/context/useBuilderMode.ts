import { useContext } from "react";
import { BuilderContext } from "./BuilderContextConfig";

export function useBuilderMode() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilderMode must be used within BuilderProvider");
  }
  return context;
}
