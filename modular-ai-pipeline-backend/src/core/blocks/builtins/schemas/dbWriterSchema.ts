import { z } from "zod";

export const dbWriterSchema = z.object({
  config: z.string()
});
