import { useEffect, useMemo, useState } from 'react';
import { getCategories } from '../services/categories';
import { createProduct, deleteProduct, getProducts } from '../services/product';
import type { Product, ProductPayload, Category } from '../types';
import { logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';

function validate(p: ProductPayload): string[] {
  const errs: string[] = [];
  if (!p.name || p.name.trim().length < 3 || p.name.trim().length > 100)
    errs.push('Name phải 3–100 ký tự');
  if (!(p.price > 0 && p.price <= 999_999_999))
    errs.push('Price > 0 và ≤ 999,999,999');
  if (!(p.quantity >= 0 && p.quantity <= 99_999))
    errs.push('Quantity ≥ 0 và ≤ 99,999');
  if (p.description && p.description.length > 500)
    errs.push('Description ≤ 500 ký tự');
  if (!p.category) errs.push('Category bắt buộc');
  return errs;
}

export default function ProductsPage() {
  const nav = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductPayload>({
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    category: 'ELECTRONICS',
  } as ProductPayload);
  const [errs, setErrs] = useState<string[]>([]);
  const user = useMemo(() => localStorage.getItem('username') ?? 'user', []);

  useEffect(() => {
    (async () => {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats as Category[]);
      setItems(prods);
      if (cats.length) setForm(f => ({ ...f, category: cats[0] as Category }));
    })();
  }, []);

  function onChange<K extends keyof ProductPayload>(k: K, v: ProductPayload[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const vErrs = validate(form);
    setErrs(vErrs);
    if (vErrs.length) return;

    const created = await createProduct({
      name: form.name.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      description: form.description?.trim() || '',
      category: form.category,
    });
    setItems([created, ...items]);
    // reset
    setForm(f => ({ ...f, name: '', price: 0, quantity: 0, description: '' }));
    setErrs([]);
  }

  async function onDelete(id: number) {
    if (!confirm('Xoá sản phẩm này?')) return;
    await deleteProduct(id);
    setItems(items.filter(i => i.id !== id));
  }

  function onLogout() {
    logout();
    nav('/login', { replace: true });
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Hi, {user}</span>
          <button className="px-3 py-1 border rounded" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Form tạo sản phẩm */}
      <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-4 rounded">
        <input
          className="border p-2 rounded"
          placeholder="Product name (3–100)"
          value={form.name}
          onChange={e => onChange('name', e.target.value)}
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => onChange('price', Number(e.target.value))}
        />
        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={e => onChange('quantity', Number(e.target.value))}
        />
        <select
          className="border p-2 rounded"
          value={form.category}
          onChange={e => onChange('category', e.target.value as Category)}
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <textarea
          className="md:col-span-2 border p-2 rounded"
          placeholder="Description (≤ 500)"
          value={form.description}
          onChange={e => onChange('description', e.target.value)}
          rows={3}
        />
        {errs.length > 0 && (
          <ul className="md:col-span-2 text-sm text-red-600 list-disc pl-5">
            {errs.map((er, i) => <li key={i}>{er}</li>)}
          </ul>
        )}
        <div className="md:col-span-2">
          <button className="bg-black text-white px-4 py-2 rounded">Create</button>
        </div>
      </form>

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
              <td className="p-2 border text-center">
                <button className="px-2 py-1 border rounded" onClick={() => onDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={6} className="p-3 text-center text-gray-500">Chưa có sản phẩm</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
