module.exports = {
  clearMocks: true,

  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules/(?!preact)/'],
  // Remove "snapshotFormat" and update to new format once initial PR is merged
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
};
