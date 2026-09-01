const findUp = require("find-up");
const fs = require("fs");
const truncate = require("cli-truncate");
const wrap = require("wrap-ansi");
const pad = require("pad");
const fuse = require("fuse.js");
const util = require("util");
const types = require("./defaultTypes");
const readFile = util.promisify(fs.readFile);

async function loadConfig(filename) {
  try {
    const text = await readFile(filename, "utf8");
    const obj = await JSON.parse(text);
    return obj && obj.config && obj.config["cz-cubics"];
  } catch {
    return null;
  }
}

async function loadConfigUpwards(filename) {
  const _filename = await findUp(filename);
  return loadConfig(_filename);
}

/**
 * Prepares the config from czrc or package.json
 * @return {Promise<CZCubicsConfig>}
 * @private
 */
async function getConfig() {
  const defaultHeadFormat = "{emoji} {type}{scope}: {subject}";
  const defaultConfig = {
    types,
    skipQuestions: [""],
    subjectMaxLength: 100,
    conventional: false,
  };
  const loadedConfig =
    (await loadConfigUpwards(".czrc")) ||
    (await loadConfigUpwards("package.json")) ||
    {};
  const config = {
    ...defaultConfig,
    headFormat: loadedConfig.headFormat ?? defaultHeadFormat,
    ...loadedConfig,
  };
  return config;
}

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

function formatIssues(issues) {
  return issues
    ? "Closes " + (issues.match(/#\d+/g) || []).join(", closes ")
    : "";
}

/**
 * Create inquier.js questions object trying to read `types` and `scopes` from the current project
 * `package.json` falling back to nice default :)
 *
 * @param {CZCubicsConfig} config Result of the `getConfig` returned promise
 * @return {Array} Return an array of `inquier.js` questions
 * @private
 */
function createQuestions(config) {
  const choices = getEmojiChoices(config);

  const fuzzy = new fuse(choices, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name"],
  });

  const questions = [
    {
      type: "autocomplete",
      name: "type",
      message:
        config.questions && config.questions.type
          ? config.questions.type
          : "Select the type of change you're committing:",
      source: (_, query) =>
        Promise.resolve(query ? fuzzy.search(query) : choices),
    },
    {
      type: config.scopes ? "list" : "input",
      name: "scope",
      message:
        config.questions && config.questions.scope
          ? config.questions.scope
          : "Specify a scope:",
      choices:
        config.scopes && [{ name: "[none]", value: "" }].concat(config.scopes),
      when: !config.skipQuestions.includes("scope"),
    },
    {
      type: "maxlength-input",
      name: "subject",
      message:
        config.questions && config.questions.subject
          ? config.questions.subject
          : "Write a short description:",
      maxLength: config.subjectMaxLength,
    },
    {
      type: "input",
      name: "body",
      message:
        config.questions && config.questions.body
          ? config.questions.body
          : "Provide a longer description:",
      when: !config.skipQuestions.includes("body"),
    },
    {
      type: "input",
      name: "breakingBody",
      message:
        config.questions && config.questions.breaking
          ? config.questions.breaking
          : "A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n",
      when: !config.skipQuestions.includes("breaking"),
    },
    {
      type: "input",
      name: "issues",
      message:
        config.questions && config.questions.issues
          ? config.questions.issues
          : "List any issue closed (#1, #2, ...):",
      when: !config.skipQuestions.includes("issues"),
    },
  ];

  return questions;
}

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
  const body = wrap(answers.body || "", columns);
  const breaking =
    answers.breakingBody && answers.breakingBody.trim().length !== 0
      ? wrap(`BREAKING CHANGE: ${answers.breakingBody.trim()}`, columns)
      : "";
  const footer = formatIssues(answers.issues);

  return [head, body, breaking, footer].filter(Boolean).join("\n\n").trim();
}

/**
 * Interactively prompts the git commit message to the user.
 *
 * @param {commitizen} cz Commitizen object
 * @return {String} Git message provided by the user
 */
async function promptCommitMessage(cz) {
  cz.prompt.registerPrompt(
    "autocomplete",
    require("inquirer-autocomplete-prompt"),
  );
  cz.prompt.registerPrompt(
    "maxlength-input",
    require("inquirer-maxlength-input-prompt"),
  );

  const config = await getConfig();
  const questions = createQuestions(config);
  const answers = await cz.prompt(questions);
  const message = formatCommitMessage(answers, config);

  return message;
}

/**
 * Export an object containing a `prompter` method. This object is used by `commitizen`.
 *
 * @type {Object}
 */
module.exports = {
  prompter: (cz, commit) => {
    promptCommitMessage(cz).then(commit);
  },
};
