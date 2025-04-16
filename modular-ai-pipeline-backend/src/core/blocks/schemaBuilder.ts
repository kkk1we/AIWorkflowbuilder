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

export function zodToFields(schema: ZodTypeAny) {
  const fields: Record<string, any> = {};

  if (!(schema instanceof ZodObject)) return fields;

  const shape = schema.shape;

  for (const [key, rawDef] of Object.entries(shape)) {
    const def = rawDef as ZodTypeAny;
    const unwrapped = unwrapType(def);

    const base: any = {
      required: !def.isOptional?.(), // whether the outer type is optional
    };

    if (unwrapped instanceof ZodString) {
      fields[key] = { type: "string", ...base };
    } else if (unwrapped instanceof ZodNumber) {
      fields[key] = { type: "number", ...base };
    } else if (unwrapped instanceof ZodBoolean) {
      fields[key] = { type: "boolean", ...base };
    } else {
      fields[key] = { type: "unknown", ...base };
    }
  }

  return fields;
}
