module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/jest.config.js",
  ],
  coverageThreshold: {
    global: {
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/controllers/",
    "/routes/",
    "/middleware/",
    "index.js",
    "/wss clients/",
    "/dtos/"
  ],
  setupFiles: ["<rootDir>/__tests__/setup.js"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setupAfterEnv.js"],
};
