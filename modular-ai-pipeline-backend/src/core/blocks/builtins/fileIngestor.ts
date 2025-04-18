import { z } from "zod";

import { Block } from "../types";
import { fileIngestorSchema } from "./schemas/fileIngestorSchema";

export const fileIngestorBlock: Block<
  { input: string },
  z.infer<typeof fileIngestorSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "fileIngestor",
  displayName: "File Ingestor",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: fileIngestorSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.prompt.replace("{{input}}", input.input);
    yield { output: `Processed: ${input.input}` }; return { output: "Done" };
  },
};

module.exports = { fileIngestorBlock };
