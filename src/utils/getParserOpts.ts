import type { CZCubicsHeaderTokens } from "../config.type";

interface Placeholder {
  regex: string;
  required: boolean;
  selfWrapped?: boolean;
}

const PLACEHOLDERS: Record<CZCubicsHeaderTokens, Placeholder> = {
  emoji: { regex: "\\S+", required: false },
  type: { regex: "\\w*", required: true },
  scope: { regex: "\\(([^)]+)\\)", required: false, selfWrapped: true },
  subject: { regex: ".*", required: true },
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function getParserOpts(headFormat: string): {
  headerPattern: RegExp;
  headerCorrespondence: CZCubicsHeaderTokens[];
} {
  const tokens = headFormat.split(/(\{[a-zA-Z]+\})/g).filter(Boolean);
  let pattern = "^";
  const headerCorrespondence: CZCubicsHeaderTokens[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const match = token.match(/^\{([a-zA-Z]+)\}$/);

    if (!match) {
      pattern += escapeRegex(token);
      continue;
    }

    const name = match[1] as CZCubicsHeaderTokens;
    const placeholder = PLACEHOLDERS[name];
    if (!placeholder) {
      continue;
    }
    headerCorrespondence.push(name);

    if (placeholder.required) {
      pattern += `(${placeholder.regex})`;
      continue;
    }

    if (placeholder.selfWrapped) {
      pattern += `(?:${placeholder.regex})?`;
      continue;
    }

    const next = tokens[i + 1];
    const literalWhitespace =
      typeof next === "string" ? next.match(/^(\s+)/) : undefined;
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
