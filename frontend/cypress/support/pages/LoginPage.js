class LoginPage {
  // --- Selectors ---
  get txtUsername() {
    return cy.get('#user-name');
  }

  get txtPassword() {
    return cy.get('#password');
  }

  get btnLogin() {
    return cy.get('#login-button');
  }

  // --- Actions ---
  visit() {  // <--- Hàm này phải nằm trong Class
    cy.visit('https://www.saucedemo.com/');
  }

  login(username, password) {
    this.txtUsername.type(username);
    this.txtPassword.type(password);
    this.btnLogin.click();
  }
}

export default new LoginPage();