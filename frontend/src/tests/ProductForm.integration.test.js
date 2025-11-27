import { TextEncoder, TextDecoder } from "util";
Object.assign(global, { TextEncoder, TextDecoder });

import React from "react";
import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";

import ProductForm from "../components/ProductForm";

describe("ProductForm Integration Tests", () => {
  let mockSave, mockCancel;

  beforeEach(() => {
    mockSave = jest.fn();
    mockCancel = jest.fn();
    jest.clearAllMocks();
  });

  const categories = ["ELECTRONICS", "BOOK", "TOY"];

  test("TC1: Tao san pham moi thanh cong", async () => {
    const resolved = Promise.resolve();
    mockSave.mockReturnValue(resolved);

    render(
      <ProductForm
        mode="create"
        categories={categories}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "Laptop Dell" },
    });
    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: "15000000" },
    });
    fireEvent.change(screen.getByTestId("product-quantity"), {
      target: { value: "10" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });

  test("TC2: Khong nhap form → hien thị loi & khong goi API", async () => {
    render(
      <ProductForm
        mode="create"
        categories={categories}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockSave).not.toHaveBeenCalled();
      expect(screen.getByTestId("error-name")).toBeInTheDocument();
      expect(screen.getByTestId("summary-errors")).toBeInTheDocument();
    });
  });

  test("TC3: Nhap gia khong hop le → bao loi", () => {
    render(
      <ProductForm
        mode="create"
        categories={categories}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    fireEvent.change(screen.getByTestId("product-price"), {
      target: { value: "-10" },
    });
    fireEvent.blur(screen.getByTestId("product-price"));

    expect(screen.getByTestId("error-price")).toBeInTheDocument();
  });

  test("TC4: Update san phẩm thanh cong", async () => {
    mockSave.mockResolvedValue({});

    render(
      <ProductForm
        mode="edit"
        initial={{
          name: "Laptop",
          price: 12000,
          quantity: 3,
          category: "ELECTRONICS",
          description: "Old",
        }}
        categories={categories}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    fireEvent.change(screen.getByTestId("product-name"), {
      target: { value: "Laptop Gaming" },
    });

    fireEvent.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });

  test("TC5: Thay doi category hoat dong dung", () => {
    render(
      <ProductForm
        mode="create"
        categories={categories}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    const select = screen.getByTestId("product-category");
    fireEvent.change(select, { target: { value: "TOY" } });

    expect(select.value).toBe("TOY");
  });

  test("TC6: Render form edit dung du lieu initial", () => {
    render(
      <ProductForm
        mode="edit"
        initial={{
          name: "Phone",
          price: 999,
          quantity: 1,
          description: "Test desc",
          category: "ELECTRONICS",
        }}
        categories={categories}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    expect(screen.getByDisplayValue("Phone")).toBeInTheDocument();
    expect(screen.getByDisplayValue("999")).toBeInTheDocument();
    expect(screen.getByDisplayValue("1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Test desc")).toBeInTheDocument();
  });

  test("TC7: Nhan Huy → goi onCancel", () => {
    render(
      <ProductForm
        mode="create"
        categories={categories}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    fireEvent.click(screen.getByText("Huỷ"));
    expect(mockCancel).toHaveBeenCalledTimes(1);
  });

  test("TC8: Mo ta qua 500 ky tu → hien loi", () => {
    render(
      <ProductForm
        mode="create"
        categories={categories}
        onSave={mockSave}
        onCancel={mockCancel}
      />
    );

    const longText = "a".repeat(600);
    fireEvent.change(screen.getByTestId("product-description"), {
      target: { value: longText },
    });
    fireEvent.blur(screen.getByTestId("product-description"));

    expect(screen.getByTestId("error-description")).toBeInTheDocument();
  });

  test("TC9: Khong chon category → bao loi summary", async () => {
  render(
    <ProductForm
      mode="create"
      categories={[""]}
      onSave={mockSave}
      onCancel={mockCancel}
    />
  );

  fireEvent.click(screen.getByTestId("submit-button"));

  await waitFor(() => {
    expect(screen.getByTestId("summary-errors")).toBeInTheDocument();
    expect(mockSave).not.toHaveBeenCalled();
    });
  });
});
