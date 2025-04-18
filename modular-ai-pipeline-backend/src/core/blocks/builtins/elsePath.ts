import { z } from "zod";

import { Block } from "../types";
import { elsePathSchema } from "./schemas/elsePathSchema";

export const elsePathBlock: Block<
  { input: string },
  z.infer<typeof elsePathSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "elsePath",
  displayName: "Else Path",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: elsePathSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.config.replace("{{input}}", input.input);
    yield { output: `Processed: ${input.input}` }; return { output: "Done" };
  },
};

module.exports = { elsePathBlock };
