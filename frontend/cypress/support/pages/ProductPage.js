class ProductPage {
  
  // --- 1. Selectors cho ứng dụng Flogin ---

  get inventoryItems() {
    return cy.get('[data-testid="product-item"]');
  }

  get productTable() {
    return cy.get('[data-testid="product-table"]');
  }

  get addProductButton() {
    return cy.contains('button', 'Tạo sản phẩm');
  }

  get firstItemName() {
    return cy.get('[data-testid="product-name-cell"]').first();
  }

  // --- 2. Actions ---

  clickViewProduct(productName) {
    cy.contains('[data-testid="product-name-cell"]', productName)
      .closest('[data-testid="product-item"]')
      .find('[data-testid="view-btn"]')
      .click();
  }

  clickEditProduct(productName) {
    cy.contains('[data-testid="product-name-cell"]', productName)
      .closest('[data-testid="product-item"]')
      .find('[data-testid="edit-btn"]')
      .click();
  }

  clickDeleteProduct(productName) {
    cy.contains('[data-testid="product-name-cell"]', productName)
      .closest('[data-testid="product-item"]')
      .find('[data-testid="delete-btn"]')
      .click();
  }
}

export default new ProductPage();