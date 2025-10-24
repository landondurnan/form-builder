import { Builder } from "@/components/builder/Builder";
import { FormPreview } from "@/components/builder/FormPreview";
import { useBuilderMode } from "@/context/useBuilderMode";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { mode } = useBuilderMode();

  return <>{mode === "builder" ? <Builder /> : <FormPreview />}</>;
}
