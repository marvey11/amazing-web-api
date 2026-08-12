/* ESLint flat config for ESLint v9+ */
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  {
    ignores: ["build/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: Object.assign(
      {
        "comma-dangle": ["warn", "never"],
        "no-trailing-spaces": ["warn"],
        "quotes": ["warn", "double"],
        "semi": ["error", "always"],
      },
      (tsPlugin.configs && tsPlugin.configs.recommended && tsPlugin.configs.recommended.rules) || {}
    ),
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
  },
];
