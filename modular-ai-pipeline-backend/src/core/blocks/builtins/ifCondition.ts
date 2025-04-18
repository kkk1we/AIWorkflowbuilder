import { z } from "zod";

import { Block } from "../types";
import { ifConditionSchema } from "./schemas/ifConditionSchema";

export const ifConditionBlock: Block<
  { input: string },
  z.infer<typeof ifConditionSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "ifCondition",
  displayName: "If Condition",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: ifConditionSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.config.replace("{{input}}", input.input);
    yield { output: `Processed: ${input.input}` }; return { output: "Done" };
  },
};

module.exports = { ifConditionBlock };
