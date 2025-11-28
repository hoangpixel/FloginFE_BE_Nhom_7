import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProductDetail } from "../components/ProductDetail";

describe("ProductDetail Integration Tests", () => {
  const product = {
    id: 1,
    name: "Laptop Dell",
    price: 15000000,
    quantity: 10,
    category: "ELECTRONICS",
    description: "Mô tả test",
  };

  test("TC1: Hien thi chi tiet san pham", () => {
    render(<ProductDetail product={product} onClose={() => {}} />);
    expect(screen.getByText("Laptop Dell")).toBeInTheDocument();
    expect(screen.getByText("15,000,000")).toBeInTheDocument();
    expect(screen.getByText("Mô tả test")).toBeInTheDocument();
  });

  test("TC2: Hien thi nut Dong va goi onClose", () => {
    const handleClose = jest.fn();
    render(<ProductDetail product={product} onClose={handleClose} />);
    const btnClose = screen.getByTestId("btn-close-detail");
    expect(btnClose).toBeInTheDocument();
    btnClose.click();
    expect(handleClose).toHaveBeenCalled();
  });

  test("TC3: Hien thi nut Sua khi co onEdit", () => {
    const handleEdit = jest.fn();
    render(<ProductDetail product={product} onClose={() => {}} onEdit={handleEdit} />);
    const btnEdit = screen.getByTestId("btn-edit");
    expect(btnEdit).toBeInTheDocument();
    btnEdit.click();
    expect(handleEdit).toHaveBeenCalledWith(product);
  });

  test("TC4: Khong render khi product la null", () => {
    render(<ProductDetail product={null} onClose={() => {}} />);
    expect(screen.queryByTestId("product-detail")).not.toBeInTheDocument();
  });

  test("TC5: Hien thi '(Khong co)' khi description rong", () => {
    const emptyDescProduct = { ...product, description: "" };
    render(<ProductDetail product={emptyDescProduct} onClose={() => {}} />);
    expect(screen.getByText("(Khong co)")).toBeInTheDocument();
  });

  test("TC6: Hien thi dung category", () => {
    render(<ProductDetail product={product} onClose={() => {}} />);
    expect(screen.getByText("ELECTRONICS")).toBeInTheDocument();
  });

  test("TC7: Hien thi dung ID và so luong", () => {
    render(<ProductDetail product={product} onClose={() => {}} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("TC8: onEdit khong hien thi khi prop onEdit undefined", () => {
    render(<ProductDetail product={product} onClose={() => {}} />);
    expect(screen.queryByTestId("btn-edit")).not.toBeInTheDocument();
  });
});
