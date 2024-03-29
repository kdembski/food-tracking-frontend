// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  coverageProvider: "v8",
  collectCoverageFrom: [
    "src/**/*.{js,ts,vue}",
    "!src/**/*.stories.js",
    "!src/main.ts",
    "!src/App.vue",
    "!src/font-awesome.ts",
    "!src/index.d.ts",
    "!src/services/*",
    "!src/types/**",
  ],
  moduleFileExtensions: ["js", "json", "vue", "ts"],
  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/src/$1",
    ".+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
  preset: "ts-jest",
  setupFiles: ["<rootDir>/jest/setup-jest"],
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/unit/**/*.test.ts"],
  transform: {
    ".*\\.(vue)$": "@vue/vue3-jest",
    ".*\\.(ts)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
    ".+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$":
      "jest-transform-stub",
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/(?!date-fns/)"],
};
