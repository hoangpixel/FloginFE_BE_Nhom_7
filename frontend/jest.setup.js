// jest.setup.js (hoặc .cjs)

// 1. Import TextEncoder từ node 'util'
import { TextEncoder, TextDecoder } from 'util';

// 2. Gán vào global để môi trường JSDOM hiểu được
Object.assign(global, { TextEncoder, TextDecoder });

// 3. Import thư viện matcher của testing-library (để dùng .toBeInTheDocument()...)
import '@testing-library/jest-dom';