import { Builder } from "@/components/builder/Builder";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

/** */

function Index() {
  return (
    <main className="h-screen">
      <Builder />
    </main>
  );
}
