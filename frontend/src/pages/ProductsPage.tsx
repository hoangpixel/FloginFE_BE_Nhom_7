import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/categories';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/product';
import type { Product, ProductPayload, Category } from '../types';
import { logout } from '../services/auth';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import ProductDetail from '../components/ProductDetail';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';

export default function ProductsPage() {
  const nav = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [mode, setMode] = useState<ViewMode>('list');
  const [current, setCurrent] = useState<Product | null>(null);
  const user = useMemo(() => localStorage.getItem('username') ?? 'user', []);

  useEffect(() => {
    (async () => {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats as Category[]);
      setItems(prods);
    })();
  }, []);

  function onLogout() { logout(); nav('/login', { replace: true }); }

  async function handleSave(payload: ProductPayload) {
    if (mode === 'edit' && current) {
      const updated = await updateProduct(current.id, payload);
      setItems(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    } else {
      const created = await createProduct(payload);
      setItems(prev => [created, ...prev]);
    }
    setMode('list');
    setCurrent(null);
  }

  async function onDelete(id: number) {
    if (!confirm('Xoá sản phẩm này?')) return;
    await deleteProduct(id);
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function startCreate() { setCurrent(null); setMode('create'); }
  function startEdit(p: Product) { setCurrent(p); setMode('edit'); }
  function startDetail(p: Product) { setCurrent(p); setMode('detail'); }
  function backToList() { setMode('list'); setCurrent(null); }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6" data-testid="products-page">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-3">
          {mode === 'list' && (
            <button className="px-3 py-2 rounded bg-black text-white" onClick={startCreate}>Thêm sản phẩm</button>
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
          categories={categories}
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
