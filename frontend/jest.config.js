// jest.config.js
export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[tj]sx?$': 'ts-jest',
    },
    
    // THÊM ĐƯỜNG DẪN TEST CỦA BẠN VÀO ĐÂY
    testMatch: [
        "<rootDir>/src/tests/**/*.{js,jsx,ts,tsx}",
        "<rootDir>/src/**/*.test.{js,jsx,ts,tsx}" 
    ]
};