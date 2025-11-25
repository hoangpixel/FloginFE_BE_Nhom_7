// --- 1. SETUP POLYFILLS CHO JEST/JSDOM ---
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextEncoder, TextDecoder });

// Polyfill requestSubmit (JSDOM cũ chưa hỗ trợ)
if (!HTMLFormElement.prototype.requestSubmit) {
  Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    value: function () {
      this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    },
    writable: true,
    configurable: true
  });
}

// --- 2. IMPORTS ---
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Import Component và Service
import ProductsPage from '../pages/ProductsPage';
import * as productService from '../services/product';
// Mock service auth để test logout nếu cần
import * as authService from '../services/auth';

// --- 3. MOCK SERVICES ---
// Mock product service và auth service
jest.mock('../services/product');
jest.mock('../services/auth');

// --- 4. HELPER & DATA ---
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

const mockProduct = { 
    id: 1, 
    name: 'Laptop Dell', 
    price: 15000000, 
    category: 'ELECTRONICS', 
    quantity: 10, 
    description: 'Manh' 
};

describe('ProductsPage Integration Tests', () => {

    beforeAll(() => {
        // Chặn crash khi test case API Error (Unhandled Promise Rejection)
        window.addEventListener('unhandledrejection', (e) => e.preventDefault());
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // Mặc định confirm = true cho các test case thông thường
        jest.spyOn(window, 'confirm').mockReturnValue(true);
        // Mock alert để test thông báo lỗi
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        // Tắt log lỗi đỏ lòm khi chạy test case Error giả lập
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    // --- CASE 1: HIỂN THỊ ---
    test('1. Hien thi danh sach san pham', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        
        await waitFor(() => {
            expect(screen.getByText('Laptop Dell')).toBeInTheDocument();
            expect(screen.getByText('15,000,000')).toBeInTheDocument();
        });
    });

    // --- CASE 2: TẠO MỚI ---
    test('2. Tao san pham moi thanh cong', async () => {
        productService.getProducts.mockResolvedValue([]); 
        productService.createProduct.mockResolvedValue({ ...mockProduct, id: 2, name: 'New Item' });

        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });

        fireEvent.click(screen.getByTestId('add-product-btn'));

        fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'New Item' } });
        fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
        fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '5' } });
        
        fireEvent.click(screen.getByTestId('submit-button'));

        await waitFor(() => {
            expect(productService.createProduct).toHaveBeenCalledTimes(1);
            expect(productService.createProduct).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New Item',
                price: 1000
            }));
        });
    });

    // --- CASE 3: CẬP NHẬT ---
    test('3. Cap nhat san pham thanh cong', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        productService.updateProduct.mockResolvedValue({ ...mockProduct, name: 'Updated Name' });

        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        
        await waitFor(() => expect(screen.getByText('Laptop Dell')).toBeInTheDocument());

        const editBtns = screen.getAllByTestId('edit-btn');
        fireEvent.click(editBtns[0]);

        const nameInput = screen.getByTestId('product-name');
        fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

        fireEvent.click(screen.getByTestId('submit-button'));

        await waitFor(() => {
            expect(productService.updateProduct).toHaveBeenCalledTimes(1);
            expect(productService.updateProduct).toHaveBeenCalledWith(1, expect.objectContaining({
                name: 'Updated Name'
            }));
        });
    });

    // --- CASE 4: XÓA ---
    test('4. Xoa san pham thanh cong', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        productService.deleteProduct.mockResolvedValue({});

        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        
        await waitFor(() => expect(screen.getByText('Laptop Dell')).toBeInTheDocument());

        const deleteBtns = screen.getAllByTestId('delete-btn');
        fireEvent.click(deleteBtns[0]);

        await waitFor(() => {
            expect(productService.deleteProduct).toHaveBeenCalledWith(1);
        });
    });

    // --- CASE 5: VALIDATE ---
    test('5. Validate form rong (khong goi API)', async () => {
        productService.getProducts.mockResolvedValue([]);
        
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });

        fireEvent.click(screen.getByTestId('add-product-btn'));
        fireEvent.click(screen.getByTestId('submit-button'));

        expect(productService.createProduct).not.toHaveBeenCalled();
        
        await waitFor(() => {
             expect(screen.getByTestId('error-name')).toBeInTheDocument();
        });
    });

    // --- CASE 6: HỦY BỎ ---
    test('6. Huy bo dialog', async () => {
        productService.getProducts.mockResolvedValue([]);
        
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });

        fireEvent.click(screen.getByTestId('add-product-btn'));
        
        const cancelButton = screen.getByText(/Huỷ/i);
        fireEvent.click(cancelButton);

        await waitFor(() => {
            expect(screen.queryByTestId('product-name')).not.toBeInTheDocument();
        });
    });

    // --- CASE 7: API ERROR KHI LOAD ---
    test('7. Xu ly loi khi API load danh sach fail', async () => {
        // Giả lập lỗi để chạy vào catch của useEffect
        productService.getProducts.mockRejectedValue(new Error("Network Error"));
        const consoleSpy = jest.spyOn(console, 'error');

        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        
        await waitFor(() => {
            // Kiểm tra console.error được gọi (dòng 27 trong ProductsPage.jsx)
            expect(consoleSpy).toHaveBeenCalledWith("Loi khi tai danh sach san pham", expect.any(Error));
        });
    });

    // --- CASE 8: API ERROR KHI SAVE ---
    test('8. Xu ly loi khi luu san pham fail', async () => {
        productService.getProducts.mockResolvedValue([]);
        // Giả lập lỗi để chạy vào catch của handleSave
        productService.createProduct.mockRejectedValue(new Error("Save Failed"));

        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });

        fireEvent.click(screen.getByTestId('add-product-btn'));
        
        // Điền dữ liệu hợp lệ
        fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Item Error' } });
        fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
        fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '1' } });

        fireEvent.click(screen.getByTestId('submit-button'));

        await waitFor(() => {
            // Kiểm tra alert được gọi (dòng 52 trong ProductsPage.jsx)
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Có lỗi xảy ra khi lưu sản phẩm'));
        });
    });

    // --- CASE 9: API ERROR KHI DELETE ---
    test('9. Xu ly loi khi xoa san pham fail', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        // Giả lập lỗi để chạy vào catch của onDelete
        productService.deleteProduct.mockRejectedValue(new Error("Delete Failed"));

        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        
        await waitFor(() => expect(screen.getByText('Laptop Dell')).toBeInTheDocument());

        const deleteBtns = screen.getAllByTestId('delete-btn');
        fireEvent.click(deleteBtns[0]);

        await waitFor(() => {
            // Kiểm tra alert được gọi (dòng 64 trong ProductsPage.jsx)
            expect(window.alert).toHaveBeenCalledWith('Không thể xóa sản phẩm');
        });
    });

    // --- CASE 10: HỦY XÓA (CANCEL CONFIRM) ---
    test('10. Huy xoa khi confirm false', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        // Giả lập người dùng bấm Cancel ở popup confirm
        window.confirm.mockReturnValue(false);

        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        
        await waitFor(() => expect(screen.getByText('Laptop Dell')).toBeInTheDocument());

        const deleteBtns = screen.getAllByTestId('delete-btn');
        fireEvent.click(deleteBtns[0]);

        // Đảm bảo deleteProduct KHÔNG được gọi (dòng 58: if (!confirm) return;)
        expect(productService.deleteProduct).not.toHaveBeenCalled();
    });

    // --- CASE 11: LOGOUT ---
    test('11. Logout thanh cong', async () => {
        productService.getProducts.mockResolvedValue([]);
        
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });

        const logoutBtn = screen.getByText('Logout');
        fireEvent.click(logoutBtn);

        expect(authService.logout).toHaveBeenCalled();
        // Kiểm tra điều hướng về login (nav được gọi trong component)
        // Lưu ý: test này chỉ check hàm logout được gọi, việc nav thực tế do Router xử lý
    });

    // --- CASE 12: VIEW DETAIL & EDIT (COVERAGE 100%) ---
    test('12. Xem chi tiet va chuyen sang Edit', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        
        // 1. Tìm nút Xem nhờ data-testid="view-btn" vừa thêm
        const viewBtns = await screen.findAllByTestId('view-btn'); 
        fireEvent.click(viewBtns[0]); // -> Chạy dòng 79-80 (startDetail)

        // 2. Kiểm tra đã vào màn hình Detail
        expect(screen.getByText('Manh')).toBeInTheDocument(); 

        // 3. Click nút Sửa trong màn hình Detail
        const editBtnInDetail = screen.getByTestId('btn-edit'); // data-testid trong ProductDetail
        fireEvent.click(editBtnInDetail); // -> Chạy dòng 133 (onEdit wrapper)

        // 4. Verify chuyển sang màn hình Edit
        await waitFor(() => {
             expect(screen.getByTestId('product-name')).toBeInTheDocument();
             expect(screen.getByDisplayValue('Laptop Dell')).toBeInTheDocument();
        });
    });
});