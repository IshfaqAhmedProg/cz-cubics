import type {
  CZCubicsConfig,
  CZCubicsHeaderTokens,
  CZCubicsSkippedQuestion,
} from "../config.type";
import { VALID_HEADER_TOKENS, VALID_SKIP_QUESTIONS } from "./constants";

class ValidationErrors {
  readonly errors: string[] = [];

  add(path: string, message: string): void {
    this.errors.push(`  - ${path}: ${message}`);
  }

  get hasErrors(): boolean {
    return this.errors.length > 0;
  }

  throwIfAny(): void {
    if (this.hasErrors) {
      throw new Error(`Invalid cz-cubics config:\n${this.errors.join("\n")}`);
    }
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractTokens(headFormat: string): string[] {
  return [...headFormat.matchAll(/{([^{}]*)}/g)].map((match) => match[1]);
}

type FieldValidator = (value: unknown, errors: ValidationErrors) => void;
const fieldValidators: Record<keyof CZCubicsConfig, FieldValidator> = {
  types(value, errors) {
    if (!Array.isArray(value)) {
      errors.add("types", "must be an array");
      return;
    }
    value.forEach((type: unknown, index: number) => {
      const path = `types[${index}]`;
      if (!isRecord(type)) {
        errors.add(path, "must be an object");
        return;
      }
      if (typeof type.name !== "string" || type.name.length === 0) {
        errors.add(`${path}.name`, "is required and must be a non-empty string");
      }
      if (
        typeof type.description !== "string" ||
        type.description.length === 0
      ) {
        errors.add(
          `${path}.description`,
          "is required and must be a non-empty string",
        );
      }
      if (type.emoji !== undefined && typeof type.emoji !== "string") {
        errors.add(`${path}.emoji`, "must be a string");
      }
    });
  },
  skipQuestions(value, errors) {
    if (!Array.isArray(value)) {
      errors.add("skipQuestions", "must be an array");
      return;
    }
    value.forEach((question: unknown, index: number) => {
      if (
        typeof question !== "string" ||
        !VALID_SKIP_QUESTIONS.includes(question as CZCubicsSkippedQuestion)
      ) {
        errors.add(
          `skipQuestions[${index}]`,
          `must be one of: ${VALID_SKIP_QUESTIONS.join(", ")} (got "${String(question)}")`,
        );
      }
    });
  },
  scopes(value, errors) {
    if (!Array.isArray(value)) {
      errors.add("scopes", "must be an array");
      return;
    }
    value.forEach((scope: unknown, index: number) => {
      if (typeof scope !== "string") {
        errors.add(`scopes[${index}]`, "must be a string");
      }
    });
  },
  questions(value, errors) {
    if (!isRecord(value)) {
      errors.add("questions", "must be an object");
    }
  },
  subjectMaxLength(value, errors) {
    if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
      errors.add("subjectMaxLength", "must be a positive integer");
    }
  },
  headFormat(value, errors) {
    if (typeof value !== "string") {
      errors.add("headFormat", "must be a string");
      return;
    }
    const invalidTokens = extractTokens(value).filter(
      (token) =>
        !VALID_HEADER_TOKENS.includes(token as CZCubicsHeaderTokens),
    );
    if (invalidTokens.length > 0) {
      errors.add(
        "headFormat",
        `contains invalid token(s): ${invalidTokens
          .map((token) => `{${token}}`)
          .join(", ")}. Valid tokens are: ${VALID_HEADER_TOKENS.map(
          (token) => `{${token}}`,
        ).join(", ")}`,
      );
    }
  },
};

/** Validate a parsed config object without changing it. */
export default function validateConfig(
  loadedConfig: unknown,
): asserts loadedConfig is CZCubicsConfig {
  const errors = new ValidationErrors();
  if (!isRecord(loadedConfig)) {
    errors.add("(root)", "config must be an object");
    errors.throwIfAny();
    return;
  }

  for (const [field, value] of Object.entries(loadedConfig)) {
    if (Object.hasOwn(fieldValidators, field)) {
      fieldValidators[field as keyof CZCubicsConfig](value, errors);
    }
  }
  errors.throwIfAny();
}
