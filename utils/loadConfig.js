const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);
const findUp = require("find-up");

/**
 * Loads the config from the nearest config file
 */
async function loadConfig(filename) {
  const _filename = await findUp(filename);
  try {
    const text = await readFile(_filename, "utf8");
    const obj = await JSON.parse(text);
    return obj && obj.config && obj.config["cz-cubics"];
  } catch {
    return null;
  }
}

module.exports = loadConfig;
