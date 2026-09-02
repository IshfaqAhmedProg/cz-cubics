const pad = require("pad");

/**
 * Gets choices for selecting the types
 * @param {CZCubicsConfig} config
 */
function getTypeChoices(config) {
  const { types } = config;
  const maxNameLength = types.reduce(
    (maxLength, type) =>
      type.name.length > maxLength ? type.name.length : maxLength,
    0,
  );

  /**
   * @param {CZCubicsCommitType} choice
   */
  function renderEmoji({ emoji = "" }) {
    return `${emoji ? `${emoji} ` : ""}`;
  }

  return types.map((choice) => ({
    name: `${renderEmoji(choice)} ${pad(choice.name, maxNameLength)} ${choice.description}`,
    value: {
      emoji: renderEmoji(choice),
      name: choice.name,
    },
  }));
}
module.exports = getTypeChoices;
