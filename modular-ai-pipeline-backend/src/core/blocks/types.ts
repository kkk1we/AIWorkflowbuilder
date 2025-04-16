import { ZodObject, ZodRawShape } from "zod";

export interface Block<I = any, C = any, CTX = any, O = any> {
  id: string;
  displayName?: string;
  configSchema: ZodObject<ZodRawShape>; // ✅ ensures it's an object schema
  inputs?: string[];
  outputs?: string[];
  run: (input: I, config: C, context: CTX) => Promise<O> | AsyncGenerator<any, O, unknown>;
}
