// src/components/ProductDialog.tsx
import { useEffect, useState } from 'react';
import type { Category, Product, ProductPayload } from '../types';

// Validate thuần khớp BE
function validateProduct(form: ProductPayload) {
  const fieldErrors: Partial<Record<keyof ProductPayload, string>> = {};
  const invalidList: string[] = [];

  const name = (form.name ?? '').trim();
  if (!name || name.length < 3 || name.length > 100) {
    fieldErrors.name = 'Name phải từ 3–100 ký tự';
    invalidList.push(fieldErrors.name);
  }

  const priceNum = Number(form.price);
  if (!(priceNum > 0 && priceNum <= 999_999_999)) {
    fieldErrors.price = 'Price > 0 và ≤ 999,999,999';
    invalidList.push(fieldErrors.price);
  }

  const qtyNum = Number(form.quantity);
  if (!(qtyNum >= 0 && qtyNum <= 99_999)) {
    fieldErrors.quantity = 'Quantity ≥ 0 và ≤ 99,999';
    invalidList.push(fieldErrors.quantity);
  }

  const desc = form.description ?? '';
  if (desc.length > 500) {
    fieldErrors.description = 'Description ≤ 500 ký tự';
    invalidList.push(fieldErrors.description);
  }

  if (!form.category) {
    fieldErrors.category = 'Category bắt buộc';
    invalidList.push(fieldErrors.category);
  }

  return { fieldErrors, invalidList };
}

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (payload: ProductPayload) => void | Promise<void>;
  categories: Category[];
  initial: Product | null;
  mode: 'create' | 'edit' | 'view';
};

export default function ProductDialog({
  open, onClose, onSave, categories, initial, mode
}: Props) {
  const [form, setForm] = useState<ProductPayload>({
    name: '',
    price: 0,
    quantity: 0,
    description: '',
    category: (categories[0] || 'ELECTRONICS') as Category,
  });

  // trạng thái hiển thị lỗi
  const [touched, setTouched] = useState<Partial<Record<keyof ProductPayload, boolean>>>({});
  const [showAllErrors, setShowAllErrors] = useState(false);

  // fill form theo initial / reset khi mở
  useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        name: initial.name,
        price: initial.price,
        quantity: initial.quantity,
        description: initial.description || '',
        category: initial.category as Category,
      });
    } else {
      setForm({
        name: '',
        price: 0,
        quantity: 0,
        description: '',
        category: (categories[0] || 'ELECTRONICS') as Category,
      });
    }
    // reset hiển thị lỗi mỗi lần mở
    setTouched({});
    setShowAllErrors(false);
  }, [initial, categories, open]);

  // đóng bằng ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const readOnly = mode === 'view';
  const title = mode === 'create' ? 'Thêm sản phẩm'
    : mode === 'edit' ? 'Sửa sản phẩm'
      : 'Chi tiết sản phẩm';

  function onChange<K extends keyof ProductPayload>(k: K, v: ProductPayload[K]) {
    setForm(prev => ({ ...prev, [k]: v }));
  }
  function onBlur<K extends keyof ProductPayload>(k: K) {
    setTouched(prev => ({ ...prev, [k]: true }));
  }
  const shouldShow = (k: keyof ProductPayload) => showAllErrors || !!touched[k];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (readOnly) return;

    const { invalidList } = validateProduct(form);
    if (invalidList.length > 0) {
      // Hiển thị toàn bộ lỗi và đánh dấu touched cho tất cả field để hiện class đỏ
      setTouched({ name: true, price: true, quantity: true, description: true, category: true });
      setShowAllErrors(true);
      return;
    }
    await onSave(form);
    onClose();
  }

  // click ra ngoài để đóng
  function handleOverlayMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // gọi validate (không phải hook)
  const { fieldErrors, invalidList } = validateProduct(form);

  const errCls = (showErr?: boolean) =>
    `border w-full p-2.5 rounded-lg outline-none ${showErr
      ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500'
      : 'focus:ring-2 focus:ring-black/60 focus:border-black/60'
    } ${readOnly ? 'bg-slate-50 text-slate-700' : ''}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
      onMouseDown={handleOverlayMouseDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="w-full max-w-2xl mx-4 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        {/* Header */}
        <div className="relative px-6 py-4 border-b bg-gradient-to-r from-white to-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-black text-white grid place-items-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 3H3v7h7V3zM21 3h-7v7h7V3zM21 14h-7v7h7v-7zM10 14H3v7h7v-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 id="dialog-title" className="text-lg font-semibold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-500">Quản lý thông tin sản phẩm</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.3 5.71 12 12.01l-6.29-6.3-1.41 1.42L10.59 13.4l-6.3 6.29 1.42 1.41 6.29-6.3 6.29 6.3 1.41-1.41-6.29-6.29 6.29-6.29z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <form id="product-form" onSubmit={submit} className="p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Tên sản phẩm</label>
            <input
              className={errCls(shouldShow('name') && !!fieldErrors.name)}
              placeholder="Product name (3–100)"
              value={form.name}
              onChange={e => onChange('name', e.target.value)}
              onBlur={() => onBlur('name')}
              disabled={readOnly}
              aria-invalid={shouldShow('name') && !!fieldErrors.name}
            />
            {shouldShow('name') && fieldErrors.name && (
              <p className="text-sm text-red-600" data-testid="error-name">{fieldErrors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Giá</label>
              <input
                className={errCls(shouldShow('price') && !!fieldErrors.price)}
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={e => onChange('price', Number(e.target.value))}
                onBlur={() => onBlur('price')}
                disabled={readOnly}
                min={0}
                aria-invalid={shouldShow('price') && !!fieldErrors.price}
              />
              {shouldShow('price') && fieldErrors.price && (
                <p className="text-sm text-red-600" data-testid="error-price">{fieldErrors.price}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Số lượng</label>
              <input
                className={errCls(shouldShow('quantity') && !!fieldErrors.quantity)}
                type="number"
                placeholder="Quantity"
                value={form.quantity}
                // *** ĐÃ SỬA: Đảm bảo giá trị âm được đọc đúng cho test (dù min=0) ***
                onChange={e => {
                  const rawValue = e.target.value;
                  const val = rawValue === '' ? 0 : Number(rawValue);
                  onChange('quantity', val);
                }}
                onBlur={() => onBlur('quantity')}
                disabled={readOnly}
                min={0}
                aria-invalid={shouldShow('quantity') && !!fieldErrors.quantity}
              />
              {shouldShow('quantity') && fieldErrors.quantity && (
                <p className="text-sm text-red-600" data-testid="error-quantity">{fieldErrors.quantity}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Danh mục</label>
              <select
                className={errCls(shouldShow('category') && !!fieldErrors.category)}
                value={form.category}
                onChange={e => onChange('category', e.target.value as Category)}
                onBlur={() => onBlur('category')}
                disabled={readOnly}
                aria-invalid={shouldShow('category') && !!fieldErrors.category}
                data-testid="field-category"
              >
                <option value="">--Chọn--</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {shouldShow('category') && fieldErrors.category && (
                <p className="text-sm text-red-600" data-testid="error-category">{fieldErrors.category}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Mô tả (tối đa 500)</label>
              <textarea
                className={errCls(shouldShow('description') && !!fieldErrors.description)}
                placeholder="Description (≤ 500)"
                value={form.description}
                onChange={e => onChange('description', e.target.value)}
                onBlur={() => onBlur('description')}
                rows={3}
                disabled={readOnly}
                aria-invalid={shouldShow('description') && !!fieldErrors.description}
                data-testid="field-description"
              />
              {shouldShow('description') && fieldErrors.description && (
                <p className="text-sm text-red-600" data-testid="error-description">{fieldErrors.description}</p>
              )}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-slate-50 rounded-b-2xl flex items-center justify-between">
          {showAllErrors && invalidList.length > 0 && !readOnly ? (
            <p className="text-sm text-red-600" data-testid="summary-errors">
              • Còn {invalidList.length} lỗi — vui lòng kiểm tra các trường bôi đỏ.
            </p>
          ) : <span data-testid="summary-none" />}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg border hover:bg-white text-slate-700"
            >
              {readOnly ? 'Đóng' : 'Huỷ'}
            </button>
            {!readOnly && (
              <button
                type="submit"
                form="product-form"
                className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
                data-testid="btn-save"
              >
                Lưu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export { validateProduct }; // export for direct unit tests to increase coverage