import { z } from "zod";

export const ocrExtractorSchema = z.object({
  config: z.string()
});
