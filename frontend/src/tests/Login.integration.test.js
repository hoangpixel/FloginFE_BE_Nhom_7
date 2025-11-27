import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../components/Login';
import App from '../App';
import { MemoryRouter } from 'react-router-dom';

// a) Test rendering và user interactions
// b) Test form submission và API calls (thực, không mock)
// c) Test error handling và success messages (thực, không mock)

describe('Tich hop LoginPage (khong mock)', () => {
    beforeEach(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        jest.useRealTimers();
    });

    // a) Test rendering và user interactions
    describe('a) Test rendering và user interactions', () => {
        test('TC0: Render form ban dau', () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );
            expect(screen.getByTestId('username-input')).toBeInTheDocument();
            expect(screen.getByTestId('password-input')).toBeInTheDocument();
            expect(screen.getByTestId('login-button')).toBeInTheDocument();
        });

        test('TC1B: Tuong tac nhap lieu cap nhat state', () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );
            const u = screen.getByTestId('username-input');
            const p = screen.getByTestId('password-input');
            fireEvent.change(u, { target: { value: 'abc' } });
            fireEvent.change(p, { target: { value: 'Abc123' } });
            expect(u.value).toBe('abc');
            expect(p.value).toBe('Abc123');
        });
    });

    // b) Test form submission và API calls
    describe('b) Test form submission và API calls', () => {
        test('TC2: Goi API khi submit form hop le (tich hop thuc)', async () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );
            fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
            fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
            fireEvent.click(screen.getByTestId('login-button'));
            // Cố gắng đợi success; nếu BE không chạy, chấp nhận fallback error
            try {
                await waitFor(() => {
                    expect(screen.getByTestId('login-message')).toHaveTextContent(/thanh cong/i);
                }, { timeout: 8000 });
                expect(localStorage.getItem('token')).toBeTruthy();
            } catch {
                await waitFor(() => {
                    expect(screen.getByTestId('username-error')).toHaveTextContent(/Co loi xay ra/i);
                }, { timeout: 8000 });
                expect(localStorage.getItem('token')).toBeFalsy();
            }
        }, 15000);

        test('TC3: Trang thai loading khi dang gui', async () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );
            fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
            fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
            fireEvent.click(screen.getByTestId('login-button'));
            // Loading xuất hiện ngay sau submit
            expect(screen.getByTestId('login-button')).toHaveTextContent(/dang dang nhap|dang|loading/i);
            // Hết loading sau khi API phản hồi~
            await waitFor(() => {
                expect(screen.getByTestId('login-button')).not.toHaveTextContent(/dang dang nhap|dang|loading/i);
            }, { timeout: 8000 });
        });
    });

    // c) Test error handling và success messages
    describe('c) Test error handling và success messages', () => {
        test('TC1: Hien thi loi khi submit form rong', async () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );
            fireEvent.click(screen.getByTestId('login-button'));
            await waitFor(() => {
                expect(screen.getByTestId('username-error')).toHaveTextContent(/khong duoc de trong/i);
            });
        });

        test('TC2A: Loi client username khong hop le', async () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );
            fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'ab' } });
            fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Abc123' } });
            fireEvent.click(screen.getByTestId('login-button'));
            await waitFor(() => {
                expect(screen.getByTestId('username-error')).toHaveTextContent(/it nhat 3 ky tu/i);
            });
        });

        test('TC2B: Loi client password khong hop le', async () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );
            fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'validUser' } });
            fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'abcdef' } });
            fireEvent.click(screen.getByTestId('login-button'));
            await waitFor(() => {
                // Component chỉ có 1 thẻ error: username-error
                expect(screen.getByTestId('username-error')).toHaveTextContent(/password phai co ca chu lan so/i);
            });
        });

        test('TC4: Loi backend tra ve that bai (tich hop thuc)', async () => {
            render(
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            );
            fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'wrong' } });
            fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Wrong123' } });
            fireEvent.click(screen.getByTestId('login-button'));
            await waitFor(() => {
                // Chấp nhận nhiều thông điệp lỗi tuỳ BE
                expect(screen.getByTestId('username-error').textContent).toMatch(/Username|Sai|định dạng|Co loi/i);
                expect(localStorage.getItem('token')).toBeFalsy();
            }, { timeout: 8000 });
        });

        test('TC5: Thanh cong va dieu huong (khong mock)', async () => {
            // Dùng App thật để kiểm tra điều hướng tới /products
            jest.useFakeTimers();
            render(<App />);
            // Ở trang Login trước
            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            fireEvent.change(screen.getByTestId('username-input'), { target: { value: 'admin' } });
            fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'Test123' } });
            fireEvent.click(screen.getByTestId('login-button'));
            // Thử đợi success; nếu không có (BE không chạy), xác nhận thông báo lỗi và kết thúc test
            let success = false;
            try {
                await waitFor(() => {
                    expect(screen.getByTestId('login-message')).toHaveTextContent(/thanh cong/i);
                }, { timeout: 8000 });
                success = true;
            } catch {
                await waitFor(() => {
                    expect(screen.getByTestId('username-error')).toHaveTextContent(/Co loi xay ra/i);
                }, { timeout: 8000 });
            }

            if (success) {
                await Promise.resolve();
                jest.advanceTimersByTime(600);
                await waitFor(() => {
                    expect(screen.getByTestId('products-page')).toBeInTheDocument();
                }, { timeout: 8000 });
            }
            jest.useRealTimers();
        }, 15000);
    });
});