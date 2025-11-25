import LoginPage from '../support/pages/LoginPage';

describe('Login Test Suite', () => {
  
  beforeEach(() => {
    LoginPage.visit();
  });

  it('TC01: Đăng nhập thành công', () => {
    LoginPage.login('standard_user', 'secret_sauce');
    // Kiểm tra đã vào trang trong thành công
    cy.url().should('include', '/inventory.html');
  });

});