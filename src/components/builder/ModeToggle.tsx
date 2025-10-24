import { useBuilderMode } from "@/context/useBuilderMode";
import { Button } from "../ui/button";

export function ModeToggle() {
  const { mode, setMode } = useBuilderMode();

  const toggleMode = () => {
    setMode(mode === "builder" ? "preview" : "builder");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleMode}
      className="capitalize"
    >
      {mode === "builder" ? "📝 Switch to Preview" : "⚙️ Switch to Builder"}
    </Button>
  );
}
