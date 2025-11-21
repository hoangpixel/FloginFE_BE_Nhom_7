/// <reference types="jest" />
import { validateProduct } from '../lib/productValidation';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductDialog from '../components/ProductDialog';
import type { Category } from '../types';

// Polyfill requestSubmit cho JSDOM nếu thiếu
if (!(HTMLFormElement.prototype as any).requestSubmit) {
  (HTMLFormElement.prototype as any).requestSubmit = function () {
    this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  };
}

const VALID_PRODUCT_DATA = {
    name: 'Laptop Dell Inspiron',
    price: 15000000,
    quantity: 50,
    description: 'Mô tả hợp lệ cho sản phẩm',
    category: 'ELECTRONICS'
};
describe('Product Validation Tests', () => {
    test('TC1: Product hợp lệ - nên trả về chuỗi rỗng', () => {
        const errors = validateProduct(
            VALID_PRODUCT_DATA.name,
            VALID_PRODUCT_DATA.price,
            VALID_PRODUCT_DATA.quantity,
            VALID_PRODUCT_DATA.description,
            VALID_PRODUCT_DATA.category
        );
        expect(errors).toBe('');
    });
    test('TC2: Tên sản phẩm rỗng - nên trả về lỗi', () => {
        const product = { ...VALID_PRODUCT_DATA, name: '' };
        const errors = validateProduct(
            product.name,
            product.price,
            product.quantity,
            product.description,
            product.category
        );
        expect(errors).toBe('Tên sản phẩm không được để trống.');
    });
    test('TC3: Tên sản phẩm quá ngắn (2 ký tự) - nên trả về lỗi', () => {
        const product = { ...VALID_PRODUCT_DATA, name: 'AB' };
        const errors = validateProduct(product.name, product.price, product.quantity, product.description, product.category);
        expect(errors).toBe('Tên sản phẩm phải có từ 3 đến 100 ký tự.');
    });
    test('TC4: Giá sản phẩm là số âm - nên trả về lỗi', () => {
        const product = { ...VALID_PRODUCT_DATA, price: -1000 };
        const errors = validateProduct(
            product.name,
            product.price,
            product.quantity,
            product.description,
            product.category
        );
        expect(errors).toContain('Giá sản phẩm phải lớn hơn 0');
    });
    test('TC5: Giá sản phẩm vượt quá MAX - nên trả về lỗi', () => {
        const MAX_PLUS_ONE = 1000000000;
        const errors = validateProduct(VALID_PRODUCT_DATA.name, MAX_PLUS_ONE, VALID_PRODUCT_DATA.quantity, VALID_PRODUCT_DATA.description, VALID_PRODUCT_DATA.category);
        expect(errors).toContain('không được vượt quá 999,999,999');
    });
    test('TC6: Số lượng là số âm - nên trả về lỗi', () => {
        const errors = validateProduct(VALID_PRODUCT_DATA.name, VALID_PRODUCT_DATA.price, -1, VALID_PRODUCT_DATA.description, VALID_PRODUCT_DATA.category);
        expect(errors).toContain('Số lượng phải là số nguyên không âm');
    });
    test('TC7: Số lượng vượt quá MAX - nên trả về lỗi', () => {
        const errors = validateProduct(VALID_PRODUCT_DATA.name, VALID_PRODUCT_DATA.price, 100000, VALID_PRODUCT_DATA.description, VALID_PRODUCT_DATA.category);
        expect(errors).toContain('không được vượt quá 99,999');
    });
    test('TC8: Mô tả quá dài - nên trả về lỗi', () => {
        const tooLongDesc = 'X'.repeat(501);
        const errors = validateProduct(VALID_PRODUCT_DATA.name, VALID_PRODUCT_DATA.price, VALID_PRODUCT_DATA.quantity, tooLongDesc, VALID_PRODUCT_DATA.category);
        expect(errors).toBe('Mô tả không được vượt quá 500 ký tự.');
    });
    test('TC9: Danh mục không có sẵn - nên trả về lỗi', () => {
        const errors = validateProduct(VALID_PRODUCT_DATA.name, VALID_PRODUCT_DATA.price, VALID_PRODUCT_DATA.quantity, VALID_PRODUCT_DATA.description, 'PETS');
        expect(errors).toBe('Danh mục sản phẩm không hợp lệ hoặc không có sẵn.');
    });
});

describe('ProductDialog component (cau b)', () => {
  const categories: Category[] = ['ELECTRONICS', 'FASHION'] as unknown as Category[];

  test('B1: Submit rong -> hien loi, khong goi onSave', async () => {
    const onSave = jest.fn();
    const onClose = jest.fn();

    render(React.createElement(ProductDialog, {
      open: true,
      onClose,
      onSave,
      categories,
      initial: null,
      mode: 'create',
    }));

    fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));

    expect(await screen.findByText('Name phải từ 3–100 ký tự')).toBeInTheDocument();
    expect(screen.getByText('Price > 0 và ≤ 999,999,999')).toBeInTheDocument();
    // Footer thong bao tong hop loi
    expect(screen.getByText(/Còn \d+ lỗi/)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  test('B2: Nhap hop le -> goi onSave(payload) va onClose', async () => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    render(React.createElement(ProductDialog, {
      open: true,
      onClose,
      onSave,
      categories,
      initial: null,
      mode: 'create',
    }));

    fireEvent.change(screen.getByPlaceholderText('Product name (3–100)'), { target: { value: 'Laptop Pro' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '12000000' } });
    fireEvent.change(screen.getByPlaceholderText('Quantity'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Description (≤ 500)'), { target: { value: 'Desc ok' } });

    // Select category neu can (mac dinh la ELECTRONICS)
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'ELECTRONICS' } });

    fireEvent.click(screen.getByRole('button', { name: 'Lưu' }));

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
    expect(onSave).toHaveBeenCalledWith({
      name: 'Laptop Pro',
      price: 12000000,
      quantity: 5,
      description: 'Desc ok',
      category: 'ELECTRONICS',
    });
    expect(onClose).toHaveBeenCalled();
  });

  test('B3: Nhan ESC -> goi onClose', () => {
    const onSave = jest.fn();
    const onClose = jest.fn();

    render(React.createElement(ProductDialog, {
      open: true,
      onClose,
      onSave,
      categories,
      initial: null,
      mode: 'create',
    }));

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});