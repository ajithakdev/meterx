import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import markdown from "@eslint/markdown";
import css from "@eslint/css";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: ["**/node_modules/", "**/dist/", "**/test-files/"],
  },
  // Extension TypeScript - browser globals
  {
    files: ["apps/extension/src/**/*.ts"],
    plugins: { js, "@typescript-eslint": tseslint.plugin },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
        chrome: "readonly",
        performance: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "off"
    },
    extends: ["js/recommended"]
  },
  // Extension build scripts
  {
    files: ["apps/extension/**/*.mjs"],
    plugins: { js },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node }
    },
    extends: ["js/recommended"]
  },
  // Server, worker and package TypeScript - node globals
  {
    files: ["services/server/src/**/*.ts", "services/worker/src/**/*.ts", "packages/*/src/**/*.ts"],
    plugins: { js, "@typescript-eslint": tseslint.plugin },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tseslint.parser,
      globals: { ...globals.node }
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "off"
    },
    extends: ["js/recommended"]
  },
  // Markdown
  {
    files: ["*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"]
  },
  // CSS
  {
    files: ["apps/extension/**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
    rules: {
      // Custom properties live in a separate stylesheet, which this rule cannot see.
      "css/no-invalid-properties": ["error", { allowUnknownVariables: true }],
      // The two uses are deliberate: [hidden] must win, and reduced motion must override every animation.
      "css/no-important": "off",
      // Extension pages run in current Chrome, Edge, Opera and Firefox only.
      "css/use-baseline": ["error", { available: "newly", allowProperties: ["accent-color"] }]
    }
  }
]);
