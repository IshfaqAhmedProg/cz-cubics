const truncate = require("cli-truncate");
const wrap = require("wrap-ansi");
const formatIssues = require("./formatIssues");

/**
 * Format the git commit message from given answers.
 *
 * @param {Object} answers Answers provide by `inquier.js`
 * @param {CZCubicsConfig} config Result of the `getConfig` returned promise
 * @return {String} Formatted git commit message
 */

function formatCommitMessage(answers, config) {
  const { columns } = process.stdout;

  const emoji = answers.type;
  const type = config.types.find((type) => type.name === emoji.name).name;
  const scope = answers.scope ? "(" + answers.scope.trim() + ")" : "";
  const subject = answers.subject.trim();

  const commitMessage = config.headFormat
    .replace(/{emoji}/g, emoji.emoji)
    .replace(/{type}/g, type)
    .replace(/{scope}/g, scope)
    .replace(/{subject}/g, subject)
    // Only allow at most one whitespace.
    // When an optional field (ie. `scope`) is not specified, it can leave several consecutive
    // white spaces in the final message.
    .replace(/\s+/g, " ");

  const head = truncate(commitMessage, columns);
  const body = wrap((answers.body || "").replace(/\s*\|\s*/g, "\n"), columns);
  const breaking =
    answers.breakingBody && answers.breakingBody.trim().length !== 0
      ? wrap(
          `BREAKING CHANGE: ${answers.breakingBody.replace(/\s*\|\s*/g, "\n").trim()}`,
          columns,
        )
      : "";
  const footer = formatIssues(answers.issues);

  return [head, body, breaking, footer].filter(Boolean).join("\n\n").trim();
}

module.exports = formatCommitMessage;

