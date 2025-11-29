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
    cy.request({
      method: 'GET',
      url: 'http://localhost:8080/api/products',
      failOnStatusCode: false
    }).then((response) => {
      
      
      expect([200, 401, 403]).to.include(response.status);

  
      if (response.headers['x-content-type-options']) {
        expect(response.headers['x-content-type-options']).to.eq('nosniff');
      }
    });
  });

});