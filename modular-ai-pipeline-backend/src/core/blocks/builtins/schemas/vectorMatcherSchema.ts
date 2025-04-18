import { z } from "zod";

export const vectorMatcherSchema = z.object({
  config: z.string()
});
