import LoginPage from '../support/pages/LoginPage';

describe('6.1.2 - E2E Test Scenarios for Login Flow', () => {
  
  beforeEach(() => {
    LoginPage.visit();
  });

  // --- Test UI elements interactions ---
  it('TC01: Verify UI Elements visibility (Kiểm tra giao diện)', () => {
    // Kiểm tra ô nhập và nút bấm có hiển thị và cho phép tương tác không
    LoginPage.txtUsername.should('be.visible').and('be.enabled');
    LoginPage.txtPassword.should('be.visible').and('be.enabled');
    LoginPage.btnLogin.should('be.visible');
  });

  // --- Test complete login flow ---
  it('TC02: Login Successfully (Đăng nhập thành công)', () => {
    // Flow chuẩn: Nhập đúng -> Click -> Vào trong
    LoginPage.login('standard_user', 'secret_sauce');

    // Kiểm tra chuyển trang thành công
    cy.url().should('include', '/inventory.html');
  });

  // --- Test error flows ---
  it('TC03: Login Failed - Wrong Password (Sai mật khẩu)', () => {
    LoginPage.login('standard_user', 'wrong_pass_123');

    // Kiểm tra thông báo lỗi xuất hiện
    LoginPage.lblErrorMessage.should('be.visible');
    LoginPage.lblErrorMessage.should('contain.text', 'Username and password do not match');
  });

  it('TC04: Login Failed - Locked Out User (Tài khoản bị khóa)', () => {
    LoginPage.login('locked_out_user', 'secret_sauce');

    // Kiểm tra thông báo lỗi cụ thể
    LoginPage.lblErrorMessage.should('contain.text', 'Sorry, this user has been locked out');
  });

  // --- Test validation messages---
  it('TC05: Validation - Empty Username (Bỏ trống tên đăng nhập)', () => {
    // Click nút login luôn mà không nhập gì cả
    LoginPage.btnLogin.click();

    // Kiểm tra Validation message yêu cầu nhập Username
    LoginPage.lblErrorMessage.should('be.visible');
    LoginPage.lblErrorMessage.should('contain.text', 'Username is required');
  });

  it('TC06: Validation - Empty Password (Bỏ trống mật khẩu)', () => {
    // Nhập user nhưng bỏ trống pass
    LoginPage.txtUsername.type('standard_user');
    LoginPage.btnLogin.click();

    // Kiểm tra Validation message yêu cầu nhập Password
    LoginPage.lblErrorMessage.should('contain.text', 'Password is required');
  });

});