const { VALID_SKIP_QUESTIONS, VALID_HEADER_TOKENS } = require("./constants");

/**
 * Collects validation errors instead of throwing on the first one,
 * so users see every problem in their config at once.
 */
class ValidationErrors {
  constructor() {
    /** @type {string[]} */
    this.errors = [];
  }

  /** @param {string} path @param {string} message */
  add(path, message) {
    this.errors.push(`  - ${path}: ${message}`);
  }

  get hasErrors() {
    return this.errors.length > 0;
  }

  throwIfAny() {
    if (this.hasErrors) {
      throw new Error(`Invalid cz-cubics config:\n${this.errors.join("\n")}`);
    }
  }
}

/**
 * Extracts all {token} placeholders from a headFormat string.
 * @param {string} headFormat
 * @return {string[]}
 */
function extractTokens(headFormat) {
  const tokenPattern = /{([^{}]*)}/g;
  const tokens = [];
  let match;
  while ((match = tokenPattern.exec(headFormat)) !== null) {
    tokens.push(match[1]);
  }
  return tokens;
}

/**
 * Field validators, keyed by config property name.
 * Each receives (value, errors) and pushes to errors on failure.
 * Add a new key here to validate an additional config field.
 * @type {Record<string, (value: any, errors: ValidationErrors) => void>}
 */
const fieldValidators = {
  types(value, errors) {
    if (!Array.isArray(value)) {
      errors.add("types", "must be an array");
      return;
    }
    value.forEach((type, i) => {
      const path = `types[${i}]`;
      if (typeof type !== "object" || type === null) {
        errors.add(path, "must be an object");
        return;
      }
      if (typeof type.name !== "string" || type.name.length === 0) {
        errors.add(
          `${path}.name`,
          "is required and must be a non-empty string",
        );
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
    value.forEach((question, i) => {
      if (!VALID_SKIP_QUESTIONS.includes(question)) {
        errors.add(
          `skipQuestions[${i}]`,
          `must be one of: ${VALID_SKIP_QUESTIONS.join(", ")} (got "${question}")`,
        );
      }
    });
  },

  scopes(value, errors) {
    if (!Array.isArray(value)) {
      errors.add("scopes", "must be an array");
      return;
    }
    value.forEach((scope, i) => {
      if (typeof scope !== "string") {
        errors.add(`scopes[${i}]`, "must be a string");
      }
    });
  },

  questions(value, errors) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
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
      (token) => !VALID_HEADER_TOKENS.includes(token),
    );
    if (invalidTokens.length > 0) {
      errors.add(
        "headFormat",
        `contains invalid token(s): ${invalidTokens
          .map((t) => `{${t}}`)
          .join(", ")}. Valid tokens are: ${VALID_HEADER_TOKENS.map(
          (t) => `{${t}}`,
        ).join(", ")}`,
      );
    }
  },
};

/**
 * Validates a loaded config object against CZCubicsConfig.
 * Only validates fields that are present and unknown fields are
 * ignored rather than rejected.
 *
 * @param {unknown} loadedConfig Raw config parsed from .czrc/package.json
 * @return {CZCubicsConfig} The same object, unmodified, if valid
 */
function validateConfig(loadedConfig) {
  const errors = new ValidationErrors();

  if (typeof loadedConfig !== "object" || loadedConfig === null) {
    errors.add("(root)", "config must be an object");
    errors.throwIfAny();
    return loadedConfig;
  }

  for (const [field, value] of Object.entries(loadedConfig)) {
    const validate = fieldValidators[field];
    if (validate) {
      validate(value, errors);
    }
    // Unknown fields are silently ignored; add a branch here if you
    // want to warn or reject on unrecognized keys instead.
  }

  errors.throwIfAny();
  return loadedConfig;
}

module.exports = validateConfig;
