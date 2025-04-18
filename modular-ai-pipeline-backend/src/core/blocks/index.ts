import fs from "fs";
import path from "path";
import { logger } from "../../utils/logger";
import { Block } from "./types";
import { ZodTypeAny } from "zod";
require("ts-node").register(); // enables .ts support in require()


export const blockRegistry: Record<string, Block> = {};

function loadBlocksFromDir(relativeDir: string) {
  const absDir = path.resolve(__dirname, relativeDir);
  logger.info(`🔍 Loading blocks from: ${absDir}`);

  if (!fs.existsSync(absDir)) {
    logger.warn(`❌ Directory does not exist: ${absDir}`);
    return;
  }

  const files = fs
    .readdirSync(absDir)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

  for (const file of files) {
    const fullPath = path.join(absDir, file);
    let module: Record<string, unknown>;

    try {
      module = require(fullPath);
    } catch (err) {
      logger.warn(`❌ Failed to load module ${file}: ${err}`);
      continue;
    }

    Object.entries(module).forEach(([exportName, maybeBlock]) => {
      const block = maybeBlock as Block;

      if (!block?.id || !block?.run || !block?.configSchema?.safeParse) {
        logger.warn(`⚠️ Skipping export "${exportName}" in ${file}: missing required properties`);
        return;
      }

      blockRegistry[block.id] = block;
      logger.info(`✅ Registered block: ${block.id}`);
    });
  }
}

// Auto-load block modules
loadBlocksFromDir("./builtins");
loadBlocksFromDir("./builtins/triggers");
loadBlocksFromDir("./builtins/integrations");


