import globals from 'globals';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tseslint from '@typescript-eslint/eslint-plugin';
import reactPlugin from '@eslint-react/eslint-plugin';

export default defineConfig([
  js.configs.recommended,
  reactPlugin.configs.recommended,
  {
    ignores: ['node_modules/*', 'dist/*', 'eslint.config.mjs'],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
