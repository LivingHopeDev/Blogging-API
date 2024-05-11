export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {},
  // Enable support for ES6 modules
  extensionsToTreatAsEsm: [".js"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
