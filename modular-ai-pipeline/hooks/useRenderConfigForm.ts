import { zodToFields } from "@/core/blocks/schemaBuilder";
import { useState } from "react";

export function useRenderConfigForm(schema, config, onChange) {
  const fields = zodToFields(schema);

  return fields.map((field) => {
    const value = config[field.key] ?? "";

    switch (field.type) {
      case "string":
        return (
          <input
            key={field.key}
            type="text"
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
            placeholder={field.label}
          />
        );
      case "number":
        return (
          <input
            key={field.key}
            type="number"
            value={value}
            onChange={(e) => onChange(field.key, parseFloat(e.target.value))}
            min={field.min}
            max={field.max}
            placeholder={field.label}
          />
        );
      case "boolean":
        return (
          <label key={field.key}>
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(field.key, e.target.checked)}
            />
            {field.label}
          </label>
        );
      case "select":
        return (
          <select
            key={field.key}
            value={value}
            onChange={(e) => onChange(field.key, e.target.value)}
          >
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  });
}
