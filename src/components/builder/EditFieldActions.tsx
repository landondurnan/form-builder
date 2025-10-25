import { Button } from "@/components/ui/button";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { FieldSeparator } from "@/components/ui/field";

interface EditFieldActionsProps {
  index: number;
  totalFields: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}

export function EditFieldActions({
  index,
  totalFields,
  onMoveUp,
  onMoveDown,
  onDelete,
}: EditFieldActionsProps) {
  const canMoveUp = index > 0;
  const canMoveDown = index < totalFields - 1;

  return (
    <div className="mt-6 space-y-3 pt-4 border-t">
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canMoveUp}
          onClick={onMoveUp}
          className="flex-1 gap-2"
        >
          <ChevronUp className="size-4" />
          Move Up
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canMoveDown}
          onClick={onMoveDown}
          className="flex-1 gap-2"
        >
          <ChevronDown className="size-4" />
          Move Down
        </Button>
      </div>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="w-full gap-2"
      >
        <Trash2 className="size-4" />
        Delete Field
      </Button>
      <FieldSeparator />
    </div>
  );
}
