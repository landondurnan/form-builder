import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { BuilderProvider } from "@/context/BuilderContext";
import { ModeToggle } from "@/components/builder/ModeToggle";

const RootLayout = () => (
  <BuilderProvider>
    <div className="p-2 flex gap-2 justify-between items-center">
      <div className="flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/docs/forms" className="[&.active]:font-bold">
          Docs
        </Link>
      </div>
      <ModeToggle />
    </div>
    <hr />
    <Outlet />
    <TanStackRouterDevtools />
  </BuilderProvider>
);

export const Route = createRootRoute({ component: RootLayout });
