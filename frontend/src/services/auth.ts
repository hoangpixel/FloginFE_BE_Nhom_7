import api from '../lib/axios';

export type LoginRequest = { username: string; password: string };
export type LoginResponse = { token: string; username: string };

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await api.post('/auth/login', data);
  return res.data;
}
