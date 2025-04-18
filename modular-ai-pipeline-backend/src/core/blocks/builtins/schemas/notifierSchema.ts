import { z } from "zod";

export const notifierSchema = z.object({
  config: z.string()
});
