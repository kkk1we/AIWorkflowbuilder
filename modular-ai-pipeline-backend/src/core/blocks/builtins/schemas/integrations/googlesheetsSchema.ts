import {z} from 'zod';

export const googlesheetsSchema = z.object({
    spreadsheetId: z.string(),
    range: z.string(),
    values: z.string(), // JSON stringified 2D array (for flexibility)
  });