module.exports = {
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  transformIgnorePatterns: ['node_modules/(?!preact)/'],
  // Remove "snapshotFormat" and update to new format once initial PR is merged
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
  testMatch: ['**/?(*.)+(test).ts?(x)'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
