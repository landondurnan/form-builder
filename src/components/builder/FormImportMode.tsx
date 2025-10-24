import { useCallback, useRef } from "react";
import { Button } from "../ui/button";
import { FieldError } from "../ui/field";
import { Field, FieldLabel, FieldDescription } from "../ui/field";
import { Textarea } from "../ui/textarea";

interface FormImportModeProps {
  importError: string | null;
  onImportSchema: (jsonString: string) => void;
}

export function FormImportMode({
  importError,
  onImportSchema,
}: FormImportModeProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInsertSampleSchema = useCallback(() => {
    const sampleSchema = {
      title: "Basic Contact Form",
      $schema: "https://json-schema.org/draft/2020-12/schema",
      type: "object",
      properties: {
        firstName: { type: "string", title: "First Name" },
        lastName: { type: "string", title: "Last Name" },
        email: {
          type: "string",
          title: "Email Address",
        },
        phone: {
          type: "string",
          title: "Phone Number",
        },
        message: {
          type: "string",
          title: "Message",
        },
      },
      required: ["firstName", "lastName", "email"],
      additionalProperties: false,
    };
    if (textareaRef.current) {
      textareaRef.current.value = JSON.stringify(sampleSchema, null, 2);
    }
  }, []);

  const handleImportClick = useCallback(() => {
    if (textareaRef.current?.value) {
      onImportSchema(textareaRef.current.value);
      textareaRef.current.value = "";
    }
  }, [onImportSchema]);

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel>Paste JSON Schema</FieldLabel>
        <FieldDescription>
          Paste a valid JSON Schema to import form structure, or use the sample
          schema above to try it out
        </FieldDescription>
        <Textarea
          ref={textareaRef}
          placeholder="Paste your JSON Schema here..."
          className="h-64 text-xs font-mono"
        />
      </Field>
      {importError && <FieldError>{importError}</FieldError>}
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleInsertSampleSchema}
        >
          Insert Sample Schema
        </Button>
        <Button type="button" onClick={handleImportClick}>
          Import Schema
        </Button>
      </div>
    </div>
  );
}
