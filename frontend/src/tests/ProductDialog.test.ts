import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductDialog from '../components/ProductDialog';
import type { Product, Category, ProductPayload } from '../types';

// Polyfill form.requestSubmit for JSDOM
// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(HTMLFormElement.prototype as any).requestSubmit) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (HTMLFormElement.prototype as any).requestSubmit = function () {
        this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    };
}

const categories: Category[] = ['ELECTRONICS', 'FASHION', 'FOOD'];

function openCreate(onSave = jest.fn(), onClose = jest.fn()) {
    render(React.createElement(ProductDialog, {
        open: true,
        onClose,
        onSave,
        categories,
        initial: null,
        mode: 'create'
    }));
    return { onSave, onClose };
}

function openEdit(initial: Product, onSave = jest.fn(), onClose = jest.fn()) {
    render(React.createElement(ProductDialog, {
        open: true,
        onClose,
        onSave,
        categories,
        initial,
        mode: 'edit'
    }));
    return { onSave, onClose };
}

function openView(initial: Product, onClose = jest.fn()) {
    render(React.createElement(ProductDialog, {
        open: true,
        onClose,
        onSave: jest.fn(),
        categories,
        initial,
        mode: 'view'
    }));
    return { onClose };
}

// Helper to click save consistently
function clickSave() {
    const btn = screen.getByTestId('btn-save');
    fireEvent.click(btn);
}

describe('ProductDialog component', () => {
    test('Create mode renders with correct title and default category', () => {
        openCreate();
        expect(screen.getByRole('heading', { name: 'Thêm sản phẩm' })).toBeInTheDocument();
        // Select has default value categories[0]
        const select = screen.getByRole('combobox') as HTMLSelectElement;
        // Giá trị mặc định là 'ELECTRONICS' được đặt trong ProductDialog.tsx (categories[0] || 'ELECTRONICS')
        expect(select.value).toBe('ELECTRONICS');
        // Save button present
        expect(screen.getByRole('button', { name: 'Lưu' })).toBeEnabled();
    });

    // Sửa lỗi tìm kiếm thông báo tóm tắt lỗi
    test('Validation errors shown when submitting empty form first time', async () => {
        openCreate();
        clickSave();
        expect(await screen.findByText('Name phải từ 3–100 ký tự')).toBeInTheDocument();
        expect(screen.getByText('Price > 0 và ≤ 999,999,999')).toBeInTheDocument();
        // Kiểm tra phần tử tóm tắt lỗi bằng data-testid và nội dung phải chứa số lỗi > 0
        const summary = await screen.findByTestId('summary-errors');
        expect(summary).toHaveTextContent(/• Còn \d+ lỗi/);
        // Kiểm tra xem lỗi Quantity có hiển thị không (nếu price=0 thì quantity=0 là hợp lệ, chỉ có 2 lỗi)
        // Lưu ý: Bài test này chỉ tìm thấy 2 lỗi (Name, Price) vì Quantity=0 là hợp lệ.
        expect(summary).toHaveTextContent(/Còn 2 lỗi/);
    });

    test('Successful save with valid data calls onSave then onClose', async () => {
        const { onSave, onClose } = openCreate(jest.fn().mockResolvedValue(undefined), jest.fn());
        fireEvent.change(screen.getByPlaceholderText('Product name (3–100)'), { target: { value: 'Laptop Pro' } });
        fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '12000000' } });
        fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('Description (≤ 500)'), { target: { value: 'Desc ok' } });
        // change category
        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'FASHION' } });
        fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));

        await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
        const payload = onSave.mock.calls[0][0] as ProductPayload;
        expect(payload).toEqual({
            name: 'Laptop Pro',
            price: 12000000,
            quantity: 5,
            description: 'Desc ok',
            category: 'FASHION'
        });
        expect(onClose).toHaveBeenCalled();
    });

    test('Edit mode pre-fills initial product and updates name before save', async () => {
        const initial: Product = {
            id: 10,
            name: 'Old Name',
            price: 5000,
            quantity: 2,
            description: 'Old desc',
            category: 'FOOD'
        };
        const { onSave } = openEdit(initial, jest.fn().mockResolvedValue(undefined));
        // Fields pre-filled
        expect((screen.getByPlaceholderText('Product name (3–100)') as HTMLInputElement).value).toBe('Old Name');
        expect((screen.getByPlaceholderText('Price') as HTMLInputElement).value).toBe('5000');
        expect((screen.getByPlaceholderText('Quantity') as HTMLInputElement).value).toBe('2');
        expect((screen.getByPlaceholderText('Description (≤ 500)') as HTMLTextAreaElement).value).toBe('Old desc');
        expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('FOOD');
        // Change name only and save
        fireEvent.change(screen.getByPlaceholderText('Product name (3–100)'), { target: { value: 'New Name' } });
        fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));
        await waitFor(() => expect(onSave).toHaveBeenCalled());
        const payload = onSave.mock.calls[0][0] as ProductPayload;
        expect(payload.name).toBe('New Name');
        expect(payload.price).toBe(5000);
        expect(payload.category).toBe('FOOD');
    });

    test('View mode disables inputs and hides save button', () => {
        const initial: Product = {
            id: 1,
            name: 'View Only',
            price: 100,
            quantity: 1,
            description: 'Readonly',
            category: 'OTHER' as Category // Giả định 'OTHER' là Category hợp lệ
        };
        openView(initial);
        expect(screen.getByRole('heading', { name: 'Chi tiết sản phẩm' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Lưu' })).not.toBeInTheDocument();
        // All inputs disabled
        expect(screen.getByPlaceholderText('Product name (3–100)')).toBeDisabled();
        expect(screen.getByPlaceholderText('Price')).toBeDisabled();
        expect(screen.getByPlaceholderText('Quantity')).toBeDisabled();
        expect(screen.getByPlaceholderText('Description (≤ 500)')).toBeDisabled();
        expect(screen.getByRole('combobox')).toBeDisabled();
        // Close button text Đóng
        expect(screen.getByRole('button', { name: 'Đóng' })).toBeInTheDocument();
    });

    test('ESC key closes dialog', () => {
        const { onClose } = openCreate(undefined, jest.fn());
        fireEvent.keyDown(window, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });

    test('Click overlay closes dialog', () => {
        const { onClose } = openCreate(jest.fn(), jest.fn());
        const overlay = screen.getByRole('dialog');
        fireEvent.mouseDown(overlay); // target === currentTarget
        expect(onClose).toHaveBeenCalled();
    });
});

describe('ProductDialog additional coverage', () => {
    test('Description quá dài hiển thị lỗi mô tả', async () => {
        openCreate();
        fireEvent.change(screen.getByPlaceholderText('Product name (3–100)'), { target: { value: 'Valid Name' } });
        fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '1' } });
        const descEl = screen.getByPlaceholderText('Description (≤ 500)');
        fireEvent.change(descEl, { target: { value: 'X'.repeat(501) } });
        fireEvent.blur(descEl); // đánh dấu touched cho description
        fireEvent.click(screen.getByTestId('btn-save'));
        // Dùng tìm theo nội dung text nếu data-testid chưa render kịp
        const descErr = await screen.findByText(/Description .*500 ký tự/);
        expect(descErr).toBeInTheDocument();
    });

    test('Price = 0 hiển thị lỗi price sau submit', async () => {
        openCreate();
        fireEvent.change(screen.getByPlaceholderText('Product name (3–100)'), { target: { value: 'Valid Name' } });
        fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '0' } }); // invalid price
        fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '1' } });
        fireEvent.click(screen.getByTestId('btn-save'));
        const priceErr = await screen.findByText(/Price > 0/);
        expect(priceErr).toBeInTheDocument();
    });

    test('Category missing triggers validation error (chỉ category invalid)', async () => {
        openCreate();
        // Nhập name & price & quantity hợp lệ để chỉ còn lỗi category
        fireEvent.change(screen.getByPlaceholderText('Product name (3–100)'), { target: { value: 'Valid Name' } });
        fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '1' } });
        // Description optional
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '' } }); // chọn option rỗng
        clickSave();
        expect(await screen.findByText('Category bắt buộc')).toBeInTheDocument();
    });

    test('Summary hidden before first invalid submit then appears', async () => {
        openCreate();
        expect(screen.queryByTestId('summary-errors')).toBeNull();
        clickSave();
        await waitFor(() => expect(screen.getByTestId('summary-errors')).toBeInTheDocument());
    });

    test('Edit mode shows correct title "Sửa sản phẩm"', () => {
        const initial: Product = { id: 2, name: 'EditMe', price: 10, quantity: 1, description: '', category: 'ELECTRONICS' };
        openEdit(initial);
        expect(screen.getByRole('heading', { name: 'Sửa sản phẩm' })).toBeInTheDocument();
    });

    test('View mode submit ignored (onSave not called)', () => {
        const initial: Product = { id: 3, name: 'ViewOnly', price: 10, quantity: 1, description: '', category: 'FASHION' };
        const onSave = jest.fn();
        // Render view mode
        render(React.createElement(ProductDialog, { open: true, onClose: jest.fn(), onSave, categories, initial, mode: 'view' }));
        // Manually dispatch submit on form
        const formEl = document.getElementById('product-form') as HTMLFormElement;
        formEl.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        expect(onSave).not.toHaveBeenCalled();
    });

    test('Reopen dialog resets touched & hides errors', async () => {
        const onSave = jest.fn();
        const onClose = jest.fn();
        const { rerender } = render(React.createElement(ProductDialog, { open: true, onClose, onSave, categories, initial: null, mode: 'create' }));
        // Cause name error to appear
        fireEvent.blur(screen.getByPlaceholderText('Product name (3–100)'));
        fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));
        expect(await screen.findByText('Name phải từ 3–100 ký tự')).toBeInTheDocument();
        // Close dialog
        rerender(React.createElement(ProductDialog, { open: false, onClose, onSave, categories, initial: null, mode: 'create' }));
        // Reopen
        rerender(React.createElement(ProductDialog, { open: true, onClose, onSave, categories, initial: null, mode: 'create' }));
        // Error should not show until interacting again
        expect(screen.queryByText('Name phải từ 3–100 ký tự')).toBeNull();
    });
});

import { validateProduct as validateProductFn } from '../components/ProductDialog';

describe('validateProduct function unit tests', () => {
    test('validateProduct: name missing', () => {
        const res = validateProductFn({ name: '', price: 1, quantity: 0, description: '', category: 'ELECTRONICS' });
        expect(res.fieldErrors.name).toMatch(/Name phải từ 3–100/);
    });
    test('validateProduct: price invalid (0)', () => {
        const res = validateProductFn({ name: 'Good', price: 0, quantity: 0, description: '', category: 'ELECTRONICS' });
        expect(res.fieldErrors.price).toMatch(/Price > 0/);
    });
    test('validateProduct: quantity too big', () => {
        const res = validateProductFn({ name: 'Good', price: 10, quantity: 100000, description: '', category: 'ELECTRONICS' });
        expect(res.fieldErrors.quantity).toMatch(/Quantity .*99,999/);
    });
    test('validateProduct: description too long', () => {
        const res = validateProductFn({ name: 'Good', price: 10, quantity: 1, description: 'D'.repeat(501), category: 'ELECTRONICS' });
        expect(res.fieldErrors.description).toMatch(/Description .*500 ký tự/);
    });
    test('validateProduct: category missing', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = validateProductFn({ name: 'Good', price: 10, quantity: 1, description: '', category: '' as any });
        expect(res.fieldErrors.category).toMatch(/Category bắt buộc/);
    });
    test('validateProduct: all valid returns empty errors', () => {
        const res = validateProductFn({ name: 'Valid Name', price: 10, quantity: 1, description: 'Ok', category: 'ELECTRONICS' });
        expect(Object.keys(res.fieldErrors).length).toBe(0);
        expect(res.invalidList.length).toBe(0);
    });
});

describe('ProductDialog extra edge coverage', () => {
    test('Close button triggers onClose', () => {
        const { onClose } = openCreate(jest.fn(), jest.fn());
        fireEvent.click(screen.getByRole('button', { name: 'Huỷ' }));
        expect(onClose).toHaveBeenCalled();
    });

    test('Click inside content does NOT close', () => {
        const { onClose } = openCreate(jest.fn(), jest.fn());
        const innerPanel = screen.getByText('Quản lý thông tin sản phẩm');
        fireEvent.mouseDown(innerPanel); // target is not overlay
        expect(onClose).not.toHaveBeenCalled();
    });

    test('Name field shows red class after blur invalid, price stays normal until submit', () => {
        openCreate();
        const nameInput = screen.getByPlaceholderText('Product name (3–100)');
        const priceInput = screen.getByPlaceholderText('Price');
        fireEvent.blur(nameInput); // touched name only
        // name error visible
        expect(screen.getByText('Name phải từ 3–100 ký tự')).toBeInTheDocument();
        expect(nameInput.className).toMatch(/border-red-500/);
        // price not touched and showAllErrors false -> no error yet
        expect(priceInput.className).not.toMatch(/border-red-500/);
        expect(screen.queryByText('Price > 0 và ≤ 999,999,999')).toBeNull();
    });

    test('Boundary valid values (name len 100, price=1, qty=0, desc len 500) passes without errors', async () => {
        const longName = 'X'.repeat(100);
        const longDesc = 'D'.repeat(500);
        const { onSave, onClose } = openCreate(jest.fn().mockResolvedValue(undefined), jest.fn());
        fireEvent.change(screen.getByPlaceholderText('Product name (3–100)'), { target: { value: longName } });
        fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '1' } });
        fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '0' } });
        fireEvent.change(screen.getByPlaceholderText('Description (≤ 500)'), { target: { value: longDesc } });
        fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));
        await waitFor(() => expect(onSave).toHaveBeenCalled());
        expect(onClose).toHaveBeenCalled();
    });

    test('Successful submit does not display summary-errors element', async () => {
        const { onSave } = openCreate(jest.fn().mockResolvedValue(undefined), jest.fn());
        fireEvent.change(screen.getByPlaceholderText('Product name (3–100)'), { target: { value: 'Good Name' } });
        fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '1000' } });
        fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '10' } });
        fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));
        await waitFor(() => expect(onSave).toHaveBeenCalled());
        // component unmounts (dialog closes) so summary element absent
        expect(screen.queryByTestId('summary-errors')).toBeNull();
    });

    test('View mode submit does not call onSave nor onClose (early return)', () => {
        const initial: Product = { id: 11, name: 'View', price: 10, quantity: 1, description: '', category: 'FOOD' };
        const onSave = jest.fn();
        const onClose = jest.fn();
        render(React.createElement(ProductDialog, { open: true, onClose, onSave, categories, initial, mode: 'view' }));
        const formEl = document.getElementById('product-form') as HTMLFormElement;
        formEl.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        expect(onSave).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });
});