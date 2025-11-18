// Cài đặt thư viện: pnpm install --save-dev encoding
// Định nghĩa TextEncoder/TextDecoder cho môi trường Jest/JSDOM
const { TextEncoder, TextDecoder } = require('util');

if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
}