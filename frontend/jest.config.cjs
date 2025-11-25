// jest.config.cjs
module.exports = {
  // Môi trường giả lập trình duyệt
  testEnvironment: 'jsdom',

  // Nếu file setup của bạn vẫn là .js thì để nguyên, nếu đổi thành .cjs thì sửa ở đây
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Dùng babel-jest để xử lý file js/jsx
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },

  moduleNameMapper: {
    // Mock CSS
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Mock ảnh
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  testMatch: [
    '<rootDir>/src/tests/**/*.{js,jsx}',
    '<rootDir>/src/**/*.test.{js,jsx}',
  ],

  // Bỏ qua node_modules
  transformIgnorePatterns: [
    "/node_modules/"
  ]
};