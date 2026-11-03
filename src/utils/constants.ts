import defaultTypesJson from "../defaultTypes.json";
import type {
  CZCubicsCommitType,
  CZCubicsHeaderTokens,
  CZCubicsSkippedQuestion,
} from "../config.type";

export const CZ_NAME = "cz-cubics";
export const DEFAULT_TYPES: CZCubicsCommitType[] = defaultTypesJson;
export const DEFAULT_HEAD_FORMAT = "{emoji} {type}{scope}: {subject}";
export const DEFAULT_SUBJECT_MAX_LENGTH = 100;
export const POSSIBLE_CONFIG_FILES = [".czrc", "package.json"];
export const VALID_HEADER_TOKENS: CZCubicsHeaderTokens[] = [
  "emoji",
  "type",
  "scope",
  "subject",
];
export const VALID_SKIP_QUESTIONS: CZCubicsSkippedQuestion[] = [
  "scope",
  "body",
  "issues",
  "breaking",
];
