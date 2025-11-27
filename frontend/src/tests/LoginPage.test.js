import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import React from "react";
import Login from "../components/Login";
import "@testing-library/jest-dom";
// 1. Thay đổi cách import cho giống đề bài
import * as authService from "../services/auth";

// 2. Mock toàn bộ module (Style đề bài)
jest.mock("../services/auth");

// 3. Mock Navigate (Vẫn phải giữ để chạy được)
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

describe("Login Mock Tests", () => {

    beforeEach(() => {
        // Reset toàn bộ mock (Style đề bài)
        jest.clearAllMocks();
    });

    test("TC1: Render giao dien form ban dau", () => {
        render(<Login />);
        expect(screen.getByTestId("username-input")).toBeInTheDocument();
        expect(screen.getByTestId("password-input")).toBeInTheDocument();
        expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    test("TC2: Tuong tac nhap lieu cap nhat state", () => {
        render(<Login />);
        const u = screen.getByTestId("username-input");
        const p = screen.getByTestId("password-input");
        fireEvent.change(u, { target: { value: "abc" } });
        fireEvent.change(p, { target: { value: "Abc123" } });
        expect(u.value).toBe("abc");
        expect(p.value).toBe("Abc123");
    });

test("TC3: Hien thi loi khi submit form rong", async () => {
        render(<Login />);
        fireEvent.click(screen.getByTestId("login-button"));       
        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toHaveTextContent(/username khong duoc de trong/i)
        );
        expect(authService.loginUser).not.toHaveBeenCalled();
    });

    test("TC4: Loi client username khong hop le", async () => {
        render(<Login />);
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "ab" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Abc123" } });
        fireEvent.click(screen.getByTestId("login-button"));
        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toHaveTextContent(/it nhat 3 ky tu/i)
        );
        expect(authService.loginUser).not.toHaveBeenCalled();
    });

    test("TC5: Loi client password khong hop le", async () => {
        render(<Login />);
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "validUser" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "abcdef" } }); 
        fireEvent.click(screen.getByTestId("login-button"));
        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toHaveTextContent(/ca chu lan so/i)
        );
        expect(authService.loginUser).not.toHaveBeenCalled();
    });

    test("TC6: Goi API khi submit form hop le", async () => {
        // Setup mock theo style đề bài
        authService.loginUser.mockResolvedValue({ 
            success: true, message: 'ok', token: 'token', username: 'user' 
        });

        render(<Login />);
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "testuser" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Test123" } });
        fireEvent.click(screen.getByTestId("login-button"));
        
        await waitFor(() => {
            expect(authService.loginUser).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId("login-message")).toHaveTextContent(/thanh cong|thành công/i);
        });
    });

    test("TC7: Hien thi trang thai Loading khi dang gui", async () => {
        // Setup mock implementation
        authService.loginUser.mockImplementation(
            () => new Promise((res) => setTimeout(() => res({ success: true }), 200))
        );
        
        render(<Login />);       
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "testuser" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Test123" } });
        fireEvent.click(screen.getByTestId("login-button"));
        
        expect(screen.getByTestId("login-button")).toHaveTextContent(/dang|loading/i);
        await waitFor(() => expect(authService.loginUser).toHaveBeenCalledTimes(1));
    });

    test("TC8: Loi backend tra ve that bai", async () => {
        // Setup mock trả về thất bại
        authService.loginUser.mockResolvedValue({
            success: false,
            message: "Sai username hoac password",
        });

        render(<Login />);     
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "testuser" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Test123" } });
        fireEvent.click(screen.getByTestId("login-button"));
        
        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toHaveTextContent(/Sai username hoac password/i)
        );
    });

    test("TC9: Hien thi thong diep thanh cong va dieu huong", async () => {
        authService.loginUser.mockResolvedValue({
            success: true,
            message: "Đăng nhập thành công",
            token: "fake-token",
            username: "testuser",
        });
        
        jest.useFakeTimers();
        render(<Login />);
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "testuser" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Test123" } });
        fireEvent.click(screen.getByTestId("login-button"));
        
        await waitFor(() =>
            expect(screen.getByTestId("login-message")).toHaveTextContent(/thanh cong|thành công/i)
        );
        
        // Bọc act để tránh warning
        act(() => {
            jest.runAllTimers();
        });

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/products", { replace: true })
        );
        jest.useRealTimers();
    });
});