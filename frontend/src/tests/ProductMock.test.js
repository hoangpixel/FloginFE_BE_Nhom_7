import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

import ProductsPage from '../pages/ProductsPage';
import * as productService from '../services/product';
import * as categoryService from '../services/categories';

jest.mock('../services/product', () => ({
    getProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
}));

jest.mock('../services/categories', () => ({
    getCategories: jest.fn(),
}), { virtual: true });

if (!HTMLFormElement.prototype.requestSubmit) {
  Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    value: function () {
      this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    },
    writable: true, configurable: true
  });
}

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

const submitForm = () => {
    const nameInput = screen.queryByPlaceholderText(/tên|name/i);
    if (nameInput) {
        const form = nameInput.closest('form');
        if (form) {
            fireEvent.submit(form);
            return;
        }
    }
    const saveBtn = screen.queryByRole('button', { name: /save|lưu/i });
    if (saveBtn) fireEvent.click(saveBtn);
};

const mockCategories = ['ELECTRONICS', 'ACCESSORIES'];
const mockProduct = { 
    id: 1, 
    name: 'Laptop Mock', 
    price: 1000, 
    category: 'ELECTRONICS', 
    quantity: 1, 
    description: 'Test' 
};

describe('Product Mock Testing (Max Coverage)', () => {

    beforeEach(() => {
        jest.clearAllMocks();

        categoryService.getCategories.mockResolvedValue(mockCategories);
        productService.getProducts.mockResolvedValue([mockProduct]);
        
        jest.spyOn(window, 'confirm').mockReturnValue(true);
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('TC1: Get products (Read) - Hien thi danh sach', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        renderWithRouter(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Laptop Mock')).toBeInTheDocument();
        });

        expect(productService.getProducts).toHaveBeenCalledTimes(1);
    });

    test('TC2: Create product (Create) - Full Flow', async () => {
        productService.getProducts.mockResolvedValue([]); 
        const newProduct = { ...mockProduct, id: 2, name: 'New Mock Item' };
        productService.createProduct.mockResolvedValue(newProduct);

        renderWithRouter(<ProductsPage />);

        fireEvent.click(screen.getByRole('button', { name: /add|thêm|new/i }));
        fireEvent.change(screen.getByPlaceholderText(/tên|name/i), { target: { value: 'New Mock Item' } });
        fireEvent.change(screen.getByPlaceholderText(/giá|price/i), { target: { value: '2000' } });
        
        const qty = screen.queryByPlaceholderText(/quantity|số lượng/i);
        if (qty) fireEvent.change(qty, { target: { value: '10' } });

        const catSelect = screen.queryByTestId('product-category');
        if (catSelect) fireEvent.change(catSelect, { target: { value: 'ELECTRONICS' } });
        submitForm();
        await waitFor(() => {
            expect(productService.createProduct).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'New Mock Item', price: 2000 })
            );
        });
    });

    test('TC3: Update product (Update)', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        productService.updateProduct.mockResolvedValue({ ...mockProduct, name: 'Updated Mock' });

        renderWithRouter(<ProductsPage />);
        await waitFor(() => expect(screen.getByText('Laptop Mock')).toBeInTheDocument());

        const editButtons = screen.getAllByRole('button', { name: /edit|sửa/i });
        fireEvent.click(editButtons[0]);

        const nameInp = screen.getByPlaceholderText(/tên|name/i);
        fireEvent.change(nameInp, { target: { value: 'Updated Mock' } });
        
        submitForm();

        await waitFor(() => {
            expect(productService.updateProduct).toHaveBeenCalledWith(
                1, 
                expect.objectContaining({ name: 'Updated Mock' })
            );
        });
    });

    test('TC4: Delete product (Delete)', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        productService.deleteProduct.mockResolvedValue({});

        renderWithRouter(<ProductsPage />);
        await waitFor(() => expect(screen.getByText('Laptop Mock')).toBeInTheDocument());

        const deleteButtons = screen.getAllByRole('button', { name: /delete|xóa/i });
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(productService.deleteProduct).toHaveBeenCalledWith(1);
        });
    });

    test('TC5: Failure - Tao san pham loi API', async () => {
        productService.getProducts.mockResolvedValue([]);
        productService.createProduct.mockRejectedValue(new Error('Create Failed'));

        renderWithRouter(<ProductsPage />);

        fireEvent.click(screen.getByRole('button', { name: /add|thêm|new/i }));
        fireEvent.change(screen.getByPlaceholderText(/tên|name/i), { target: { value: 'Fail Item' } });
        fireEvent.change(screen.getByPlaceholderText(/giá|price/i), { target: { value: '100' } });
        
        submitForm();

        await waitFor(() => {
            expect(productService.createProduct).toHaveBeenCalled();
            expect(window.alert).toHaveBeenCalled();
        });
    });

    test('TC6: Validation - Submit form rong (Client Side)', async () => {
        productService.getProducts.mockResolvedValue([]);
        renderWithRouter(<ProductsPage />);

        fireEvent.click(screen.getByRole('button', { name: /add|thêm|new/i }));

        submitForm();

        await new Promise(r => setTimeout(r, 100));
        expect(productService.createProduct).not.toHaveBeenCalled();
    });

    test('TC7: Empty List - Hien thi khi khong co san pham', async () => {
        productService.getProducts.mockResolvedValue([]);

        renderWithRouter(<ProductsPage />);

        await waitFor(() => {
            const emptyMsg = screen.queryByText(/chưa có sản phẩm|no products/i);
            expect(emptyMsg).toBeInTheDocument();
        });
    });

    test('TC8: Cancel Dialog - Dong form', async () => {
        productService.getProducts.mockResolvedValue([]);
        renderWithRouter(<ProductsPage />);

        fireEvent.click(screen.getByRole('button', { name: /add|thêm|new/i }));

        const cancelBtn = screen.getByRole('button', { name: /cancel|huỷ|hủy/i });
        fireEvent.click(cancelBtn);

        await waitFor(() => {
            expect(screen.queryByPlaceholderText(/tên|name/i)).not.toBeInTheDocument();
        });
    });
});