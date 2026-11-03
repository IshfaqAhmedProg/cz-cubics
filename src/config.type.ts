/** A commit type offered by the interactive commit prompt. */
export interface CZCubicsCommitType {
  /** The conventional commit type keyword, such as `feat` or `fix`. */
  name: string;
  /** The emoji shown alongside the type and substituted for `{emoji}`. */
  emoji?: string;
  /** Explanatory text shown in the type selection prompt. */
  description: string;
}

/** Header placeholders supported by `headFormat`. */
export type CZCubicsHeaderTokens = "emoji" | "type" | "scope" | "subject";

/** Optional questions that can be omitted from the interactive prompt. */
export type CZCubicsSkippedQuestion = "scope" | "body" | "issues" | "breaking";

/** Custom prompt messages keyed by question name. */
export interface CZCubicsQuestions {
  /** Override the commit-type prompt message. */
  type?: string;
  /** Override the scope prompt message. */
  scope?: string;
  /** Override the subject prompt message. */
  subject?: string;
  /** Override the body prompt message. */
  body?: string;
  /** Override the breaking-change prompt message. */
  breaking?: string;
  /** Override the issue-reference prompt message. */
  issues?: string;
}

/** User-provided cz-cubics configuration. All properties are optional. */
export interface CZCubicsConfig {
  /** Commit types offered by the prompt; defaults to `defaultTypes.json`. */
  types?: CZCubicsCommitType[];
  /** Questions to omit; defaults to an empty list. */
  skipQuestions?: CZCubicsSkippedQuestion[];
  /** Predefined scope choices. */
  scopes?: string[];
  /** Overrides for the generated Inquirer question messages. */
  questions?: CZCubicsQuestions;
  /** Maximum subject length; defaults to `100`. */
  subjectMaxLength?: number;
  /** Commit header template; defaults to `{emoji} {type}{scope}: {subject}`. */
  headFormat?: string;
}

/** Configuration after default values have been applied. */
export interface ResolvedCZCubicsConfig extends CZCubicsConfig {
  types: CZCubicsCommitType[];
  skipQuestions: CZCubicsSkippedQuestion[];
  subjectMaxLength: number;
  headFormat: string;
}