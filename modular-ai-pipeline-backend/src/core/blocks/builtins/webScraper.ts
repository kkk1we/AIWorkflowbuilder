import { z } from "zod";

import { Block } from "../types";
import { webScraperSchema } from "./schemas/webScraperSchema";

export const webScraperBlock: Block<
  { input: string },
  z.infer<typeof webScraperSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "webScraper",
  displayName: "Web Scraper",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: webScraperSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.config.replace("{{input}}", input.input);
    yield { output: `Processed: ${input.input}` }; return { output: "Done" };
  },
};

module.exports = { webScraperBlock };
