// src/tests/ProductMock.test.js
import * as productService from '../services/product';

// Mock toàn bộ module product service
jest.mock('../services/product');

describe('Product Service Mock Tests', () => {
  // Reset mock sau mỗi bài test để đảm bảo không bị trùng lặp số lần gọi
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- a) Mock CRUD operations (Create, Read, Update, Delete) ---

  // 1. Test READ (Lấy danh sách sản phẩm)
  test('Mock: Get products (Read) - Success', async () => {
    const mockResponse = {
      data: [
        { id: 1, name: 'Laptop Dell', price: 15000000 },
        { id: 2, name: 'Mouse Logitech', price: 500000 }
      ],
      total: 2,
      page: 1
    };

    // Giả lập service trả về data thành công
    productService.getProducts.mockResolvedValue(mockResponse);

    // Gọi hàm (giả lập hành động của component)
    const result = await productService.getProducts(1); // trang 1

    // c) Verify all mock calls
    expect(productService.getProducts).toHaveBeenCalledTimes(1); // Kiểm tra đã được gọi 1 lần
    expect(productService.getProducts).toHaveBeenCalledWith(1); // Kiểm tra tham số truyền vào đúng
    expect(result).toEqual(mockResponse); // Kiểm tra kết quả trả về
  });

  // 2. Test CREATE (Tạo sản phẩm mới)
  test('Mock: Create product - Success', async () => {
    const newProduct = { name: 'New Laptop', price: 20000000 };
    const mockCreatedProduct = { id: 3, ...newProduct };

    productService.createProduct.mockResolvedValue(mockCreatedProduct);

    const result = await productService.createProduct(newProduct);

    // c) Verify calls
    expect(productService.createProduct).toHaveBeenCalledTimes(1);
    expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
    expect(result).toEqual(mockCreatedProduct);
  });

  // 3. Test UPDATE (Cập nhật sản phẩm)
  test('Mock: Update product - Success', async () => {
    const updateId = 1;
    const updateData = { price: 16000000 };
    const mockUpdatedProduct = { id: 1, name: 'Laptop Dell', price: 16000000 };

    productService.updateProduct.mockResolvedValue(mockUpdatedProduct);

    const result = await productService.updateProduct(updateId, updateData);

    expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    expect(productService.updateProduct).toHaveBeenCalledWith(updateId, updateData);
    expect(result).toEqual(mockUpdatedProduct);
  });

  // 4. Test DELETE (Xóa sản phẩm)
  test('Mock: Delete product - Success', async () => {
    const deleteId = 1;
    const mockResponse = { message: 'Product deleted successfully' };

    productService.deleteProduct.mockResolvedValue(mockResponse);

    const result = await productService.deleteProduct(deleteId);

    expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    expect(productService.deleteProduct).toHaveBeenCalledWith(deleteId);
    expect(result).toEqual(mockResponse);
  });

  // --- b) Test failure scenarios (Test trường hợp lỗi) ---

  test('Mock: Create product - Failure (API Error)', async () => {
    const invalidProduct = { name: '', price: -100 }; // Giả sử data sai
    const errorMessage = 'Invalid product data';

    // Giả lập service trả về lỗi (Promise reject)
    productService.createProduct.mockRejectedValue(new Error(errorMessage));

    // Mong đợi hàm sẽ throw ra lỗi
    await expect(productService.createProduct(invalidProduct)).rejects.toThrow(errorMessage);

    // c) Verify calls
    expect(productService.createProduct).toHaveBeenCalledTimes(1);
  });
});