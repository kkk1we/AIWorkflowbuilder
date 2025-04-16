import express from "express";
import { blockRegistry } from "../../core/blocks";

const router = express.Router();

router.get("/", (req, res) => {
  const availableBlockIds = Object.keys(blockRegistry); // e.g. ["llm.prompt", "slack.send"]
  res.json(availableBlockIds);
});

export default router;
