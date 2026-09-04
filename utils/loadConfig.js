const findUp = require("find-up");
const { CZ_NAME, POSSIBLE_CONFIG_FILES } = require("./constants");
const validateConfig = require("./validateConfig");
const { readFileSync } = require("fs");

/**
 * Loads the config from the nearest possible config file.
 * @returns {Promise<CZCubicsConfig|Object>}
 */
async function loadConfig() {
  for (const filename of POSSIBLE_CONFIG_FILES) {
    const filepath = await findUp(filename);
    if (!filepath) {
      continue;
    }
    try {
      const text = await readFile(filepath, "utf8");
      const obj = JSON.parse(text);
      const config = obj && obj.config && obj.config[CZ_NAME];

      if (config) {
        return validateConfig(config);
      }
    } catch {
      // Try the next possible config file.
    }
  }
  return {};
}
/**
 * Loads the config from the nearest possible config file.
 * @returns {Object}
 */
function loadConfigSync() {
  for (const filename of POSSIBLE_CONFIG_FILES) {
    const filepath = findUp.sync(filename);
    if (!filepath) {
      continue;
    }
    try {
      const text = readFileSync(filepath, "utf8");
      const obj = JSON.parse(text);
      const config = obj && obj.config && obj.config[CZ_NAME];

      if (config) {
        return validateConfig(config);
      }
    } catch {
      // Try the next possible config file.
    }
  }
  return {};
}

module.exports = loadConfig;
module.exports.sync = loadConfigSync;
