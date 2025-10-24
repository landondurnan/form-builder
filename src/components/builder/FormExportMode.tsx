import { useCallback, useMemo } from "react";
import { Button } from "../ui/button";
import { exportFormAsJSONSchema } from "../../lib/schemaUtils";
import type { FormField } from "../../lib/types";

interface FormExportModeProps {
  title: string;
  fields: FormField[];
}

export function FormExportMode({ title, fields }: FormExportModeProps) {
  const formDef = useMemo(
    () => ({
      title,
      ...exportFormAsJSONSchema(fields),
    }),
    [title, fields]
  );

  const handleCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(formDef, null, 2));
  }, [formDef]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Form Definition</h3>
        <p className="text-xs text-muted-foreground mb-2">
          Complete form definition with title and validation schema
        </p>
        <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-auto max-h-96">
          {JSON.stringify(formDef, null, 2)}
        </pre>
      </div>
      <Button type="button" variant="outline" onClick={handleCopyToClipboard}>
        Copy Form Definition to Clipboard
      </Button>
    </div>
  );
}
