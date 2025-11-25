import LoginPage from '../support/pages/LoginPage';
import ProductPage from '../support/pages/ProductPage';

describe('Product Feature Test', () => {
  
  it('Test thử Product POM', () => {
    // 1. Phải đăng nhập trước mới thấy trang Product
    LoginPage.visit();
    LoginPage.login('standard_user', 'secret_sauce');

    // 2. Thử thêm cái Balo vào giỏ (Dùng hàm vừa viết bên ProductPage)
    ProductPage.addToCart('Sauce Labs Backpack');

    // 3. Kiểm tra icon giỏ hàng hiện số 1
    ProductPage.cartBadge.should('have.text', '1');
  });

});