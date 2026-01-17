import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import pluginImport from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config(
  { ignores: ["dist", "src/azure-rules-engine/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: pluginImport,
      "unused-imports": unusedImports,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // --- your preferences ---
      semi: ["error", "never"],
      quotes: ["warn", "single", { avoidEscape: true }],
      "object-curly-spacing": ["error", "always"],
      "no-debugger": "warn",
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",

      // --- React Hooks recommended (explicit) ---
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // --- React Refresh ---
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // --- Unuseds (per your ask) ---
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "off",
      "import/no-unresolved": "off",

      // --- TypeScript rules ---
      "@typescript-eslint/no-explicit-any": "off",

      // --- Allow empty block statements ---
      "no-empty": "off",
    },
  },
);
