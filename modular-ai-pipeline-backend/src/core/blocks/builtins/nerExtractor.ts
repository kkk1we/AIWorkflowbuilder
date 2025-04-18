import { z } from "zod";
import { callLLM, callLLMStream } from "../../../services/openai";
import { Block } from "../types";
import { nerExtractorSchema } from "./schemas/nerExtractorSchema";

export const nerExtractorBlock: Block<
  { input: string },
  z.infer<typeof nerExtractorSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "ner./.skill.extractor",
  displayName: "NER / Skill Extractor",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: nerExtractorSchema,

  async *run(input, config, context) {
    const renderedPrompt = config.prompt.replace("{{input}}", input.input);
    for await (const chunk of callLLMStream({
      model: config.model,
      prompt: renderedPrompt,
      temperature: config.temperature,
    })) {
      yield { output: chunk };
    }
    return { output: "" };
  },
};

module.exports = { nerExtractorBlock };
