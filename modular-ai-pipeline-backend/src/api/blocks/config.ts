import express from "express";
import { blockRegistry } from "../../core/blocks";
import { zodToFields } from "../../core/blocks/schemaBuilder";

const router = express.Router();

router.get("/", (req, res) => {
  const configs = Object.entries(blockRegistry).map(([id, block]) => ({
    id,
    fields: zodToFields(block.configSchema)
  }));
  res.json(configs);
});

export default router;
