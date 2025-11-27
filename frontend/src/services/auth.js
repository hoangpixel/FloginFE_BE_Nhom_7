import api from '../../lib/axios';

/**
 * Gọi API đăng nhập
 * @param {Object} body - { username, password }
 * @returns {Promise<Object>} - Luôn trả về object { success, message, token?, username? }
 */
export async function loginUser(body) {
  try {
    // Gọi API, axios trả về object có thuộc tính 'data'
    const { data } = await api.post('/auth/login', body);

    // Nếu BE trả về success: true và có token thì lưu vào localStorage
    if (data.success && data.token) {
      localStorage.setItem('token', data.token);
      if (data.username) {
        localStorage.setItem('username', data.username);
      }
    }
    return data;
  } catch (err) {
    // Lấy data lỗi từ response (nếu có)
    const errorResponse = err?.response;
    const errorData = errorResponse?.data;
    const status = errorResponse?.status;

    // Trả về object lỗi chuẩn hóa để UI hiển thị dễ dàng
    return {
      success: false,
      message:
        errorData?.message ?? // Ưu tiên message từ Backend trả về
        (status === 401
          ? 'Sai username hoac password' // Khớp logic PDF trang 6 (Authentication flow)
          : status === 400
          ? 'Sai dinh dang username/password'
          : 'Co loi xay ra. Thu lai sau.'),
    };
  }
}

/**
 * Đăng xuất: Xóa token khỏi localStorage
 */
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
}

/**
 * Kiểm tra xem user đã đăng nhập chưa (dựa vào token)
 * @returns {boolean}
 */
export function isAuthed() {
  // Ép kiểu về boolean: nếu có string token -> true, nếu null -> false
  return !!localStorage.getItem('token');
}