import { z } from "zod";

import { Block } from "../types";
import { transcriberSchema } from "./schemas/transcriberSchema";

export const transcriberBlock: Block<
  { input: string },
  z.infer<typeof transcriberSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "transcriber",
  displayName: "Transcriber",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: transcriberSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.config.replace("{{input}}", input.input);
    yield { output: `Processed: ${input.input}` }; return { output: "Done" };
  },
};

module.exports = { transcriberBlock };
