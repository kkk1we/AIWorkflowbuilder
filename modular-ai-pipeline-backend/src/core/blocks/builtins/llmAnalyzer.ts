import { z } from "zod";
import { callLLM, callLLMStream } from "../../../services/openai";
import { Block } from "../types";
import { llmPromptSchema } from "./schemas/llmPromptSchema";

export const PromptBlock: Block<
  { input: string },
  z.infer<typeof llmPromptSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "llm.analyzer",
  displayName: "LLM Analyzer",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: llmPromptSchema,

  async *run(
    input: { input: string },
    config: z.infer<typeof llmPromptSchema>,
    context: { memory: Record<string, any> }
  ) {
    const renderedPrompt = config.prompt.replace("{{input}}", input.input);

    if (config.stream) {
      for await (const chunk of callLLMStream({
        model: config.model,
        prompt: renderedPrompt,
        temperature: config.temperature,
      })) {
        yield { output: chunk };
      }
      return { output: "" };
    } else {
      const result = await callLLM({
        model: config.model,
        prompt: renderedPrompt,
        temperature: config.temperature,
        stream: false,
      });

      return { output: typeof result === "string" ? result : "" };
    }
  },
};

module.exports = { PromptBlock };
