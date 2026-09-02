const CZ_NAME = "cz-cubics";
const DEFAULT_TYPES = require("../defaultTypes.json");
const DEFAULT_HEAD_FORMAT = "{emoji} {type}{scope}: {subject}";
const DEFAULT_SUBJECT_MAX_LENGTH = 100;
const POSSIBLE_CONFIG_FILES = [".czrc", "package.json"];

module.exports = {
  CZ_NAME,
  DEFAULT_TYPES,
  DEFAULT_HEAD_FORMAT,
  DEFAULT_SUBJECT_MAX_LENGTH,
  POSSIBLE_CONFIG_FILES,
};
