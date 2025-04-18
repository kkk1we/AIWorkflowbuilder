import { z } from "zod";

export const elsePathSchema = z.object({
  config: z.string()
});
