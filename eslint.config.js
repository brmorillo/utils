const js = require('@eslint/js');
const globals = require('globals');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...js.configs.recommended.rules,

      // Formatting is owned by Prettier (`bun run format`); ESLint does not
      // police style. Enabling indent/quotes/semi/comma-dangle here only
      // duplicates Prettier and produces conflicting warnings.

      // TypeScript specific - relaxed
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      // `any` is a deliberate design choice across this library (dynamic
      // require() of optional peer deps, generic `<T = any>` passthrough,
      // logger `...meta: any[]`). The API is frozen (v14), so retyping public
      // signatures is out of scope; the rule is disabled rather than silenced
      // line-by-line with ~180 inline disable comments.
      '@typescript-eslint/no-explicit-any': 'off',

      // Best practices - relaxed
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-duplicate-imports': 'warn',
      'prefer-const': 'warn',
      'no-var': 'warn',
      'no-unused-vars': 'off', // Disable base rule
      'no-undef': 'off', // TypeScript handles this
      'no-useless-escape': 'warn',

      // Complexity - relaxed
      complexity: 'off',
      'max-depth': 'off',
      'max-lines-per-function': 'off',
    },
  },
  {
    files: ['tests/**/*.{js,ts}', '**/*.spec.{js,ts}', '**/*.test.{js,ts}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      '*.config.js',
      '*.config.ts',
      '.git/',
    ],
  },
];
