import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

const USER_RE = /^[A-Za-z0-9._-]{3,50}$/;
const PASS_RE = /^(?=.*[A-Za-z])(?=.*\d).{6,100}$/;

export default function LoginPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function clientValidate(): string | null {
    if (!USER_RE.test(username)) return 'Username 3–50, chỉ a-z A-Z 0-9 - . _';
    if (!PASS_RE.test(password)) return 'Password 6–100 và phải có chữ & số';
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = clientValidate();
    if (v) { setError(v); return; }

    setError(null);
    setLoading(true);

    const res = await login({ username, password });
    setLoading(false);

    if (res.success) {
      // token đã được lưu trong service nếu success
      nav('/products', { replace: true });
    } else {
      setError(res.message || 'Đăng nhập thất bại');
    }
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border w-full p-2 rounded"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="border w-full p-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded w-full">
          {loading ? 'Đang đăng nhập…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
