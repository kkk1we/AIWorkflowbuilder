import { z } from "zod";
import { callLLM, callLLMStream } from "../../../services/openai";
import { Block } from "../types";
import { summarizerSchema } from "./schemas/summarizerSchema";

export const summarizerBlock: Block<
  { input: string },
  z.infer<typeof summarizerSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "summarizer",
  displayName: "Summarizer",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: summarizerSchema,

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

module.exports = { summarizerBlock };
