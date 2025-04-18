// src/core/blocks/builtins/eventTrigger.ts

import { z } from "zod";
import { Block } from "../../types";
import { eventTriggerSchema } from "../schemas/triggers/eventTriggerSchema";

export const EventTrigger: Block<
  {}, // No input needed for a trigger
  z.infer<typeof eventTriggerSchema>,
  { event: { name: string; payload: Record<string, any> } }, // Context includes the fired event
  { triggered: boolean; payload: Record<string, any> }
> = {
  id: "event.trigger",
  displayName: "Event Trigger",
  inputs: [],
  outputs: ["triggered", "payload"],
  configSchema: eventTriggerSchema,

  async run(_, config, context) {
    const { event } = context;

    // Basic match
    if (event.name !== config.eventName) {
      return { triggered: false, payload: {} };
    }

    // Optional filtering
    if (
      config.filterKey &&
      config.filterValue &&
      event.payload[config.filterKey] !== config.filterValue
    ) {
      return { triggered: false, payload: {} };
    }

    return {
      triggered: true,
      payload: event.payload,
    };
  },
};

module.exports = { EventTrigger };
