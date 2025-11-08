import api from '../lib/axios';
import type { LoginRequest, LoginResponse } from '../types';

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', body);
  // Lưu token/username để điều hướng và guard route
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
  return data;
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}
