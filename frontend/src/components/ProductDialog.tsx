import { useEffect, useState } from 'react';
import type { Category, Product, ProductPayload } from '../types';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: ProductPayload) => Promise<void>;
  categories: Category[];
  initial?: Product | null; // null = create, có giá trị = edit
};

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

export default function ProductDialog({ open, onClose, onSave, categories, initial }: Props) {
  const [form, setForm] = useState<ProductPayload>({
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    category: (categories[0] ?? 'ELECTRONICS') as Category,
  });
  const [errs, setErrs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initial) {
      // Edit
      setForm({
        name: initial.name,
        price: initial.price,
        quantity: initial.quantity,
        description: initial.description ?? '',
        category: initial.category as Category,
      });
    } else {
      // Create
      setForm({
        name: '',
        price: 0,
        quantity: 0,
        description: '',
        category: (categories[0] ?? 'ELECTRONICS') as Category,
      });
    }
    setErrs([]);
  }, [open, initial, categories]);

  function onChange<K extends keyof ProductPayload>(k: K, v: ProductPayload[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate(form);
    setErrs(v);
    if (v.length) return;

    setLoading(true);
    try {
      await onSave({
        name: form.name.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
        description: form.description?.trim() || '',
        category: form.category,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold">
          {initial ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
        </h2>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="px-3 py-2 rounded border"
              onClick={onClose}
              disabled={loading}
            >
              Huỷ
            </button>
            <button
              className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Đang lưu…' : (initial ? 'Cập nhật' : 'Tạo mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
