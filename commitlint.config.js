const getConfig = require("./utils/getConfig");
const getParserOpts = require("./utils/getParserOpts");
const plugin = require("./utils/plugin");

const config = getConfig.sync();
const typeNames = config.types.map((t) => t.name);

/** @type {import("@commitlint/types").UserConfig} */
module.exports = {
  extends: [],
  parserPreset: {
    parserOpts: getParserOpts(config.headFormat),
  },
  rules: {
    "type-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "subject-case": [2, "always", "sentence-case"],
    "subject-max-length": [2, "always", config.subjectMaxLength],
    "type-enum": [2, "always", typeNames],
    "header-start-emoji": [2, "always"],
    "header-has-emoji": [0, "always"],
  },
  plugins: [plugin],
};
