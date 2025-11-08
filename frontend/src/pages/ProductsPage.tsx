import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/categories';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/product';
import type { Product, ProductPayload, Category } from '../types';
import { logout } from '../services/auth';
import ProductDialog from '../components/ProductDialog';

export default function ProductsPage() {
  const nav = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [openDlg, setOpenDlg] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const user = useMemo(() => localStorage.getItem('username') ?? 'user', []);

  useEffect(() => {
    (async () => {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats as Category[]);
      setItems(prods);
    })();
  }, []);

  function onLogout() {
    logout();
    nav('/login', { replace: true });
  }

  // Handler lưu của dialog (tạo hoặc sửa)
  async function handleSave(payload: ProductPayload) {
    if (editing) {
      const updated = await updateProduct(editing.id, payload);
      setItems(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    } else {
      const created = await createProduct(payload);
      setItems(prev => [created, ...prev]);
    }
  }

  async function onDelete(id: number) {
    if (!confirm('Xoá sản phẩm này?')) return;
    await deleteProduct(id);
    setItems(items.filter(i => i.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-3">
          <button
            className="px-3 py-2 rounded bg-black text-white"
            onClick={() => { setEditing(null); setOpenDlg(true); }}
          >
            Thêm sản phẩm
          </button>
          <span className="text-sm text-gray-600">Hi, {user}</span>
          <button className="px-3 py-1 border rounded" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* List */}
      <table className="w-full border">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Qty</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id}>
              <td className="p-2 border text-center">{p.id}</td>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border text-right">{p.price.toLocaleString()}</td>
              <td className="p-2 border text-right">{p.quantity}</td>
              <td className="p-2 border">{p.category}</td>
              <td className="p-2 border text-center space-x-2">
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => { setEditing(p); setOpenDlg(true); }}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 border rounded"
                  onClick={() => onDelete(p.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} className="p-3 text-center text-gray-500">Chưa có sản phẩm</td></tr>
          )}
        </tbody>
      </table>

      {/* Dialog */}
      <ProductDialog
        open={openDlg}
        onClose={() => setOpenDlg(false)}
        onSave={handleSave}
        categories={categories}
        initial={editing}
      />
    </div>
  );
}
