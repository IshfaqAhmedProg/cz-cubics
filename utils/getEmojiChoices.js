const pad = require("pad");

function getEmojiChoices({ types }) {
  const maxNameLength = types.reduce(
    (maxLength, type) =>
      type.name.length > maxLength ? type.name.length : maxLength,
    0,
  );

  return types.map((choice) => ({
    name: `${pad(choice.name, maxNameLength)}  ${choice.emoji}  ${choice.description}`,
    value: {
      emoji: `${choice.emoji} `,
      name: choice.name,
    },
  }));
}
exports.getEmojiChoices = getEmojiChoices;
