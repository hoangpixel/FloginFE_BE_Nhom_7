import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import Login from "../components/Login";
import "@testing-library/jest-dom";
import { login } from "../services/auth";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
    const actual = jest.requireActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

jest.mock("../services/auth", () => ({ login: jest.fn() }));
const mockedLogin = login as jest.Mock;

describe("LoginPage Mock Tests", () => {

    beforeEach(() => {
        mockedLogin.mockReset();
        mockNavigate.mockReset();
    });

    // TC0 — Render form initial
    test("TC0 Render form ban dau", () => {
        render(React.createElement(Login));
        expect(screen.getByTestId("username-input")).toBeInTheDocument();
        expect(screen.getByTestId("password-input")).toBeInTheDocument();
        expect(screen.getByTestId("login-button")).toHaveTextContent(/login/i);
    });

    // TC1 — Empty form submit
    test("TC1 Hien thi loi khi submit form rong", async () => {
        render(React.createElement(Login));
        fireEvent.click(screen.getByTestId("login-button"));
        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toBeInTheDocument()
        );
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    // TC1B — Update state
    test("TC1B Tuong tac nhap lieu cap nhat state", () => {
        render(React.createElement(Login));
        const u = screen.getByTestId("username-input") as HTMLInputElement;
        const p = screen.getByTestId("password-input") as HTMLInputElement;

        fireEvent.change(u, { target: { value: "abc" } });
        fireEvent.change(p, { target: { value: "Abc123" } });

        expect(u.value).toBe("abc");
        expect(p.value).toBe("Abc123");
    });

    // TC2A — Username invalid
    test("TC2A Loi client username khong hop le", async () => {
        render(React.createElement(Login));

        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "ab" },
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "Abc123" },
        });
        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toHaveTextContent(/3–50/)
        );
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    // TC2A2 — Username empty
    test("TC2A2 Loi username rong", async () => {
        render(React.createElement(Login));

        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "Abc123" },
        });
        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toBeInTheDocument()
        );

        expect(mockedLogin).not.toHaveBeenCalled();
    });

    // TC2B — Password invalid
    test("TC2B Loi password khong hop le", async () => {
        render(React.createElement(Login));

        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "validUser" },
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "abcdef" },
        });
        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toHaveTextContent(/Password/)
        );
        expect(mockedLogin).not.toHaveBeenCalled();
    });

    // TC2B2 — Password empty
    test("TC2B2 Loi password rong", async () => {
        render(React.createElement(Login));

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

        render(React.createElement(Login));

        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "Test123" },
        });

        fireEvent.click(screen.getByTestId("login-button"));

        expect(screen.getByTestId("login-button")).toHaveTextContent(/đang đăng nhập/i);

        await waitFor(() => expect(mockedLogin).toHaveBeenCalledTimes(1));
    });

    // TC4 — Backend fail
    test("TC4 Loi backend tra ve that bai", async () => {
        mockedLogin.mockResolvedValue({
            success: false,
            message: "Sai username hoac password",
        });

        render(React.createElement(Login));
        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "Test123" },
        });
        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            expect(screen.getByTestId("username-error")).toHaveTextContent(
                "Sai username hoac password"
            )
        );
    });

    // TC5 — Success + navigate
    test("TC5 Hien thi thong diep thanh cong va dieu huong", async () => {
        mockedLogin.mockResolvedValue({
            success: true,
            message: "ok",
            token: "t",
            username: "u",
        });

        jest.useFakeTimers();

        render(React.createElement(Login));

        fireEvent.change(screen.getByTestId("username-input"), {
            target: { value: "testuser" },
        });
        fireEvent.change(screen.getByTestId("password-input"), {
            target: { value: "Test123" },
        });

        fireEvent.click(screen.getByTestId("login-button"));

        await waitFor(() =>
            expect(screen.getByTestId("login-message")).toHaveTextContent("thanh cong")
        );

        jest.runAllTimers();

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/products", { replace: true })
        );

        jest.useRealTimers();
    });
});
