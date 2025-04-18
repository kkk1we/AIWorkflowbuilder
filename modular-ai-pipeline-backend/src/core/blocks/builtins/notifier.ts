import { z } from "zod";

import { Block } from "../types";
import { notifierSchema } from "./schemas/notifierSchema";

export const notifierBlock: Block<
  { input: string },
  z.infer<typeof notifierSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "notifier",
  displayName: "Notifier",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: notifierSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.config.replace("{{input}}", input.input);
    yield { output: `Processed: ${input.input}` }; return { output: "Done" };
  },
};

module.exports = { notifierBlock };
