import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { validateProduct } from '../utils/productValidation';

export default function ProductForm({ mode, categories, initial, onSave, onCancel }) {
    // Khởi tạo state form
    const [form, setForm] = useState({
        name: '',
        price: 0,
        quantity: 0,
        description: '',
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

    function onChange(k, v) {
        setForm(prev => ({ ...prev, [k]: v }));
    }

    function onBlur(k) {
        setTouched(prev => ({ ...prev, [k]: true }));
    }

    const errors = validateProduct(form);
    const hasErrors = Object.keys(errors).length > 0;
    const shouldShow = (k) => showAllErrors || !!touched[k];

    async function submit(e) {
        e.preventDefault();

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

        await onSave(form);
    }

    // Helper class CSS cho input
    const inputClass = (hasError) => `
        mt-1 block w-full px-3 py-2 bg-white border rounded-md text-sm shadow-sm placeholder-gray-400
        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500
        disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none
        transition duration-150 ease-in-out
        ${hasError
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 text-gray-900'}
    `;

    const labelClass = "block text-sm font-medium text-gray-700";

    return (
        <div className="bg-white" data-testid="product-form-wrapper">
            <form onSubmit={submit} className="space-y-6" data-testid="product-form">

                {/* --- Field Name --- */}
                <div>
                    <label htmlFor="pf-name" className={labelClass}>
                        Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            id="pf-name"
                            data-testid="product-name"
                            className={inputClass(shouldShow('name') && !!errors.name)}
                            placeholder="Nhập tên sản phẩm (3–100 ký tự)"
                            value={form.name}
                            onChange={e => onChange('name', e.target.value)}
                            onBlur={() => onBlur('name')}
                        />
                    </div>
                    {shouldShow('name') && errors.name && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1" data-testid="error-name">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    {/* --- Field Price --- */}
                    <div className="sm:col-span-3">
                        <label htmlFor="pf-price" className={labelClass}>
                            Giá (VND) <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                id="pf-price"
                                data-testid="product-price"
                                className={inputClass(shouldShow('price') && !!errors.price)}
                                type="number"
                                placeholder="0"
                                value={form.price}
                                onChange={e => onChange('price', Number(e.target.value))}
                                onBlur={() => onBlur('price')}
                                min={0}
                            />
                        </div>
                        {shouldShow('price') && errors.price && (
                            <p className="mt-2 text-sm text-red-600" data-testid="error-price">{errors.price}</p>
                        )}
                    </div>

                    {/* --- Field Quantity --- */}
                    <div className="sm:col-span-3">
                        <label htmlFor="pf-qty" className={labelClass}>
                            Số lượng <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                                id="pf-qty"
                                data-testid="product-quantity"
                                className={inputClass(shouldShow('quantity') && !!errors.quantity)}
                                type="number"
                                placeholder="0"
                                value={form.quantity}
                                onChange={e => {
                                    const rawValue = e.target.value;
                                    const val = rawValue === '' ? 0 : Number(rawValue);
                                    onChange('quantity', val);
                                }}
                                onBlur={() => onBlur('quantity')}
                                min={0}
                            />
                        </div>
                        {shouldShow('quantity') && errors.quantity && (
                            <p className="mt-2 text-sm text-red-600" data-testid="error-quantity">{errors.quantity}</p>
                        )}
                    </div>
                </div>

                {/* --- Field Category --- */}
                <div>
                    <label htmlFor="pf-category" className={labelClass}>
                        Danh mục <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                        <select
                            id="pf-category"
                            data-testid="product-category"
                            className={inputClass(shouldShow('category') && !!errors.category)}
                            value={form.category}
                            onChange={e => onChange('category', e.target.value)}
                            onBlur={() => onBlur('category')}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    {shouldShow('category') && errors.category && (
                        <p className="mt-2 text-sm text-red-600" data-testid="error-category">{errors.category}</p>
                    )}
                </div>

                {/* --- Field Description --- */}
                <div>
                    <label htmlFor="pf-desc" className={labelClass}>
                        Mô tả chi tiết
                        <span className="text-gray-400 font-normal ml-1">(Tối đa 500 ký tự)</span>
                    </label>
                    <div className="mt-1">
                        <textarea
                            id="pf-desc"
                            data-testid="product-description"
                            className={inputClass(shouldShow('description') && !!errors.description)}
                            placeholder="Nhập mô tả sản phẩm..."
                            value={form.description}
                            onChange={e => onChange('description', e.target.value)}
                            onBlur={() => onBlur('description')}
                            rows={4}
                        />
                    </div>
                    {shouldShow('description') && errors.description && (
                        <p className="mt-2 text-sm text-red-600" data-testid="error-description">{errors.description}</p>
                    )}
                </div>

                {/* Tổng hợp lỗi */}
                {showAllErrors && hasErrors && (
                    <div className="rounded-md bg-red-50 p-4" data-testid="summary-errors">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Vui lòng kiểm tra lại thông tin
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Một số trường thông tin chưa hợp lệ.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="pt-5 border-t border-gray-200">
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {/* FIX: Đổi 'Huỷ bỏ' hoặc 'Hủy' thành 'Huỷ' để khớp test case */}
                            Huỷ
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            data-testid="submit-button"
                        >
                            {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
                        </button>
                    </div>
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