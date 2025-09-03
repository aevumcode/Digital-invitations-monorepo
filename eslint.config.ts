// eslint.config.ts
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "react/react-in-jsx-scope": "off",
      "@next/next/no-html-link-for-pages": "off",
      "react/jsx-one-expression-per-line": "off",
      "react/jsx-first-prop-new-line": "off",
      "react/jsx-max-props-per-line": "off",
    },
    languageOptions: {
      parserOptions: { project: false },
    },
  },
  {
    ignores: [
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/lib/generated/prisma/**",
      "apps/*/lib/generated/**",
      "packages/*/lib/generated/**",
      "**/prisma/**",
      "apps/*/next-env.d.ts",
      "**/*{%*}.ts",
      "**/*{%*}.tsx",
    ],
  },
];

export default eslintConfig;
