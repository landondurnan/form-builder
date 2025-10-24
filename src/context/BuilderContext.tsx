import { useState, type ReactNode } from "react";
import { storageManager, type BuilderMode } from "../lib/storageUtils";
import { BuilderContext } from "./BuilderContextConfig";

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<BuilderMode>(() =>
    storageManager.getMode()
  );

  const setMode = (newMode: BuilderMode) => {
    storageManager.saveMode(newMode);
    setModeState(newMode);
  };

  return (
    <BuilderContext.Provider value={{ mode, setMode }}>
      {children}
    </BuilderContext.Provider>
  );
}
