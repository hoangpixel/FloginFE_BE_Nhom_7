// --- Lệnh Login tùy chỉnh (cy.login) ---
Cypress.Commands.add('login', (username, password) => {
  cy.session([username, password], () => {
    // 1. Truy cập trang login
    cy.visit('http://localhost:5173/login');

    // 2. Nhập thông tin (Dựa theo data-testid bạn đã làm)
    cy.get('[data-testid="username-input"]').clear().type(username);
    cy.get('[data-testid="password-input"]').clear().type(password);

    // 3. Click nút đăng nhập
    cy.get('[data-testid="login-button"]').click();

    // 4. Đợi đăng nhập thành công (url chuyển sang /products)
    cy.url().should('include', '/products');
  });
});

// --- Bạn có thể thêm các lệnh khác nếu cần ---
// Ví dụ: Lệnh lấy token từ localStorage
Cypress.Commands.add('getToken', () => {
  return localStorage.getItem('token');
});