import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API || 'http://localhost:8080/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const t = localStorage.getItem('token');
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default api;
