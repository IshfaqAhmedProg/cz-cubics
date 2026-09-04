/** @type {import("@commitlint/types").Plugin} */
module.exports = {
  rules: {
    // Checks whether the captured leading token is a emoji/emoji.
    // Use "always" to require one, "never" to forbid one.
    "header-start-emoji": (parsed, when) => {
      if (!parsed.type || !parsed.subject) {
        return [true];
      }
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
      if (!parsed.type || !parsed.subject) {
        return [true];
      }
      const emoji = /\p{Extended_Pictographic}/u.test(parsed.header ?? "");

      if (when === "never") {
        return [!emoji, "Commit header must not contain a pictograph/emoji"];
      }
      return [emoji, "Commit header must contain a pictograph/emoji"];
    },
  },
};
