// Tests réseau contre l'API Frankfurter réelle, en environnement Node (fetch natif, non simulé).
const babelPresetExpo = require.resolve('babel-preset-expo', { paths: [require.resolve('expo')] });

module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.integration.test.ts'],
  transform: { '^.+\\.tsx?$': ['babel-jest', { presets: [babelPresetExpo] }] },
};
