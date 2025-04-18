import {z} from 'zod';

export const llmPromptSchema = z.object({
  model: z.string(),
  prompt: z.string(),
  temperature: z.number().optional().default(0.7),
  stream: z.boolean().optional().default(false),
});