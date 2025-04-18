import express, { Request, Response } from "express";
import { blockRegistry } from "../../core/blocks";
import { zodToFields } from "../../core/blocks/schemaBuilder";
import { ZodTypeAny } from "zod";

const router = express.Router();
console.log("🚀 test");

router.get("/", (req: Request, res: Response) => {
  const configs = Object.entries(blockRegistry).map(([id, block]) => {
    // Add type assertion to tell TS this is a Zod schema
    const configSchema = block.configSchema as ZodTypeAny;

    return {
      id,
      fields: zodToFields(configSchema)
    };
  });

  console.log("🚀 Block config response:", configs);
  res.json(configs);
});

export default router;
