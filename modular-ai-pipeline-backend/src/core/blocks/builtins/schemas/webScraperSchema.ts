import { z } from "zod";

export const webScraperSchema = z.object({
  config: z.string()
});
