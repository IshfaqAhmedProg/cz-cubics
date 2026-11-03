import {
  DEFAULT_HEAD_FORMAT,
  DEFAULT_SUBJECT_MAX_LENGTH,
  DEFAULT_TYPES,
} from "./constants";
import loadConfig from "./loadConfig";
import type { ResolvedCZCubicsConfig } from "../config.type";

const defaultConfig: ResolvedCZCubicsConfig = {
  types: DEFAULT_TYPES,
  skipQuestions: [],
  subjectMaxLength: DEFAULT_SUBJECT_MAX_LENGTH,
  headFormat: DEFAULT_HEAD_FORMAT,
};

async function getConfig(): Promise<ResolvedCZCubicsConfig> {
  return {
    ...defaultConfig,
    ...(await loadConfig()),
  };
}

function getConfigSync(): ResolvedCZCubicsConfig {
  return {
    ...defaultConfig,
    ...loadConfig.sync(),
  };
}

namespace getConfig {
  export const sync = getConfigSync;
}

export default getConfig;
