import { z } from "zod";

import { Block } from "../types";
import { textSegmenterSchema } from "./schemas/textSegmenterSchema";

export const textSegmenterBlock: Block<
  { input: string },
  z.infer<typeof textSegmenterSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "textSegmenter",
  displayName: "Text Segmenter",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: textSegmenterSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.config.replace("{{input}}", input.input);
    yield { output: `Processed: ${input.input}` }; return { output: "Done" };
  },
};

module.exports = { textSegmenterBlock };
