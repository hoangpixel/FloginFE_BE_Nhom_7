import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import Login from '../components/Login';
import '@testing-library/jest-dom';
// SỬA 1: Import đúng tên hàm mới
import { loginUser } from '../services/auth';

const mockNavigate = jest.fn();

// Mock useNavigate
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

// SỬA 2: Mock đúng tên hàm loginUser để Component gọi được
jest.mock('../services/auth', () => ({ loginUser: jest.fn() }));
const mockedLogin = loginUser;

describe('Tich hop LoginPage', () => {
    beforeEach(() => {
        mockedLogin.mockReset();
        mockNavigate.mockReset();
    });

    test('TC0: Render form ban dau', () => {
        render(<Login />);
        expect(screen.getByTestId('username-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });

    test('TC1: Hien thi loi khi submit form rong', async () => {
        render(<Login />);
        const submitBtn = screen.getByTestId('login-button');
        fireEvent.click(submitBtn);
        
        await waitFor(() => {
            // SỬA 3: Regex bắt text không dấu (khớp với validation.js của bạn)
            expect(screen.getByTestId('username-error')).toHaveTextContent(/khong duoc de trong/i);
        });
    });

    test('TC1B: Tuong tac nhap lieu cap nhat state', () => {
        render(<Login />);
        const u = screen.getByTestId('username-input');
        const p = screen.getByTestId('password-input');
        
        fireEvent.change(u, { target: { value: 'abc' } });
        fireEvent.change(p, { target: { value: 'Abc123' } });
        
        expect(u.value).toBe('abc');
        expect(p.value).toBe('Abc123');
    });

    test('TC2A: Loi client username khong hop le', async () => {
        render(<Login />);
        const u = screen.getByTestId('username-input');
        const p = screen.getByTestId('password-input');
        
        fireEvent.change(u, { target: { value: 'ab' } }); // Quá ngắn (< 3)
        fireEvent.change(p, { target: { value: 'Abc123' } });
        fireEvent.click(screen.getByTestId('login-button'));
        
        await waitFor(() => {
            // SỬA 4: Regex bắt text không dấu
            expect(screen.getByTestId('username-error')).toHaveTextContent(/it nhat 3 ky tu/i);
        });
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    test('TC2B: Loi client password khong hop le', async () => {
        render(<Login />);
        const u = screen.getByTestId('username-input');
        const p = screen.getByTestId('password-input');
        
        fireEvent.change(u, { target: { value: 'validUser' } });
        fireEvent.change(p, { target: { value: 'abcdef' } }); // Chỉ có chữ, thiếu số
        fireEvent.click(screen.getByTestId('login-button'));
        
        await waitFor(() => {
            // SỬA 5: Regex bắt text không dấu
            expect(screen.getByTestId('username-error')).toHaveTextContent(/ca chu lan so/i);
        });
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    test('TC2: Goi API khi submit form hop le', async () => {
        mockedLogin.mockResolvedValue({ success: true, message: 'ok', token: 'token', username: 'user' });
        render(<Login />);

        const usernameInput = screen.getByTestId('username-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitBtn = screen.getByTestId('login-button');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'Test123' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockedLogin).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId('login-message')).toHaveTextContent(/thanh cong|thành công/i);
        });
    });

    test('TC3: Trang thai loading khi dang gui', async () => {
        mockedLogin.mockImplementation(() => new Promise(res => setTimeout(() => res({ success: true, message: 'ok' }), 200)));
        render(<Login />);
        
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
        fireEvent.click(screen.getByTestId('login-button'));
        
        expect(screen.getByTestId('login-button')).toHaveTextContent(/dang|loading/i);
        
        await waitFor(() => expect(mockedLogin).toHaveBeenCalledTimes(1));
    });

    test('TC4: Loi backend tra ve that bai', async () => {
        mockedLogin.mockResolvedValue({ success: false, message: 'Sai username hoac password' });
        render(<Login />);
        
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
        fireEvent.click(screen.getByTestId('login-button'));
        
        await waitFor(() => {
            expect(screen.getByTestId('username-error')).toHaveTextContent(/Sai username hoac password/i);
        });
    });

    test('TC5: Hien thi thong diep thanh cong va dieu huong', async () => {
        mockedLogin.mockResolvedValue({ success: true, message: 'ok', token: 't', username: 'u' });
        jest.useFakeTimers();
        
        render(<Login />);
        
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
        fireEvent.click(screen.getByTestId('login-button'));
        
        await waitFor(() => 
            expect(screen.getByTestId('login-message')).toHaveTextContent(/thanh cong|thành công/i)
        );
        
        act(() => {
            jest.runAllTimers();
        });
        
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/products', { replace: true }));
        
        jest.useRealTimers();
    });
});