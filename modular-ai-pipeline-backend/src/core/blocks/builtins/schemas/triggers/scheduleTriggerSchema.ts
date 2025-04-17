import { z } from "zod";

export const scheduleTriggerSchema = z.object({
  cron: z.string(), // e.g. "0 * * * *" for every hour
  timezone: z.string().default("UTC"),
  name: z.string().optional(), // Optional name to identify the task
});