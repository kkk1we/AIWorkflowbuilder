import { z } from "zod";

import { Block } from "../types";
import { vectorMatcherSchema } from "./schemas/vectorMatcherSchema";

export const vectorMatcherBlock: Block<
  { input: string },
  z.infer<typeof vectorMatcherSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "vector.matcher",
  displayName: "Vector Matcher",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: vectorMatcherSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.config.replace("{{input}}", input.input);
    yield { output: `Processed: ${input.input}` }; return { output: "Done" };
  },
};

module.exports = { vectorMatcherBlock };
