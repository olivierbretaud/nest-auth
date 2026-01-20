import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  setupFiles: ['dotenv/config'],
  testEnvironment: 'node',

  testMatch: [
    '**/*.spec.ts',
    '**/*.e2e-spec.ts',
  ],

  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
  ],

  testTimeout: 30000,
  verbose: true,
};

export default config;