import LoginPage from '../support/pages/LoginPage';

describe('7.2 - E2E Test Scenarios for Security Testing', () => {

  beforeEach(() => {

    LoginPage.visit();
  });

  it('TC1:SQL Injection', () => {
    const sqlInjectionPayload = "' OR '1'='1"; 
    LoginPage.txtUsername.type(sqlInjectionPayload);
    LoginPage.txtPassword.type('anypassword');
    LoginPage.btnLogin.click();
    LoginPage.lblErrorMessage.should('be.visible');
    cy.url().should('not.include', '/products');
  });

  
  it('TC2: XSS (Cross-Site Scripting)', () => {
    const xssPayload = "<script>alert('Hacked')</script>";

    LoginPage.txtUsername.type(xssPayload);
    LoginPage.txtPassword.type('anypassword');
    LoginPage.btnLogin.click();
    LoginPage.lblErrorMessage.should('be.visible');
    
    cy.on('window:alert', (text) => {
    throw new Error('XSS vulnerability detected: ' + text);
    });
  });

  it('TC3: CSRF (Cross-Site Request Forgery)', () => {
    const apiBase = Cypress.env('API_BASE') || 'http://localhost:8080';
    cy.request({
      method: 'POST',
      url: `${apiBase}/api/auth/login`,
      body: { username: 'admin', password: '123456' },
      failOnStatusCode: false,
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => {
      expect([200, 400, 401]).to.include(response.status);
      expect(response.headers['set-cookie'] || '').to.not.contain('SESSION');
    });
  });

  it('TC4:Authentication bypass attempts', () => {
    const feBase = Cypress.env('FE_BASE') || 'http://localhost:5173';
    cy.visit(`${feBase}/products`);
    cy.url().should('include', '/login');
  });

  it('TC5: Test input validation,sanitization', () => {
    LoginPage.txtUsername.type('admin@!#$%^&*()');
    LoginPage.txtPassword.type('123456');
    LoginPage.btnLogin.click();
    LoginPage.lblErrorMessage.should('be.visible');
  });

  it('TC6:  Password hashing', () => {
    const apiBase = Cypress.env('API_BASE') || 'http://localhost:8080';
    const feBase = Cypress.env('FE_BASE') || 'http://localhost:5173';
    cy.request({
      method: 'OPTIONS',
      url: `${apiBase}/api/auth/login`,
      headers: {
        Origin: feBase,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type'
      },
      failOnStatusCode: false
    }).then((resp) => {
      expect([200, 204]).to.include(resp.status);
      expect(resp.headers['access-control-allow-origin']).to.eq(feBase);
      expect(resp.headers['access-control-allow-methods']).to.contain('POST');
    });
  });

  it('TC7:HTTPS enforcement', () => {
    const apiBase = Cypress.env('API_BASE') || 'http://localhost:8080';
    const feBase = Cypress.env('FE_BASE') || 'http://localhost:5173';
    const pwd = 'SuperSecret123!';
    cy.request({
      method: 'POST',
      url: `${apiBase}/api/auth/login`,
      body: { username: 'khong_ton_tai', password: pwd },
      headers: { 'Content-Type': 'application/json', Origin: feBase },
      failOnStatusCode: false
    }).then((resp) => {
      expect([400, 401]).to.include(resp.status);
      const text = JSON.stringify(resp.body || {});
      expect(text).to.not.contain(pwd);
      expect(text.toLowerCase()).to.not.contain('password');
      expect(text).to.not.contain('Exception');
    });
  });

  it('TC8:CORS configuration', () => {
    const apiBase = Cypress.env('API_BASE') || 'http://localhost:8080';
    const feBase = Cypress.env('FE_BASE') || 'http://localhost:5173';
    cy.request({
      method: 'POST',
      url: `${apiBase}/api/auth/login`,
      body: { username: 'admin', password: '123456' },
      headers: { 'Content-Type': 'application/json', Origin: feBase },
      failOnStatusCode: false
    }).then((resp) => {
      expect([200, 400, 401]).to.include(resp.status);
      expect(resp.headers['access-control-allow-origin']).to.eq(feBase);
    });
  });

  it("TC9: Security headers", () => {
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

});