import express from "express";
import { blockRegistry } from "../../core/blocks";
import { zodToFields } from "../../core/blocks/schemaBuilder";

const router = express.Router();
console.log("🚀 test");

router.get("/", (req, res) => {
  const configs = Object.entries(blockRegistry).map(([id, block]) => ({
    id,
    fields: zodToFields(block.configSchema)
  }));
  console.log("🚀 Block config response:", configs);
  res.json(configs);
});

export default router;
