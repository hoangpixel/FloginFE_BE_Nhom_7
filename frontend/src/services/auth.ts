import api from '../lib/axios';

export type LoginReq = { username: string; password: string };
export type LoginRes = {
  success: boolean;
  message: string;
  token?: string;
  username?: string;
};

/**
 * Gọi /auth/login và TRẢ VỀ LoginRes (không throw).
 * Nếu BE trả 400/401, mình bắt và map về {success:false, message:...}
 */
export async function login(body: LoginReq): Promise<LoginRes> {
  try {
    const { data } = await api.post<LoginRes>('/auth/login', body);
    // BE có thể trả 200 + success=true/false; nếu true thì lưu token
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      if (data.username) localStorage.setItem('username', data.username);
    }
    return data;
  } catch (err: any) {
    const data = err?.response?.data as Partial<LoginRes> | undefined;
    return {
      success: false,
      message:
        data?.message ??
        (err?.response?.status === 401
          ? 'Sai username hoặc password'
          : err?.response?.status === 400
          ? 'Sai định dạng username/password'
          : 'Có lỗi xảy ra. Thử lại sau.'),
    };
  }
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}

export function isAuthed(): boolean {
  return !!localStorage.getItem('token');
}
