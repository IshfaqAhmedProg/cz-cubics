import type { UserConfig } from "@commitlint/types";
import getConfig from "./utils/getConfig";
import getParserOpts from "./utils/getParserOpts";
import plugin from "./utils/plugin";

const config = getConfig.sync();
const typeNames = config.types.map((t) => t.name);

const commitlintConfig: UserConfig = {
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
  helpUrl:
    "https://github.com/IshfaqAhmedProg/cz-cubics#commitlint-integration",
  plugins: [plugin],
};

export default commitlintConfig;
