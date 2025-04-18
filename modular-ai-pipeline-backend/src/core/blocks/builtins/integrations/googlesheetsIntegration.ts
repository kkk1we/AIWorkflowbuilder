
import { z } from "zod";
import { Block } from "../../types";
import {
//slackintegrationSchema,
    googlesheetsSchema,
//   salesforceSchema,
//   mailchimpSchema,
} from "../schemas/integrations/googlesheetsSchema"; // adjust path


export const Googlesheets: Block<
  {},
  z.infer<typeof googlesheetsSchema>,
  {},
  { success: boolean }
> = {
  id: "google.sheets",
  displayName: "Google Sheets",
  inputs: [],
  outputs: ["success"],
  configSchema: googlesheetsSchema,

  async run(_, config, context) {
    const dummy = { success: true }; // Replace with Sheets API logic
    return { success: dummy.success };
  },
};

module.exports = {Googlesheets}