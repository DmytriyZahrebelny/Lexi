import js from "@eslint/js";
import unicorn from "eslint-plugin-unicorn";
import { config, configs } from "typescript-eslint";

const NO_DEFAULT_IMPORT = {
  selector: "ImportDefaultSpecifier",
  message: "Use a named import instead of a default import.",
};

const NO_DEFAULT_EXPORT = {
  selector: "ExportDefaultDeclaration",
  message: "Use a named export instead of a default export.",
};

export default config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/drizzle/**",
      "**/next-env.d.ts",
      "**/AGENTS.md",
      "**/CLAUDE.md",
    ],
  },
  js.configs.recommended,
  ...configs.recommended,
  {
    plugins: { unicorn },
    rules: {
      "unicorn/filename-case": ["error", { case: "kebabCase", ignore: ["^__tests__$"] }],
      "no-restricted-syntax": ["error", NO_DEFAULT_IMPORT, NO_DEFAULT_EXPORT],
    },
  },
  {
    // Next.js App Router file conventions require a default-exported component;
    // there is no named-export alternative. Default imports are still banned here.
    files: [
      "apps/web/src/app/**/page.tsx",
      "apps/web/src/app/**/layout.tsx",
      "apps/web/src/app/**/loading.tsx",
      "apps/web/src/app/**/error.tsx",
      "apps/web/src/app/**/not-found.tsx",
    ],
    rules: {
      "no-restricted-syntax": ["error", NO_DEFAULT_IMPORT],
    },
  },
  {
    // Tool config files: required default export by contract (vitest/drizzle/next/eslint
    // itself), and some also pull in plugin packages that only ship a default export
    // (e.g. @vitejs/plugin-react, @eslint/js, eslint-plugin-unicorn). Not application code.
    files: ["**/vitest.config.ts", "**/drizzle.config.ts", "**/next.config.ts", "eslint.config.mjs"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
);
