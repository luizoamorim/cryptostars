// The jest init command generate a big file, then let's create our own

module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts(x)?', '|src/**/stories.tsx'],
  setUpFilesAfterEnv: ['<rootDir>/.jest/setup.ts']
}
