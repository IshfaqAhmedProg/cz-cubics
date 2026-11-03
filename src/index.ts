import autocompletePrompt from "inquirer-autocomplete-prompt";
import maxlengthInputPrompt from "inquirer-maxlength-input-prompt";
import createQuestions from "./utils/createQuestions";
import formatCommitMessage from "./utils/formatCommitMessage";
import getConfig from "./utils/getConfig";
import type { CommitAnswers } from "./utils/formatCommitMessage";

export type * from "./config.type";

interface PromptModule {
  (questions: Record<string, unknown>[]): Promise<CommitAnswers>;
  registerPrompt(name: string, prompt: unknown): void;
}

interface Commitizen {
  prompt: PromptModule;
}

/**
 * Interactively prompts the git commit message and returns it to Commitizen.
 */
async function promptCommitMessage(cz: Commitizen): Promise<string> {
  cz.prompt.registerPrompt("autocomplete", autocompletePrompt);
  cz.prompt.registerPrompt("maxlength-input", maxlengthInputPrompt);

  const config = await getConfig();
  const answers = await cz.prompt(createQuestions(config));
  return formatCommitMessage(answers, config);
}

/** Commitizen adapter entry point. */
export const prompter = (
  cz: Commitizen,
  commit: (message: string) => void,
): void => {
  void promptCommitMessage(cz).then(commit);
};
