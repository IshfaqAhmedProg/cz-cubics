const types = require("../defaultTypes");
const loadConfig = require("./loadConfig");

/**
 * Prepares the config from czrc or package.json
 * @return {Promise<CZCubicsConfig>}
 */
async function getConfig() {
  const defaultHeadFormat = "{emoji} {type}{scope}: {subject}";
  const defaultConfig = {
    types,
    skipQuestions: [""],
    subjectMaxLength: 100,
    conventional: false,
  };
  const loadedConfig =
    (await loadConfig(".czrc")) || (await loadConfig("package.json")) || {};
  const config = {
    ...defaultConfig,
    headFormat: loadedConfig.headFormat ?? defaultHeadFormat,
    ...loadedConfig,
  };
  return config;
}

module.exports = getConfig;
