import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextEncoder, TextDecoder });

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

import ProductsPage from '../pages/ProductsPage';
import * as productService from '../services/product';
import * as authService from '../services/auth';


// Mock Navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

// Mock Services
jest.mock('../services/product');
jest.mock('../services/auth');

// Mock RequestSubmit cho JSDOM
if (!HTMLFormElement.prototype.requestSubmit) {
  Object.defineProperty(HTMLFormElement.prototype, 'requestSubmit', {
    value: function () {
      this.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    },
    writable: true,
    configurable: true
  });
}

const mockProduct = { 
    id: 1, 
    name: 'Laptop Dell', 
    price: 15000000, 
    category: 'ELECTRONICS', 
    quantity: 10, 
    description: 'Manh' 
};

const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};


describe('ProductsPage Integration Tests', () => {

    beforeAll(() => {
        window.addEventListener('unhandledrejection', (e) => e.preventDefault());
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(window, 'confirm').mockReturnValue(true);
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('TC1: Hien thi danh sach san pham (Read)', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        await waitFor(() => {
            expect(screen.getByText('Laptop Dell')).toBeInTheDocument();
            expect(screen.getByText('15,000,000')).toBeInTheDocument();
        });
    });

    test('TC2: Tao san pham moi thanh cong (Create)', async () => {
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

    test('TC3: Cap nhat san pham thanh cong (Update)', async () => {
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

    test('TC4: Xoa san pham thanh cong (Delete)', async () => {
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

    test('TC5: Validate form rong (Khong goi API)', async () => {
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

    test('TC6: Huy bo dialog (Cancel)', async () => {
        productService.getProducts.mockResolvedValue([]);
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        fireEvent.click(screen.getByTestId('add-product-btn'));
        const cancelButton = screen.getByText(/Huỷ|Cancel/i);
        fireEvent.click(cancelButton);
        await waitFor(() => {
            expect(screen.queryByTestId('product-name')).not.toBeInTheDocument();
        });
    });

    test('TC7: Xu ly loi khi API load danh sach fail', async () => {
        productService.getProducts.mockRejectedValue(new Error("Network Error"));
        const consoleSpy = jest.spyOn(console, 'error');
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith("Loi khi tai danh sach san pham", expect.any(Error));
        });
    });

    test('TC8: Xu ly loi khi luu san pham fail', async () => {
        productService.getProducts.mockResolvedValue([]);
        productService.createProduct.mockRejectedValue(new Error("Save Failed"));
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        fireEvent.click(screen.getByTestId('add-product-btn'));
        fireEvent.change(screen.getByTestId('product-name'), { target: { value: 'Item Error' } });
        fireEvent.change(screen.getByTestId('product-price'), { target: { value: '1000' } });
        fireEvent.change(screen.getByTestId('product-quantity'), { target: { value: '1' } });
        fireEvent.click(screen.getByTestId('submit-button'));
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Có lỗi xảy ra khi lưu sản phẩm'));
        });
    });

    test('TC9: Xu ly loi khi xoa san pham fail', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        productService.deleteProduct.mockRejectedValue(new Error("Delete Failed"));
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        await waitFor(() => expect(screen.getByText('Laptop Dell')).toBeInTheDocument());
        const deleteBtns = screen.getAllByTestId('delete-btn');
        fireEvent.click(deleteBtns[0]);
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Không thể xóa sản phẩm');
        });
    });

    test('TC10: Huy xoa khi confirm false', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        window.confirm.mockReturnValue(false);
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        await waitFor(() => expect(screen.getByText('Laptop Dell')).toBeInTheDocument());
        const deleteBtns = screen.getAllByTestId('delete-btn');
        fireEvent.click(deleteBtns[0]);
        expect(productService.deleteProduct).not.toHaveBeenCalled();
    });

    test('TC11: Logout thanh cong', async () => {
        productService.getProducts.mockResolvedValue([]);
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        const logoutBtn = screen.getByText(/Logout|Đăng xuất/i);
        fireEvent.click(logoutBtn);
        expect(authService.logout).toHaveBeenCalled();
    });

    test('TC12: Xem chi tiet va chuyen sang Edit', async () => {
        productService.getProducts.mockResolvedValue([mockProduct]);
        await act(async () => {
            renderWithRouter(<ProductsPage />);
        });
        const viewBtns = await screen.findAllByTestId('view-btn'); 
        fireEvent.click(viewBtns[0]); 
        expect(screen.getByText('Manh')).toBeInTheDocument(); 
        const editBtnInDetail = screen.getByTestId('btn-edit'); 
        fireEvent.click(editBtnInDetail); 
        await waitFor(() => {
             expect(screen.getByTestId('product-name')).toBeInTheDocument();
             expect(screen.getByDisplayValue('Laptop Dell')).toBeInTheDocument();
        });
    });
});