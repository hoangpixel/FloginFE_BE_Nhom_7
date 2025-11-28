class LoginPage {
  // --- Khai báo các thành phần (Selectors) ---
  get txtUsername() {
    return cy.get('[data-testid="username-input"]'); 
  }

  get txtPassword() {
    return cy.get('[data-testid="password-input"]'); 
  }

  get btnLogin() {
    return cy.get('[data-testid="login-button"]'); 
  }

  get lblErrorMessage() {
    return cy.get('[data-testid="username-error"]');
  }

  get lblSuccessMessage() {
    return cy.get('[data-testid="login-message"]');
  }

  // --- Các hành động (Actions) ---
  
  visit() {
    cy.visit('/'); 
  }

  login(username, password) {
    this.txtUsername.clear().type(username); 
    this.txtPassword.clear().type(password);
    this.btnLogin.click();
  }
}

export default new LoginPage();