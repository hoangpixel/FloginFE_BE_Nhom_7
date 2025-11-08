import api from '../lib/axios';

type LoginReq = { username: string; password: string };
type LoginRes = { token: string; username: string };

export async function login(body: LoginReq): Promise<void> {
  const res = await api.post<LoginRes>('/auth/login', body);
  const data = res.data;
  localStorage.setItem('token', data.token);
  localStorage.setItem('username', data.username);
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}

export function isAuthed(): boolean {
  return !!localStorage.getItem('token');
}
