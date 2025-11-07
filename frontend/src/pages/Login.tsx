import React, { useState } from 'react';
import { login } from '../services/auth';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const { login: saveToken } = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      const res = await login({ username, password });
      saveToken(res.token);
      nav('/products', { replace: true });
    } catch {
      setMsg('Sai tài khoản hoặc mật khẩu');
    } finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#f6f7fb'}}>
      <form onSubmit={submit} style={{width:360, background:'#fff', padding:24, borderRadius:16, boxShadow:'0 10px 30px rgba(0,0,0,.08)'}}>
        <h2 style={{marginTop:0, marginBottom:16}}>Đăng nhập</h2>
        <label>Tên đăng nhập</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} style={inp}/>
        <label>Mật khẩu</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={inp}/>
        <button type="submit" disabled={loading} style={btn}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        <div style={{color: 'crimson', marginTop:8}}>{msg}</div>
        <p style={{opacity:.6, fontSize:12, marginTop:12}}>Demo: admin / 123456</p>
      </form>
    </div>
  );
}

const inp: React.CSSProperties = { width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:10, margin:'6px 0 12px' };
const btn: React.CSSProperties = { width:'100%', padding:'10px 12px', borderRadius:10, border:'none', background:'#3b82f6', color:'#fff', fontWeight:600 };
