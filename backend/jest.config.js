export default {
  // The test environment that will be used for testing
  testEnvironment: "node",
  
  // Use this to handle ESM
  transform: {},
  
  // Setup files to run before the tests
  setupFilesAfterEnv: ['./src/tests/setup/jest-setup.js'],
  
  // Tell Jest to treat these as ESM
  extensionsToTreatAsEsm: ['.jsx'],
  
  // Support for experimental Node.js ESM
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};
