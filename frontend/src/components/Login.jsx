import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
        setError(res.message || 'Dang nhap that bai');
      }
    } catch (err) {
      setLoading(false);
      setError('Loi ket noi server');
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#ffe3c4] via-[#f7c07a] to-[#ffb36a] relative overflow-hidden flex items-center justify-center" data-testid="login-page">
      <div className="absolute inset-0 pointer-events-none opacity-30">
      </div>

      <div className="backdrop-blur-md bg-white/40 shadow-xl rounded-2xl w-full max-w-md mx-4 border border-white/50">
        <div className="p-8">
          <h1 className="text-3xl font-semibold text-center text-[#7a2e1b] mb-6">Sign In</h1>

          <form onSubmit={onSubmit} className="space-y-4" data-testid="login-form">
            <div className="flex flex-col">
              <input
                className="w-full rounded-md bg-white text-[#5a3b2e] placeholder-[#8b6a5e] border border-[#e9d6c6] focus:border-[#c08c6a] focus:ring-2 focus:ring-[#c08c6a] px-4 py-3"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                data-testid="username-input"
              />
            </div>

            <div className="flex flex-col">
              <input
                className="w-full rounded-md bg-white text-[#5a3b2e] placeholder-[#8b6a5e] border border-[#e9d6c6] focus:border-[#c08c6a] focus:ring-2 focus:ring-[#c08c6a] px-4 py-3"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                data-testid="password-input"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm" data-testid="username-error">{error}</p>
            )}

            {successMsg && (
              <p className="text-green-600 text-sm" data-testid="login-message">{successMsg}</p>
            )}

            <button
              disabled={loading}
              className="w-full rounded-md bg-[#7a2e1b] hover:bg-[#6a2717] text-white py-3 transition disabled:opacity-50"
              data-testid="login-button"
            >
              {loading ? 'Dang dang nhap...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-[#6b4a3c]">
            <button type="button" className="text-sm underline underline-offset-2 hover:text-[#7a2e1b]">
              Forget Password
            </button>
            <Link to="/signup" className="text-sm underline underline-offset-2 hover:text-[#7a2e1b]">
              Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}