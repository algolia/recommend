/* eslint-disable import/no-commonjs */
const OFF = 0;
// const WARNING = 1;
const ERROR = 2;

module.exports = {
  plugins: ['prettier'],
  extends: ['algolia', 'algolia/jest', 'algolia/react', 'algolia/typescript'],
  globals: {
    __DEV__: false,
    __TEST__: false,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'prettier/prettier': ERROR,
    curly: ERROR,
    'no-param-reassign': OFF,
    'valid-jsdoc': OFF,
    'prefer-template': OFF,
    'eslint-comments/disable-enable-pair': [ERROR, { allowWholeFile: true }],
    'import/extensions': OFF,
    'no-unused-expressions': OFF,
    'no-lonely-if': OFF,
    'react/prop-types': OFF,
    '@typescript-eslint/explicit-function-return-type': OFF,
    'react/function-component-definition': OFF,
    'react/button-has-type': OFF,
    'jsdoc/check-tag-names': OFF,
    '@typescript-eslint/consistent-type-imports': OFF,
    'react/jsx-fragments': OFF,
    '@typescript-eslint/ban-types': OFF,
    'import/order': [
      ERROR,
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '@/**/*',
            group: 'parent',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
  },
  overrides: [
    {
      files: ['scripts/**', '*.config.js'],
      rules: {
        'import/no-commonjs': OFF,
      },
    },
    {
      files: ['test/**', '**/__tests__/**', '*.config.js'],
      rules: {
        'import/no-extraneous-dependencies': OFF,
        '@typescript-eslint/no-shadow': OFF,
        'jest/consistent-test-it': OFF,
      },
    },
    {
      files: ['*.d.ts'],
      rules: { '@typescript-eslint/naming-convention': OFF },
    },
  ],
};
