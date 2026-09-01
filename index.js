const getConfig = require("./utils/getConfig");
const createQuestions = require("./utils/createQuestions");
const formatCommitMessage = require("./utils/formatCommitMessage");

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
