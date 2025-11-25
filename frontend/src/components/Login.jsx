import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';
// Import logic validate đã viết ở câu 2.1 để tái sử dụng
// Đảm bảo file validation.js nằm đúng đường dẫn '../validation' hoặc '../utils/validation' tùy cấu trúc folder của bạn
import { validateUsername, validatePassword } from '../utils/validation';

export default function Login() {
    const nav = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    // Bỏ định nghĩa type <string | null>, JS tự hiểu
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    async function onSubmit(e) {
        e.preventDefault();
        setSuccessMsg(null);
        setError(null);

        // --- 1. Client-side Validation (Sử dụng code từ validation.js) ---
        // Validate Username
        const userError = validateUsername(username);
        if (userError) {
            setError(userError);
            return;
        }

        // Validate Password
        const passError = validatePassword(password);
        if (passError) {
            setError(passError);
            return;
        }

        // --- 2. Call API ---
        setLoading(true);
        try {
            const res = await login({ username, password });
            setLoading(false);

            if (res.success) {
                // Text 'thanh cong' này quan trọng để khớp với Integration Test (Listing 5 - Page 14)
                setSuccessMsg('thanh cong'); 
                // Redirect sau 0.5s
                setTimeout(() => nav('/products', { replace: true }), 500);
            } else {
                setError(res.message || 'Dang nhap that bai');
            }
        } catch (err) {
            setLoading(false);
            setError('Loi ket noi server');
        }
    }

    return (
        <div className="p-6 max-w-sm mx-auto" data-testid="login-page">
            <h1 className="text-2xl font-semibold mb-4">Login</h1>
            
            <form onSubmit={onSubmit} className="space-y-3" data-testid="login-form">
                <div className="flex flex-col gap-1">
                    <input 
                        className="border w-full p-2 rounded" 
                        placeholder="Username" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        // data-testid dùng cho integration test và E2E test
                        data-testid="username-input" 
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <input 
                        className="border w-full p-2 rounded" 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        data-testid="password-input" 
                    />
                </div>

                {/* Hiển thị lỗi - data-testid="username-error" khớp với PDF trang 14 */}
                {error && (
                    <p className="text-red-600 text-sm" data-testid="username-error">
                        {error}
                    </p>
                )}

                {/* Hiển thị thành công - data-testid="login-message" khớp với PDF trang 14 */}
                {successMsg && (
                    <p className="text-green-600 text-sm" data-testid="login-message">
                        {successMsg}
                    </p>
                )}

                <button 
                    disabled={loading} 
                    className="bg-black text-white px-4 py-2 rounded w-full disabled:opacity-50" 
                    data-testid="login-button"
                >
                    {loading ? 'Dang dang nhap...' : 'Login'}
                </button>
            </form>
        </div>
    );
}