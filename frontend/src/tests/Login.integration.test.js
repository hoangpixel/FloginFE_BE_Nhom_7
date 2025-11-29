import { BrowserRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';
import App from '../App';
import * as authService from '../services/auth';

describe('Tich hop Component Login (Real API Integration)', () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
        jest.useRealTimers();
    });

    describe('a) Test rendering và user interactions', () => {
        test('TC0: Render form ban dau', () => {

            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            expect(screen.getByTestId('username-input')).toBeInTheDocument();
            expect(screen.getByTestId('password-input')).toBeInTheDocument();
            expect(screen.getByTestId('login-button')).toBeInTheDocument();
        });

        test('TC1B: Tuong tac nhap lieu', () => {

            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );
            const u = screen.getByTestId('username-input');
            const p = screen.getByTestId('password-input');

            fireEvent.change(u, { target: { value: 'abc' } });
            fireEvent.change(p, { target: { value: 'Abc123' } });

            expect(u.value).toBe('abc');
            expect(p.value).toBe('Abc123');
        });
    });

    describe('b) Test form submission', () => {
        test('TC2: Kiem tra ham login duoc goi khi submit (Spy)', async () => {

            const loginSpy = jest.spyOn(authService, 'loginUser');
            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
            fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
            fireEvent.click(screen.getByTestId('login-button'));

            await waitFor(() => {
                expect(loginSpy).toHaveBeenCalledWith({ username: 'admin', password: 'Test123' });
            });
        });

        test('TC3: Hien thi trang thai loading', async () => {

            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
            fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
            fireEvent.click(screen.getByTestId('login-button'));

            expect(screen.getByTestId('login-button')).toHaveTextContent(/dang|loading/i);
            await waitFor(() => {
                expect(screen.getByTestId('login-button')).not.toHaveTextContent(/dang|loading/i);
            }, { timeout: 5000 });
        });
    });

    describe('c) Test error handling va success messages', () => {
        test('TC1: Loi Validation - Submit form rong', async () => {

            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            fireEvent.click(screen.getByTestId('login-button'));

            await waitFor(() => {
                expect(screen.getByTestId('username-error')).toHaveTextContent(/khong duoc de trong/i);
            });
        });

        test('TC4: Loi Backend - Sai thong tin dang nhap', async () => {

            render(
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            );

            fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'user_fake_123' } });
            fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'WrongPass123' } });
            fireEvent.click(screen.getByTestId('login-button'));

            await waitFor(() => {
                const errorEl = screen.getByTestId('username-error');
                expect(errorEl.textContent).toMatch(/Sai|Loi|khong|tontai|failed|connect|fail|Username|ton tai/i);
            }, { timeout: 5000 });
        });

        test('TC5: Thanh cong va dieu huong (YEU CAU BACKEND ONLINE)', async () => {

            render(<App />);

            fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
            fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
            fireEvent.click(screen.getByTestId('login-button'));

            await waitFor(() => {
                expect(screen.getByTestId('login-message')).toHaveTextContent(/thanh cong/i);
            }, { timeout: 8000 });
            await waitFor(() => {
                expect(screen.getByTestId('products-page')).toBeInTheDocument();
            }, { timeout: 8000 });
        });
    });
});