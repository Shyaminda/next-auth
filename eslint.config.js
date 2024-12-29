import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "next",
    "plugin:@typescript-eslint/recommended",
  ),
  {
    files: ["**/*.ts", "**/*.tsx"],
		plugins: {
      prettier: prettierPlugin, 
    },
    rules: {
      "prettier/prettier": [
        "warn",
        {
          "singleQuote": false,
          "useTabs": true,
          "tabWidth": 2,
          "trailingComma": "all",
					"endOfLine": "auto",
        },
      ],
      "semi": ["warn", "always"],
      "eol-last": ["warn", "always"],
      "indent": ["warn", "tab"],
    },
  },
];

export default eslintConfig;