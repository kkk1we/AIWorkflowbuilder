import { z } from "zod";

import { Block } from "../types";
import { dbWriterSchema } from "./schemas/dbWriterSchema";

export const dbWriterBlock: Block<
  { input: string },
  z.infer<typeof dbWriterSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "dbWriter",
  displayName: "DB Writer",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: dbWriterSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.config.replace("{{input}}", input.input);
    yield { output: `Processed: ${input.input}` }; return { output: "Done" };
  },
};

module.exports = { dbWriterBlock };
