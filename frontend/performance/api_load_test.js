import http from 'k6/http';
import { check, sleep } from 'k6';

const USER_COUNT = __ENV.USERS || 100;
const BASE_URL = 'http://localhost:8080';

export const options = {
  stages: [
    { duration: '30s', target: parseInt(USER_COUNT) },
    { duration: '1m', target: parseInt(USER_COUNT) },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    'http_req_duration{name:LoginRequest}': [],   
    'http_req_duration{name:ProductRequest}': [],
  },
};

export default function () {
  const loginPayload = JSON.stringify({
    username: 'admin',
    password: 'Test123',
  });

  const loginParams = {
    headers: { 'Content-Type': 'application/json' },
    tags: { name: 'LoginRequest' }, 
  };

  const loginRes = http.post(`${BASE_URL}/api/auth/login`, loginPayload, loginParams);

  check(loginRes, {
    'Login status 200': (r) => r.status === 200,
    'Has Token': (r) => r.json('token') !== undefined,
  });

  const token = loginRes.json('token');

  if (token) {
    const authParams = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      tags: { name: 'ProductRequest' }, 
    };

    const productRes = http.get(`${BASE_URL}/api/products`, authParams);

    check(productRes, {
      'Get Product status 200': (r) => r.status === 200,
    });
  }
  sleep(1);
}