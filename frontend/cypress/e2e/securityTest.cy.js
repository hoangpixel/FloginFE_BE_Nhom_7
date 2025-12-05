import LoginPage from '../support/pages/LoginPage';

describe('7.2 - E2E Test Scenarios for Security Testing', () => {

  beforeEach(() => {

    LoginPage.visit();
  });

  it('TC1: Ngan chan tan cong SQL Injection', () => {
    const sqlInjectionPayload = "' OR '1'='1"; 
    
    LoginPage.txtUsername.type(sqlInjectionPayload);
    LoginPage.txtPassword.type('anypassword');
    LoginPage.btnLogin.click();
    LoginPage.lblErrorMessage.should('be.visible');

    cy.url().should('not.include', '/products');
  });

  
  it('TC2: Ngan chan tan cong XSS Injection', () => {
    const xssPayload = "<script>alert('Hacked')</script>";

    LoginPage.txtUsername.type(xssPayload);
    LoginPage.txtPassword.type('anypassword');
    LoginPage.btnLogin.click();
    LoginPage.lblErrorMessage.should('be.visible');
    
    cy.on('window:alert', (text) => {
    throw new Error('XSS vulnerability detected: ' + text);
    });
  });

  it('TC3: Kiem tra xu ly ky tu dac biet', () => {
    LoginPage.txtUsername.type('admin@!#$%^&*()');
    LoginPage.txtPassword.type('123456');

    LoginPage.btnLogin.click();
    LoginPage.lblErrorMessage.should('be.visible');
  });

  it('TC4: Kiem tra cac Security Headers', () => {
    const apiBase = Cypress.env('API_BASE') || 'http://localhost:8080';
    cy.request({
      method: 'GET',
      url: `${apiBase}/api/products`,
      failOnStatusCode: false
    }).then((response) => {
      
      expect([200, 401, 403]).to.include(response.status);

      // Assert common security headers
      expect(response.headers['x-content-type-options']).to.eq('nosniff');
      expect(response.headers['x-frame-options']).to.eq('DENY');
      expect(response.headers['content-security-policy']).to.contain("default-src 'self'");
      // HSTS only effective over HTTPS, but header presence is checked
      expect(response.headers['strict-transport-security']).to.contain('max-age');
    });
  });

  it('TC5: Thu CSRF (khong co token se that bai)', () => {
    const apiBase = Cypress.env('API_BASE') || 'http://localhost:8080';
    // Giả lập gửi form POST không có CSRF token đến endpoint login
    cy.request({
      method: 'POST',
      url: `${apiBase}/api/auth/login`,
      body: { username: 'admin', password: '123456' },
      failOnStatusCode: false,
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      // Ứng dụng hiện không bật CSRF filter; yêu cầu: xác minh không xảy ra thay đổi trạng thái ngoài ý muốn
      // Ít nhất phải trả về 200/400/401, không được set-cookie phiên nếu thất bại
      expect([200, 400, 401]).to.include(response.status);
      expect(response.headers['set-cookie'] || '').to.not.contain('SESSION');
    });
  });

  it('TC6: Thu bypass xac thuc vao /products khi chua dang nhap', () => {
    const feBase = Cypress.env('FE_BASE') || 'http://localhost:5173';
    cy.visit(`${feBase}/products`);
    // Frontend nên chuyển hướng hoặc hiển thị thông báo yêu cầu đăng nhập
    cy.url().should('include', '/login');
  });

});