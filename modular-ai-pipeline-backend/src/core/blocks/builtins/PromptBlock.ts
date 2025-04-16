import { z } from "zod";
import { callLLM, callLLMStream } from "../../../services/openai";
import { Block } from "../types";

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
  id: "llm.analyzer",
  displayName: "Prompt GPT",
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
      return { output: "" }; // ✅ satisfies return type
    } else {
      const result = await callLLM({
        model: config.model,
        prompt: renderedPrompt,
        temperature: config.temperature,
        stream: false,
      });

      // ✅ Explicitly ensure it's a string
      return { output: typeof result === "string" ? result : "" };
    }
  },
};
module.exports = { PromptBlock }; // for CommonJS
