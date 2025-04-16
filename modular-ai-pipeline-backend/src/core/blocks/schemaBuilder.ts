import {
  ZodTypeAny,
  ZodObject,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodRawShape,
} from "zod";

type FieldType = "string" | "number" | "boolean" | "unknown";

interface FieldSchema {
  type: FieldType;
  required: boolean;
}

export function zodToFields(schema: ZodTypeAny): Record<string, FieldSchema> {
  const fields: Record<string, FieldSchema> = {};

  if (!(schema instanceof ZodObject)) return fields;

  const shape = (schema._def.shape() ?? {}) as ZodRawShape;

  for (const [key, def] of Object.entries(shape)) {
    const fieldSchema: FieldSchema = {
      type: getFieldType(def),
      required: !def.isOptional?.(), // safe check for optional fields
    };

    fields[key] = fieldSchema;
  }

  return fields;
}

function getFieldType(def: ZodTypeAny): FieldType {
  if (def instanceof ZodString) return "string";
  if (def instanceof ZodNumber) return "number";
  if (def instanceof ZodBoolean) return "boolean";
  return "unknown";
}
