import LoginPage from '../support/pages/LoginPage';
import ProductPage from '../support/pages/ProductPage';

describe('6.2.2 - Product CRUD & Filter Operations', () => {

  // Chạy trước mỗi test case: Phải login thì mới test được Product
  beforeEach(() => {
    LoginPage.visit();
    LoginPage.login('standard_user', 'secret_sauce');
  });

  // --- YÊU CẦU B: Test Read/List products (0.5 điểm) ---
  it('TC01: Read - Verify product list is displayed', () => {
    // Kiểm tra danh sách sản phẩm phải xuất hiện
    ProductPage.inventoryItems.should('be.visible');
    // Kiểm tra phải có ít nhất 1 sản phẩm (thường trang này có 6 cái)
    ProductPage.inventoryItems.should('have.length.at.least', 1);
  });

  // --- YÊU CẦU A: Test Create product flow (0.5 điểm) ---
  // (Ánh xạ: Create = Thêm 1 item mới vào giỏ hàng)
  it('TC02: Create - Add product to cart', () => {
    ProductPage.addToCart('Sauce Labs Backpack');
    
    // Kiểm tra icon giỏ hàng hiện số 1
    ProductPage.cartBadge.should('have.text', '1');
  });

  // --- YÊU CẦU C: Test Update product (0.5 điểm) ---
  // (Ánh xạ: Update = Cập nhật trạng thái giỏ hàng - Thêm tiếp món thứ 2)
  // Vì web mẫu không cho sửa tên sản phẩm, nên ta test logic update số lượng
  it('TC03: Update - Update cart state (Add items)', () => {
    // Ban đầu thêm 1 món
    ProductPage.addToCart('Sauce Labs Backpack');
    ProductPage.cartBadge.should('have.text', '1');

    // Update: Thêm món thứ 2
    ProductPage.addToCart('Sauce Labs Bike Light');
    
    // Verify: Số lượng trên giỏ hàng được CẬP NHẬT lên 2
    ProductPage.cartBadge.should('have.text', '2');
  });

  // --- YÊU CẦU D: Test Delete product (0.5 điểm) ---
  // (Ánh xạ: Delete = Xóa sản phẩm khỏi giỏ)
  it('TC04: Delete - Remove product from cart', () => {
    // Setup: Thêm vào trước rồi mới xóa được
    ProductPage.addToCart('Sauce Labs Backpack');
    
    // Action: Xóa
    ProductPage.removeFromCart('Sauce Labs Backpack');

    // Verify: Icon số lượng trên giỏ hàng biến mất (nghĩa là rỗng)
    ProductPage.cartBadge.should('not.exist');
  });

  // --- YÊU CẦU E: Test Search/Filter functionality (0.5 điểm) ---
  // (Ánh xạ: Filter = Chức năng Sort Z to A)
  it('TC05: Filter - Sort products by Name (Z to A)', () => {
    // Chọn option sắp xếp Z -> A
    ProductPage.selectSortOption('za'); // 'za' là value của html option

    // Verify: Sản phẩm đầu tiên phải là cái áo đỏ (Vần T - cuối bảng)
    // Thay vì balo (Vần S)
    ProductPage.firstItemName.should('contain.text', 'Test.allTheThings() T-Shirt (Red)');
  });

});