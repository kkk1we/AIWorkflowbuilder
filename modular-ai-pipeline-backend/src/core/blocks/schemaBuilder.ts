import {
  ZodTypeAny,
  ZodObject,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodOptional,
  ZodDefault,
} from "zod";

function unwrapType(type: ZodTypeAny): ZodTypeAny {
  if (type instanceof ZodOptional || type instanceof ZodDefault) {
    return unwrapType(type._def.innerType); // recursively unwrap
  }
  return type;
}

export function zodToFields(schema: ZodTypeAny): Record<string, { type: string; required: boolean }> {
  const fields: Record<string, { type: string; required: boolean }> = {};

  if (!(schema instanceof ZodObject)) return fields;

  const shape = schema._def.shape(); // proper access

  for (const [key, def] of Object.entries(shape)) {
    const unwrapped = unwrapType(def as ZodTypeAny);

    const required = !(def instanceof ZodOptional || def instanceof ZodDefault);

    if (unwrapped instanceof ZodString) {
      fields[key] = { type: "string", required };
    } else if (unwrapped instanceof ZodNumber) {
      fields[key] = { type: "number", required };
    } else if (unwrapped instanceof ZodBoolean) {
      fields[key] = { type: "boolean", required };
    } else {
      fields[key] = { type: "unknown", required };
    }
  }

  return fields;
}
