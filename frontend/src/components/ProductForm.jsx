import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// Import logic validate chuẩn từ file dùng chung
import { validateProduct } from '../utils/productValidation';

export default function ProductForm({ mode, categories, initial, onSave, onCancel }) {
    // Khởi tạo state form
    const [form, setForm] = useState({
        name: '',
        price: 0,
        quantity: 0,
        description: '',
        // Lấy category đầu tiên hoặc mặc định
        category: categories[0] || 'ELECTRONICS',
    });

    const [touched, setTouched] = useState({});
    const [showAllErrors, setShowAllErrors] = useState(false);

    // Load dữ liệu khi sửa (Edit mode)
    useEffect(() => {
        if (initial) {
            setForm({
                name: initial.name,
                price: initial.price,
                quantity: initial.quantity,
                description: initial.description || '',
                category: initial.category,
            });
        } else {
            // Reset form khi tạo mới
            setForm({
                name: '',
                price: 0,
                quantity: 0,
                description: '',
                category: categories[0] || 'ELECTRONICS',
            });
        }
        setTouched({});
        setShowAllErrors(false);
    }, [initial, categories, mode]);

    // Hàm handle change chung
    function onChange(k, v) {
        setForm(prev => ({ ...prev, [k]: v }));
    }

    // Đánh dấu field đã bị focus (để hiện lỗi)
    function onBlur(k) {
        setTouched(prev => ({ ...prev, [k]: true }));
    }

    // Tính toán lỗi ngay tại thời điểm render (Real-time validation)
    // errors là object dạng: { name: 'Lỗi...', price: 'Lỗi...' }
    const errors = validateProduct(form);
    const hasErrors = Object.keys(errors).length > 0;

    // Helper: Có nên hiện lỗi của field này không?
    const shouldShow = (k) => showAllErrors || !!touched[k];

    async function submit(e) {
        e.preventDefault();
        
        // Nếu có lỗi thì hiện tất cả lên và chặn submit
        if (hasErrors) {
            setTouched({
                name: true,
                price: true,
                quantity: true,
                description: true,
                category: true
            });
            setShowAllErrors(true);
            return;
        }

        // Nếu hợp lệ thì gọi onSave
        await onSave(form);
    }

    // Helper class CSS cho input lỗi
    const errCls = (showErr) => 
        `border w-full p-2.5 rounded-lg outline-none ${
            showErr 
            ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
            : 'focus:ring-2 focus:ring-black/60 focus:border-black/60'
        }`;

    const title = mode === 'create' ? 'Thêm sản phẩm' : 'Sửa sản phẩm';

    return (
        <div className="space-y-5" data-testid="product-form-wrapper">
            <h2 className="text-lg font-semibold">{title}</h2>
            
            <form onSubmit={submit} className="space-y-5" data-testid="product-form">
                {/* --- Field Name --- */}
                <div className="space-y-1.5">
                    <label className="text-sm font-medium" htmlFor="pf-name">Tên sản phẩm</label>
                    <input 
                        id="pf-name" 
                        data-testid="product-name" 
                        className={errCls(shouldShow('name') && !!errors.name)} 
                        placeholder="Product name (3–100)" 
                        value={form.name} 
                        onChange={e => onChange('name', e.target.value)} 
                        onBlur={() => onBlur('name')} 
                    />
                    {shouldShow('name') && errors.name && (
                        <p className="text-sm text-red-600" data-testid="error-name">{errors.name}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* --- Field Price --- */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="pf-price">Giá</label>
                        <input 
                            id="pf-price" 
                            data-testid="product-price" 
                            className={errCls(shouldShow('price') && !!errors.price)} 
                            type="number" 
                            placeholder="Price" 
                            value={form.price} 
                            // Convert sang number ngay khi nhập
                            onChange={e => onChange('price', Number(e.target.value))} 
                            onBlur={() => onBlur('price')} 
                            min={0} 
                        />
                        {shouldShow('price') && errors.price && (
                            <p className="text-sm text-red-600" data-testid="error-price">{errors.price}</p>
                        )}
                    </div>

                    {/* --- Field Quantity --- */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="pf-qty">Số lượng</label>
                        <input 
                            id="pf-qty" 
                            data-testid="product-quantity" 
                            className={errCls(shouldShow('quantity') && !!errors.quantity)} 
                            type="number" 
                            placeholder="Quantity" 
                            value={form.quantity} 
                            onChange={e => { 
                                const rawValue = e.target.value; 
                                const val = rawValue === '' ? 0 : Number(rawValue); 
                                onChange('quantity', val); 
                            }} 
                            onBlur={() => onBlur('quantity')} 
                            min={0} 
                        />
                        {shouldShow('quantity') && errors.quantity && (
                            <p className="text-sm text-red-600" data-testid="error-quantity">{errors.quantity}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* --- Field Category --- */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="pf-category">Danh mục</label>
                        <select 
                            id="pf-category" 
                            data-testid="product-category" 
                            className={errCls(shouldShow('category') && !!errors.category)} 
                            value={form.category} 
                            onChange={e => onChange('category', e.target.value)} 
                            onBlur={() => onBlur('category')}
                        >
                            <option value="">--Chọn--</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {shouldShow('category') && errors.category && (
                            <p className="text-sm text-red-600" data-testid="error-category">{errors.category}</p>
                        )}
                    </div>

                    {/* --- Field Description --- */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium" htmlFor="pf-desc">Mô tả (≤500)</label>
                        <textarea 
                            id="pf-desc" 
                            data-testid="product-description" 
                            className={errCls(shouldShow('description') && !!errors.description)} 
                            placeholder="Description (≤ 500)" 
                            value={form.description} 
                            onChange={e => onChange('description', e.target.value)} 
                            onBlur={() => onBlur('description')} 
                            rows={3} 
                        />
                        {shouldShow('description') && errors.description && (
                            <p className="text-sm text-red-600" data-testid="error-description">{errors.description}</p>
                        )}
                    </div>
                </div>

                {/* Tổng hợp lỗi */}
                {showAllErrors && hasErrors && (
                    <p className="text-sm text-red-600" data-testid="summary-errors">
                        • Vui lòng kiểm tra các trường bôi đỏ.
                    </p>
                )}

                <div className="flex gap-3 justify-end">
                    <button type="button" onClick={onCancel} className="px-3 py-2 border rounded">
                        Huỷ
                    </button>
                    {/* Nút Submit quan trọng cho E2E test */}
                    <button 
                        type="submit" 
                        className="px-4 py-2 rounded bg-black text-white" 
                        data-testid="submit-button"
                    >
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
}

ProductForm.propTypes = {
    mode: PropTypes.oneOf(['create', 'edit']).isRequired,
    categories: PropTypes.arrayOf(PropTypes.string).isRequired,
    initial: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};