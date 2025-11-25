import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Login from "../components/Login";
import "@testing-library/jest-dom";
import { login } from "../services/auth";

const mockNavigate = jest.fn();

// Mock useNavigate của react-router-dom
jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

// Mock service auth
jest.mock("../services/auth", () => ({ login: jest.fn() }));
const mockedLogin = login;

describe("LoginPage Mock Tests", () => {

    beforeEach(() => {
        mockedLogin.mockReset();
        mockNavigate.mockReset();
    });

    // TC0 — Render form initial
    test("TC0 Render form ban dau", () => {
        render(<Login />);
        expect(screen.getByTestId("username-input")).toBeInTheDocument();
        expect(screen.getByTestId("password-input")).toBeInTheDocument();
        // Regex /login/i chấp nhận cả "Login", "LOGIN", "Đăng nhập"...
        expect(screen.getByTestId("login-button")).toBeInTheDocument();
    });

    // TC1 — Empty form submit
    test("TC1 Hien thi loi khi submit form rong", async () => {
        render(<Login />);
        fireEvent.click(screen.getByTestId("login-button"));
        
        await waitFor(() =>
            // Khớp với validation.js: "username không được để trống"
            expect(screen.getByTestId("username-error")).toHaveTextContent(/username không được để trống/i)
        );
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    // TC1B — Update state
    test("TC1B Tuong tac nhap lieu cap nhat state", () => {
        render(<Login />);
        const u = screen.getByTestId("username-input");
        const p = screen.getByTestId("password-input");

        fireEvent.change(u, { target: { value: "abc" } });
        fireEvent.change(p, { target: { value: "Abc123" } });

        expect(u.value).toBe("abc");
        expect(p.value).toBe("Abc123");
    });

    // TC2A — Username invalid
    test("TC2A Loi client username khong hop le", async () => {
        render(<Login />);

        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "ab" }, // < 3 ký tự
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "Abc123" },
        });
        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            // Khớp với validation.js: "username phải có ít nhất 3 ký tự trở lên"
            // (Đề bài yêu cầu min 3 ký tự )
            expect(screen.getByTestId("username-error")).toHaveTextContent(/ít nhất 3 ký tự/i)
        );
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    // TC2A2 — Username empty
    test("TC2A2 Loi username rong", async () => {
        render(<Login />);

        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "Abc123" },
        });
        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            // Kiểm tra thẻ lỗi xuất hiện
            expect(screen.getByTestId("username-error")).toBeInTheDocument()
        );

        expect(mockedLogin).not.toHaveBeenCalled();
    });

    // TC2B — Password invalid
    test("TC2B Loi password khong hop le", async () => {
        render(<Login />);

        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "validUser" },
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "abcdef" }, // Thiếu số
        });
        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            // Khớp với validation.js: "password phải có cả chữ lẫn số"
            // (Đề bài yêu cầu password phải có cả chữ và số [cite: 88])
            expect(screen.getByTestId("username-error")).toHaveTextContent(/cả chữ lẫn số/i)
        );
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    // TC2B2 — Password empty
    test("TC2B2 Loi password rong", async () => {
        render(<Login />);

        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "validUser" },
        });
        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toBeInTheDocument()
        );

        expect(mockedLogin).not.toHaveBeenCalled();
    });

    // TC3 — Loading state
    test("TC3 Trang thai loading khi dang login", async () => {
        mockedLogin.mockImplementation(
            () => new Promise((res) => setTimeout(() => res({ success: true }), 200))
        );

        render(<Login />);

        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "Test123" },
        });

        fireEvent.click(screen.getByTestId("login-button"));

        // Kiểm tra text hiển thị khi đang loading (tuỳ vào component của bạn render gì)
        // Mình dùng regex thoáng để bắt từ khóa
        expect(screen.getByTestId("login-button")).toHaveTextContent(/dang|loading/i);

        await waitFor(() => expect(mockedLogin).toHaveBeenCalledTimes(1));
    });

    // TC4 — Backend fail
    test("TC4 Loi backend tra ve that bai", async () => {
        mockedLogin.mockResolvedValue({
            success: false,
            message: "Sai username hoac password", // Mock trả về
        });

        render(<Login />);
        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "Test123" },
        });
        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toHaveTextContent(
                /Sai username hoac password/i
            )
        );
    });

    // TC5 — Success + navigate
    test("TC5 Hien thi thong diep thanh cong va dieu huong", async () => {
        mockedLogin.mockResolvedValue({
            success: true,
            message: "Đăng nhập thành công",
            token: "fake-token",
            username: "testuser",
        });

        jest.useFakeTimers();

        render(<Login />);

        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "Test123" },
        });

        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            // Kiểm tra thông báo thành công (chấp nhận cả tiếng Anh lẫn Việt)
            expect(screen.getByTestId("login-message")).toHaveTextContent(/thanh cong|success|thành công/i)
        );

        jest.runAllTimers();

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/products", { replace: true })
        );

        jest.useRealTimers();
    });
});