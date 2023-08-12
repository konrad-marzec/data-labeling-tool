const pathJoin = require('path').join;

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [pathJoin(__dirname, '../core/tsconfig.json'), pathJoin(__dirname, '../../apps/docs/tsconfig.json')],
  },
  plugins: ['testing-library', 'import'],
  extends: [
    'xo',
    'turbo',
    'prettier',
    'xo-typescript',
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'import/order': [
      'error',
      {
        groups: [
          ['builtin', 'external'],
          ['internal', 'parent', 'sibling', 'index', 'object'],
        ],
        alphabetize: { order: 'asc', caseInsensitive: true },
        'newlines-between': 'always',
      },
    ],
    // Defer to Prettier
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',

    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          null: false,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['*.json'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/quotes': 'off',
        '@typescript-eslint/semi': 'off',
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/await-thenable': 'off',
        'max-nested-callbacks': 'off',
      },
    },
  ],
};
