import eslint from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint, { configs, parser } from "typescript-eslint";

export default tseslint.config([
  {
    languageOptions: {
      parser,
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        document: "readonly",
        navigator: "readonly",
        window: "readonly",
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js", "*.config.mjs", "tsup.config.ts"],
        },
        tsconfigRootDir: "./",
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
  ...configs.strictTypeChecked,
  ...configs.stylisticTypeChecked,
  prettierPlugin,
  eslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "axios",
              message: "Please use fetch instead",
            },
          ],
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        { "ts-expect-error": "allow-with-description" },
      ],
      "@typescript-eslint/no-redeclare": ["error", { builtinGlobals: false }],
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true,
        },
      ],
      "@typescript-eslint/no-use-before-define": [
        "error",
        { classes: false, functions: false, variables: true },
      ],
      "@typescript-eslint/no-shadow": "error",
      "@typescript-eslint/no-confusing-void-expression": [
        "error",
        {
          ignoreArrowShorthand: true,
        },
      ],
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    ignores: ["example/**", "dist/**"],
  },
]);
