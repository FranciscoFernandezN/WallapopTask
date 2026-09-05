export default {
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|js)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@openrouter)/)',
  ],
};
