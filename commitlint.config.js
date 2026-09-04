const getConfig = require("./utils/getConfig");

const config = getConfig.sync();
const typeNames = config.types.map((t) => t.name);

/** @type {import("@commitlint/types").UserConfig} */
module.exports = {
  extends: [],
  parserPreset: {
    parserOpts: {
      // Capture an optional leading emoji token, then parse type(scope): subject
      headerPattern: /^(?:(\S+)\s+)?(\w+)(?:\(([^)]+)\))?:\s(.+)$/,
      headerCorrespondence: ["emoji", "type", "scope", "subject"],
    },
  },
  rules: {
    "type-empty": [2, "never"],
    "subject-empty": [2, "never"],
    "subject-case": [2, "always", "sentence-case"],
    "subject-max-length": [2, "always", 100],
    "type-enum": [2, "always", typeNames],
    "header-start-emoji": [2, "always"],
    "header-has-emoji": [0, "always"],
  },
  plugins: [
    {
      rules: {
        // Checks whether the captured leading token is a emoji/emoji.
        // Use "always" to require one, "never" to forbid one.
        "header-start-emoji": (parsed, when) => {
          const hasEmoji =
            Boolean(parsed.emoji) &&
            /\p{Extended_Pictographic}/u.test(parsed.emoji);

          if (when === "never") {
            return [
              !hasEmoji,
              "Commit header must not start with a extended_pictograph/emoji",
            ];
          }
          return [
            hasEmoji,
            "Commit header must start with a extended_pictograph/emoji",
          ];
        },

        // Checks whether a emoji appears anywhere in the full header line.
        // Use "always" to require one, "never" to forbid one.
        "header-has-emoji": (parsed, when) => {
          const emoji = /\p{Extended_Pictographic}/u.test(
            parsed.header ?? "",
          );

          if (when === "never") {
            return [
              !emoji,
              "Commit header must not contain a pictograph/emoji",
            ];
          }
          return [
            emoji,
            "Commit header must contain a pictograph/emoji",
          ];
        },
      },
    },
  ],
};
