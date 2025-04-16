import express from "express";
import { workflowQueue } from "../../../jobs/queue";

const router = express.Router();

router.post("/:id/run", async (req, res) => {
  const { id } = req.params;
  const { nodes, edges, input, context } = req.body; // assume frontend sends these

  await workflowQueue.add("run", { nodes, edges, input, context });
  res.json({ success: true, message: "Workflow queued" });
});

export default router;