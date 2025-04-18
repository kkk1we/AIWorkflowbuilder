import { z } from "zod";

import { Block } from "../types";
import { ocrExtractorSchema } from "./schemas/ocrExtractorSchema";

export const ocrExtractorBlock: Block<
  { input: string },
  z.infer<typeof ocrExtractorSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "ocr./.pdf.extractor",
  displayName: "OCR / PDF Extractor",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: ocrExtractorSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.config.replace("{{input}}", input.input);
    yield { output: `Processed: ${input.input}` }; return { output: "Done" };
  },
};

module.exports = { ocrExtractorBlock };
