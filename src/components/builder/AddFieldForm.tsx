import { useState, useCallback } from "react";
import type { FormField, FieldType } from "../../lib/types";
import { Field, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AddFieldFormProps {
  onAddField: (field: FormField) => void;
}

// Constants
const FIELD_TYPES: FieldType[] = [
  "text",
  "textarea",
  "number",
  "select",
  "radio",
  "checkbox",
  "date",
];

// Utility functions
const generateId = () =>
  `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const labelToFieldName = (label: string) =>
  label
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

const getDefaultValue = (type: FieldType) => (type === "checkbox" ? false : "");

export function AddFieldForm({ onAddField }: AddFieldFormProps) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState<FieldType>("text");
  const [placeholder, setPlaceholder] = useState("");
  const [description, setDescription] = useState("");
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");

  const handleSubmit = useCallback(() => {
    if (!label.trim()) return;

    const newField: FormField = {
      id: generateId(),
      label,
      name: labelToFieldName(label),
      type,
      required,
      defaultValue: defaultValue || getDefaultValue(type),
      ...(placeholder && { placeholder }),
      ...(description && { description }),
    };

    onAddField(newField);

    // Reset form
    setLabel("");
    setType("text");
    setPlaceholder("");
    setDescription("");
    setRequired(false);
    setDefaultValue("");
  }, [
    label,
    type,
    placeholder,
    description,
    required,
    defaultValue,
    onAddField,
  ]);

  return (
    <div className="min-w-md mb-4 p-4 space-y-4">
      <h3 className="font-medium">Add New Field</h3>

      {/* Basic Field Info */}

      <Field>
        <FieldLabel>Label</FieldLabel>
        <Input
          type="text"
          placeholder="Enter field label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Type</FieldLabel>
        <Select
          value={type}
          onValueChange={(value) => setType(value as FieldType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select field type" />
          </SelectTrigger>
          <SelectContent>
            {FIELD_TYPES.map((fieldType) => (
              <SelectItem key={fieldType} value={fieldType}>
                {fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      {/* Optional Field Properties */}

      <Field>
        <FieldLabel>Placeholder</FieldLabel>
        <Input
          type="text"
          placeholder="e.g., Enter your name"
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
        />
      </Field>
      <Field>
        <FieldLabel>Default Value</FieldLabel>
        <Input
          type="text"
          placeholder="e.g., Default text"
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
        />
      </Field>

      {/* Help Text and Required */}

      <Field>
        <FieldLabel>Help Text</FieldLabel>
        <Input
          type="text"
          placeholder="e.g., This field is required"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Field>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
          className="rounded"
        />
        <span className="text-sm font-medium">Required</span>
      </label>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!label.trim()}
        className="w-full"
      >
        Add Field
      </Button>
    </div>
  );
}
