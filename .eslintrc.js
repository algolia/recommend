const OFF = 0;
// const WARNING = 1;
const ERROR = 2;

module.exports = {
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
    curly: ERROR,
    'no-param-reassign': OFF,
    'valid-jsdoc': OFF,
    'no-shadow': OFF,
    'prefer-template': OFF,
    'eslint-comments/disable-enable-pair': [ERROR, { allowWholeFile: true }],
    'import/extensions': OFF,
    'no-unused-expressions': OFF,
    'no-lonely-if': OFF,
    'react/prop-types': OFF,
    '@typescript-eslint/camelcase': [
      ERROR,
      {
        allow: ['hierarchical_categories'],
      },
    ],
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
      },
    },
  ],
};
