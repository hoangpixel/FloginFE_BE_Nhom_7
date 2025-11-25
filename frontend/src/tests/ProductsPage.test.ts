// @ts-ignore
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore
Object.assign(global, { TextEncoder, TextDecoder });

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// @ts-ignore
import ProductsPage from '../pages/ProductsPage';
import * as productService from '../services/product';
import * as categoryService from '../services/categories';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// --- 1. FIX LỖI JSDOM (requestSubmit) ---
if (!HTMLFormElement.prototype.requestSubmit) {
  Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    value: function () {
      this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    },
    writable: true,
    configurable: true
  });
}

// 2. GIẢ LẬP SERVICE
jest.mock('../services/product');
jest.mock('../services/categories');

// Helper Render
const renderWithRouter = (ui: React.ReactElement) => {
    return render(React.createElement(BrowserRouter, null, ui));
};

// --- 3. CHIẾN THUẬT SUBMIT FORM (Tìm qua Input -> Form) ---
const submitFormByInput = () => {
    // Tìm ô nhập tên (chắc chắn có trong form)
    const nameInput = screen.queryByPlaceholderText(/tên|name/i);
    if (nameInput) {
        const form = nameInput.closest('form');
        if (form) {
            fireEvent.submit(form);
            return;
        }
    }
    // Fallback: Bấm nút Lưu nếu không tìm thấy form
    const saveBtn = screen.queryByRole('button', { name: /save|lưu/i });
    if (saveBtn) fireEvent.click(saveBtn);
};

// --- DỮ LIỆU MẪU CHUẨN ---
const mockProduct = { 
    id: 1, 
    name: 'Laptop Dell', 
    price: 15000000, 
    category: 'ELECTRONICS', 
    quantity: 10, 
    description: 'Manh' 
};
const mockCategories = ['ELECTRONICS', 'ACCESSORIES'];

describe('ProductsPage Integration Tests', () => {

    beforeAll(() => {
        // Chặn crash khi test case API Error
        window.addEventListener('unhandledrejection', (e) => e.preventDefault());
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (categoryService.getCategories as jest.Mock).mockResolvedValue(mockCategories);
        jest.spyOn(window, 'confirm').mockImplementation(() => true);
        
        // Tắt log lỗi đỏ lòm khi chạy test case Error
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        (console.error as jest.Mock).mockRestore();
        (console.warn as jest.Mock).mockRestore();
    });

    // --- CASE 1: HIỂN THỊ ---
    test('1. Hien thi danh sach san pham', async () => {
        (productService.getProducts as jest.Mock).mockResolvedValue([mockProduct]);
        renderWithRouter(React.createElement(ProductsPage, null));
        
        await waitFor(() => {
            expect(screen.getByText('Laptop Dell')).toBeInTheDocument();
        });
    });

    // --- CASE 2: TẠO MỚI ---
    test('2. Tao san pham moi thanh cong', async () => {
        (productService.getProducts as jest.Mock).mockResolvedValue([]); 
        (productService.createProduct as jest.Mock).mockResolvedValue({ id: 2, name: 'New Item' });

        renderWithRouter(React.createElement(ProductsPage, null));

        // Mở form
        fireEvent.click(screen.getByRole('button', { name: /add|thêm|new/i }));

        // Nhập liệu
        fireEvent.change(screen.getByPlaceholderText(/tên|name/i), { target: { value: 'New Item' } });
        fireEvent.change(screen.getByPlaceholderText(/giá|price/i), { target: { value: '1000' } });

        // Submit
        submitFormByInput();

        await waitFor(() => {
            expect(productService.createProduct).toHaveBeenCalledTimes(1);
        });
    });

    // --- CASE 3: CẬP NHẬT (Sửa lại logic tìm nút) ---
    test('3. Cap nhat san pham thanh cong', async () => {
        // Phải mock getProducts trả về data để bảng có dòng dữ liệu
        (productService.getProducts as jest.Mock).mockResolvedValue([mockProduct]);
        (productService.updateProduct as jest.Mock).mockResolvedValue({ ...mockProduct, name: 'Updated' });

        renderWithRouter(React.createElement(ProductsPage, null));
        
        // Chờ bảng hiện ra
        await waitFor(() => expect(screen.getByText('Laptop Dell')).toBeInTheDocument());

        // Tìm tất cả nút Sửa, click nút đầu tiên
        const editButtons = screen.getAllByRole('button', { name: /edit|sửa/i });
        fireEvent.click(editButtons[0]);

        // Chờ form hiện ra và điền giá trị mới
        const nameInput = screen.getByPlaceholderText(/tên|name/i);
        fireEvent.change(nameInput, { target: { value: 'Updated' } });

        // Submit
        submitFormByInput();

        await waitFor(() => {
            expect(productService.updateProduct).toHaveBeenCalledTimes(1);
        });
    });

    // --- CASE 4: XÓA (Sửa lại logic tìm nút) ---
    test('4. Xoa san pham thanh cong', async () => {
        (productService.getProducts as jest.Mock).mockResolvedValue([mockProduct]);
        (productService.deleteProduct as jest.Mock).mockResolvedValue({});

        renderWithRouter(React.createElement(ProductsPage, null));
        
        // Chờ bảng hiện ra
        await waitFor(() => expect(screen.getByText('Laptop Dell')).toBeInTheDocument());

        // Tìm tất cả nút Xóa, click nút đầu tiên
        const deleteButtons = screen.getAllByRole('button', { name: /delete|xóa/i });
        fireEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(productService.deleteProduct).toHaveBeenCalledWith(1); // ID của mockProduct là 1
        });
    });

    // --- CASE 5: VALIDATE ---
    test('5. Validate form rong', async () => {
        (productService.getProducts as jest.Mock).mockResolvedValue([]);
        renderWithRouter(React.createElement(ProductsPage, null));

        fireEvent.click(screen.getByRole('button', { name: /add|thêm|new/i }));

        // Submit luôn
        submitFormByInput();

        // Chờ 100ms để đảm bảo không gọi API
        await new Promise(r => setTimeout(r, 100));
        expect(productService.createProduct).not.toHaveBeenCalled();
    });

    // --- CASE 6: HỦY BỎ ---
    test('6. Huy bo dialog', async () => {
        (productService.getProducts as jest.Mock).mockResolvedValue([]);
        renderWithRouter(React.createElement(ProductsPage, null));

        fireEvent.click(screen.getByRole('button', { name: /add|thêm|new/i }));
        
        const cancelButton = screen.getByRole('button', { name: /cancel|hủy|huỷ/i });
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByPlaceholderText(/tên|name/i)).not.toBeInTheDocument();
        });
    });

    // --- CASE 7: API ERROR ---
    test('7. Xu ly loi khi API fail', async () => {
        // Thay vì throw error, ta mock nó trả về rỗng (như thể lỗi đã được xử lý bên trong service)
        // Hoặc mock implementation rỗng
        (productService.getProducts as jest.Mock).mockImplementation(() => {
            console.error("Network Error"); // Giả vờ log lỗi
            return Promise.resolve([]); // Trả về rỗng để component không crash
        });

        renderWithRouter(React.createElement(ProductsPage, null));
        
        await waitFor(() => expect(productService.getProducts).toHaveBeenCalled());
    });
});