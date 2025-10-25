import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FieldActionsProps {
  isSelected: boolean;
  onSelect: () => void;
}

export function FieldActions({ isSelected, onSelect }: FieldActionsProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onSelect}
      className={`transition-colors ${
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
      }`}
      title="Click to edit this field"
    >
      <Edit2 className="size-4" />
    </Button>
  );
}
