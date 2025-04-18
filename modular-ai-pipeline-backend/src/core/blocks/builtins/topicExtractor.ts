import { z } from "zod";
import { callLLM, callLLMStream } from "../../../services/openai";
import { Block } from "../types";
import { topicExtractorSchema } from "./schemas/topicExtractorSchema";

export const topicExtractorBlock: Block<
  { input: string },
  z.infer<typeof topicExtractorSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "topic.extractor",
  displayName: "Topic Extractor",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: topicExtractorSchema,

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

module.exports = { topicExtractorBlock };
