import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/product';
import { logout } from '../services/auth';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';

// --- SỬA Ở ĐÂY: Thêm dấu { } vào import để khớp với file ProductDetail ---
import { ProductDetail } from '../components/ProductDetail'; 

// Import danh mục cứng
import { VALID_CATEGORIES } from '../utils/productValidation'; 

export default function ProductsPage() {
  const nav = useNavigate();
  // State categories không cần thiết nữa vì đã có VALID_CATEGORIES
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState('list'); // 'list' | 'create' | 'edit' | 'detail'
  const [current, setCurrent] = useState(null);
  
  const user = useMemo(() => localStorage.getItem('username') ?? 'user', []);

  // Load danh sách sản phẩm khi vào trang
  useEffect(() => {
    (async () => {
      try {
        const prods = await getProducts();
        setItems(prods);
      } catch (error) {
        console.error("Loi khi tai danh sach san pham", error);
      }
    })();
  }, []);

  function onLogout() { 
    logout(); 
    nav('/login', { replace: true }); 
  }

  async function handleSave(payload) {
    try {
      if (mode === 'edit' && current) {
        const updated = await updateProduct(current.id, payload);
        setItems(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      } else {
        const created = await createProduct(payload);
        setItems(prev => [created, ...prev]); // Thêm mới lên đầu danh sách
      }
      // Reset về list
      setMode('list');
      setCurrent(null);
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu sản phẩm: ' + error.message);
    }
  }

  async function onDelete(id) {
    // Lưu ý: Cypress mặc định auto-confirm các window.confirm này
    if (!window.confirm('Xoá sản phẩm này?')) return;
    
    try {
      await deleteProduct(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      alert('Không thể xóa sản phẩm');
    }
  }

  function startCreate() { 
    setCurrent(null); 
    setMode('create'); 
  }
  
  function startEdit(p) { 
    setCurrent(p); 
    setMode('edit'); 
  }
  
  function startDetail(p) { 
    setCurrent(p); 
    setMode('detail'); 
  }
  
  function backToList() { 
    setMode('list'); 
    setCurrent(null); 
  }

  return (
    // data-testid="products-page" khớp với Listing 15 trong PDF (cy.visit)
    <div className="max-w-5xl mx-auto p-6 space-y-6" data-testid="products-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-3">
          {mode === 'list' && (
            <button 
              className="px-3 py-2 rounded bg-black text-white" 
              onClick={startCreate}
              // QUAN TRỌNG: data-testid này bắt buộc phải có để chạy E2E Test (Listing 15)
              data-testid="add-product-btn"
            >
              Thêm sản phẩm
            </button>
          )}
          <span className="text-sm text-gray-600">Hi, {user}</span>
          <button className="px-3 py-1 border rounded" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {mode === 'list' && (
        <ProductList
          items={items}
          onView={startDetail}
          onEdit={startEdit}
          onDelete={onDelete}
        />
      )}

      {(mode === 'create' || mode === 'edit') && (
        <ProductForm
          mode={mode === 'create' ? 'create' : 'edit'}
          // Truyền trực tiếp danh sách categories vào form
          categories={VALID_CATEGORIES}
          initial={mode === 'edit' ? current : null}
          onSave={handleSave}
          onCancel={backToList}
        />
      )}

      {mode === 'detail' && (
        <ProductDetail
          product={current}
          onClose={backToList}
          onEdit={(p) => startEdit(p)}
        />
      )}
    </div>
  );
}