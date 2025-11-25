import http from 'k6/http';
import { check, sleep } from 'k6';

// 1. Cấu hình Load & Stress Test (Yêu cầu b - dòng 1, 2)
export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Giai đoạn 1: Tăng lên 100 users (Load test nhẹ)
    { duration: '1m',  target: 500 },  // Giai đoạn 2: Tăng lên 500 users
    { duration: '1m',  target: 1000 }, // Giai đoạn 3: Stress test cực đại (1000 users)
    { duration: '30s', target: 0 },    // Giai đoạn 4: Giảm dần về 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // Yêu cầu 95% request phải phản hồi dưới 500ms
    http_req_failed: ['rate<0.01'],   // Tỉ lệ lỗi phải dưới 1%
  },
};

const BASE_URL = 'http://localhost:3000'; // Đổi thành link API thật của bạn

export default function () {
  // --- YÊU CẦU B: Test Login API ---
  const loginPayload = JSON.stringify({
    username: 'admin',
    password: 'password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Gửi request POST đăng nhập
  const loginRes = http.post(`${BASE_URL}/api/login`, loginPayload, params);

  // Kiểm tra kết quả Login
  check(loginRes, {
    'Login status is 200': (r) => r.status === 200,
    'Token exists': (r) => r.json('token') !== '',
  });

  // Lấy token để dùng cho API Product (nếu cần)
  const authToken = loginRes.json('token');
  
  // --- YÊU CẦU C: Test Product API ---
  const productParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`, // Gắn token vào
    },
  };

  // Gửi request GET lấy danh sách sản phẩm
  const productRes = http.get(`${BASE_URL}/api/products`, productParams);

  // Kiểm tra API Product
  check(productRes, {
    'Product List status is 200': (r) => r.status === 200,
    'Response time < 500ms': (r) => r.timings.duration < 500, // Yêu cầu b - dòng 3 (Response time analysis)
  });

  sleep(1); // Nghỉ 1 giây giữa các lần gửi request
}