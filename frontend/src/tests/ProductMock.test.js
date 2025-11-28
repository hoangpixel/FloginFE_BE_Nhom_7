import * as productService from '../services/product';

jest.mock('../services/product');

describe('Product Service Mock Tests', () => {
  // Reset mock sau mỗi bài test để đảm bảo không bị trùng lặp số lần gọi
  afterEach(() => {
    jest.clearAllMocks();
  });

  // a) Mock CRUD operations (Create, Read, Update, Delete)

  test('TC1: Mock - Get products (Read)', async () => {
    const mockResponse = {
      data: [
        { id: 1, name: 'Laptop Dell', price: 15000000 },
        { id: 2, name: 'Mouse Logitech', price: 500000 }
      ],
      total: 2,
      page: 1
    };

    productService.getProducts.mockResolvedValue(mockResponse);

    const result = await productService.getProducts(1);

    expect(productService.getProducts).toHaveBeenCalledTimes(1);
    expect(productService.getProducts).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockResponse);
  });

  test('TC2: Mock - Create product', async () => {
    const newProduct = { name: 'New Laptop', price: 20000000 };
    const mockCreatedProduct = { id: 3, ...newProduct };

    productService.createProduct.mockResolvedValue(mockCreatedProduct);

    const result = await productService.createProduct(newProduct);

    expect(productService.createProduct).toHaveBeenCalledTimes(1);
    expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
    expect(result).toEqual(mockCreatedProduct);
  });

  test('TC3: Mock - Update product', async () => {
    const updateId = 1;
    const updateData = { price: 16000000 };
    const mockUpdatedProduct = { id: 1, name: 'Laptop Dell', price: 16000000 };

    productService.updateProduct.mockResolvedValue(mockUpdatedProduct);

    const result = await productService.updateProduct(updateId, updateData);

    expect(productService.updateProduct).toHaveBeenCalledTimes(1);
    expect(productService.updateProduct).toHaveBeenCalledWith(updateId, updateData);
    expect(result).toEqual(mockUpdatedProduct);
  });

  test('TC4: Mock - Delete product', async () => {
    const deleteId = 1;
    const mockResponse = { message: 'Product deleted successfully' };

    productService.deleteProduct.mockResolvedValue(mockResponse);

    const result = await productService.deleteProduct(deleteId);

    expect(productService.deleteProduct).toHaveBeenCalledTimes(1);
    expect(productService.deleteProduct).toHaveBeenCalledWith(deleteId);
    expect(result).toEqual(mockResponse);
  });

  // b) Test failure scenarios (Test trường hợp lỗi)

  test('TC5: Mock - Create product - Failure (API Error)', async () => {
    const invalidProduct = { name: '', price: -100 };
    const errorMessage = 'Invalid product data';

    productService.createProduct.mockRejectedValue(new Error(errorMessage));

    await expect(productService.createProduct(invalidProduct)).rejects.toThrow(errorMessage);

    // c) Verify calls
    expect(productService.createProduct).toHaveBeenCalledTimes(1);
  });
});