// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  testMatch: [
    '<rootDir>/src/tests/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/test/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
  ],

  // ➡️ THÊM DÒNG NÀY VÀO ĐÂY
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // --------------------------------------------------

  // Coverage: để script quyết định collectCoverageFrom
  collectCoverage: true,
  coverageReporters: ['text', 'text-summary', 'lcov'],
  coverageThreshold: {
    global: { branches: 90, functions: 90, lines: 90, statements: 90 },
  },
};