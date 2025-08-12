export default {
  transform: {
    "^.+\\.js$": "babel-jest",
    "^.+\\.cjs$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!your-module-name)"
  ],
  moduleFileExtensions: ["js", "cjs", "jsx", "ts", "tsx"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  }
};
