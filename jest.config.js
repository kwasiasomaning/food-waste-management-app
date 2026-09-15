/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts', '**/*.test.js'],
  modulePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '/_shelved/'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          types: ['jest'],
          esModuleInterop: true,
          strict: true,
        },
      },
    ],
  },
};
