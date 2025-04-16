import express from "express";
import { blockRegistry } from "../../core/blocks";
import { z } from "zod";

const router = express.Router();

router.get("/", async (req, res) => {
  const results: any[] = [];

  for (const [id, block] of Object.entries(blockRegistry)) {
    try {
      // Provide generic mock config with fallback
      const mockConfig = block.configSchema.safeParse({
        model: "gpt-4o",
        prompt: "Say hi to {{input}}",
        temperature: 0.7,
        sheetId: "sheet123",
        webhookUrl: "https://slack.com/fake",
        valueToCheck: "Hello",
        conditionValue: "Hi",
        conditionType: "Contains Text",
      });

      if (!mockConfig.success) {
        results.push({
          id,
          status: "invalid_config",
          issues: mockConfig.error.issues,
        });
        continue;
      }

      const output = await block.run(
        { input: "Hello World" }, // You can customize per block
        mockConfig.data,
        { memory: {} }            // Generic execution context
      );

      results.push({ id, status: "ok", output });
    } catch (err: any) {
      results.push({
        id,
        status: "error",
        error: err.message || err.toString(),
      });
    }
  }

  res.json(results);
});

export default router;
