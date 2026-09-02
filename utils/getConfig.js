const {
  DEFAULT_TYPES,
  DEFAULT_HEAD_FORMAT,
  DEFAULT_SUBJECT_MAX_LENGTH,
} = require("./constants");
const loadConfig = require("./loadConfig");

/** @type {CZCubicsConfig} */
const defaultConfig = {
  types: DEFAULT_TYPES,
  skipQuestions: [""],
  subjectMaxLength: DEFAULT_SUBJECT_MAX_LENGTH,
  headFormat: DEFAULT_HEAD_FORMAT,
};

/**
 * Prepares the config from czrc or package.json
 * @return {Promise<CZCubicsConfig>}
 */
async function getConfig() {
  /** @type {CZCubicsConfig} */
  const loadedConfig = await loadConfig();
  return {
    ...defaultConfig,
    ...loadedConfig,
  };
}

module.exports = getConfig;
