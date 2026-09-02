/** @type {import("@commitlint/types").UserConfig} */
module.exports = {
  extends: [],
  parserPreset: {
    parserOpts: {
      // Skip an optional leading emoji token, then parse type(scope): subject
      headerPattern: /^(?:\S+\s+)?(\w+)(?:\(([^)]+)\))?:\s(.+)$/,
      headerCorrespondence: ["type", "scope", "subject"],
    },
  },
  rules: {
    "subject-case": [1, "always", "sentence-case"],
    "subject-max-length": [2, "always", 100],
  },
  // plugins: [],
};
