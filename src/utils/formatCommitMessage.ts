import wrap from "wrap-ansi";
import type { ResolvedCZCubicsConfig } from "../config.type";
import formatIssues from "./formatIssues";

export interface CommitAnswers {
  type: {
    emoji: string;
    name: string;
  };
  scope?: string;
  subject: string;
  body?: string;
  breakingBody?: string;
  issues?: string;
}

/** Format the git commit message from answers provided by Inquirer. */
export default function formatCommitMessage(
  answers: CommitAnswers,
  config: ResolvedCZCubicsConfig,
): string {
  const columns = process.stdout.columns || 80;
  const type = config.types.find((item) => item.name === answers.type.name);
  if (!type) {
    throw new Error(`Unknown commit type: ${answers.type.name}`);
  }

  const scope = answers.scope ? `(${answers.scope.trim()})` : "";
  const subject = answers.subject.trim();
  const commitMessage = config.headFormat
    .replace(/{emoji}/g, answers.type.emoji)
    .replace(/{type}/g, type.name)
    .replace(/{scope}/g, scope)
    .replace(/{subject}/g, subject)
    .replace(/\s+/g, " ");

  const head =
    commitMessage.length > columns
      ? `${commitMessage.slice(0, columns - 1)}…`
      : commitMessage;
  const body = wrap((answers.body ?? "").replace(/\s*\|\s*/g, "\n"), columns);
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
