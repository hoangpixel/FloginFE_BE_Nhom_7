// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  // Chỉ cần khai báo 1 lần thôi
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },

  testMatch: [
    '<rootDir>/src/tests/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
  ],

  // --- CẤU HÌNH COVERAGE ---
  // Để false để không chạy coverage mỗi lần test thường (cho nhanh)
  collectCoverage: true,

  // Xuất ra nhiều định dạng: xem trên terminal (text), xem web (lcov)
  coverageReporters: ['text', 'text-summary', 'lcov'],
};