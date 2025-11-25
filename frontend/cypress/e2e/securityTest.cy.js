describe('7.2 Security Testing & Vulnerability Checks', () => {

  beforeEach(() => {
    // Truy cập trang web (Web thật hoặc localhost)
    cy.visit('https://www.saucedemo.com/'); 
  });

  // --- YÊU CẦU A: Common Vulnerabilities (SQL Injection) ---
  it('SEC-01: Prevent SQL Injection in Login', () => {
    // Tấn công giả: Cố tình nhập câu lệnh SQL vào ô user
    const sqlInjectionPayload = "' OR '1'='1"; 
    
    cy.get('#user-name').type(sqlInjectionPayload);
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    // KẾT QUẢ MONG ĐỢI: Phải đăng nhập thất bại (Hiện lỗi)
    // Nếu đăng nhập thành công -> Web bị dính lỗi bảo mật
    cy.get('[data-test="error"]').should('be.visible');
    cy.url().should('not.include', '/inventory.html');
  });

  // --- YÊU CẦU A: Common Vulnerabilities (XSS - Cross Site Scripting) ---
  it('SEC-02: Prevent XSS Injection', () => {
    // Tấn công giả: Chèn mã Script alert
    const xssPayload = "<script>alert('Hacked')</script>";

    cy.get('#user-name').type(xssPayload);
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    // KẾT QUẢ MONG ĐỢI: Web không được thực thi đoạn script kia
    // Kiểm tra trang web vẫn hiển thị thông báo lỗi bình thường, không bị popup alert
    cy.get('[data-test="error"]').should('be.visible');
  });

  // --- YÊU CẦU B: Input Validation ---
  it('SEC-03: Validate Special Characters', () => {
    // Nhập các ký tự đặc biệt nguy hiểm
    cy.get('#user-name').type('admin@!#$%^&*()');
    cy.get('#password').type('123456');
    cy.get('#login-button').click();

    // Hệ thống phải xử lý gọn gàng (không crash, hiện lỗi user sai)
    cy.get('[data-test="error"]').should('be.visible');
  });

  // --- YÊU CẦU C: Security Best Practices (HTTPS, Headers) ---
  it('SEC-04: Check Security Headers & HTTPS', () => {
    cy.request({
      method: 'GET',
      url: 'https://www.saucedemo.com/', // Hoặc localhost
    }).then((response) => {
      
      // 1. Kiểm tra HTTPS enforcement
      expect(response.status).to.eq(200);

      // 2. Kiểm tra các Header bảo mật quan trọng
      // Chống click-jacking
      expect(response.headers).to.have.property('x-frame-options'); 
      // Chống XSS trình duyệt
      expect(response.headers).to.have.property('x-xss-protection');
      // Chống đoán MIME type
      expect(response.headers).to.have.property('x-content-type-options', 'nosniff');
    });
  });

});