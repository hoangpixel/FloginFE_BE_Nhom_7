import { useEffect, useState } from 'react';
import type { Category, ProductPayload, Product } from '../types';

// Moved validation logic inlined (file productDialog.validation.ts sẽ bị xoá)
function validateProduct(form: ProductPayload) {
    const fieldErrors: Partial<Record<keyof ProductPayload, string>> = {};
    const invalidList: string[] = [];
    const name = (form.name ?? '').trim();
    if (!name || name.length < 3 || name.length > 100) { fieldErrors.name = 'Name phải từ 3–100 ký tự'; invalidList.push(fieldErrors.name); }
    const priceNum = Number(form.price);
    if (!(priceNum > 0 && priceNum <= 999_999_999)) { fieldErrors.price = 'Price > 0 và ≤ 999,999,999'; invalidList.push(fieldErrors.price); }
    const qtyNum = Number(form.quantity);
    if (!(qtyNum >= 0 && qtyNum <= 99_999)) { fieldErrors.quantity = 'Quantity ≥ 0 và ≤ 99,999'; invalidList.push(fieldErrors.quantity); }
    const desc = form.description ?? '';
    if (desc.length > 500) { fieldErrors.description = 'Description ≤ 500 ký tự'; invalidList.push(fieldErrors.description); }
    if (!form.category) { fieldErrors.category = 'Category bắt buộc'; invalidList.push(fieldErrors.category); }
    return { fieldErrors, invalidList };
}

export type ProductFormMode = 'create' | 'edit';

interface ProductFormProps {
    mode: ProductFormMode;
    categories: Category[];
    initial: Product | null;
    onSave: (payload: ProductPayload) => Promise<void> | void;
    onCancel: () => void;
}

export default function ProductForm({ mode, categories, initial, onSave, onCancel }: ProductFormProps) {
    const [form, setForm] = useState<ProductPayload>({
        name: '', price: 0, quantity: 0, description: '', category: (categories[0] || 'ELECTRONICS') as Category,
    });
    const [touched, setTouched] = useState<Partial<Record<keyof ProductPayload, boolean>>>({});
    const [showAllErrors, setShowAllErrors] = useState(false);

    useEffect(() => {
        if (initial) {
            setForm({
                name: initial.name,
                price: initial.price,
                quantity: initial.quantity,
                description: initial.description || '',
                category: initial.category as Category,
            });
        } else {
            setForm({ name: '', price: 0, quantity: 0, description: '', category: (categories[0] || 'ELECTRONICS') as Category });
        }
        setTouched({});
        setShowAllErrors(false);
    }, [initial, categories, mode]);

    function onChange<K extends keyof ProductPayload>(k: K, v: ProductPayload[K]) { setForm(prev => ({ ...prev, [k]: v })); }
    function onBlur<K extends keyof ProductPayload>(k: K) { setTouched(prev => ({ ...prev, [k]: true })); }
    const shouldShow = (k: keyof ProductPayload) => showAllErrors || !!touched[k];

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        const { invalidList } = validateProduct(form);
        if (invalidList.length) {
            setTouched({ name: true, price: true, quantity: true, description: true, category: true });
            setShowAllErrors(true);
            return;
        }
        await onSave(form);
    }

    const { fieldErrors, invalidList } = validateProduct(form);
    const errCls = (showErr?: boolean) => `border w-full p-2.5 rounded-lg outline-none ${showErr ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' : 'focus:ring-2 focus:ring-black/60 focus:border-black/60'}`;
    const title = mode === 'create' ? 'Thêm sản phẩm' : 'Sửa sản phẩm';

    return (
        <div className="space-y-5" data-testid="product-form-wrapper">
            <h2 className="text-lg font-semibold">{title}</h2>
            <form onSubmit={submit} className="space-y-5" data-testid="product-form">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium" htmlFor="pf-name">Tên sản phẩm</label>
                    <input id="pf-name" data-testid="product-name" className={errCls(shouldShow('name') && !!fieldErrors.name)} placeholder="Product name (3–100)" value={form.name} onChange={e => onChange('name', e.target.value)} onBlur={() => onBlur('name')} aria-invalid={shouldShow('name') && !!fieldErrors.name} />
                    {shouldShow('name') && fieldErrors.name && <p className="text-sm text-red-600" data-testid="error-name">{fieldErrors.name}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="pf-price">Giá</label>
                        <input id="pf-price" data-testid="product-price" className={errCls(shouldShow('price') && !!fieldErrors.price)} type="number" placeholder="Price" value={form.price} onChange={e => onChange('price', Number(e.target.value))} onBlur={() => onBlur('price')} min={0} aria-invalid={shouldShow('price') && !!fieldErrors.price} />
                        {shouldShow('price') && fieldErrors.price && <p className="text-sm text-red-600" data-testid="error-price">{fieldErrors.price}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="pf-qty">Số lượng</label>
                        <input id="pf-qty" data-testid="product-quantity" className={errCls(shouldShow('quantity') && !!fieldErrors.quantity)} type="number" placeholder="Quantity" value={form.quantity} onChange={e => { const rawValue = e.target.value; const val = rawValue === '' ? 0 : Number(rawValue); onChange('quantity', val); }} onBlur={() => onBlur('quantity')} min={0} aria-invalid={shouldShow('quantity') && !!fieldErrors.quantity} />
                        {shouldShow('quantity') && fieldErrors.quantity && <p className="text-sm text-red-600" data-testid="error-quantity">{fieldErrors.quantity}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="pf-category">Danh mục</label>
                        <select id="pf-category" data-testid="product-category" className={errCls(shouldShow('category') && !!fieldErrors.category)} value={form.category} onChange={e => onChange('category', e.target.value as Category)} onBlur={() => onBlur('category')} aria-invalid={shouldShow('category') && !!fieldErrors.category}>
                            <option value="">--Chọn--</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {shouldShow('category') && fieldErrors.category && <p className="text-sm text-red-600" data-testid="error-category">{fieldErrors.category}</p>}
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="pf-desc">Mô tả (≤500)</label>
                        <textarea id="pf-desc" data-testid="product-description" className={errCls(shouldShow('description') && !!fieldErrors.description)} placeholder="Description (≤ 500)" value={form.description} onChange={e => onChange('description', e.target.value)} onBlur={() => onBlur('description')} rows={3} aria-invalid={shouldShow('description') && !!fieldErrors.description} />
                        {shouldShow('description') && fieldErrors.description && <p className="text-sm text-red-600" data-testid="error-description">{fieldErrors.description}</p>}
                    </div>
                </div>
                {showAllErrors && invalidList.length > 0 && (
                    <p className="text-sm text-red-600" data-testid="summary-errors">• Còn {invalidList.length} lỗi — vui lòng kiểm tra các trường bôi đỏ.</p>
                )}
                <div className="flex gap-3 justify-end">
                    <button type="button" onClick={onCancel} className="px-3 py-2 border rounded">Huỷ</button>
                    <button type="submit" className="px-4 py-2 rounded bg-black text-white" data-testid="submit-button">Lưu</button>
                </div>
            </form>
        </div>
    );
}
