# cz-cubics

A customizable [Commitizen](https://github.com/commitizen/cz-cli) adapter with emoji-prefixed conventional commit messages, plus a ready-to-extend `commitlint` config.

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/cz-cubics)](https://bundlephobia.com/package/cz-cubics)

## Installation

```bash
pnpm add -D cz-cubics commitizen
```

Register it as your Commitizen adapter in `package.json`:

```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-cubics"
    }
  }
}
```

or in `.czrc`:

```json
{
  "path": "./node_modules/cz-cubics"
}
```

Then commit with:

```bash
pnpm commit
```

(assuming a `"commit": "cz"` script, or run `commitizen`/`git cz` directly)

## Configuration

Config is resolved from the nearest of the following files, searched via [`find-up`](https://www.npmjs.com/package/find-up) in this order:

1. `.czrc`
2. `package.json`

The first matching file that contains a `config["cz-cubics"]` key wins if both exist, `.czrc` takes precedence.

### Config file shape

**`.czrc`**

```json
{
  "config": {
    "cz-cubics": {
      "headFormat": "{type}{scope}: {subject}"
    }
  }
}
```

**`package.json`**

```json
{
  "config": {
    "commitizen": {
      "path": "node_modules/cz-cubics"
    },
    "cz-cubics": {
      "headFormat": "{type}{scope}: {subject}"
    }
  }
}
```

Note `cz-cubics` sits as a **sibling** of `commitizen` under `config`, not nested inside it.

Custom configurations will be validated, invalid types, unknown `skipQuestions` values, or unrecognized `{token}`s in `headFormat` throws errors, rather than failing silently or on the first issue.

### `CZCubicsConfig`

| Property           | Type                   | Default                              | Description                                                                                                   |
| ------------------ | ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `types`            | `CZCubicsCommitType[]` | contents of `defaultTypes.json`      | The list of commit types offered to the user.                                                                 |
| `skipQuestions`    | `string[]`             | `[]`                                 | Skip any of: `scope`, `body`, `issues`, `breaking`. `type` and `subject` are mandatory and cannot be skipped. |
| `scopes`           | `string[]`             | -                                    | Predefined scope choices (Inquirer.js choices array) shown in the scope autocomplete prompt.                  |
| `questions`        | `Object`               | -                                    | Overrides for the generated Inquirer questions.                                                               |
| `subjectMaxLength` | `number`               | `100`                                | Maximum allowed length of the subject line.                                                                   |
| `headFormat`       | `string`               | `"{emoji} {type}{scope}: {subject}"` | Template for the commit header. Supports the tokens below.                                                    |

### `CZCubicsCommitType`

Each entry in `types` (and in `defaultTypes.json`) has the shape:

```json
{
  "name": "feat",
  "emoji": "✨",
  "description": "A new feature"
}
```

| Property      | Type     | Default | Description                                                              |
| ------------- | -------- | ------- | ------------------------------------------------------------------------ |
| `name`        | `string` | -       | The conventional commit type keyword (e.g. `feat`, `fix`).               |
| `emoji`       | `string` | `""`    | Emoji shown next to the type and inserted into the header via `{emoji}`. |
| `description` | `string` | -       | Explanatory text shown in the type selection prompt.                     |

### `headFormat` tokens (`CZCubicsHeaderTokens`)

| Token       | Resolves to                                        |
| ----------- | -------------------------------------------------- |
| `{emoji}`   | The selected type's `emoji`.                       |
| `{type}`    | The selected type's `name`.                        |
| `{scope}`   | `(scope)` if a scope was entered, otherwise empty. |
| `{subject}` | The trimmed subject line.                          |

Any run of consecutive whitespace left behind by an omitted token (e.g. no scope) is collapsed to a single space.

### Example `.czrc`

```json
{
  "config": {
    "cz-cubics": {
      "types": [
        { "name": "feat", "emoji": "✨", "description": "A new feature" },
        { "name": "fix", "emoji": "🐛", "description": "A bug fix" }
      ],
      "scopes": ["api", "ui", "docs"],
      "skipQuestions": ["issues", "breaking"],
      "subjectMaxLength": 72,
      "headFormat": "{emoji} {type}{scope}: {subject}"
    }
  }
}
```

## Commit message structure

The final message is assembled as:

```
<head>

<body>

BREAKING CHANGE: <breakingBody>

<footer (issues)>
```

- **head** => built from `headFormat`, truncated to the terminal's column width.
- **body** => the free-text body answer, wrapped to the terminal width.
- **breaking** => included only if a breaking change body was provided.
- **footer** => issue references, formatted via `formatIssues`.

Empty sections are omitted; the result is trimmed of trailing whitespace.

## `commitlint` integration

This package ships its own `commitlint.config.js`, which consumers can extend directly instead of duplicating rules:

```js
// commitlint.config.js (in your project)
/** @type {import("@commitlint/types").UserConfig} */
module.exports = {
  extends: ["cz-cubics/commitlint"],
  // add or override rules here
};
```

It includes:

- `subject-case`: `sentence-case`, always enforced.
- `subject-max-length`: `100`, always enforced.
- A `parserPreset` with a `headerPattern` that accounts for the leading emoji in the header, so `type`, `scope`, and `subject` are still parsed correctly out of headers like `✨ feat(api): add endpoint`.

### Requirements

`cz-cubics/commitlint` is a plain config object with no runtime dependency on any commitlint package itself. However, to actually lint commits you need `@commitlint/cli` (v19+) installed **in your own project**, since that's what reads and executes the config:

```bash
pnpm add -D @commitlint/cli
```

### Husky hook

Wire it up in `.husky/commit-msg`:

```sh
pnpm commitlint --edit "$1"
```

Make sure the hook file is executable (`chmod +x .husky/commit-msg`) and that `core.hooksPath` points at `.husky` (set automatically by the `prepare: "husky"` script).

## License

MIT

## Special Thanks
- [ngryman/cz-emoji](https://github.com/ngryman/cz-emoji): the core idea of emoji-based conventional commit types this adapter builds on.
- [commitizen/cz-cli](https://github.com/commitizen/cz-cli): the adapter framework this package plugs into.