import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import LoginPage from '../pages/LoginPage';
import '@testing-library/jest-dom';
import { login } from '../services/auth';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom');
    return { ...actual, useNavigate: () => mockNavigate };
});

jest.mock('../services/auth', () => ({ login: jest.fn() }));
const mockedLogin = login as jest.Mock;

describe('Tich hop LoginPage', () => {
    beforeEach(() => {
        mockedLogin.mockReset();
        mockNavigate.mockReset();
    });

    test('TC0 Render form ban dau', () => {
        render(React.createElement(LoginPage));
        expect(screen.getByTestId('username-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('login-button')).toHaveTextContent('Login');
    });

    test('TC1 Hien thi loi khi submit form rong', async () => {
        render(React.createElement(LoginPage));
        const submitBtn = screen.getByTestId('login-button');
        fireEvent.click(submitBtn);
        await waitFor(() => {
            expect(screen.getByTestId('username-error')).toBeInTheDocument();
        });
    });

    test('TC1B Tuong tac nhap lieu cap nhat state', () => {
        render(React.createElement(LoginPage));
        const u = screen.getByTestId('username-input') as HTMLInputElement;
        const p = screen.getByTestId('password-input') as HTMLInputElement;
        fireEvent.change(u, { target: { value: 'abc' } });
        fireEvent.change(p, { target: { value: 'Abc123' } });
        expect(u.value).toBe('abc');
        expect(p.value).toBe('Abc123');
    });

    test('TC2A Loi client username khong hop le', async () => {
        render(React.createElement(LoginPage));
        const u = screen.getByTestId('username-input');
        const p = screen.getByTestId('password-input');
        fireEvent.change(u, { target: { value: 'ab' } }); // qua ngan
        fireEvent.change(p, { target: { value: 'Abc123' } });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(screen.getByTestId('username-error')).toHaveTextContent(/Username 3–50/);
        });
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    test('TC2B Loi client password khong hop le', async () => {
        render(React.createElement(LoginPage));
        const u = screen.getByTestId('username-input');
        const p = screen.getByTestId('password-input');
        fireEvent.change(u, { target: { value: 'validUser' } });
        fireEvent.change(p, { target: { value: 'abcdef' } }); // chi chu
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(screen.getByTestId('username-error')).toHaveTextContent(/Password 6–100/);
        });
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    test('TC2 Goi API khi submit form hop le', async () => {
        mockedLogin.mockResolvedValue({ success: true, message: 'ok', token: 'token', username: 'user' });
        render(React.createElement(LoginPage));

        const usernameInput = screen.getByTestId('username-input');
        const passwordInput = screen.getByTestId('password-input');
        const submitBtn = screen.getByTestId('login-button');

        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(passwordInput, { target: { value: 'Test123' } });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockedLogin).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId('login-message')).toHaveTextContent('thanh cong');
        });
    });

    test('TC3 Trang thai loading khi dang gui', async () => {
        mockedLogin.mockImplementation(() => new Promise(res => setTimeout(() => res({ success: true, message: 'ok' }), 200)));
        render(React.createElement(LoginPage));
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
        fireEvent.click(screen.getByTestId('login-button'));
        expect(screen.getByTestId('login-button')).toHaveTextContent(/Đang đăng nhập/i);
        await waitFor(() => expect(mockedLogin).toHaveBeenCalledTimes(1));
    });

    test('TC4 Loi backend tra ve that bai', async () => {
        mockedLogin.mockResolvedValue({ success: false, message: 'Sai username hoac password' });
        render(React.createElement(LoginPage));
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => {
            expect(screen.getByTestId('username-error')).toHaveTextContent('Sai username hoac password');
        });
    });

    test('TC5 Hien thi thong diep thanh cong va dieu huong', async () => {
        mockedLogin.mockResolvedValue({ success: true, message: 'ok', token: 't', username: 'u' });
        jest.useFakeTimers();
        render(React.createElement(LoginPage));
        fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
        fireEvent.click(screen.getByTestId('login-button'));
        await waitFor(() => expect(screen.getByTestId('login-message')).toHaveTextContent('thanh cong'));
        // chay timer de simulate delay dieu huong
        jest.runAllTimers();
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/products', { replace: true }));
        jest.useRealTimers();
    });
});
