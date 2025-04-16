import { Worker } from "bullmq";
import { executeDAG } from "../core/engine/Executor";
import { connection } from "./queue";

export const workflowWorker = new Worker("workflow", async job => {
  const { nodes, edges, input, context } = job.data;
  return await executeDAG(nodes, edges, input, context);
}, { connection });
