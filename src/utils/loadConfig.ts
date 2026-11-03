import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { findUp, findUpSync } from "find-up";
import type { CZCubicsConfig } from "../config.type";
import { CZ_NAME, POSSIBLE_CONFIG_FILES } from "./constants";
import validateConfig from "./validateConfig";

type ConfigFile = Record<string, unknown>;

function isRecord(value: unknown): value is ConfigFile {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractConfig(value: unknown): CZCubicsConfig | undefined {
  if (!isRecord(value) || !isRecord(value.config)) {
    return undefined;
  }
  const config = value.config[CZ_NAME];
  if (config === undefined || config === null || config === false) {
    return undefined;
  }
  validateConfig(config);
  return config;
}

function parseConfigText(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return undefined;
    }
    throw error;
  }
}

async function loadConfig(): Promise<CZCubicsConfig> {
  for (const filename of POSSIBLE_CONFIG_FILES) {
    const filepath = await findUp(filename);
    if (!filepath) {
      continue;
    }
    const text = await readFile(filepath, "utf8");
    const config = extractConfig(parseConfigText(text));
    if (config) {
      return config;
    }
  }
  return {};
}

function loadConfigSync(): CZCubicsConfig {
  for (const filename of POSSIBLE_CONFIG_FILES) {
    const filepath = findUpSync(filename);
    if (!filepath) {
      continue;
    }
    const text = readFileSync(filepath, "utf8");
    const config = extractConfig(parseConfigText(text));
    if (config) {
      return config;
    }
  }
  return {};
}

namespace loadConfig {
  export const sync = loadConfigSync;
}

export default loadConfig;
