// Maps each known headFormat placeholder to its capture regex and
// whether it's mandatory. Per CZCubicsConfig, type and subject are
// always required; emoji and scope may be present or absent.
//
// Required placeholders use "*" rather than "+" so a genuinely missing
// field captures as an empty string instead of failing the whole header
// match that keeps type-empty/subject-empty independent, so only the
// field that's actually missing gets reported.
const PLACEHOLDERS = {
  emoji: { regex: "\\S+", required: false },
  type: { regex: "\\w*", required: true },
  scope: { regex: "\\(([^)]+)\\)", required: false, selfWrapped: true },
  subject: { regex: ".*", required: true },
};

/**
 * Escapes regex-special characters in literal template text.
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Converts a headFormat template like "{emoji} {type}{scope}: {subject}"
 * into a headerPattern regex + matching headerCorrespondence array, so
 * commitlint's parser follows whatever format the config declares.
 * @param {string} headFormat
 * @returns {{ headerPattern: RegExp, headerCorrespondence: string[] }}
 */
function getParserOpts(headFormat) {
  // Split into alternating literal text and {placeholder} tokens.
  const tokens = headFormat.split(/(\{[a-zA-Z]+\})/g).filter(Boolean);

  let pattern = "^";
  const headerCorrespondence = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const match = token.match(/^\{([a-zA-Z]+)\}$/);

    if (!match) {
      // Plain literal text
      pattern += escapeRegex(token);
      continue;
    }

    const name = match[1];
    const placeholder = PLACEHOLDERS[name];
    if (!placeholder) {
      // Unknown placeholder
      continue;
    }

    headerCorrespondence.push(name);

    if (placeholder.required) {
      pattern += `(${placeholder.regex})`;
      continue;
    }

    if (placeholder.selfWrapped) {
      // e.g. scope's own regex already includes its delimiters (parens),
      // so just make the whole thing optional.
      pattern += `(?:${placeholder.regex})?`;
      continue;
    }

    // Optional placeholder like emoji also absorb the " " after the emoji
    const next = tokens[i + 1];
    const literalWhitespace = typeof next === "string" && next.match(/^(\s+)/);

    if (literalWhitespace) {
      pattern += `(?:(${placeholder.regex})${escapeRegex(literalWhitespace[1])})?`;
      tokens[i + 1] = next.slice(literalWhitespace[1].length);
    } else {
      pattern += `(?:(${placeholder.regex}))?`;
    }
  }

  pattern += "$";
  return { headerPattern: new RegExp(pattern), headerCorrespondence };
}

module.exports = getParserOpts;
