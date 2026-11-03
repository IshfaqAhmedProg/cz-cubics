import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    "commitlint.config": "./src/commitlint.config.ts",
  },
  format: ["cjs"],
  dts: true,
  deps: {
    alwaysBundle: ["wrap-ansi", "find-up"],
    neverBundle: ["@commitlint/types", "conventional-commits-parser"],
    onlyBundle: false,
  }
});
