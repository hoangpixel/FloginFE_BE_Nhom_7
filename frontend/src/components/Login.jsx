import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/auth';
import { validateUsername, validatePassword } from '../utils/validation';

export default function Login() {
  const nav = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setSuccessMsg(null);
    setError(null);

    const userError = validateUsername(username);
    if (userError) { setError(userError); return; }
    const passError = validatePassword(password);
    if (passError) { setError(passError); return; }

    setLoading(true);
    try {
      const res = await loginUser({ username, password });
      setLoading(false);
      if (res.success) {
        setSuccessMsg('thanh cong');
        setTimeout(() => nav('/products', { replace: true }), 500);
      } else {
        setError(res.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setLoading(false);
      setError('Lỗi kết nối server');
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4" data-testid="login-page">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
        
        {/* --- Header --- */}
        <div className="bg-[#7a2e1b] p-8 text-center">
          <div className="mx-auto h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Welcome Back</h1>
          <p className="text-orange-100 mt-2 text-sm">Đăng nhập để quản lý kho hàng của bạn</p>
        </div>

        {/* --- Form Body --- */}
        <div className="p-8 pt-10">
          <form onSubmit={onSubmit} className="space-y-6" data-testid="login-form">
            
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
              <div className="relative">
                <input
                  className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#7a2e1b] focus:ring-2 focus:ring-[#7a2e1b]/20 outline-none transition-all text-gray-800 placeholder-gray-400"
                  placeholder="Nhập username..."
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  data-testid="username-input"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
              <input
                className="w-full pl-4 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-[#7a2e1b] focus:ring-2 focus:ring-[#7a2e1b]/20 outline-none transition-all text-gray-800 placeholder-gray-400"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                data-testid="password-input"
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-red-100 animate-fade-in" data-testid="username-error">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-green-100 animate-fade-in" data-testid="login-message">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {successMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#7a2e1b] to-[#a03b22] hover:from-[#652516] hover:to-[#8a331d] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              data-testid="login-button"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>
        </div>
        
        {/* Footer decoration */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">© 2025 Flogin Project - Nhóm 7. Faculty of Information Technology, Saigon University.</p>
        </div>
      </div>
    </div>
  );
}
