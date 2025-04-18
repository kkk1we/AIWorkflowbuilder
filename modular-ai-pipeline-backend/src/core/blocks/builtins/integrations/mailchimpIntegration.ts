import { z } from "zod";
import { Block } from "../../types";
import {
mailchimpSchema,
} from "../schemas/integrations/mailchimpSchema"; // adjust path


export const Mailchimp: Block<
  {},
  z.infer<typeof mailchimpSchema>,
  {},
  { result: string }
> = {
  id: "mailchimp",
  displayName: "Mailchimp",
  inputs: [],
  outputs: ["result"],
  configSchema: mailchimpSchema,

  async run(_, config, context) {
    const dummy = { result: `Email ${config.action}d successfully` }; // Replace with Mailchimp logic
    return { result: dummy.result };
  },
};
module.exports = {Mailchimp}