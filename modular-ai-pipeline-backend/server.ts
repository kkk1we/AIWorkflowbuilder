import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import blocksAvailable from "./src/api/blocks/available";
import blockConfigs from "./src/api/blocks/config";
import blockTestRoute from "./src/api/blocks/test";
import { logger } from "./src/utils/logger";

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors()); // allows frontend on a different port
app.use(express.json());

// Routes
app.use("/api/blocks/available", blocksAvailable);

app.use("/api/blocks/config", blockConfigs);

app.use("/api/blocks/test", blockTestRoute);
// Root health check
app.get("/", (_, res) => {
  res.send("ModularAI backend is running ✅");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// 500 handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
