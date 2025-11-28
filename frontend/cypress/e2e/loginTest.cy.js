import LoginPage from '../support/pages/LoginPage';

describe('E2E Test - Login Flow cho Flogin App', () => {
  
  beforeEach(() => {
    LoginPage.visit();
  });

  // --- Test UI elements ---
  it('TC01: Verify UI Elements visibility', () => {
    LoginPage.txtUsername.should('be.visible').and('be.enabled');
    LoginPage.txtPassword.should('be.visible').and('be.enabled');
    LoginPage.btnLogin.should('be.visible');
  });

  // --- Test validation ---
  it('TC02: Validation - Empty Username', () => {
    LoginPage.btnLogin.click();
    LoginPage.lblErrorMessage.should('be.visible');
    LoginPage.lblErrorMessage.should('contain.text', 'username khong duoc de trong');
  });

  it('TC03: Validation - Empty Password', () => {
    LoginPage.txtUsername.type('testuser');
    LoginPage.btnLogin.click();
    LoginPage.lblErrorMessage.should('be.visible');
    LoginPage.lblErrorMessage.should('contain.text', 'password khong duoc de trong');
  });

  it('TC04: Validation - Username too short', () => {
    LoginPage.login('ab', 'password123');
    LoginPage.lblErrorMessage.should('be.visible');
    LoginPage.lblErrorMessage.should('contain.text', 'username phai co it nhat 3 ky tu');
  });

  it('TC05: Validation - Password too short', () => {
    LoginPage.login('testuser', '123');
    LoginPage.lblErrorMessage.should('be.visible');
    LoginPage.lblErrorMessage.should('contain.text', 'password phai co it nhat 6 ky tu');
  });

  // --- Test login flows ---
  it('TC06: Login Failed - Wrong credentials', () => {
    LoginPage.login('wronguser', 'wrongpass123');
    
    // Đợi API response
    cy.wait(1000);
    
    LoginPage.lblErrorMessage.should('be.visible');
    // Backend có thể trả về "Username không tồn tại" hoặc lỗi server
    LoginPage.lblErrorMessage.invoke('text').should('match', /Username không tồn tại|Co loi xay ra/);
  });

  it('TC07: Login Successfully', () => {
    // Sử dụng user 'admin' có sẵn trong database
    // Password gốc: Test123
    LoginPage.login('admin', 'Test123');
    
    // Kiểm tra redirect đến trang products (login thành công redirect ngay)
    cy.url().should('include', '/products', { timeout: 10000 });
    
    // Verify đã vào trang products
    cy.log('Login successful - redirected to products page');
  });

  // --- Test network error ---
  it('TC08: Handle Server Error', () => {
    // Giả lập lỗi network bằng cách intercept request
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 500,
      body: { message: 'Internal Server Error' }
    }).as('loginRequest');

    LoginPage.login('testuser', 'password123');
    
    cy.wait('@loginRequest');
    
    LoginPage.lblErrorMessage.should('be.visible');
    // Frontend hiển thị message từ backend hoặc default error message
    LoginPage.lblErrorMessage.invoke('text').should('match', /Internal Server Error|Co loi xay ra/);
  });

});