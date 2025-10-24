import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { BuilderProvider } from "@/context/BuilderContext";
import { ModeToggle } from "@/components/builder/ModeToggle";

const RootLayout = () => (
  <BuilderProvider>
    <div className="flex flex-col h-screen">
      <header className="p-4 flex gap-2 justify-between items-center border-b">
        <h1 className="text-lg font-semibold">Custom Form Builder</h1>
        <ModeToggle />
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
    <TanStackRouterDevtools />
  </BuilderProvider>
);

export const Route = createRootRoute({ component: RootLayout });
