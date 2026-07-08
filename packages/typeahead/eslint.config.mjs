import { config as reactConfig } from "@repo/config/eslint-react";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...reactConfig,
  {
    // Jest provides these as ambient globals in test files.
    files: ["**/*.test.ts", "**/*.test.tsx"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        jest: "readonly",
      },
    },
  },
];
