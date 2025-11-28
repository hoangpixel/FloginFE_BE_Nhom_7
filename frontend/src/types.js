/**
 * Danh mục sản phẩm
 * @typedef {'ELECTRONICS' | 'FASHION' | 'FOOD' | 'HOME' | 'OTHER'} Category
 */

/**
 * Cấu trúc đối tượng Product
 * @typedef {Object} Product
 * @property {number} id - ID của sản phẩm
 * @property {string} name - Tên sản phẩm
 * @property {number} price - Giá sản phẩm
 * @property {number} quantity - Số lượng
 * @property {string} [description] - Mô tả (tùy chọn)
 * @property {Category} category - Danh mục
 */

/**
 * Payload để tạo/sửa sản phẩm (không bao gồm ID)
 * @typedef {Omit<Product, 'id'>} ProductPayload
 */

/**
 * Dữ liệu yêu cầu đăng nhập
 * @typedef {Object} LoginRequest
 * @property {string} username
 * @property {string} password
 */

/**
 * Phản hồi sau khi đăng nhập thành công
 * @typedef {Object} LoginResponse
 * @property {string} token
 * @property {string} username
 */

// File này không export code thực thi (runtime code), 
// nó chỉ chứa định nghĩa kiểu cho JSDoc check.
export {};