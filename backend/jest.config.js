export default {
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/beautifier\\.test\\.ts$'],
  transform: {
    '^.+\\.(ts|js)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@openrouter)/)',
  ],
};
