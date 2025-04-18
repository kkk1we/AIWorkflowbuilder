import { z } from "zod";

export const fileIngestorSchema = z.object({
  config: z.string()
});
