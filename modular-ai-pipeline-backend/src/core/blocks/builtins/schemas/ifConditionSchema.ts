import { z } from "zod";

export const ifConditionSchema = z.object({
  config: z.string()
});
