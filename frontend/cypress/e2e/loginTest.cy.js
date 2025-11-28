import LoginPage from '../support/pages/LoginPage';

describe('6.1.2 - E2E Test Scenarios for Login Flow', () => {
  
  beforeEach(() => {
    LoginPage.visit();
  });

  // --- Test UI elements interactions ---
  it('TC1: Kiem tra hien thi cac thanh phan giao dien', () => {
    // Kiểm tra ô nhập và nút bấm có hiển thị và cho phép tương tác không
    LoginPage.txtUsername.should('be.visible').and('be.enabled');
    LoginPage.txtPassword.should('be.visible').and('be.enabled');
    LoginPage.btnLogin.should('be.visible');
  });

  // --- Test complete login flow ---
  it('TC2: Dang nhap thanh cong voi tai khoan hop le', () => {
    // Flow chuẩn: Nhập đúng -> Click -> Vào trong
    LoginPage.login('admin', 'Test123');

    // Đợi API login hoàn thành và kiểm tra chuyển trang thành công
    cy.url({ timeout: 10000 }).should('include', '/products');
  });

  // --- Test error flows ---
  it('TC3: Dang nhap that bai khi nhap sai mat khau', () => {
    LoginPage.login('testuser', 'wrong_password');

    // Kiểm tra thông báo lỗi xuất hiện
    LoginPage.lblErrorMessage.should('be.visible');
  });

  it('TC4: Dang nhap that bai khi tai khoan khong ton tai', () => {
    LoginPage.login('invaliduser123', 'anypassword');

    // Kiểm tra thông báo lỗi
    LoginPage.lblErrorMessage.should('be.visible');
  });

  // --- Test validation messages---
  it('TC5: Kiem tra thong bao loi khi bo trong ten dang nhap', () => {
    // Click nút login luôn mà không nhập gì cả
    LoginPage.btnLogin.click();

    // Kiểm tra Validation message yêu cầu nhập Username
    LoginPage.lblErrorMessage.should('be.visible');
    LoginPage.lblErrorMessage.should('contain.text', 'username khong duoc de trong');
  });

  it('TC6: Kiem tra thong bao loi khi bo trong mat khau', () => {
    // Nhập user nhưng bỏ trống pass
    LoginPage.txtUsername.type('admin');
    LoginPage.btnLogin.click();

    // Kiểm tra Validation message yêu cầu nhập Password
    LoginPage.lblErrorMessage.should('contain.text', 'password khong duoc de trong');
  });

});