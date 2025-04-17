import {z} from 'zod';

export const mailchimpSchema = z.object({
    apiKey: z.string(),
    audienceId: z.string(),
    email: z.string(),
    action: z.string(), // e.g., "subscribe", "unsubscribe"
  });