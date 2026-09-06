import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default [
  {
    ignores: ["dist/", "node_modules/", ".astro/", "src/env.d.ts", "public/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // .astro 文件（含其中的 <script>）同样纳入 lint——此前是完全的盲区
  ...astro.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        URL: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        fetch: "readonly",
      },
    },
  },
];
