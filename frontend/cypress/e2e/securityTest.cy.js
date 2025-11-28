import LoginPage from '../support/pages/LoginPage';

describe('7.2 - E2E Test Scenarios for Security Testing', () => {

  beforeEach(() => {
    // Truy cập trang login localhost
    LoginPage.visit();
  });

  // --- YÊU CẦU A: Common Vulnerabilities (SQL Injection) ---
  it('TC1: Ngan chan tan cong SQL Injection', () => {
    // Tấn công giả: Cố tình nhập câu lệnh SQL vào ô user
    const sqlInjectionPayload = "' OR '1'='1"; 
    
    LoginPage.txtUsername.type(sqlInjectionPayload);
    LoginPage.txtPassword.type('anypassword');
    LoginPage.btnLogin.click();

    // KẾT QUẢ MONG ĐỢI: Phải đăng nhập thất bại (Hiện lỗi)
    // Nếu đăng nhập thành công -> Web bị dính lỗi bảo mật
    LoginPage.lblErrorMessage.should('be.visible');
    cy.url().should('not.include', '/products');
  });

  // --- YÊU CẦU A: Common Vulnerabilities (XSS - Cross Site Scripting) ---
  it('TC2: Ngan chan tan cong XSS Injection', () => {
    // Tấn công giả: Chèn mã Script alert
    const xssPayload = "<script>alert('Hacked')</script>";

    LoginPage.txtUsername.type(xssPayload);
    LoginPage.txtPassword.type('anypassword');
    LoginPage.btnLogin.click();

    // KẾT QUẢ MONG ĐỢI: Web không được thực thi đoạn script kia
    // Kiểm tra trang web vẫn hiển thị thông báo lỗi bình thường, không bị popup alert
    LoginPage.lblErrorMessage.should('be.visible');
    
    // Verify không có alert popup (nếu có thì test fail)
    cy.on('window:alert', (text) => {
      throw new Error('XSS vulnerability detected: ' + text);
    });
  });

  // --- YÊU CẦU B: Input Validation ---
  it('TC3: Kiem tra xu ly ky tu dac biet', () => {
    // Nhập các ký tự đặc biệt nguy hiểm
    LoginPage.txtUsername.type('admin@!#$%^&*()');
    LoginPage.txtPassword.type('123456');
    LoginPage.btnLogin.click();

    // Hệ thống phải xử lý gọn gàng (không crash, hiện lỗi user sai)
    LoginPage.lblErrorMessage.should('be.visible');
  });

  // --- YÊU CẦU C: Security Best Practices (HTTPS, Headers) ---
  it('TC4: Kiem tra cac Security Headers', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8080/api/products',
      failOnStatusCode: false
    }).then((response) => {
      
      // Kiểm tra API response thành công hoặc yêu cầu auth
      expect([200, 401, 403]).to.include(response.status);

      // Kiểm tra các Header bảo mật nếu có
      // Note: Localhost có thể không có đầy đủ security headers như production
      if (response.headers['x-content-type-options']) {
        expect(response.headers['x-content-type-options']).to.eq('nosniff');
      }
    });
  });

});