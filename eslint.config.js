import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    ignores: ['node_modules', 'dist'],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: typescriptEslintParser,
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: eslintPluginPrettier,
    },
    rules: {
      ...eslintPluginPrettier.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
];
