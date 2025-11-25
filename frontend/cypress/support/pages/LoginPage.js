class LoginPage {
  // --- Khai báo các thành phần (Selectors) ---
  // Giả định web của bạn sẽ có ô user, pass và nút login
  get txtUsername() {
    return cy.get('#user-name'); 
  }

  get txtPassword() {
    return cy.get('#password'); 
  }

  get btnLogin() {
    return cy.get('#login-button'); 
  }

  get lblErrorMessage() {
    return cy.get('[data-test="error"]');
  }

  // --- Các hành động (Actions) ---
  
  visit() {
    cy.visit('https://www.saucedemo.com/'); 
  }

  login(username, password) {
    this.txtUsername.clear().type(username); 
    this.txtPassword.clear().type(password);
    this.btnLogin.click();
  }
}

export default new LoginPage();