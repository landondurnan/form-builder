import { createContext } from "react";
import { type BuilderMode } from "@/lib/storageUtils";

export interface BuilderContextType {
  mode: BuilderMode;
  setMode: (mode: BuilderMode) => void;
}

export const BuilderContext = createContext<BuilderContextType | undefined>(
  undefined
);
