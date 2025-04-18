import { z } from "zod";

export const transcriberSchema = z.object({
  config: z.string()
});
