import { z } from "zod";
import { Block } from "../../types";

import { scheduleTriggerSchema } from "../schemas/triggers/scheduleTriggerSchema";

export const ScheduleTrigger: Block<
  {},
  z.infer<typeof scheduleTriggerSchema>,
  { now: Date },
  { triggered: boolean; timestamp: string }
> = {
  id: "schedule.trigger",
  displayName: "Schedule Trigger",
  inputs: [],
  outputs: ["triggered", "timestamp"],
  configSchema: scheduleTriggerSchema,

  async run(_, config, context) {
    const { now } = context;

    return {
      triggered: true,
      timestamp: now.toISOString(),
    };
  },
  
};


module.exports = { ScheduleTrigger };