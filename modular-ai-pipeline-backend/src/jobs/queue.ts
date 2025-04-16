import { Queue } from "bullmq";
import { Redis } from "ioredis";

export const connection = new Redis();
export const workflowQueue = new Queue("workflow", { connection });