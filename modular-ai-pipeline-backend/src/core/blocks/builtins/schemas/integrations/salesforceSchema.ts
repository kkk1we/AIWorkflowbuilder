import {z} from 'zod';

export const salesforceSchema = z.object({
    accessToken: z.string(),
    instanceUrl: z.string(),
    leadEmail: z.string(),
    leadName: z.string(),
  });