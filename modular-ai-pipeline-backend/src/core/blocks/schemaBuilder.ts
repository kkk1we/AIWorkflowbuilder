import { ZodTypeAny } from "zod";

export function zodToFields(zodType: unknown): any {
  const z = zodType as ZodTypeAny; // 👈 Tell TS this is a Zod schema

  if ("_def" in z) {
    const def = z._def;

    switch (def.typeName) {
      case "ZodNumber":
        const typeInfo: any = { type: "number" };
        if (def.minValue !== undefined) typeInfo.min = def.minValue;
        if (def.maxValue !== undefined) typeInfo.max = def.maxValue;
        return typeInfo;

      case "ZodEnum":
        return {
          type: "select",
          options: def.values,
        };

      case "ZodString":
        return { type: "string" };

      case "ZodBoolean":
        return { type: "boolean" };

      // Add more cases as needed...
    }
  }

  return { type: "string" }; // fallback
}
