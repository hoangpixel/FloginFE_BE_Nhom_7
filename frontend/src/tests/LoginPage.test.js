import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Login from "../components/Login";
import "@testing-library/jest-dom";
import { login } from "../services/auth";

// 1. MOCK NAVIGATE
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

// 2. MOCK SERVICE AUTH
jest.mock("../services/auth", () => ({ login: jest.fn() }));
const mockedLogin = login;

describe("LoginPage Integration Tests", () => {

    beforeEach(() => {
        mockedLogin.mockReset();
        mockNavigate.mockReset();
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
            expect(screen.getByTestId("username-error")).toHaveTextContent(/username không được để trống/i)
        );
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    test("TC4: Loi client username khong hop le", async () => {
        render(<Login />);
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "ab" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Abc123" } });
        fireEvent.click(screen.getByTestId("login-button"));
        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toHaveTextContent(/ít nhất 3 ký tự/i)
        );
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    test("TC5: Loi client password khong hop le", async () => {
        render(<Login />);
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "validUser" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "abcdef" } }); 
        fireEvent.click(screen.getByTestId("login-button"));
        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toHaveTextContent(/cả chữ lẫn số/i)
        );
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    test("TC6: Goi API khi submit form hop le", async () => {
        mockedLogin.mockResolvedValue({ success: true, message: 'ok', token: 'token', username: 'user' });
        render(<Login />);
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "testuser" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Test123" } });
        fireEvent.click(screen.getByTestId("login-button"));
        await waitFor(() => {
            expect(mockedLogin).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId("login-message")).toHaveTextContent(/thanh cong|thành công/i);
        });
    });

    test("TC7: Hien thi trang thai Loading khi dang gui", async () => {
        mockedLogin.mockImplementation(
            () => new Promise((res) => setTimeout(() => res({ success: true }), 200))
        );
        render(<Login />);       
        fireEvent.change(screen.getByTestId("username-input"), { target: { value: "testuser" } });
        fireEvent.change(screen.getByTestId("password-input"), { target: { value: "Test123" } });
        fireEvent.click(screen.getByTestId("login-button"));
        expect(screen.getByTestId("login-button")).toHaveTextContent(/dang|loading/i);
        await waitFor(() => expect(mockedLogin).toHaveBeenCalledTimes(1));
    });

    test("TC8: Loi backend tra ve that bai", async () => {
        mockedLogin.mockResolvedValue({
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
        mockedLogin.mockResolvedValue({
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
        jest.runAllTimers();
        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/products", { replace: true })
        );
        jest.useRealTimers();
    });
});