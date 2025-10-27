import { Builder } from "@/components/builder/Builder";
import { FormPreview } from "@/components/builder/FormPreview";
import { useBuilderContext } from "@/context/BuilderContextConfig";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { state } = useBuilderContext();

  // Show preview only if mode is exactly "preview", otherwise show builder
  // (builder can have internal modes: "builder", "import", "export")
  return <>{state.mode === "preview" ? <FormPreview /> : <Builder />}</>;
}
