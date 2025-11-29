import { render, screen, fireEvent } from "@testing-library/react";
import ProductList from "../components/ProductList";

describe("ProductList Component Tests", () => {

    const mockProducts = [
        { id: 1, name: "Laptop", price: 15000000, quantity: 10, category: "Tech" },
        { id: 2, name: "Phone", price: 5000000, quantity: 5, category: "Tech" }
    ];

    const mockOnView = jest.fn();
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    test("TC1: Hien thi dung so luong san pham", () => {
        render(
            <ProductList 
                items={mockProducts} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        const rows = screen.getAllByTestId("product-item");

        expect(rows.length).toBe(2);
    });

    test("TC2: Hien thi Empty khi khong co san pham", () => {
        render(
            <ProductList 
                items={[]} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        expect(screen.getByText(/chưa có sản phẩm/i)).toBeInTheDocument();
    });

    test("TC3: Hien thi dung ten san pham", () => {
        render(
            <ProductList 
                items={mockProducts} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        expect(screen.getByText("Laptop")).toBeInTheDocument();
        expect(screen.getByText("Phone")).toBeInTheDocument();
    });

    test("TC4: Click nut View goi callback dung", () => {
        render(
            <ProductList 
                items={mockProducts} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        fireEvent.click(screen.getAllByTestId("view-btn")[0]);

        expect(mockOnView).toHaveBeenCalledWith(mockProducts[0]);
    });

    test("TC5: Click nut Edit goi callback dung", () => {
        render(
            <ProductList 
                items={mockProducts} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        fireEvent.click(screen.getAllByTestId("edit-btn")[1]);

        expect(mockOnEdit).toHaveBeenCalledWith(mockProducts[1]);
    });

    test("TC6: Click nut Delete gọi callback dung ID", () => {
        render(
            <ProductList 
                items={mockProducts} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        fireEvent.click(screen.getAllByTestId("delete-btn")[0]);

        expect(mockOnDelete).toHaveBeenCalledWith(1);
    });

    test("TC7: Format gia tien theo toLocaleString()", () => {
        render(
            <ProductList 
                items={mockProducts} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        expect(screen.getByText("15,000,000")).toBeInTheDocument();
        expect(screen.getByText("5,000,000")).toBeInTheDocument();
    });

    test("TC8: Co hien thi day du cac cot", () => {
        render(
            <ProductList 
                items={mockProducts} 
                onView={mockOnView} 
                onEdit={mockOnEdit} 
                onDelete={mockOnDelete} 
            />
        );

        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Price")).toBeInTheDocument();
        expect(screen.getByText("Qty")).toBeInTheDocument();
        expect(screen.getByText("Category")).toBeInTheDocument();
    });

    test("TC9: Hien thi phan trang khi totalPages > 1", () => {
        const onPageChange = jest.fn();
        render(
            <ProductList
                items={mockProducts}
                onView={mockOnView}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                currentPage={1}
                totalPages={3}
                onPageChange={onPageChange}
            />
        );

        expect(screen.getByTestId('pagination-controls')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-1')).toBeInTheDocument();
        expect(screen.getByTestId('page-btn-2')).toBeInTheDocument();
    });

    test("TC10: Click vao so trang goi onPageChange dung gia tri", () => {
        const onPageChange = jest.fn();
        render(
            <ProductList
                items={mockProducts}
                onView={mockOnView}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                currentPage={1}
                totalPages={3}
                onPageChange={onPageChange}
            />
        );
        fireEvent.click(screen.getByTestId('page-btn-2'));

        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    test("TC11: Previous disabled o trang 1 va khong goi onPageChange", () => {
        const onPageChange = jest.fn();
        render(
            <ProductList
                items={mockProducts}
                onView={mockOnView}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                currentPage={1}
                totalPages={2}
                onPageChange={onPageChange}
            />
        );
        const prevBtn = screen.getByText(/Trang trước/i);

        expect(prevBtn).toBeDisabled();

        fireEvent.click(prevBtn);

        expect(onPageChange).not.toHaveBeenCalled();
    });

    test("TC12: Next disabled o trang cuoi va khong goi onPageChange", () => {
        const onPageChange = jest.fn();
        render(
            <ProductList
                items={mockProducts}
                onView={mockOnView}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                currentPage={3}
                totalPages={3}
                onPageChange={onPageChange}
            />
        );
        const nextBtn = screen.getByText(/Trang sau/i);

        expect(nextBtn).toBeDisabled();

        fireEvent.click(nextBtn);

        expect(onPageChange).not.toHaveBeenCalled();
    });

    test("TC13: Previous & Next hoat dong o trang giua", () => {
        const onPageChange = jest.fn();
        render(
            <ProductList
                items={mockProducts}
                onView={mockOnView}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                currentPage={2}
                totalPages={3}
                onPageChange={onPageChange}
            />
        );
        const prevBtn = screen.getByText(/Trang trước/i);
        const nextBtn = screen.getByText(/Trang sau/i);

        expect(prevBtn).not.toBeDisabled();
        expect(nextBtn).not.toBeDisabled();

        fireEvent.click(prevBtn);
        fireEvent.click(nextBtn);
        
        expect(onPageChange).toHaveBeenCalledWith(1);
        expect(onPageChange).toHaveBeenCalledWith(3);
    });
});
