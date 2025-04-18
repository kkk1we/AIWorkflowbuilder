import { z } from "zod";

export const textSegmenterSchema = z.object({
  config: z.string()
});
