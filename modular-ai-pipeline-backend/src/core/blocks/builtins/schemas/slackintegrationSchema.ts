
import { z } from "zod";

export const slackintegrationSchema = z.object({
  webhookUrl: z.string(),
  channel: z.string(),
  message: z.string(),
});