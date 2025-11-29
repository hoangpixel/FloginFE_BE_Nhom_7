import api from './axios';

/**
 * Lấy danh sách sản phẩm
 * API: GET /api/products
 * @returns {Promise<Array>} Danh sách sản phẩm
 */
export async function getProducts() {
  const { data } = await api.get('/products');
  return data;
}

/**
 * Tạo sản phẩm mới
 * API: POST /api/products
 * @param {Object} product - Dữ liệu sản phẩm (không bao gồm ID)
 * @returns {Promise<Object>} Sản phẩm vừa tạo
 */
export async function createProduct(product) {
  const { data } = await api.post('/products', product);
  return data;
}

/**
 * Cập nhật sản phẩm
 * API: PUT /api/products/{id}
 * @param {number} id - ID sản phẩm
 * @param {Object} product - Dữ liệu cập nhật
 * @returns {Promise<Object>} Sản phẩm đã cập nhật
 */
export async function updateProduct(id, product) {
  const { data } = await api.put(`/products/${id}`, product);
  return data;
}

/**
 * Xóa sản phẩm
 * API: DELETE /api/products/{id}
 * @param {number} id - ID sản phẩm
 */
export async function deleteProduct(id) {
  await api.delete(`/products/${id}`);
}

/**
 * Xem chi tiết một sản phẩm
 * API: GET /api/products/{id}
 * @param {number} id - ID sản phẩm
 * @returns {Promise<Object>} Chi tiết sản phẩm
 */
export async function readProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}