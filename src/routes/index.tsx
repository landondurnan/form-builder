import { Builder } from "@/components/builder/Builder";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

/** */

function Index() {
  return (
    <main className="p-8">
      <Builder />
    </main>
  );
}
