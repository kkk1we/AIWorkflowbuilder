import { z } from "zod";
import { callLLM, callLLMStream } from "../../../services/openai";
import { Block } from "../types";

// src/core/blocks/builtins/llmAnalyzer.ts (or similar)

const configSchema = z.object({
  model: z.string(),
  prompt: z.string(),
  temperature: z.number().optional().default(0.7),
  stream: z.boolean().optional().default(false),
});

export const PromptBlock: Block<
  { input: string },
  z.infer<typeof configSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "llm.analyzer", // matches frontend block ID
  displayName: "LLM Analyzer",
  inputs: ["input"],
  outputs: ["output"],
  configSchema,

  async *run(input, config, context) {
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

module.exports = { PromptBlock }; // for CommonJS
