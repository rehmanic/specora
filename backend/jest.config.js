export default {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "modules/**/*.js",
    "core/**/*.js",
    "!**/node_modules/**",
    "!**/tests/**",
    "!**/coverage/**",
  ],
  testMatch: [
    "**/tests/**/*.test.js",
    "**/tests/**/*.spec.js",
  ],
  transform: {},
  moduleFileExtensions: ["js", "json"],
  verbose: true,
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
