// @ts-ignore
import { TextEncoder, TextDecoder } from 'util';
// @ts-ignore
Object.assign(global, { TextEncoder, TextDecoder });
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/Login';
import * as authService from '../services/auth'; // Import service thật
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// 1. GIẢ LẬP (MOCK) SERVICE AUTH
jest.mock('../services/auth');

const renderWithRouter = (ui: any) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('LoginPage Mock Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Mock: Login thanh cong', async () => {
        // 1. Setup Mock trả về thành công
        const mockResponse = {
            success: true,
            token: 'fake-jwt-token',
            user: { username: 'testuser' }
        };
        // Giả sử hàm trong auth.ts tên là login (nếu khác bạn sửa lại nhé)
        (authService.login as jest.Mock).mockResolvedValue(mockResponse);

        // 2. Render
        renderWithRouter(<Login />);

        // 3. Nhập liệu (Thay đổi Placeholder/Label cho khớp giao diện của bạn)
        const usernameInput = screen.getByPlaceholderText(/username|tên đăng nhập/i);
        const passwordInput = screen.getByPlaceholderText(/password|mật khẩu/i);
        const loginButton = screen.getByRole('button', { name: /login|đăng nhập/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'Test1234' } });

        // 4. Click Login
        fireEvent.click(loginButton);

        // 5. Kiểm tra
        await waitFor(() => {
            expect(authService.login).toHaveBeenCalledTimes(1);
            expect(authService.login).toHaveBeenCalledWith({
                username: 'testuser',
                password: 'Test1234'
            });
        });
    });
});