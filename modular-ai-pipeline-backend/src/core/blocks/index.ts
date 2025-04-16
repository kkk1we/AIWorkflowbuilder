import fs from "fs";
import path from "path";
import { ZodTypeAny } from "zod";
import { logger } from "../../utils/logger";
import { Block } from "./types";

export const blockRegistry: Record<string, Block> = {};

function loadBlocksFromDir(dirPath: string) {
  const absDir = path.resolve(__dirname, dirPath);
  if (!fs.existsSync(absDir)) return;

  const files = fs
    .readdirSync(absDir)
    .filter((f) => f.endsWith(".ts") || f.endsWith(".js"));

  for (const file of files) {
    const fullPath = path.join(absDir, file);

    // NOTE: Dynamic import in CommonJS context
    const module = require(fullPath);

    Object.values(module).forEach((maybeBlock) => {
      const block = maybeBlock as Block;

      if (!block?.id || !block?.run || !block?.configSchema?.safeParse) {
        logger.warn(`⚠️ Skipping ${file}: missing id/run/configSchema`);
        return;
      }

      try {
        (block.configSchema as ZodTypeAny).parse({});
        blockRegistry[block.id] = block;
        logger.info(`✅ Registered block: ${block.id}`);
      } catch (err) {
        logger.warn(`❌ Invalid configSchema in ${block.id}: ${err}`);
      }
    });
  }
}

// Auto-load both builtins and external blocks
loadBlocksFromDir("./builtins");
loadBlocksFromDir("./external");
