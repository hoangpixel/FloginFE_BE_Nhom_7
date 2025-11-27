import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// SỬA 1: Đổi login thành loginUser
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

        // Validation giữ nguyên...
        const userError = validateUsername(username);
        if (userError) {
            setError(userError);
            return;
        }

        const passError = validatePassword(password);
        if (passError) {
            setError(passError);
            return;
        }

        setLoading(true);
        try {
            // SỬA 2: Gọi hàm loginUser thay vì login
            const res = await loginUser({ username, password });
            setLoading(false);

            if (res.success) {
                setSuccessMsg('thanh cong'); 
                setTimeout(() => nav('/products', { replace: true }), 500);
            } else {
                setError(res.message || 'Dang nhap that bai');
            }
        } catch (err) {
            setLoading(false);
            setError('Loi ket noi server');
        }
    }

    // Phần return giao diện giữ nguyên (code bạn viết đã chuẩn data-testid rồi)
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

                {error && (
                    <p className="text-red-600 text-sm" data-testid="username-error">
                        {error}
                    </p>
                )}

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