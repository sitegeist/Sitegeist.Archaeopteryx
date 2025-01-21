module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    "node_modules/(?!(.*@neos-project/positional-array-sorter.*)/)" // Allow Jest to transform this specific module
  ],
};
