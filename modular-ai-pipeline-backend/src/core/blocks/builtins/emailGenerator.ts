import { z } from "zod";
import { callLLM, callLLMStream } from "../../../services/openai";
import { Block } from "../types";
import { emailGeneratorSchema } from "./schemas/emailGeneratorSchema";

export const emailGeneratorBlock: Block<
  { input: string },
  z.infer<typeof emailGeneratorSchema>,
  { memory: Record<string, any> },
  { output: string }
> = {
  id: "emailGenerator",
  displayName: "Email Generator",
  inputs: ["input"],
  outputs: ["output"],
  configSchema: emailGeneratorSchema,

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

module.exports = { emailGeneratorBlock };
