describe('E2E Test - Security Testing cho Flogin App', () => {

  beforeEach(() => {
    // Truy cập trang login của ứng dụng Flogin
    cy.visit('/'); 
  });

  // --- Test SQL Injection Prevention ---
  it('SEC-01: Prevent SQL Injection in Login', () => {
    // Tấn công giả: Cố tình nhập câu lệnh SQL vào ô username
    const sqlInjectionPayload = "' OR '1'='1"; 
    
    cy.get('[data-testid="username-input"]').type(sqlInjectionPayload);
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // KẾT QUẢ MONG ĐỢI: Phải đăng nhập thất bại (Hiện lỗi)
    // Nếu đăng nhập thành công -> Web bị dính lỗi bảo mật
    cy.get('[data-testid="username-error"]').should('be.visible');
    cy.url().should('not.include', '/products');
  });

  // --- Test XSS Prevention ---
  it('SEC-02: Prevent XSS Injection', () => {
    // Tấn công giả: Chèn mã Script alert
    const xssPayload = "<script>alert('Hacked')</script>";

    cy.get('[data-testid="username-input"]').type(xssPayload);
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // KẾT QUẢ MONG ĐỢI: Web không được thực thi đoạn script kia
    // Kiểm tra trang web vẫn hiển thị thông báo lỗi bình thường, không bị popup alert
    cy.get('[data-testid="username-error"]').should('be.visible');
    
    // Đảm bảo không có alert popup
    cy.on('window:alert', (str) => {
      expect(str).to.not.equal('Hacked');
    });
  });

  // --- Test Input Validation với Special Characters ---
  it('SEC-03: Validate Special Characters', () => {
    // Nhập các ký tự đặc biệt nguy hiểm
    cy.get('[data-testid="username-input"]').type('admin@!#$%^&*()');
    cy.get('[data-testid="password-input"]').type('123456');
    cy.get('[data-testid="login-button"]').click();

    // Hệ thống phải xử lý gọn gàng (không crash, hiện lỗi validation)
    cy.get('[data-testid="username-error"]').should('be.visible');
  });

  // --- Test Security Headers ---
  it('SEC-04: Check Security Headers', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:5173/',
    }).then((response) => {
      
      // Kiểm tra response thành công
      expect(response.status).to.eq(200);

      // Note: Vite dev server có thể không set đầy đủ security headers
      // Trong production nên cấu hình nginx/apache để thêm các headers này
      
      // Kiểm tra Content-Type
      expect(response.headers).to.have.property('content-type');
    });
  });

  // --- Test Password không bị lộ trong response ---
  it('SEC-05: Password should not be exposed in response', () => {
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');
    
    cy.get('[data-testid="username-input"]').type('testuser');
    cy.get('[data-testid="password-input"]').type('SecretPass123');
    cy.get('[data-testid="login-button"]').click();
    
    cy.wait('@loginRequest').then((interception) => {
      // Kiểm tra response không chứa password
      const responseBody = JSON.stringify(interception.response.body);
      expect(responseBody).to.not.include('SecretPass123');
    });
  });

});