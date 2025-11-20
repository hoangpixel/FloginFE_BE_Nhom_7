// @ts-ignore
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore
Object.assign(global, { TextEncoder, TextDecoder });

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductsPage from '../pages/ProductsPage';
import * as productService from '../services/product';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// 1. GIẢ LẬP SERVICE PRODUCT
jest.mock('../services/product');

const renderWithRouter = (ui: any) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('ProductsPage Integration Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Tao san pham moi thanh cong', async () => {
        // 1. Setup Mock
        (productService.getProducts as jest.Mock).mockResolvedValue({ data: [] }); 
        (productService.createProduct as jest.Mock).mockResolvedValue({ id: 1, name: 'Iphone 15' });

        renderWithRouter(<ProductsPage />);

        // 2. Tìm nút "Thêm"
        const addButton = screen.getByRole('button', { name: /add|thêm|new/i });
        fireEvent.click(addButton);

        // 3. Điền form
        const nameInput = screen.getByPlaceholderText(/tên|name/i);
        fireEvent.change(nameInput, { target: { value: 'Iphone 15' } });

        const priceInput = screen.getByPlaceholderText(/giá|price/i);
        fireEvent.change(priceInput, { target: { value: '30000000' } });

        // 4. Submit Form (CHIẾN THUẬT B: Né lỗi requestSubmit)
        // Thay vì bấm nút Save, ta tìm form chứa ô input và submit nó trực tiếp
        const form = nameInput.closest('form');
        if (form) {
            fireEvent.submit(form);
        } else {
            // Fallback nếu không tìm thấy form (ít khi xảy ra)
            throw new Error("Không tìm thấy thẻ <form> để submit");
        }

        // 5. Kiểm tra
        await waitFor(() => {
            expect(productService.createProduct).toHaveBeenCalledTimes(1);
        });
    });
});