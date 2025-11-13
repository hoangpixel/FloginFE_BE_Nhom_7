import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Gắn token nếu có
api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// ĐỪNG nuốt lỗi – để services/auth.ts tự xử lý status/message
api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);

export default api;
