// src/core/blocks/schemas/eventTriggerSchema.ts

import { z } from "zod";

export const eventTriggerSchema = z.object({
  eventName: z.string().min(1, "Event name is required"),
  filterKey: z.string().optional(),
  filterValue: z.string().optional(),
});
