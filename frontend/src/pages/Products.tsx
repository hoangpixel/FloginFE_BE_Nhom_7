import React from 'react';
import ProductList from '../components/ProductList';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Products(){
  const { logout } = useAuth();
  const nav = useNavigate();
  const out = () => { logout(); nav('/login', { replace:true }); };

  return (
    <div style={{padding:16}}>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <h1 style={{margin:0}}>Products</h1>
        <button onClick={out} style={{padding:'8px 12px', borderRadius:10, border:'1px solid #ddd'}}>Đăng xuất</button>
      </div>
      <ProductList />
    </div>
  );
}
