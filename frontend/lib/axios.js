import axios from 'axios';

/**
 * Cấu hình Axios instance kết nối tới Spring Boot
 * BaseURL: http://localhost:8080/api (Theo cấu hình backend bài tập)
 */
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000, // Timeout sau 10s
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * Tự động gắn Bearer Token từ localStorage vào mỗi request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Trong JS thường không cần check config.headers tồn tại hay không 
      // vì axios mặc định đã tạo object này rồi.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Giữ nguyên lỗi để các service (auth.js, product.js) tự catch và xử lý UI
 */
api.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);

export default api;