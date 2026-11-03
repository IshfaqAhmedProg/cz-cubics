import Fuse from "fuse.js";
import type { ResolvedCZCubicsConfig } from "../config.type";
import getTypeChoices, { type TypeChoice } from "./getTypeChoices";

type PromptQuestion = Record<string, unknown>;

export default function createQuestions(
  config: ResolvedCZCubicsConfig,
): PromptQuestion[] {
  const choices = getTypeChoices(config);
  const fuzzy = new Fuse(choices, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: ["name"],
  });
  const promptMessage = (
    key: keyof NonNullable<ResolvedCZCubicsConfig["questions"]>,
    fallback: string,
  ) => config.questions?.[key] ?? fallback;

  // Normalize scopes (strings or { name, value }) into choice objects
  const scopeChoices = (config.scopes || []).map((scope) =>
    typeof scope === "string" ? { name: scope, value: scope } : scope,
  );
  const allScopeChoices = [{ name: "[none]", value: "" }].concat(scopeChoices);

  const scopeFuzzy = new Fuse(scopeChoices, {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 100,
    minMatchCharLength: 1,
    keys: ["name"],
  });

  // Suggestions from the list, plus the typed text as a custom option
  const searchScopes = (_: unknown, query: string) => {
    if (!query) return Promise.resolve(allScopeChoices);

    const results = scopeFuzzy.search(query).map((result) => result.item);

    return Promise.resolve([
      ...results,
      { name: `${query} (custom)`, value: query },
    ]);
  };

  return [
    {
      type: "autocomplete",
      name: "type",
      message: promptMessage(
        "type",
        "Select the type of change you're committing:",
      ),
      source: async (
        _answers: unknown,
        query?: string,
      ): Promise<TypeChoice[]> =>
        query ? fuzzy.search(query).map((result) => result.item) : choices,
    },
    {
      type: config.scopes ? "autocomplete" : "input",
      name: "scope",
      message: promptMessage("scope", "Specify a scope:"),
      source: config.scopes ? searchScopes : undefined,
      when: !config.skipQuestions.includes("scope"),
    },
    {
      type: "maxlength-input",
      name: "subject",
      message: promptMessage("subject", "Write a short description:"),
      maxLength: config.subjectMaxLength,
      validate: (input: string) =>
        input.trim().length > 0 || "Subject cannot be empty.",
    },
    {
      type: "input",
      name: "body",
      message: promptMessage("body", "Provide a longer description:"),
      when: !config.skipQuestions.includes("body"),
    },
    {
      type: "input",
      name: "breakingBody",
      message: promptMessage(
        "breaking",
        "A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself:\n",
      ),
      when: !config.skipQuestions.includes("breaking"),
    },
    {
      type: "input",
      name: "issues",
      message: promptMessage("issues", "List any issue closed (#1, #2, ...):"),
      when: !config.skipQuestions.includes("issues"),
    },
  ];
}
