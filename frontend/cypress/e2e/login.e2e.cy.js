import LoginPage from '../support/pages/LoginPage';

describe('6.1.2 - E2E Test Scenarios for Login Flow', () => {
  
  beforeEach(() => {
    LoginPage.visit();
  });

  it('TC1: Kiem tra hien thi cac thanh phan giao dien', () => {
    LoginPage.txtUsername.should('be.visible').and('be.enabled');
    LoginPage.txtPassword.should('be.visible').and('be.enabled');
    LoginPage.btnLogin.should('be.visible');
  });

  it('TC2: Dang nhap thanh cong voi tai khoan hop le', () => {
    LoginPage.login('admin', 'Test123');

    cy.url({ timeout: 10000 }).should('include', '/products');
  });

 
  it('TC3: Dang nhap that bai khi nhap sai mat khau', () => {
    LoginPage.login('testuser', 'wrong_password');


    LoginPage.lblErrorMessage.should('be.visible');
  });

  it('TC4: Dang nhap that bai khi tai khoan khong ton tai', () => {
    LoginPage.login('invaliduser123', 'anypassword');

    
    LoginPage.lblErrorMessage.should('be.visible');
  });

  
  it('TC5: Kiem tra thong bao loi khi bo trong ten dang nhap', () => {
    
    LoginPage.btnLogin.click();
    LoginPage.lblErrorMessage.should('be.visible');
    LoginPage.lblErrorMessage.should('contain.text', 'username khong duoc de trong');
  });

  it('TC6: Kiem tra thong bao loi khi bo trong mat khau', () => {
    LoginPage.txtUsername.type('admin');
    LoginPage.btnLogin.click();
    LoginPage.lblErrorMessage.should('contain.text', 'password khong duoc de trong');
  });

});